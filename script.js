'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const section1 = document.querySelector('#section--1')
const toScroll = document.querySelector('.btn--scroll-to')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')
const header = document.querySelector('.header')
const sections = document.querySelectorAll('.section')

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ? Adding smooth scroll

toScroll.addEventListener('click', function () {
  const s1coords = section1.getBoundingClientRect();

  // Method 1
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset) //For relative scrolling

  // Method 2
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })

  // Modern method
  section1.scrollIntoView({ behavior: 'smooth' })
})

// Smooth scroll to nav-links
// Method 1: It is not much efficient as it makes same function for multiple elements
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
//   })
// })

// Method 2: this is efficient method: using //*event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {  //this condition will prevent click event from happening in parent element nav__links
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

// ? Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab')

  // Guard clause
  if (!clicked) return

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'))
  tabsContent.forEach(c => c.classList.remove('operations__content--active'))

  // Activate tabs
  clicked.classList.add('operations__tab--active')

  // Active Content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')

})

// ? Navbar fading effect

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
}

// Method 1
// nav.addEventListener('mouseover', function (e) {  // * mouseover works same as mouseenter but it also has bubbling effect which mouseenter don't have
//   handleHover(e, 0.5)
// })

// nav.addEventListener('mouseout', function (e) {  //When cursor is removed from that element
//   handleHover(e, 1)
// })

// Method 2: Passing arguments into handler functions
nav.addEventListener('mouseover', handleHover.bind(0.5))  //* Here we defined 0.5 as this keyword for handleHover function by using bind method

nav.addEventListener('mouseout', handleHover.bind(1))

// ? Sticky navbar

// Method 1: This method is not recommended as it is very slow performance wise.
// const initialCoords = section1.getBoundingClientRect().top;

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords) nav.classList.add('sticky');
//   else nav.classList.remove('sticky')
// })

// Method 2: This is efficient

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky')
  else nav.classList.remove('sticky')
}

const navOptions = {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
  // rootMargin: `-${navHeight}px`, //This method will stick navbar exactly at height of navbar
}

const headerObserver = new IntersectionObserver(stickyNav, navOptions)
headerObserver.observe(header);


// ? COOL Section reveal effect

const revealSection = function ([entry], observer) {

  if (!entry.isIntersecting) return;  //For the first section, because first entry will always be generated. Hence by preventing this way it works
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target) //When a section is revealed, there is no longer need to observe it. Hence it will increase performance
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})

sections.forEach(section => {
  sectionObserver.observe(section)
  section.classList.add('section--hidden')
})


// ? Lazy loading images (This effect is used for better performance when internet connection is slow)

const images = document.querySelectorAll('img[data-src]')  //This technique selects only those img which have data-src attribute

const revealImages = function ([entry], observer) {
  if (!entry.isIntersecting) return;

  // Replace src with dataset src
  const image = entry.target;
  image.src = image.dataset.src

  image.addEventListener('load', () => image.classList.remove('lazy-img')) //This event listener will remove lazy-img class only when the image is completely loaded on the browser

  observer.unobserve(image)
}

const imageObserver = new IntersectionObserver(revealImages, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
})

images.forEach(img => imageObserver.observe(img))

// ? Slider in section 3

const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right')
const btnLeft = document.querySelector('.slider__btn--left')
let curSlide = 0;
const maxSlide = slides.length
const dotContainer = document.querySelector('.dots')

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  })
}

createDots();

const activeDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}

const changeSlide = function (slide) {
  slides.forEach((s, i) => s.style.transform = `translateX(${(i - slide) * 100}%)`)
  activeDot(slide)
}
changeSlide(0); //0% 100% 200% 

const rightSlide = function () {
  if (curSlide === maxSlide - 1) curSlide = 0;
  else curSlide++;

  changeSlide(curSlide)
  //-100% 0% 100%
}

const leftSlide = function () {
  if (curSlide === 0) curSlide = maxSlide - 1;
  else curSlide--;

  changeSlide(curSlide)
}

btnRight.addEventListener('click', rightSlide)

btnLeft.addEventListener('click', leftSlide)

// Change slide with arrow keys
document.addEventListener('keydown', function (e) {
  console.log(e); //For checking which key is pressed
  e.key === 'ArrowRight' && rightSlide();
  e.key === 'ArrowLeft' && leftSlide();
})

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // const slide = e.target.dataset.slide  //Method 1
    const { slide } = e.target.dataset  //Using destructuring
    changeSlide(slide)
  }
})