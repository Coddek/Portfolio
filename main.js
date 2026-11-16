(function () {
  "use strict";

  var SYSTEMS = window.__SYSTEMS__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.from((scope || document).querySelectorAll(sel)); };
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); } }
  function svg(tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  /* =========================================================
     DIAGRAMAS: renderiza un sistema como plano en SVG.
     En pantallas angostas la grilla se traspone (flujo vertical).
     ========================================================= */
  function renderDiagram(host, key, animate) {
    var sys = SYSTEMS[key];
    if (!sys) return null;

    var narrow = host.clientWidth < 520;
    var W = narrow ? 160 : 176, H = 56;
    var GX = narrow ? 16 : 44, GY = narrow ? 34 : 26;

    var pos = {}, maxC = 0, maxR = 0;
    sys.nodes.forEach(function (n) {
      var c = narrow ? n.row : n.col, r = narrow ? n.col : n.row;
      pos[n.id] = { c: c, r: r, x: c * (W + GX), y: r * (H + GY), n: n };
      maxC = Math.max(maxC, c); maxR = Math.max(maxR, r);
    });
    var width = (maxC + 1) * W + maxC * GX;
    var height = (maxR + 1) * H + maxR * GY;
    var pad = 10;

    var root = svg("svg", {
      viewBox: (-pad) + " " + (-pad) + " " + (width + pad * 2) + " " + (height + pad * 2),
      class: "diagram-svg",
      role: "img",
      "aria-label": "Arquitectura de " + sys.name + ": " +
        sys.edges.map(function (e) { return pos[e[0]].n.label + " → " + pos[e[1]].n.label; }).join(", ")
    });
    root.style.maxWidth = Math.round((width + pad * 2) * (host.classList.contains("diagram--hero") ? 1.25 : 1)) + "px";

    var defs = svg("defs", {});
    var marker = svg("marker", { id: "arrow-" + key, viewBox: "0 0 8 8", refX: "7", refY: "4", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    marker.appendChild(svg("path", { d: "M0,0 L8,4 L0,8 z", class: "diagram-arrow" }));
    defs.appendChild(marker);
    root.appendChild(defs);

    var paths = {};
    var edgeLayer = svg("g", { class: "diagram-edges" });
    sys.edges.forEach(function (e) {
      var a = pos[e[0]], b = pos[e[1]];
      var forward = narrow ? b.r > a.r : b.c > a.c;
      var d;
      // flujo principal: horizontal en escritorio, vertical en celular
      var alongX = narrow ? !forward : forward;
      if (alongX) {
        var dir = b.x >= a.x ? 1 : -1;
        var x1 = a.x + (dir > 0 ? W : 0), y1 = a.y + H / 2;
        var x2 = b.x + (dir > 0 ? 0 : W), y2 = b.y + H / 2;
        var mx = (x1 + x2) / 2;
        d = "M" + x1 + "," + y1 + " C" + mx + "," + y1 + " " + mx + "," + y2 + " " + (x2 - dir * 2) + "," + y2;
      } else {
        var dy = b.y >= a.y ? 1 : -1;
        var vx1 = a.x + W / 2, vy1 = a.y + (dy > 0 ? H : 0);
        var vx2 = b.x + W / 2, vy2 = b.y + (dy > 0 ? 0 : H);
        var my = (vy1 + vy2) / 2;
        d = "M" + vx1 + "," + vy1 + " C" + vx1 + "," + my + " " + vx2 + "," + my + " " + vx2 + "," + (vy2 - dy * 2);
      }
      var p = svg("path", { d: d, class: "diagram-edge" + (e[2] === "fallback" ? " is-fallback" : ""), "marker-end": "url(#arrow-" + key + ")", pathLength: "1" });
      p.style.setProperty("--d", ((narrow ? a.r : a.c) * 140 + 160) + "ms");
      paths[e[0] + ">" + e[1]] = p;
      edgeLayer.appendChild(p);
    });
    root.appendChild(edgeLayer);

    var nodeEls = {};
    sys.nodes.forEach(function (n) {
      var p = pos[n.id];
      var g = nodeEls[n.id] = svg("g", { class: "diagram-node is-" + n.kind, transform: "translate(" + p.x + "," + p.y + ")" });
      g.style.setProperty("--d", ((narrow ? p.r : p.c) * 140) + "ms");
      g.appendChild(svg("rect", { width: W, height: H, rx: 7 }));
      if (n.kind === "ai") g.appendChild(svg("circle", { cx: W - 12, cy: 12, r: 3, class: "diagram-pulse" }));
      var t = svg("text", { x: 12, y: n.sub ? 23 : 33, class: "diagram-label" });
      t.textContent = n.label;
      g.appendChild(t);
      if (n.sub) {
        var s = svg("text", { x: 12, y: 41, class: "diagram-sub" });
        s.textContent = n.sub;
        g.appendChild(s);
      }
      root.appendChild(g);
    });

    host.innerHTML = "";
    host.classList.toggle("is-narrow", narrow);
    host.appendChild(root);

    if (animate && !reduced) {
      host.classList.remove("is-drawn");
      void host.offsetWidth;
      requestAnimationFrame(function () { host.classList.add("is-drawn"); });
    } else {
      host.classList.add("is-drawn", "is-static");
    }

    return {
      root: root,
      route: (sys.route || []).slice(1).map(function (id, i) { return paths[sys.route[i] + ">" + id]; }).filter(Boolean),
      routeNodes: (sys.route || []).map(function (id) { return nodeEls[id]; }),
      narrow: narrow
    };
  }

  /* Paquete de datos que recorre la ruta principal del hero.
     Viaja por cada conexión y, al llegar a un nodo, se "procesa" ahí
     (el nodo se ilumina) antes de salir por la siguiente. Así nunca
     salta de un borde del nodo a otro. */
  var packet = { raf: 0, run: 0, visible: true };
  function startPacket(drawn) {
    cancelAnimationFrame(packet.raf);
    packet.run++;
    if (reduced || !drawn || !drawn.route.length) return;
    var run = packet.run;
    var dot = svg("circle", { r: 5, class: "diagram-packet" });
    drawn.root.appendChild(dot);

    var SPEED = 0.14, DWELL = 380, REST = 1100;
    var steps = [];
    drawn.route.forEach(function (path, i) {
      var len = path.getTotalLength();
      steps.push({ type: "move", path: path, len: len, dur: len / SPEED });
      steps.push({ type: "node", node: drawn.routeNodes[i + 1], dur: i === drawn.route.length - 1 ? DWELL * 2 : DWELL });
    });
    steps.unshift({ type: "node", node: drawn.routeNodes[0], dur: DWELL });
    steps.push({ type: "rest", dur: REST });
    var cycle = steps.reduce(function (a, st) { return a + st.dur; }, 0);

    var active = null;
    function setActive(node) {
      if (active === node) return;
      if (active) active.classList.remove("is-active");
      active = node || null;
      if (active) active.classList.add("is-active");
    }

    var start = performance.now() + 1300; // espera a que termine de dibujarse
    var pausedAt = null;
    function frame(now) {
      if (run !== packet.run) { setActive(null); return; }
      packet.raf = requestAnimationFrame(frame);
      if (!packet.visible) { if (pausedAt === null) pausedAt = now; return; }
      if (pausedAt !== null) { start += now - pausedAt; pausedAt = null; }
      var t = now - start;
      if (t < 0) return;
      t = t % cycle;
      for (var i = 0; i < steps.length; i++) {
        var st = steps[i];
        if (t > st.dur) { t -= st.dur; continue; }
        if (st.type === "move") {
          var pt = st.path.getPointAtLength(st.len * (t / st.dur));
          dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
          dot.style.opacity = 1;
          setActive(null);
        } else {
          dot.style.opacity = 0;
          setActive(st.type === "node" ? st.node : null);
        }
        return;
      }
    }
    packet.raf = requestAnimationFrame(frame);
  }

  function initHeroDiagram() {
    var host = $("#hero-diagram");
    if (!host) return;
    var tabs = $$(".system-tab");
    var caption = $("#hero-caption");
    var current = tabs.length ? tabs[0].dataset.system : "archichat";
    var lastNarrow = null;

    function show(key, animate) {
      current = key;
      tabs.forEach(function (t) {
        var on = t.dataset.system === key;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      if (caption && SYSTEMS[key]) caption.textContent = SYSTEMS[key].caption;
      var drawn = renderDiagram(host, key, animate);
      lastNarrow = drawn && drawn.narrow;
      startPacket(drawn);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { if (tab.dataset.system !== current) show(tab.dataset.system, true); });
      tab.addEventListener("keydown", function (e) {
        var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        var next = tabs[(i + step + tabs.length) % tabs.length];
        next.focus();
        next.click();
      });
    });

    show(current, true);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        packet.visible = entries[0].isIntersecting;
      }).observe(host);
    }
    document.addEventListener("visibilitychange", function () { packet.visible = !document.hidden; });

    var timer;
    window.addEventListener("resize", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if ((host.clientWidth < 520) !== lastNarrow) show(current, false);
      }, 150);
    });
  }

  function initProjectDiagrams() {
    var hosts = $$("[data-diagram]");
    function draw() { hosts.forEach(function (h) { renderDiagram(h, h.dataset.diagram, false); }); }
    draw();
    var timer, lastW = window.innerWidth;
    window.addEventListener("resize", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (Math.abs(window.innerWidth - lastW) > 40) { lastW = window.innerWidth; draw(); }
      }, 150);
    });
  }

  /* NAV */
  function initNav() {
    var nav = $("#nav");
    var burger = $(".nav-burger");
    var menu = $("#nav-mobile");

    window.addEventListener("scroll", function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    }, { passive: true });

    function close() {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      menu.setAttribute("aria-hidden", "true");
    }
    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-hidden", String(!open));
      });
      $$("a", menu).forEach(function (a) { a.addEventListener("click", close); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }
  }

  /* Copiar email */
  function initCopy() {
    var btn = $("#copy-email");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var text = btn.dataset.copy;
      var done = function () {
        btn.textContent = "Copiado";
        setTimeout(function () { btn.textContent = "Copiar"; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectEmail(); });
      } else { selectEmail(); }
    });
    function selectEmail() {
      var el = $("#email-text");
      var r = document.createRange();
      r.selectNodeContents(el);
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    }
  }

  /* Diplomas en modal; sin JS el link abre la imagen */
  function initCertModal() {
    var modal = $("#cert-modal");
    if (!modal || typeof modal.showModal !== "function") return;
    var img = $(".cert-modal-img", modal);
    var error = $(".cert-modal-error", modal);

    img.addEventListener("error", function () { img.hidden = true; error.hidden = false; });
    $$(".cert-view").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        img.hidden = false; error.hidden = true;
        img.alt = "Diploma: " + a.getAttribute("aria-label").replace(/^Ver diploma: /, "");
        img.src = a.getAttribute("href");
        modal.showModal();
      });
    });
    $(".cert-modal-close", modal).addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
    modal.addEventListener("close", function () { img.removeAttribute("src"); });
  }

  function boot() {
    safe(initNav, "nav");
    safe(initHeroDiagram, "heroDiagram");
    safe(initProjectDiagrams, "projectDiagrams");
    safe(initCopy, "copy");
    safe(initCertModal, "certModal");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
