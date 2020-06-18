let currentGallery = {};
let currentIndex = 0;
let galleryName = "";


window.gallery =
    {
        currentIndex: 0,
        galleryName: '',
        currentGallery: {},
        switchTo: function (index) {
            galleryImages = document.getElementsByClassName("profile-gallery--image");

            for (let i = 0; i < galleryImages.length; i++) {
                if (i !== index) {
                    galleryImages[i].style.display = "none";
                } else {
                    galleryImages[i].style.display = "block";
                }
            }
        },
        load: function (name) {
            this.currentGallery = window.galleries[name];
            this.galleryName = name;
            let galleryHtmls = [];
            for (let i = 0; i < this.currentGallery.gallery.length; i++) {
                let galleryItem = this.currentGallery.gallery[i];
                let caption = galleryItem.caption;
                let location = galleryItem.location;
                let webp = "photoprojects/" + this.galleryName + "/" + galleryItem.image + ".webp";
                let jpg = "photoprojects/" + this.galleryName + "/" + galleryItem.image + ".jpg";
                galleryHtmls.push(`
        <div class="profile-gallery--image">
            <div class="profile-gallery--meta">
                <div class="profile-gallery--meta--caption">${caption}</div>
                <div  class="profile-gallery--meta--location">${location}</div>
            </div>
            <picture>
                <source  srcset="${webp}" type="image/webp">
                <source  srcset="${jpg}" type="image/jpg">
                <img  src="${jpg}"
                     alt=""/>
            </picture>
        </div>`);
            }
            document.getElementById("gallery-items").innerHTML = galleryHtmls.join("");
            this.show();
            this.switchTo(0);
            document.getElementById("profile-gallery--overlayprev").addEventListener("click", function () {
                window.gallery.prev();
            });
            document.getElementById("profile-gallery--overlaynext").addEventListener("click", function () {
                window.gallery.next();
            });
            document.addEventListener('keydown', function (event) {
                if (event.key === "ArrowRight") {
                    event.stopImmediatePropagation();
                    window.gallery.next();
                    return false;
                }
                if (event.key === "ArrowLeft") {
                    event.stopImmediatePropagation();
                    window.gallery.prev();
                    return false;
                }
                if (event.key==="Esc" || event.key === "Escape"){
                    window.gallery.hide();
                    return false;
                }
            });
        },
        next: function () {
            this.currentIndex = (this.currentIndex + 1) % this.currentGallery.gallery.length;
            window.gallery.switchTo(this.currentIndex)
        },
        prev: function () {
            this.currentIndex = (this.currentIndex - 1) % this.currentGallery.gallery.length;
            if (this.currentIndex < 0) {
                this.currentIndex = this.currentGallery.gallery.length - 1;
            }
            this.switchTo(this.currentIndex)
        },
        open:

            function (name) {
                window.showGallery = true;
                this.load(name)
            }

        ,

        show: function () {
            document.getElementById("gallery").classList.remove("disappear");
            document.getElementById("gallery").classList.add("appear");
            document.getElementById("profile-gallery--overlayprev").style.display = "block";
            document.getElementById("profile-gallery--overlaynext").style.display = "block";
            document.getElementById("gallery-prev").style.display = "block";
            document.getElementById("gallery-next").style.display = "block";
            document.getElementById("gallery-close").style.display = "block";
            window.scrollToElement(document.getElementById("gallery"))
        }
        ,
        hide: function () {
            document.getElementById("gallery").classList.remove("appear");
            document.getElementById("gallery").classList.add("disappear");
            document.getElementById("profile-gallery--overlayprev").style.display = "none";
            document.getElementById("profile-gallery--overlaynext").style.display = "none";
            document.getElementById("gallery-prev").style.display = "none";
            document.getElementById("gallery-next").style.display = "none";
            document.getElementById("gallery-close").style.display = "none";
            window.scrollToElement(document.getElementById("photoprojects"))
        }
    }
;




