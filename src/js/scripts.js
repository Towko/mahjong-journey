// var $ = require( "jquery" );
// require('bootstrap');
$(document).ready(function() {
    $('.carousel').carousel();
    new WOW({
        offset: 200
    }).init();
});