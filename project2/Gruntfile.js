/**
 * Created by Dagur on 2/17/2015.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'app/*.js'],
            options: {
                curly:  true,
                immed:  true,
                newcap: true,
                noarg:  true,
                sub:    true,
                boss:   true,
                eqnull: true,
                node:   true,
                undef:  true,
                globals: {
                    _:       false,
                    jQuery:  false,
                    angular: false,
                    moment:  false,
                    console: false,
                    $:       false,
                    io:      false
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);

};