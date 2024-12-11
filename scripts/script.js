//script for home page slider
$(document).ready(function () {
    // First Slider
    $('.owl-carousel:not(.reverse-carousel)').owlCarousel({
        loop: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
            0: { items: 1 },
            480: { items: 2 },
            768: { items: 3 },
            1024: { items: 4 }
        }
    });

    // Second Slider with Opposite Direction
    $('.reverse-carousel').owlCarousel({
        loop: true,
        margin: 20,
        autoplay: true,
        autoplayTimeout: 3000,
        rtl: true,
        responsive: {
            0: { items: 1 },
            480: { items: 2 },
            768: { items: 3 },
            1024: { items: 4 }
        }
    });
});
//script for home page slider ends