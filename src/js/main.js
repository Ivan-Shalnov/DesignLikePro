// import "../../node_modules/focus-visible/dist/focus-visible";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "../js/ScrollSmoother";

import "../scss/main.scss";
import "../index.html";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 2, // how long (in seconds) it takes to "catch up" to the native scroll position
  effects: true, // looks for data-speed and data-lag attributes on elements
  smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});
window.addEventListener("DOMContentLoaded", () => {
  // PROMO SECTION
  {
    const wrapRef = document.querySelector(".promo__wrap");
    const imgsRefs = wrapRef.querySelectorAll(".promo__img");
    const getScrollLength = () =>
      ((wrapRef.scrollWidth - document.body.clientWidth) / 100) * 97.5;
    const promoTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-wrap",
        start: "top top",
        end: () => getScrollLength() + "px",
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    ease: "none",
      promoTl.to(".promo__wrap", {
        x: () => -getScrollLength(),
        ease: "none",
      });
    imgsRefs.forEach((el) => {
      gsap.to(el, {
        xPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          containerAnimation: promoTl,
          start: "left right",
          scrub: true,
          // markers: true,
          horizontal: true,
        },
      });
    });
  }
  // PROMO SECTION
});
