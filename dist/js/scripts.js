$(document).ready(function() {
    $('.carousel').carousel();
    new WOW({
        offset: 200
    }).init();
    $('.parallax, .carousel-block__top-image, .cloud1, .cloud2, .video-decor > div').parallaxBackground();
});