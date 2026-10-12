/* Dreamy Kids · efeitos divertidos da hero
   - letras do título que saltam ao passar o rato
   - zonas da fotografia que reagem (slime, confettis, pepinos, música, comando)
   - rasto de estrelinhas a seguir o cursor
   Tudo desligado com prefers-reduced-motion. Em ecrãs táteis, as zonas reagem ao toque. */
(function () {
  "use strict";
  var gsap = window.gsap;
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temRato = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!gsap || reduz) return;

  var CORES = ["#FFBE3D", "#EC3A97", "#8B52E0", "#22B5EE", "#F59ACB", "#C9A7FF"];
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 1. Letras do título ---------- */
  function letras() {
    var h1 = $(".hero__titulo");
    if (!h1) return;
    h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
    $$(".w__i", h1).forEach(function (w) {
      var t = w.textContent; w.textContent = "";
      Array.prototype.forEach.call(t, function (c) {
        var s = document.createElement("span"); s.className = "l"; s.textContent = c; s.setAttribute("aria-hidden", "true");
        w.appendChild(s);
      });
    });
    setTimeout(function () { h1.classList.add("livre"); }, 2300); // depois da entrada, as letras podem saltar sem ser cortadas
    var saltar = function (l) {
      if (l._ativa) return; l._ativa = true;
      var noRoxo = !!l.closest("em");
      gsap.timeline({ onComplete: function () { l._ativa = false; } })
        .to(l, { y: -14, rotation: rnd(-14, 14), scale: 1.18, color: noRoxo ? "#EC3A97" : CORES[Math.floor(rnd(1, 4))], duration: 0.18, ease: "power2.out" })
        .to(l, { y: 0, rotation: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.35)" })
        .to(l, { color: noRoxo ? "#7C42D8" : "#22213A", duration: 0.6, clearProps: "color" }, "-=0.5");
    };
    if (temRato) h1.addEventListener("pointerover", function (e) { if (e.target.classList.contains("l")) saltar(e.target); });
    // no toque: a palavra inteira faz uma onda
    h1.addEventListener("click", function (e) {
      var w = e.target.closest(".w__i"); if (!w) return;
      $$(".l", w).forEach(function (l, i) { setTimeout(function () { saltar(l); }, i * 40); });
    });
  }

  /* ---------- 2. Partículas na camada de efeitos da foto ---------- */
  var fx = $(".hero__fx");
  function particula(cls, x, y, html) {
    var p = document.createElement("i");
    p.className = "fx " + cls; p.style.left = x + "%"; p.style.top = y + "%";
    if (html) p.innerHTML = html;
    fx.appendChild(p);
    return p;
  }
  function confettis(x, y, n) {
    for (var i = 0; i < n; i++) {
      var p = particula("fx--confetti", x, y);
      p.style.background = CORES[i % CORES.length];
      if (i % 3 === 0) p.style.borderRadius = "50%";
      var ang = rnd(-Math.PI * 0.95, -Math.PI * 0.05), v = rnd(60, 150);
      gsap.timeline({ onComplete: p.remove.bind(p) })
        .to(p, { x: Math.cos(ang) * v, y: Math.sin(ang) * v, rotation: rnd(-300, 300), duration: 0.55, ease: "power2.out" })
        .to(p, { y: "+=" + rnd(90, 160), x: "+=" + rnd(-20, 20), rotation: "+=" + rnd(-200, 200), opacity: 0, duration: rnd(0.8, 1.2), ease: "power1.in" });
    }
  }
  function brilhos(pontos, cor) {
    pontos.forEach(function (pt, i) {
      var p = particula("fx--brilho", pt[0], pt[1]);
      p.style.background = cor || CORES[i % CORES.length];
      gsap.timeline({ delay: i * 0.05, onComplete: p.remove.bind(p) })
        .fromTo(p, { scale: 0, rotation: 0 }, { scale: rnd(0.8, 1.4), rotation: 90, duration: 0.3, ease: "back.out(2)" })
        .to(p, { scale: 0, opacity: 0, y: -12, duration: 0.5 });
    });
  }
  function notas(x, y) {
    ["♪", "♫", "♪"].forEach(function (n, i) {
      var p = particula("fx--nota", x, y, n);
      p.style.color = CORES[(i + 1) % CORES.length];
      gsap.timeline({ delay: i * 0.18, onComplete: p.remove.bind(p) })
        .fromTo(p, { y: 0, x: 0, opacity: 0, scale: 0.6 }, { y: -30, x: rnd(-14, 14), opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" })
        .to(p, { y: -90, x: "+=" + rnd(-24, 24), rotation: rnd(-25, 25), opacity: 0, duration: 1.1, ease: "sine.in" });
    });
  }
  function pulso(alvos, vezes, escala) {
    gsap.timeline().to(alvos, { scale: escala || 1.07, duration: 0.14, ease: "power2.out", yoyo: true, repeat: vezes * 2 - 1, clearProps: "transform" });
  }

  var EFEITOS = {
    festa: function () { // confettis a sair dos dois punhos
      confettis(21, 4, 16); confettis(60, 4, 16);
    },
    slime: function () { // a gosma ondula e regressa com elasticidade
      var mapa = $("#gosma-mapa"), ruido = $("#gosma-ruido"), clone = $(".clone--slime");
      gsap.killTweensOf([mapa, ruido]);
      clone.classList.add("ativo");
      gsap.timeline({ onComplete: function () { clone.classList.remove("ativo"); } })
        .to(mapa, { attr: { scale: 22 }, duration: 0.3, ease: "power2.out" })
        .to(ruido, { attr: { baseFrequency: "0.02 0.05" }, duration: 0.9, ease: "sine.inOut" }, 0)
        .to(mapa, { attr: { scale: 0 }, duration: 1.4, ease: "elastic.out(1, 0.3)" })
        .to(ruido, { attr: { baseFrequency: "0.012 0.03" }, duration: 1.2 }, "<");
      brilhos([[14, 50], [22, 61], [30, 68], [38, 70], [26, 72]], "#FFFFFF");
    },
    pepino: function () { // os pepinos giram, saltam e soltam gotinhas
      $$(".clone--pepino").forEach(function (c, i) {
        gsap.timeline({ delay: i * 0.08 })
          .to(c, { rotation: i ? -220 : 220, scale: 1.45, y: -16, duration: 0.45, ease: "back.out(1.8)" })
          .to(c, { rotation: i ? -250 : 250, duration: 0.25, ease: "sine.inOut" })
          .to(c, { rotation: i ? -360 : 360, scale: 1, y: 0, duration: 0.7, ease: "bounce.out", clearProps: "transform" });
      });
      brilhos([[52, 44], [57.5, 41], [63, 45], [55, 56], [61, 57]], "#A6E3A1");
    },
    fone: function () { // os auscultadores pulsam ao ritmo e saem notas
      var fones = $$(".clone--fone");
      fones.forEach(function (c) { c.classList.add("ativo"); });
      setTimeout(function () { fones.forEach(function (c) { c.classList.remove("ativo"); }); }, 950);
      pulso(fones, 3, 1.1);
      notas(73, 30); setTimeout(function () { notas(88, 29); }, 220);
    },
    comando: function () { // brilho leve à volta das mãos e faíscas suaves, sem mexer a fotografia
      gsap.timeline().fromTo(".luz-comando", { opacity: 0, scale: 0.85 }, { opacity: 0.9, scale: 1.05, duration: 0.35, ease: "power2.out" })
        .to(".luz-comando", { opacity: 0, scale: 1.15, duration: 0.9, ease: "power1.in" });
      brilhos([[76, 68], [86, 66], [90, 74], [80, 63]]);
    }
  };

  function zonas() {
    if (!fx) return;
    $$(".hs", fx).forEach(function (z) {
      var tipo = z.getAttribute("data-fx"), ultimo = 0;
      var disparar = function () {
        var agora = Date.now(); if (agora - ultimo < 1100) return; ultimo = agora;
        EFEITOS[tipo] && EFEITOS[tipo]();
      };
      if (temRato) z.addEventListener("pointerenter", function () { if (!document.documentElement.classList.contains("a-rolar")) disparar(); });
      z.addEventListener("click", disparar);
    });
  }

  /* ---------- 3. Rasto de estrelinhas atrás do cursor ---------- */
  function rasto() {
    var cv = $("#rasto");
    if (!cv || !temRato) { if (cv) cv.remove(); return; }
    var hero = $(".hero");
    var ctx = cv.getContext("2d"), dpr = 1; // estrelas pequenas: resolução 1x chega e poupa muito trabalho
    var parts = [], ultimo = null, aCorrer = false;
    var dim = function () { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    dim(); addEventListener("resize", dim);
    function estrela(x, y, r, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
      for (var i = 0; i < 10; i++) {
        var a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
        ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function passo() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vida -= 1; p.x += p.vx; p.y += p.vy; p.vy += 0.035; p.rot += p.vr;
        if (p.vida <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = Math.min(1, p.vida / 30);
        ctx.fillStyle = p.cor;
        estrela(p.x, p.y, p.r * (0.5 + 0.5 * p.vida / p.max), p.rot);
      }
      ctx.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(passo); else { aCorrer = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      // só dentro da hero: no resto da página o rato fica limpo
      var h = hero.getBoundingClientRect();
      if (e.clientY < h.top || e.clientY > h.bottom) { ultimo = null; return; }
      if (ultimo) {
        var dx = e.clientX - ultimo.x, dy = e.clientY - ultimo.y;
        if (dx * dx + dy * dy < 16 * 16) return;
      }
      ultimo = { x: e.clientX, y: e.clientY };
      if (parts.length > 90) parts.splice(0, parts.length - 90);
      for (var k = 0; k < 2; k++) {
        var max = rnd(36, 60);
        parts.push({ x: e.clientX + rnd(-6, 6), y: e.clientY + rnd(-6, 6), vx: rnd(-0.6, 0.6), vy: rnd(-0.9, 0.1),
          r: rnd(3.5, 7.5), rot: rnd(0, 6), vr: rnd(-0.08, 0.08), cor: CORES[Math.floor(rnd(0, CORES.length))], vida: max, max: max });
      }
      if (!aCorrer) { aCorrer = true; requestAnimationFrame(passo); }
    }, { passive: true });
  }

  function iniciar() { letras(); zonas(); rasto(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
