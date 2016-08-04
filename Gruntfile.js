'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      dist: {
        src: 'dist/**',
      },
    },

    copy: {
      assets: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: 'images/**',
          dest: 'dist/',
        }],
      },

      html: {
        files: [{
          expand: true,
          cwd: 'src/html/',
          src: '**.html',
          dest: 'dist/',
        }],
      },
    },

    postcss: {
      dev: {
        files: [{
          expand: true,
          cwd: 'dist/css/',
          src: '**.css',
          dest: 'dist/css/',
        }],

        options: {
          processors: [
            require('postcss-import')({
              url: 'inline',
            }),
            require('postcss-url')({
              url: 'inline',
            }),
            require('postcss-custom-properties')({
              preserve: true,
            }),
            require('autoprefixer')({
              browsers: [
                'last 2 versions',
                'ie > 11',
              ],
            }),
          ],
        },
      },

      prod: {
        files: [{
          expand: true,
          cwd: 'dist/css/',
          src: '**.css',
          dest: 'dist/css/',
        }],

        options: {
          processors: [
            require('postcss-import')(),
            require('postcss-custom-properties')({
              preserve: true,
            }),
            require('autoprefixer')({
              browsers: [
                'last 2 versions',
                'ie > 11',
              ],
            }),
            require('cssnano')({
              safe: true,
            }),
          ],
        },
      },
    },

    sass: {
      default: {
        src: 'src/css/application.scss',
        dest: 'dist/css/application.css',
      },
    },

    watch: {
      assets: {
        files: 'src/**',
        tasks: ['build:dev'],
        options: {
          atBegin: true,
          spawn: true,
        },
      },
    },
  });

  grunt.registerTask('build', [
    'build:dev',
  ]);

  grunt.registerTask('build:dev', [
    'clean:dist',
    'sass:default',
    'postcss:dev',
    'copy:assets',
    'copy:html',
  ]);

  grunt.registerTask('build:prod', [
    'clean:dist',
    'sass:default',
    'postcss:prod',
    'copy:assets',
    'copy:html',
  ]);

  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
