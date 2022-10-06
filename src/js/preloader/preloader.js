import disableScroll from "disable-scroll";
import gsap from "gsap";
import "./preloader.scss";
export class Preloader {
  REFS = {};
  currentStep = 0;
  currentProgress = 0;
  stepCost = 0;
  steps = [0];
  visibleProgress = 0;
  nextVisibleProgress = 0;
  timeline = gsap.timeline();
  constructor({ mediaSelector, preloaderSelector, stepsAmount }) {
    this.REFS = {
      preloader: document.querySelector(preloaderSelector),
      progressValue: document.querySelector(
        `${preloaderSelector} [data-progress-value]`
      ),
      elements: document.querySelectorAll(mediaSelector),
    };
    const stepCost = 100 / stepsAmount;
    for (let i = 1; i <= stepsAmount; i += 1) {
      const step = Math.ceil(stepCost * i);
      this.steps.push(step);
    }
    this.nextVisibleProgress = this.steps[1];
    this.stepCost = 100 / this.REFS.elements.length;
    this.elementsAmount = this.REFS.elements.length;
    this.step = 100 / (this.elementsAmount - 1);
    this.futureProgress = this.step;
    const cs = getComputedStyle(this.REFS.preloader);

    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

    const borderY =
      parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

    const containerHeight =
      this.REFS.preloader.offsetHeight - paddingY - borderY;

    this.stepSizePx = (containerHeight * 0.8) / (this.steps.length - 1);
    console.log("Preloader ~ constructor ~ this.stepSizePx", this.stepSizePx);
    this.init();
  }
  init() {
    disableScroll.on();
    this.hidePreloderTl = gsap.timeline({
      paused: true,
      autoRemoveChildren: true,
    });
    this.hidePreloderTl.then(() => disableScroll.off());
    this.hidePreloderTl
      .to(this.REFS.preloader, { yPercent: -100, duration: 0.75 })
      .to(".preloader__progress-value, .preloader__logo", { opacity: 0 }, "<")
      .fromTo(
        ".header",
        { yPercent: -100 },
        { yPercent: 0, lazy: false, duration: 0.5 }
      );
    this.REFS.elements.forEach((el, idx) => {
      if (el.complete) this.elementLoaded();
      else el.addEventListener("load", this.elementLoaded);
      // setTimeout(this.elementLoaded, 700 * (idx + 1));
    });
  }
  elementLoaded = (event) => {
    this.currentProgress += this.stepCost;
    const snappedProgress = gsap.utils.snap(this.steps, this.currentProgress);

    if (snappedProgress === this.visibleProgress) {
      console.log("Skip");
      return;
    }

    // const valueIdx = this.steps.indexOf(snappedProgress);
    // this.visibleProgress = snappedProgress;
    // this.nextVisibleProgress = this.steps[valueIdx + 1];
    // this.renderProgress({
    //   current: this.visibleProgress,
    //   future: this.nextVisibleProgress,
    // });

    if (this.tween) {
      this.tween = this.tween.then(() => {
        if (snappedProgress === 100) {
          // this.createNumbersTl().then(this.hidePreloader);
          this.hidePreloader();
          return;
        }
        // this.nextStep();
        this.currentStep += 1;
        const valueIdx = this.steps.indexOf(snappedProgress);
        const current = snappedProgress;
        const future = this.steps[valueIdx + 1];
        this.nextVisibleProgress = this.steps[valueIdx + 1];

        this.renderProgress({ current, future });
        return this.createNumbersTl();
      });
      this.visibleProgress = snappedProgress;
    } else {
      // console.log(this.currentProgress);
      // this.nextStep();
      this.currentStep += 1;
      const valueIdx = this.steps.indexOf(snappedProgress);
      const current = snappedProgress;
      const future = this.steps[valueIdx + 1];
      this.nextVisibleProgress = this.steps[valueIdx + 1];
      this.renderProgress({ current, future });

      this.tween = this.createNumbersTl();
      this.visibleProgress = snappedProgress;
    }
  };
  // nextStep() {

  //   // this.currentStep += 1;
  //   // //   const valueIdx = this.steps.indexOf(snappedProgress);

  //   // this.currentProgress = this.steps;
  //   // if (this.currentProgress >= 100) this.futureProgress = 100;
  //   // else this.futureProgress = this.currentProgress + this.step;
  // }
  renderProgress({ current, future }) {
    const currentProgressMarkup = current
      .toString()
      .split("")
      .map((char) => `<div>${char}</div>`)
      .join("");
    const futureProgressMarkup = future
      .toString()
      .split("")
      .map((char) => `<div>${char}</div>`)
      .join("");

    this.REFS.progressValue.innerHTML = `<div class="preloader__current">${currentProgressMarkup}</div><div class="preloader__future">${futureProgressMarkup}</div>`;
  }
  hidePreloader = () => {
    this.hidePreloderTl.play();
  };
  createNumbersTl() {
    return gsap
      .timeline({ autoRemoveChildren: true })
      .to(this.REFS.progressValue, {
        y: -(this.stepSizePx * this.currentStep),
        ease: "slow(0.7, 0.7, false)",
        duration: 0.6,
      })
      .to(
        "div.preloader__current > div",
        {
          yPercent: -100,
          opacity: 0,
          stagger: {
            each: 0.25,
            from: 0,
          },
          ease: "slow(0.7, 0.7, false)",
          duration: 0.6,
        },

        "<"
      )
      .fromTo(
        "div.preloader__future > div",
        {
          yPercent: 0,
          opacity: 0,
        },
        {
          yPercent: -100,
          opacity: 1,
          stagger: {
            each: 0.25,
            from: 0,
          },
          duration: 0.6,
          ease: "slow(0.7, 0.7, false)",
        },
        "<"
      );
  }
}
