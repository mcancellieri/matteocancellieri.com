import {loadGallery} from "./gallery";
import {showGallery} from "./gallery";
import {hideGallery} from "./gallery";

let new_scroll_position = 0;
let last_scroll_position;
let header = document.getElementById("bar");

window.showGallery = false;

function showHideBar(e) {
    last_scroll_position = window.scrollY;
    // Scrolling down
    if (last_scroll_position < 400) {
        // header.removeClass('slideDown').addClass('slideUp');
        header.classList.remove("slideDown");
        header.classList.add("slideUp");

        // Scrolling up
    } else {
        // header.removeClass('slideUp').addClass('slideDown');
        header.classList.remove("slideUp");
        header.classList.add("slideDown");
    }
    if (!window.showGallery && window.galleryDisappearOnNextScroll) {
        window.gallery.hide();
        window.galleryDisappearOnNextScroll=false;
        scrollTo(document.getElementById("photoprojects"))

    }
    if (window.showGallery) {
        header.classList.remove("slideDown");
        header.classList.add("slideUp");
        window.showGallery = false;
        window.galleryDisappearOnNextScroll=true;
    }

    new_scroll_position = last_scroll_position;
}

function scrollTo(element) {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop
    });
}

window.addEventListener('scroll', showHideBar);

showHideBar(null);

