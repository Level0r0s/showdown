/**
 * Created by Tivie on 12-11-2014.
 */

module.exports = function (grunt) {

  // Project configuration.
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        sourceMap: true,
        banner: ';/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n(function(){\n',
        footer: '}).call(this);'
      },
      dist: {
        src: [
          'src/showdown.js',
          'src/helpers.js',
          'src/converter.js',
          'src/subParsers/*.js',
          'src/loader.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      test: {
        src: '<%= concat.dist.dest %>',
        dest: '.build/<%= pkg.name %>.js',
        options: {
          sourceMap: false
        }
      }
    },

    clean: ['.build/'],

    uglify: {
      options: {
        sourceMap: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    jscs: {
      options: {
        config: '.jscs.json'
      },
      files: {
        src: [
          'Gruntfile.js',
          'src/**/*.js',
          'test/**/*.js'
        ]
      }
    },

    changelog: {
      options: {
        repository: 'http://github.com/showdownjs/showdown',
        dest: 'CHANGELOG.md'
      }
    },

    simplemocha: {
      node: {
        src: 'test/node/**/*.js',
        options: {
          globals: ['should'],
          timeout: 3000,
          ignoreLeaks: false,
          reporter: 'spec'
        }
      },
      karlcow: {
        src: 'test/node/testsuite.karlcow.js',
        options: {
          globals: ['should'],
          timeout: 3000,
          ignoreLeaks: false,
          reporter: 'spec'
        },
        issues: {
          src: 'test/node/testsuite.issues.js',
          options: {
            globals: ['should'],
            timeout: 3000,
            ignoreLeaks: false,
            reporter: 'spec'
          }
        }
      }
    }
  };

  grunt.initConfig(config);

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('concatenate', ['concat:dist']);
  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('test', ['lint', 'concat:test', 'simplemocha:node', 'clean']);
  grunt.registerTask('build', ['test', 'concatenate', 'uglify']);
  grunt.registerTask('prep-release', ['build', 'changelog']);

  // Default task(s).
  grunt.registerTask('default', ['test']);
};
