// import "../../node_modules/focus-visible/dist/focus-visible";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "../js/ScrollSmoother";
import SplitText from "../js/SplitText";

import { Preloader } from "./preloader/preloader";
const vh = window.innerHeight * 0.01;
const vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
document.documentElement.style.setProperty("--vw", `${vw}px`);
import "../scss/main.scss";
import "../index.html";

new Preloader({
  mediaSelector: "img, video",
  preloaderSelector: "[data-preloader]",
  stepsAmount: 7,
});

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
gsap.config({
  force3D: true,
});
const windowWidth = window.innerWidth;
if (windowWidth > 768) {
  ScrollSmoother.create({
    normalizeScroll: true,
    smooth: 2, // how long (in seconds) it takes to "catch up" to the native scroll position
    effects: true, // looks for data-speed and data-lag attributes on elements
    smoothTouch: 0, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
  });
}

window.addEventListener("DOMContentLoaded", () => {
  // PROMO SECTION
  {
    let mm = gsap.matchMedia();
    // add a media query. When it matches, the associated function will run

    const wrapRef = document.querySelector(".promo__wrap");
    const imgsRefs = wrapRef.querySelectorAll(".promo__img");
    const getScrollLength = () =>
      ((wrapRef.scrollWidth - document.body.clientWidth) / 100) * 97.5;
    const promoTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-wrap",
        start: "top top",
        end: () => getScrollLength() + "px",
        scrub: true,
        pin: true,
        // markers: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    promoTl.to(".promo__wrap", {
      x: () => -getScrollLength(),
      ease: "none",
      lazy: false,
    });
    // imgsRefs.forEach((el) => {
    //   gsap.to(el, {
    //     xPercent: -40,
    //     ease: "none",
    //     scrollTrigger: {
    //       trigger: el,
    //       containerAnimation: promoTl,
    //       start: "left right",
    //       scrub: true,
    //       horizontal: true,
    //     },
    //   });
    // });
  }

  // PROMO SECTION

  // PROGRAM SECTION
  {
    let mm = gsap.matchMedia();

    // add a media query. When it matches, the associated function will run
    mm.add("(min-width: 1200px)", () => {
      const wrapRef = document.querySelector(".program-section__slides");
      const headerRef = document.querySelector(".program-section__header");
      const slides = gsap.utils.toArray(".program-section__slide");
      console.log(headerRef.clientHeight);
      const totalHeight = (el) => el.clientHeight;
      ScrollTrigger.create({
        trigger: headerRef,
        start: "top 3%",
        endTrigger: slides[slides.length - 1],
        end: () => "top 10%",
        pin: true,
        // markers: true,
        pinSpacing: false,
      });
      slides.pop(); // get rid of the last one (don't need it in the loop)
      slides.forEach((slide, i) => {
        const { offsetHeight } = slide;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: slide,
            start: "bottom 90%",
            pinSpacing: false,
            end: "+=" + offsetHeight,
            pin: true,
            scrub: true,
            // markers: true,
            onRefresh: () =>
              gsap.set(slide, {
                transformOrigin:
                  "center " + (offsetHeight - window.innerHeight / 2) + "px",
              }),
          },
        });

        tl.to({}, { duration: 5 })
          .to(slide, {
            rotateZ: 3,
            yPercent: 4,
            scale: 0.9,
            duration: 5,
          })
          .set(slide, { opacity: 0 });
      });
    });
  }
  // PROGRAM SECTION

  // PRICE SECTION START
  {
    const priceTitleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".price-section__title",
        start: "top 65%",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
      },
    });
    new SplitText(".price-section__title li h2", {
      type: "words, chars",
      charsClass: "word",
    });

    priceTitleTl
      .addLabel("start" + 0.15)
      .staggerFrom(
        ".price-section__title li h2 div",
        0.8,
        { y: "100%", ease: "Power2.easeInOut", yoyo: true },
        0.01
      )
      .staggerFrom(
        ".price-section__subtitle li p",
        0.4,
        { opacity: 0, ease: "Bounce.inOut", y: "100%" },
        0.1,
        "start"
      );
  }
  // PRICE SECTION END
});
