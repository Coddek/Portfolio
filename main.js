(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function(sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function(sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  /* NAV */
  function initNav() {
    var nav = $("#nav");
    var burger = $(".nav-burger");
    var mobileMenu = $("#nav-mobile");

    window.addEventListener("scroll", function() {
      if (window.scrollY > 20) {
        nav.style.background = "rgba(8,11,16,0.97)";
      } else {
        nav.style.background = "rgba(8,11,16,0.8)";
      }
    }, { passive: true });

    if (burger && mobileMenu) {
      burger.addEventListener("click", function() {
        var isOpen = mobileMenu.classList.toggle("is-open");
        burger.classList.toggle("is-open", isOpen);
        burger.setAttribute("aria-expanded", String(isOpen));
        mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      });

      $$(".nav-mobile a").forEach(function(a) {
        a.addEventListener("click", function() {
          mobileMenu.classList.remove("is-open");
          burger.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
          mobileMenu.setAttribute("aria-hidden", "true");
        });
      });
    }

    /* Smooth scroll para anchors internos */
    $$('a[href^="#"]').forEach(function(a) {
      a.addEventListener("click", function(e) {
        var target = $(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        var offset = 70;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* SCROLL REVEALS */
  function initReveals() {
    if (reduced) return;

    var els = $$(".section-header, .project-card, .project-mini, .stack-item, .cert-item, .about-text, .about-visual, .contact-inner");
    els.forEach(function(el) { el.classList.add("reveal"); });

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function() {
            entry.target.classList.add("is-visible");
          }, (i % 4) * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    els.forEach(function(el) { observer.observe(el); });
  }

  /* GSAP HERO ANIMATIONS */
  function initHeroAnimations() {
    if (reduced || !window.gsap) return;

    gsap.from(".hero-badge", { opacity: 0, y: 20, duration: .7, ease: "expo.out", delay: .1 });
    gsap.from(".hero-title-name", { opacity: 0, y: 30, duration: .8, ease: "expo.out", delay: .25 });
    gsap.from(".hero-title-role", { opacity: 0, y: 20, duration: .7, ease: "expo.out", delay: .4 });
    gsap.from(".hero-sub", { opacity: 0, y: 20, duration: .7, ease: "expo.out", delay: .55 });
    gsap.from(".hero-actions", { opacity: 0, y: 16, duration: .6, ease: "expo.out", delay: .7 });
    gsap.from(".hero-stack span", {
      opacity: 0, y: 12, duration: .5, ease: "expo.out", delay: .85, stagger: .06
    });
    gsap.from(".hero-scroll", { opacity: 0, duration: 1, delay: 1.4 });
  }

  /* GSAP SCROLL PARALLAX (sutil) */
  function initParallax() {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;

    try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}

    gsap.to(".hero-glow--1", {
      yPercent: -30,
      ease: "none",
      scrollTrigger: { trigger: ".hero", scrub: 1.5 }
    });
    gsap.to(".hero-glow--2", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: { trigger: ".hero", scrub: 2 }
    });
  }

  /* STACK HOVER (tilt sutil) */
  function initStackHover() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    $$(".stack-item").forEach(function(item) {
      item.addEventListener("mousemove", function(e) {
        var rect = item.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - .5;
        var y = (e.clientY - rect.top) / rect.height - .5;
        item.style.transform = "perspective(300px) rotateX(" + (-y * 6) + "deg) rotateY(" + (x * 6) + "deg) scale(1.03)";
      });
      item.addEventListener("mouseleave", function() {
        item.style.transform = "";
      });
    });
  }

  /* BOOT */
  function boot() {
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initStackHover, "initStackHover");

    if (window.gsap) {
      safe(initHeroAnimations, "initHeroAnimations");
      if (window.ScrollTrigger) {
        safe(initParallax, "initParallax");
      }
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})();
