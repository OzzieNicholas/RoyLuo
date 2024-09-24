// img -> html(img?v=hash,ng-include) -> js(img?v=hash,html?v=hash,js?v=hash) -> router(html?v=hash,js?v=hash) -> index(css?v=hash,js?v=hash)
// img -> css(img?v=hash)             -> js(img?v=hash,css?v=hash,js?v=hash)  -> router(css?v=hash,js?v=hash)  -> index(css?v=hash,js?v=hash)

const Q = require('q'),
    del = require('del'),
    gulp = require('gulp'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    pngquant = require('imagemin-pngquant'),
    packages = require('gulp-packages');

const pkg = packages(gulp, [
        'autoprefixer',
        'cache',
        'clean-css',
        'htmlmin',
        'ignore',
        'imagemin',
        'ng-annotate',
        'rename',
        'rev',
        'rev-replace',
        'sass',
        'uglify'
    ]),
    paths = {
        dist: '../web/',
        src: 'src/'
    },
    manifest = {
        html: 'manifest.html.json',
        img: 'manifest.img.json',
        css: 'manifest.css.json',
        js: 'manifest.js.json'
    },
    mkRev = (stream, manifest) => (stream.pipe(pkg.rev()).pipe(pkg.rename((file) => {
        file.extname += '?rev=' + /\-(\w+)(\.|$)/.exec(file.basename)[1];
        if (/\-(\w+)\./.test(file.basename)) {
            file.basename = file.basename.replace(/\-(\w+)\./, '.');
        }
        if (/\-(\w+)$/.test(file.basename)) {
            file.basename = file.basename.replace(/\-(\w+)$/, '');
        }
    })).pipe(pkg.rev.manifest(manifest, {
        merge: true
    })).pipe(gulp.dest('.'))),
    delFiles = (paths) => (del(paths, {
        force: true
    }));

gulp.task('build-img', () => {
    let deferred = Q.defer(),
        stream = gulp.src(paths.src + '**/img/**/*.*').pipe(pkg.cache(pkg.imagemin({
            progressive: true,
            interlaced: true,
            use: [pngquant()]
        })));
    delFiles([
        paths.dist + 'app/**/img/',
        manifest.img
    ]).then(() => (mkRev(stream.pipe(gulp.dest(paths.dist)), manifest.img).on('finish', deferred.resolve)));
    return deferred.promise;
});

gulp.task('build-css', () => {
    let deferred = Q.defer(),
        stream = gulp.src(paths.src + '**/*.scss').pipe(pkg.sass()).pipe(pkg.autoprefixer({
            browsers: ['last 10 versions']
        })).pipe(pkg.revReplace({
            manifest: gulp.src(manifest.img)
        })).pipe(pkg.cleanCss()).pipe(pkg.rename({
            extname: '.min.css'
        }));
    delFiles([
        paths.dist + 'app/**/*.css',
        manifest.css
    ]).then(() => (mkRev(stream.pipe(gulp.dest(paths.dist)), manifest.css).on('finish', deferred.resolve)));
    return deferred.promise;
});

gulp.task('build-html', () => {
    let deferred = Q.defer(),
        stream = gulp.src(paths.src + '**/*.html').pipe(pkg.ignore.exclude('index.html')).pipe(pkg.revReplace({
            manifest: gulp.src(manifest.img)
        })).pipe(pkg.htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }));
    delFiles([
        paths.dist + 'app/**/*.html',
        manifest.html
    ]).then(() => (mkRev(stream.pipe(gulp.dest(paths.dist)), manifest.html).on('finish', () => (mkRev(gulp.src(paths.dist + '**/app/**/*.html').pipe(pkg.revReplace({
        manifest: gulp.src(manifest.html)
    })).pipe(gulp.dest(paths.dist)), manifest.html).on('finish', deferred.resolve)))));
    return deferred.promise;
});

gulp.task('build-js', () => {
    let deferred = Q.defer(),
        stream = gulp.src(paths.src + '**/*.js').pipe(pkg.ignore.exclude('**/router.js')).pipe(pkg.revReplace({
            manifest: gulp.src(manifest.img)
        })).pipe(pkg.revReplace({
            manifest: gulp.src(manifest.css)
        })).pipe(pkg.revReplace({
            manifest: gulp.src(manifest.html)
        })).pipe(pkg.ngAnnotate()).pipe(pkg.uglify()).pipe(pkg.rename({
            extname: '.min.js'
        }));
    delFiles([
        paths.dist + 'app/**/*.js',
        manifest.js
    ]).then(() => (mkRev(stream.pipe(gulp.dest(paths.dist)), manifest.js).on('finish', () => (mkRev(gulp.src(paths.dist + '**/app/**/*.min.js').pipe(pkg.revReplace({
        manifest: gulp.src(manifest.js)
    })).pipe(gulp.dest(paths.dist)), manifest.js).on('finish', deferred.resolve)))));
    return deferred.promise;
});

gulp.task('build-router', () => (mkRev(gulp.src(paths.src + '**/router.js').pipe(pkg.revReplace({
    manifest: gulp.src(manifest.html)
})).pipe(pkg.revReplace({
    manifest: gulp.src(manifest.css)
})).pipe(pkg.revReplace({
    manifest: gulp.src(manifest.js)
})).pipe(pkg.ngAnnotate()).pipe(pkg.uglify()).pipe(pkg.rename({
    extname: '.min.js'
})).pipe(gulp.dest(paths.dist)), manifest.js)));

gulp.task('build-index', () => (gulp.src(paths.src + 'index.html').pipe(pkg.revReplace({
    manifest: gulp.src(manifest.css)
})).pipe(pkg.revReplace({
    manifest: gulp.src(manifest.js)
})).pipe(pkg.htmlmin({
    collapseWhitespace: true,
    removeComments: true
})).pipe(gulp.dest(paths.dist)).on('finish', () => (setTimeout(browserSync.reload)))));

gulp.task('default', () => (runSequence('build-img', ['build-css', 'build-html'], 'build-js', 'build-router', 'build-index')));

gulp.task('watch', () => {
    gulp.watch(paths.src + '**/img/*.*', () => (runSequence('default')));
    gulp.watch(paths.src + '**/*.scss', () => (runSequence('build-css', 'build-js', 'build-router', 'build-index')));
    gulp.watch([paths.src + '**/*.html', '!' + paths.src + 'index.html'], () => (runSequence('build-html', 'build-js', 'build-router', 'build-index')));
    gulp.watch([paths.src + '**/*.js', '!' + paths.src + '**/router.js'], () => (runSequence('build-js', 'build-router', 'build-index')));
    gulp.watch(paths.src + '**/router.js', () => (runSequence('build-router', 'build-index')));
    gulp.watch(paths.src + 'index.html', () => (runSequence('build-index')));
    browserSync.init({
        server: '../web',
        port: 3010,
        ui: {
            port: 3011,
            weinre: {
                port: 3012
            }
        },
        open: false
    });
});