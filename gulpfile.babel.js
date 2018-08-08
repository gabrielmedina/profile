// gulp

import gulp from 'gulp';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import include from 'gulp-include';
import htmlmin from 'gulp-htmlmin';
import injectSvg from 'gulp-inject-svg';
import ghpages from 'gulp-gh-pages';
import del from 'del';
import browserSync from 'browser-sync';

const paths = {
  dist: {
    src: 'dist/'
  },
  styles: {
    src: 'app/assets/css/**.scss',
    watch: 'app/assets/css/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'app/assets/js/**.js',
    watch: 'app/assets/js/**/*.js',
    dest: 'dist/js/'
  },
  html: {
    src: 'app/views/**/*.html',
    watch: 'app/views/**/*.html',
    dest: 'dist/'
  },
  img: {
    src: 'app/assets/img/**/*',
    watch: 'app/assets/img/**/*',
    dest: 'dist/img/'
  }
};

const reload = browserSync.reload;

export function clear() {
  return del(['.publish'])
}

export function production() {
  return gulp
    .src('./dist/**/*')
    .pipe(ghpages({
      remoteUrl: 'git@github.com:gabrielmedina/gulp-boilerplate.git',
      branch: 'production'
    }));
}

export function develop() {
  return gulp
    .src('./dist/**/*')
    .pipe(ghpages({
      remoteUrl: 'git@github.com:gabrielmedina/gulp-boilerplate.git',
      branch: 'develop'
    }));
}

export function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(include())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

export function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(include())
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

export function html() {
  return gulp
    .src(paths.html.src)
    .pipe(injectSvg({ base: '/app/assets' }))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

export function img() {
  return gulp
    .src(paths.img.src)
    .pipe(gulp.dest(paths.img.dest))
    .pipe(browserSync.stream());
}

export function browser_sync() {
  browserSync
    .init({
      server: {
        baseDir: paths.dist.src
      }
    });
}

export function watch() {
  gulp.watch(paths.scripts.watch, scripts);
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.html.watch, html);
  gulp.watch(paths.img.watch, img);
}

gulp.task('default', gulp.series(styles, scripts, img, html, gulp.parallel(watch, browser_sync)));

gulp.task('develop', gulp.series(clear, develop));
gulp.task('production', gulp.series(clear, production));
