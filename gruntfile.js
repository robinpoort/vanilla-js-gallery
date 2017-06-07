module.exports = function(grunt) {

    // measures the time each task takes
    require('time-grunt')(grunt);

    // load time-grunt and all grunt plugins found in the package.json
    require('jit-grunt')(grunt, {
        versioncheck: 'grunt-version-check'
    });

    // grunt config
    grunt.initConfig({


        // Grunt variables
        srcPath: 'src',
        distPath: 'dist',


        // Checks if your NPM or Bower dependencies are out of date
        versioncheck: {
            target: {
                options: {
                    skip : ["semver", "npm", "lodash"],
                    hideUpToDate : false
                }
            }
        },


        // Compile sass files
        sass: {
            dist: {
                files: {
                    '<%= distPath %>/css/gallery.css': ['<%= srcPath %>/scss/gallery.scss'],
                    'demo/css/demo.css': ['<%= srcPath %>/scss/demo.scss']
                }
            }
        },


        // Minify and clean CSS
        cssmin: {
            options: {
                roundingPrecision: -1,
                sourceMap: true
            },
            site: {
                files: {
                    '<%= distPath %>/css/gallery.css': '<%= distPath %>/css/gallery.css'
                }
            }
        },


        // Autoprefixer
        autoprefixer: {
            options: {
                browsers: ['> 5%', 'last 2 versions']
            },
            files: {
                expand: true,
                flatten: true,
                src: '<%= distPath %>/css/*.css',
                dest: '<%= distPath %>/css/'
            }
        },


        // Uglify
        uglify: {
            options: {
                soureMap: true
            },
            build: {
                files: {
                    '<%= distPath %>/js/gallery.js': '<%= srcPath %>/js/gallery.js'
                }
            }
        },


        // Shell commands
        shell: {
            updateCanIUse: {
                command: 'npm update caniuse-db'
            }
        },


        // Watch files
        watch: {
            sass: {
                files: [
                    '<%= srcPath %>/scss/*.scss',
                    '<%= srcPath %>/scss/**/*.scss'
                ],
                tasks: ['sass', 'cssmin', 'autoprefixer'],
                options: {
                    interrupt: true,
                    atBegin: true
                }
            },
            uglify: {
                files: [
                    '<%= srcPath %>/js/*.js'
                ],
                tasks: ['uglify'],
                options: {
                    interrupt: true,
                    atBegin: true
                }
            }
        }

    });

    // The dev task will be used during development
    grunt.registerTask('default', ['shell:updateCanIUse', 'watch']);

};
