import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

export const formatDate = (date: string) => {
  return dayjs(date).locale('pt-br').format('MMMM D, YYYY')
}