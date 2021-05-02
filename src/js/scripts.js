import '@/styl/style.styl'
import '@/styl/timeline.styl'

const navSlide = () =>{
    const nav = document.querySelector('#toggle')
    const navResponse = document.querySelector('.nav-responsive')
    const navClose = document.querySelector('.nav-close')
    const navItem = document.getElementsByClassName('nav-item')

    nav.addEventListener('click',() => {
        navResponse.classList.toggle('nav-active')
    })
    navClose.addEventListener('click',() => {
        navResponse.classList.toggle('nav-active')
    })
    for(var i=0;i<navItem.length;i++){
        navItem[i].addEventListener('click',() => {
            navResponse.classList.toggle('nav-active')
        })
    }
}
navSlide();
$(window).on("scroll", function() {
    console.log('scroll');
    if($(window).scrollTop() > 80) {
        $(".container-header").addClass("header-active");
        $(".social-link").addClass("social-link-active")
    } else {
       $(".container-header").removeClass("header-active");
       $(".social-link").removeClass("social-link-active")
    }
});

ScrollReveal({ reset: true }).reveal('.timeline-item').delay(500);