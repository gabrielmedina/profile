import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ImageSize } from '../types'

export async function readImageSize(
  publicPath: string,
): Promise<ImageSize | null> {
  const file = publicFile(publicPath)

  if (!file) return null

  try {
    return parseImageSize(await readFile(file))
  } catch {
    return null
  }
}

function publicFile(publicPath: string) {
  if (
    !publicPath.startsWith('/') ||
    publicPath.includes('\\') ||
    publicPath.includes('\0')
  ) {
    return null
  }

  const publicDir = path.resolve(process.cwd(), 'public')
  const file = path.resolve(publicDir, publicPath.replace(/^\/+/, ''))

  if (file !== publicDir && !file.startsWith(`${publicDir}${path.sep}`)) {
    return null
  }

  return file
}

function parseImageSize(buffer: Buffer): ImageSize | null {
  return parsePng(buffer) ?? parseJpeg(buffer) ?? parseWebp(buffer)
}

function parsePng(buffer: Buffer): ImageSize | null {
  if (buffer.length < 24 || buffer[0] !== 0x89) return null
  if (buffer.toString('ascii', 1, 4) !== 'PNG') return null

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

function parseJpeg(buffer: Buffer): ImageSize | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null

  let offset = 2

  while (offset + 1 < buffer.length) {
    if (buffer[offset] !== 0xff) return null

    const marker = buffer[offset + 1]

    if (marker === undefined) return null

    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2
      continue
    }

    if (marker === 0xff) {
      offset += 1
      continue
    }

    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2
      continue
    }

    if (offset + 4 >= buffer.length) return null

    const length = buffer.readUInt16BE(offset + 2)
    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)

    if (isStartOfFrame) {
      if (offset + 8 >= buffer.length) return null

      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      }
    }

    offset += 2 + length
  }

  return null
}

function parseWebp(buffer: Buffer): ImageSize | null {
  if (buffer.length < 30) return null
  if (buffer.toString('ascii', 0, 4) !== 'RIFF') return null
  if (buffer.toString('ascii', 8, 12) !== 'WEBP') return null

  const chunk = buffer.toString('ascii', 12, 16)

  if (chunk === 'VP8 ' && buffer[23] === 0x9d) {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff,
    }
  }

  if (chunk === 'VP8L') {
    const first = buffer[21]
    const second = buffer[22]
    const third = buffer[23]
    const fourth = buffer[24]

    if (
      first === undefined ||
      second === undefined ||
      third === undefined ||
      fourth === undefined
    ) {
      return null
    }

    return {
      width: 1 + (((second & 0x3f) << 8) | first),
      height:
        1 + (((fourth & 0x0f) << 10) | (third << 2) | ((second & 0xc0) >> 6)),
    }
  }

  if (chunk === 'VP8X') {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
    }
  }

  return null
}
