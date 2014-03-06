module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['**/*'],
            tasks: ['dummy'],
            options: {
                livereload: true
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('dummy', 'A dummy watch function', function() {
        console.log('watch complete');
    });

    grunt.registerTask('default', ['connect', 'watch']);
};
