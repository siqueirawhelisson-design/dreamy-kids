/* Dreamy Kids · efeitos divertidos da hero
   - letras do título que saltam ao passar o rato
   - confettis a sair dos punhos do menino na fotografia
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
    // a classe "livre" (letras podem saltar sem ser cortadas) é posta pelo main.js no fim da entrada da hero
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
  // Confettis nos punhos do menino. O slime e o comando têm efeitos próprios (secções 4 e 5);
  // o slime antigo aplicava um filtro de distorção sobre a fotografia inteira e era o efeito mais pesado do site.
  var EFEITOS = {
    festa: function () { confettis(21, 4, 16); confettis(60, 4, 16); }
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

  /* ---------- 4. Slime da menina: estica para onde vai o rato e balança como geleia ----------
     Leve de propósito: só a área do slime (canvas pequeno, desenhado em faixas de 3 px),
     só enquanto o rato está por cima ou a geleia ainda balança; parado, o canvas fica vazio e não custa nada.
     O antigo efeito com filtro de distorção sobre a foto inteira é que pesava. */
  var FW = 1300, FH = 725; // coordenadas da fotografia original (hero-criancas.webp)
  function caixa(el, x0, y0, x1, y1) {
    el.style.left = x0 / FW * 100 + "%"; el.style.top = y0 / FH * 100 + "%";
    el.style.width = (x1 - x0) / FW * 100 + "%"; el.style.height = (y1 - y0) / FH * 100 + "%";
  }
  function slime() {
    var img = $(".hero__criancas img");
    if (!fx || !img) return;
    // contorno da geleia: borda de cima (esquerda → direita) e de baixo (direita → esquerda)
    var CIMA = [[107,383],[135,372],[167,365],[190,382],[210,407],[240,438],[275,463],[320,485],[370,497],[420,500],[460,495],[495,482],[517,476],[532,477]];
    var BAIXO = [[527,555],[490,560],[440,570],[385,580],[340,578],[295,565],[250,545],[210,520],[175,490],[145,460],[120,430],[107,405]];
    var X0 = 95, Y0 = 340, X1 = 545, Y1 = 645, cw = X1 - X0, ch = Y1 - Y0;
    var PONTA_E = 107, PONTA_D = 532; // as mãos seguram aqui: estas pontas não mexem

    var cv = document.createElement("canvas");
    cv.className = "fx-slime"; cv.width = cw; cv.height = ch; caixa(cv, X0, Y0, X1, Y1);
    fx.insertBefore(cv, fx.firstChild);
    // zona de toque com a forma da geleia (e um pouco abaixo dela, para dar para puxar)
    var zona = document.createElement("span");
    zona.className = "hs hs--slime"; caixa(zona, X0, Y0, X1, Y1);
    zona.style.clipPath = "polygon(" + CIMA.concat(BAIXO.map(function (p) { return [p[0], p[1] + 60]; })).map(function (p) {
      return ((p[0] - X0) / cw * 100).toFixed(1) + "% " + ((p[1] - Y0) / ch * 100).toFixed(1) + "%";
    }).join(",") + ")";
    fx.appendChild(zona);

    var ctx = cv.getContext("2d"), fonte = null, bruta = null;
    function preparar() { // recorta a geleia da foto, uma única vez, no primeiro toque
      // lê-se de uma cópia sem srcset: na <img> o naturalWidth vem corrigido pela densidade do ecrã
      var k = bruta.naturalWidth / FW;
      fonte = document.createElement("canvas"); fonte.width = cw; fonte.height = ch;
      var f = fonte.getContext("2d");
      f.drawImage(bruta, X0 * k, Y0 * k, cw * k, ch * k, 0, 0, cw, ch);
      var m = document.createElement("canvas"); m.width = cw; m.height = ch;
      var mc = m.getContext("2d");
      mc.filter = "blur(2px)"; mc.beginPath();
      CIMA.concat(BAIXO).forEach(function (p) { mc.lineTo(p[0] - X0, p[1] - Y0); });
      mc.closePath(); mc.fill();
      f.globalCompositeOperation = "destination-in"; f.drawImage(m, 0, 0);
      // o mesmo desvanecer que a foto tem em baixo (mask-image 76% → 98%)
      var g = f.createLinearGradient(0, -Y0, 0, FH - Y0);
      g.addColorStop(0.76, "#000"); g.addColorStop(0.98, "rgba(0,0,0,0)");
      f.fillStyle = g; f.fillRect(0, 0, cw, ch);
    }
    function interp(lista, x) { // altura de uma borda num dado x
      for (var i = 0; i < lista.length - 1; i++) {
        var a = lista[i], b = lista[i + 1];
        if ((x - a[0]) * (x - b[0]) <= 0 && a[0] !== b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
      }
      return null;
    }
    var BAIXO_ORD = BAIXO.slice().reverse();

    var amp = 0, vel = 0, alvo = 0, foco = 0.5, dentro = false, raf = 0;
    function desenhar() {
      ctx.clearRect(0, 0, cw, ch);
      var L = PONTA_E - X0, R = PONTA_D - X0;
      for (var x = 0; x < cw; x += 3) {
        var t = (x - L) / (R - L), dy = 0;
        if (t > 0 && t < 1) {
          var s = Math.sin(Math.PI * t), perto = Math.exp(-Math.pow((t - foco) / 0.3, 2));
          dy = amp * s * s * (0.45 + 0.55 * perto); // estica mais onde está o rato
        }
        // a borda de baixo desce mais do que a de cima: parece esticar, não deslizar
        ctx.drawImage(fonte, x, 0, 3, ch, x, dy * 0.45, 3, ch + dy * 0.55);
      }
    }
    function passo() {
      vel += (alvo - amp) * 0.11; vel *= 0.84; amp += vel; // mola com balanço de geleia
      desenhar();
      if (dentro || Math.abs(vel) > 0.03 || Math.abs(amp - alvo) > 0.05) raf = requestAnimationFrame(passo);
      else { raf = 0; amp = vel = 0; ctx.clearRect(0, 0, cw, ch); } // parado: canvas vazio, a foto original volta a ver-se
    }
    function arrancar() {
      if (!bruta) { bruta = new Image(); bruta.onload = arrancar; bruta.src = img.currentSrc || img.src; } // já está em cache
      if (!bruta.complete || !bruta.naturalWidth) return false;
      if (!fonte) preparar();
      if (!raf) raf = requestAnimationFrame(passo);
      return true;
    }
    function posicao(e) {
      var r = zona.getBoundingClientRect();
      return { x: X0 + (e.clientX - r.left) / r.width * cw, y: Y0 + (e.clientY - r.top) / r.height * ch };
    }
    if (temRato) {
      zona.addEventListener("pointerenter", function () { dentro = true; arrancar(); });
      zona.addEventListener("pointermove", function (e) {
        var p = posicao(e), c = interp(CIMA, p.x), b = interp(BAIXO_ORD, p.x);
        foco = Math.min(1, Math.max(0, (p.x - PONTA_E) / (PONTA_D - PONTA_E)));
        if (c !== null && b !== null) alvo = Math.max(-12, Math.min(28, (p.y - (c + b) / 2) * 0.75));
        vel += Math.max(-1.5, Math.min(1.5, e.movementY * 0.08)); // um abanão quando o rato passa depressa
      });
      zona.addEventListener("pointerleave", function () { dentro = false; alvo = 0; });
    }
    // no toque (e no clique): a geleia dá um salto e balança
    zona.addEventListener("click", function (e) {
      var p = posicao(e);
      foco = Math.min(1, Math.max(0, (p.x - PONTA_E) / (PONTA_D - PONTA_E)));
      vel += 5; if (!temRato) alvo = 0;
      arrancar();
    });
  }

  /* ---------- 5. Comando do menino: a barra de luz acende em cores e saltam os símbolos dos botões ---------- */
  function comando() {
    if (!fx) return;
    var luz = document.createElement("span");
    luz.className = "fx-luz"; caixa(luz, 1036, 545, 1088, 561);
    fx.appendChild(luz);
    var zona = document.createElement("span");
    zona.className = "hs hs--comando"; caixa(zona, 985, 522, 1140, 600);
    fx.appendChild(zona);
    var SIMBOLOS = [["△", "#22B5EE"], ["○", "#EC3A97"], ["✕", "#8B52E0"], ["□", "#FFBE3D"]];
    var ultimo = 0, tApagar = 0;
    function botoes() {
      var agora = Date.now(); if (agora - ultimo < 900) return; ultimo = agora;
      SIMBOLOS.forEach(function (s, i) {
        var p = particula("fx--nota fx--simbolo", 80 + rnd(-1.5, 1.5) + (i - 1.5) * 2.2, 74, s[0]);
        p.style.color = s[1];
        gsap.timeline({ delay: i * 0.07, onComplete: p.remove.bind(p) })
          .fromTo(p, { y: 0, scale: 0.4, opacity: 0 }, { y: rnd(-70, -50), x: (i - 1.5) * rnd(14, 22), scale: 1, opacity: 1, rotation: rnd(-25, 25), duration: 0.45, ease: "back.out(2)" })
          .to(p, { y: "-=30", opacity: 0, duration: 0.5, ease: "power1.in" }, "+=0.15");
      });
    }
    function acender(ms) {
      clearTimeout(tApagar); luz.classList.add("on");
      if (ms) tApagar = setTimeout(function () { luz.classList.remove("on"); }, ms);
    }
    if (temRato) {
      zona.addEventListener("pointerenter", function () { if (document.documentElement.classList.contains("a-rolar")) return; acender(); botoes(); });
      zona.addEventListener("pointerleave", function () { tApagar = setTimeout(function () { luz.classList.remove("on"); }, 500); });
    }
    zona.addEventListener("click", function () { acender(1600); botoes(); });
  }

  function iniciar() { letras(); zonas(); rasto(); slime(); comando(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
