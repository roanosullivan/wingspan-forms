/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        bower: {
            install: {
                options: {
                    copy: false,
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },

        subgrunt: {
            options: {},
            'app': {
                '../../': ['default'],
                '../../vendor/wingspan-contrib': ['default'],
                '../../vendor/wingspan-data': ['default']
            }
        },

        react: {
            app: {
                files: [{ expand: true, cwd: 'webapp/js', src: ['**/*.js'], dest: 'webapp/js-built', ext: '.js' }]
            }
        },

        less: {
            development: {
                options: {
                    paths: ['styles'],
                    ieCompat: true,
                    yuicompress: true,
                    report: 'min',
                    relativeUrls: true
                },
                files: {
                    'webapp/styles/App.css': 'webapp/styles/App.less'
                }
            }
        },

        requirejs: {
            options: {

                optimize: 'none',
                inlineText: true,
                useStrict: true,
                skipPragmas: true,
                preserveLicenseComments: true,

                baseUrl: 'webapp/js-built',

                paths: {
                    'underscore': '../lib/underscore',
                    'underscore.string': '../lib/underscore.string',
                    'jquery': '../lib/jquery',
                    'kendo': '../lib/kendo-ui/js/kendo.web',
                    'moment': '../lib/moment',
                    'react': '../lib/react-with-addons',
                    'es5-shim': '../lib/es5-shim',
                    'text': '../lib/text',
                    'q': '../lib/q',
                    'wingspan-forms': '../lib/wingspan-forms/wingspan-forms',
                    'wingspan-contrib': '../lib/wingspan-contrib',
                    'wingspan-data': '../lib/wingspan-data',
                    'textassets': '../textassets' // all assets loaded via `text!` must be rooted here (to avoid JSX compilation)
                },

                shim: {
                    'underscore': { deps: [], exports: '_' },
                    'underscore.string': { exports: '_s' },
                    'jquery': { deps: [], exports: '$' },
                    'kendo': { deps: [], exports: 'kendo' },
                    'moment': { deps: [], exports: 'moment' },
                    'react': { deps: [], exports: 'React'},
                    'q': { deps: [], exports: 'Q'},
                    'wingspan-forms': { deps: ['underscore', 'react', 'jquery', 'kendo', 'moment', 'underscore.string', 'wingspan-contrib', 'wingspan-data'], exports: 'WingspanForms' },
                    'wingspan-contrib': { deps: ['underscore', 'jquery', 'underscore.string', 'moment', 'q'], exports: 'WingspanContrib' },
                    'wingspan-data': { deps: ['underscore', 'jquery', 'kendo', 'q'], exports: 'WingspanData' }
                },

                uglify: {
                    toplevel: true,
                    ascii_only: true,
                    beautify: true,
                    max_line_length: 1000,
                    defines: { DEBUG: ['name', 'false'] },
                    no_mangle: true
                }
            },
            compile: {
                options: {
                    out: 'webapp/Page.js',
                    include: ['Page']
                }
            }
        },

        copy: {
            'libs': {
                files: [
                    {
                        expand: true,
                        src: [
                            'bower_components/jquery/jquery.js',
                            'bower_components/momentjs/moment.js',
                            'bower_components/underscore/underscore.js',
                            'bower_components/react/react-with-addons.js',
                            'bower_components/underscore.string/lib/underscore.string.js',
                            'bower_components/es5-shim/es5-shim.js',
                            'bower_components/q/q.js',
                            'bower_components/requirejs/require.js',
                            'bower_components/requirejs-text/text.js',
                            '../../vendor/wingspan-contrib/dist/wingspan-contrib.js',
                            '../../vendor/wingspan-data/dist/wingspan-data.js'
                        ],
                        dest: 'webapp/lib',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/kendo-ui/src/',
                        src: ['js/kendo.web.js', 'styles/kendo.common.css', 'styles/kendo.default.css', 'styles/Default/**', 'styles/textures/**'],
                        dest: 'webapp/lib/kendo-ui/',
                        flatten: false
                    },
                    {
                        expand: true,
                        cwd: '../../dist/',
                        src: ['**'],
                        dest: 'webapp/lib/wingspan-forms/',
                        flatten: false
                    }
                ]
            }
        },

        clean: ['bower_components', 'webapp/js-built', 'webapp/libs', 'webapp/styles/App.css', 'webapp/Page.js']
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-subgrunt');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['bower:install', 'subgrunt', 'copy', 'react', 'less', 'requirejs']);
    grunt.registerTask('devel', ['bower:install', 'subgrunt', 'copy', 'react', 'less']);
};
