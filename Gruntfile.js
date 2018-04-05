/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function( grunt ) {

    grunt.initConfig( {
        responsive_images: {
            dev: {
                options: {
                    rename: false,
                    engine: 'im',
                    sizes: [ {

                            width: 390,
                            suffix: "_small",
                            quality: 30,


          },
                        {

                            width: 830,
                            suffix: "_large",
                            quality: 50,


          } ]
                },

                /*
                You don't need to change this part if you don't change
                the directory structure.
                */
                files: [ {
                    expand: true,
                    src: [ '*.{gif,jpg,png}' ],
                    cwd: 'src_img/',
                    dest: 'img/'
        } ]
            }
        },

        /* Clear out the images directory if it exists */
        clean: {
            dev: {
                src: [ 'img' ],
            },
        },

        /* Generate the images directory if it is missing */
        mkdir: {
            dev: {
                options: {
                    create: [ 'img' ]
                },
            },
        },

        /* Copy the "fixed" images that don't go through processing into the images/directory */
        copy: {
            dev: {
                files: [ {
                    expand: true,
                    src: 'src_img/fixed/*.{gif,jpg,png}',
                    dest: 'images/'
        } ]
            },
        },
    } );

    grunt.loadNpmTasks( 'grunt-responsive-images' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-mkdir' );
    grunt.registerTask( 'default', [ 'clean', 'mkdir', 'copy', 'responsive_images' ] );

};