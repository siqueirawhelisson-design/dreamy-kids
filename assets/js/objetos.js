/* Objetos interativos Dreamy Kids: SVG desenhado à mão + reações.
   Cada objeto é injetado em elementos com data-obj="<tipo>".
   As reações correm com hover (rato), toque e teclado (Enter/Espaço). */
(function () {
  "use strict";
  var uid = 0;
  var brilho = function (cx, cy, rx, ry) {
    return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="url(#g-brilho)"/>';
  };

  /* Bola de futebol clássica: pentágono central + cinco pentágonos cortados pela borda */
  var bola = function (cx, cy, r) {
    var id = "clip-bola-" + (++uid);
    var pent = function (x, y, s, rot) {
      var p = [];
      for (var k = 0; k < 5; k++) { var a = (rot + 72 * k) * Math.PI / 180; p.push((x + Math.cos(a) * s).toFixed(1) + " " + (y + Math.sin(a) * s).toFixed(1)); }
      return '<path d="M' + p.join("L") + 'Z" fill="#2B2940"/>';
    };
    var s = r * 0.3, out = "", linhas = "";
    for (var k = 0; k < 5; k++) {
      var a = -90 + 72 * k, ar = a * Math.PI / 180, b = (a + 36) * Math.PI / 180;
      var vx = cx + Math.cos(ar) * s, vy = cy + Math.sin(ar) * s;
      linhas += "M" + vx.toFixed(1) + " " + vy.toFixed(1) + "L" + (cx + Math.cos(ar) * r).toFixed(1) + " " + (cy + Math.sin(ar) * r).toFixed(1);
      out += pent(cx + Math.cos(b) * r * 1.1, cy + Math.sin(b) * r * 1.1, s * 1.1, a + 36 + 180);
    }
    return '<defs><clipPath id="' + id + '"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/></clipPath></defs>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff"/>' +
      '<g clip-path="url(#' + id + ')">' + out + pent(cx, cy, s, -90) +
      '<path d="' + linhas + '" stroke="#2B2940" stroke-width="1.6" stroke-linecap="round"/>' +
      '<circle cx="' + (cx + r * 0.35) + '" cy="' + (cy + r * 0.4) + '" r="' + r + '" fill="#7C42D8" opacity=".08"/></g>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#2B2940" stroke-width="1.8"/>' +
      brilho(cx - r * 0.35, cy - r * 0.45, r * 0.4, r * 0.22);
  };

  var SVG = {
    nuvem: function () {
      return '<svg viewBox="0 0 200 120" aria-hidden="true"><path d="M46 104C20 104 8 86 14 68C20 50 40 44 54 50C58 26 82 12 106 18C126 22 138 38 140 52C160 44 186 56 188 78C190 96 176 104 160 104Z" fill="url(#g-nuvem)"/>' + brilho(90, 38, 30, 10) + '</svg>';
    },
    estrela: function () {
      return '<svg viewBox="0 0 120 120" aria-hidden="true"><g class="o-gira"><path d="M60 14L73 44L106 47L81 68L89 101L60 84L31 101L39 68L14 47L47 44Z" fill="url(#g-amar)" stroke="url(#g-amar)" stroke-width="12" stroke-linejoin="round"/>' + brilho(52, 44, 18, 9) + '</g></svg>';
    },
    comando: function () {
      return '<svg viewBox="0 0 180 120" aria-hidden="true">' +
        '<path d="M48 24H132C152 24 164 38 168 58L174 88C177 106 158 116 144 104L128 90H52L36 104C22 116 3 106 6 88L12 58C16 38 28 24 48 24Z" fill="url(#g-roxo)"/>' +
        brilho(90, 36, 46, 9) +
        '<circle cx="80" cy="50" r="3" fill="#fff" opacity=".5"/><circle cx="100" cy="50" r="3" fill="#fff" opacity=".5"/>' +
        // lado esquerdo: cruz direcional + manípulo esquerdo
        '<g class="o-esq"><g class="o-cruz"><rect x="45" y="50" width="10" height="24" rx="3" fill="#fff" opacity=".92"/><rect x="38" y="57" width="24" height="10" rx="3" fill="#fff" opacity=".92"/></g>' +
        '<circle cx="72" cy="80" r="10" fill="#5A2AAE"/><circle cx="72" cy="78" r="6" fill="#9467EA"/></g>' +
        // lado direito: quatro botões + manípulo direito
        '<g class="o-dir"><circle cx="108" cy="80" r="10" fill="#5A2AAE"/><circle cx="108" cy="78" r="6" fill="#9467EA"/>' +
        '<circle class="luz" data-c="#22B5EE" cx="130" cy="49" r="6.5" fill="#BDEBFF"/><circle class="luz" data-c="#EC3A97" cx="142" cy="61" r="6.5" fill="#FFC4E2"/>' +
        '<circle class="luz" data-c="#FFB02E" cx="130" cy="73" r="6.5" fill="#FFE7A6"/><circle class="luz" data-c="#FFFFFF" cx="118" cy="61" r="6.5" fill="#E9DCFF"/></g>' +
        '</svg>';
    },
    slime: function () {
      var id = "f-slime-" + (++uid);
      return '<svg viewBox="0 0 160 130" aria-hidden="true"><defs><filter id="' + id + '" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="4" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></defs>' +
        '<ellipse cx="80" cy="116" rx="54" ry="7" fill="#7C42D8" opacity=".08"/>' +
        '<g class="o-slime" filter="url(#' + id + ')"><path d="M22 102C8 80 26 46 58 44C70 20 108 22 116 48C140 52 152 86 132 102C108 118 46 120 22 102Z" fill="url(#g-slime)"/>' +
        brilho(64, 60, 22, 10) +
        '<circle cx="98" cy="72" r="3" fill="#fff"/><circle cx="52" cy="90" r="2.2" fill="#fff"/><circle cx="114" cy="92" r="2.6" fill="#fff" opacity=".8"/><circle cx="80" cy="96" r="2" fill="#FFE59A"/></g></svg>';
    },
    arena: function () {
      return '<svg viewBox="0 0 220 120" aria-hidden="true">' +
        '<g class="o-alvo"><path d="M150 100L142 116M186 100L194 116" stroke="#C9B8E8" stroke-width="4" stroke-linecap="round"/>' +
        '<circle cx="168" cy="58" r="44" fill="#fff" stroke="#EDE3FB" stroke-width="2"/><circle cx="168" cy="58" r="34" fill="url(#g-rosa)"/>' +
        '<circle cx="168" cy="58" r="24" fill="#fff"/><circle cx="168" cy="58" r="14" fill="url(#g-azul)"/><circle cx="168" cy="58" r="5" fill="#fff"/></g>' +
        '<ellipse class="o-sombra" cx="52" cy="110" rx="22" ry="4" fill="#22213A" opacity=".1"/>' +
        '<g class="o-bola">' + bola(52, 82, 24) + '</g></svg>';
    },
    pincel: function () {
      return '<svg viewBox="0 0 220 130" aria-hidden="true">' +
        '<path class="o-traco" d="M18 104C48 70 78 118 108 88S160 62 196 92" stroke="url(#g-arco)" stroke-width="10" fill="none" stroke-linecap="round"/>' +
        '<g class="o-pincel" transform="translate(196 92) rotate(35)">' +
        '<path d="M-7 -14Q0 8 7 -14Z" fill="url(#g-rosa)"/><rect x="-5" y="-27" width="10" height="13" rx="2" fill="#D9D2E6"/>' +
        '<rect x="-4" y="-74" width="8" height="48" rx="4" fill="url(#g-roxo)"/></g></svg>';
    },
    print: function () {
      return '<svg viewBox="0 0 180 130" aria-hidden="true">' +
        '<path d="M40 86C40 48 66 28 96 28C126 28 150 48 150 86Z" fill="#FFE4F1" stroke="#F6B7D7" stroke-width="2"/>' +
        '<path d="M96 28C86 44 82 64 84 86M96 28C106 44 110 64 108 86" stroke="#F6B7D7" stroke-width="1.6" fill="none"/>' +
        '<path d="M12 94C12 84 40 82 70 84L150 86C158 88 158 98 150 100C110 106 40 106 22 102C16 101 12 98 12 94Z" fill="#F7A9D2"/>' +
        '<circle cx="96" cy="28" r="4.5" fill="#F7A9D2"/>' +
        '<path class="o-estampa" d="M96 74C80 62 78 50 88 47C93 46 96 50 96 52C96 50 99 46 104 47C114 50 112 62 96 74Z" fill="url(#g-roxo)"/>' +
        '<g class="o-prensa"><rect x="72" y="-6" width="48" height="20" rx="6" fill="url(#g-azul)"/><rect x="92" y="-30" width="8" height="26" rx="3" fill="#B7A6D6"/></g>' +
        '</svg>';
    },
    pipocas: function () {
      var k = [[34,50,13],[50,40,14],[68,42,15],[86,50,13],[42,28,11],[60,24,12],[78,30,11],[58,52,12]];
      var kern = k.map(function (c) {
        return '<circle class="o-pipoca" cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#FFF6DF" stroke="#F1D79E" stroke-width="1.5"/>';
      }).join("");
      return '<svg viewBox="0 0 120 150" aria-hidden="true">' + kern +
        '<path d="M24 58L96 58L86 140L34 140Z" fill="#fff" stroke="#F4C3DD" stroke-width="2"/>' +
        '<path d="M32 58H44L48.4 140H39.8Z M54 58H66L64.3 140H55.7Z M76 58H88L80.2 140H71.6Z" fill="url(#g-rosa)"/>' +
        '<rect x="20" y="54" width="80" height="9" rx="4.5" fill="url(#g-roxo)"/></svg>';
    },
    spa: function () {
      return '<svg viewBox="0 0 170 120" aria-hidden="true">' +
        '<rect x="18" y="42" width="98" height="56" rx="28" fill="#FFD9EC"/><path d="M30 56H100M30 84H100" stroke="#FFC0DF" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="116" cy="70" r="28" fill="#FFC4E1"/><circle cx="116" cy="70" r="20" fill="#FFE3F1"/><circle cx="116" cy="70" r="12" fill="#FFC4E1"/><circle cx="116" cy="70" r="5" fill="#FFE3F1"/>' +
        brilho(60, 52, 30, 7) +
        '<circle cx="146" cy="100" r="17" fill="#9FDDA7"/><circle cx="146" cy="100" r="13" fill="#DDF6D6"/>' +
        '<ellipse cx="141" cy="96" rx="1.8" ry="3" fill="#A7D9A0"/><ellipse cx="151" cy="96" rx="1.8" ry="3" fill="#A7D9A0"/><ellipse cx="146" cy="105" rx="3" ry="1.8" fill="#A7D9A0"/>' +
        '<path class="o-faisca" d="M150 30l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="url(#g-amar)"/></svg>';
    }
  };

  var G = function () { return window.gsap; };
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CORES_ESTAMPA = ["url(#g-roxo)", "url(#g-rosa)", "url(#g-azul)", "url(#g-amar)"];

  var ACOES = {
    estrela: function (el) { // toque: uma volta suave (o hover é tratado em CSS)
      G().fromTo(el.querySelector(".o-gira"), { rotation: 0, transformOrigin: "50% 50%" },
        { rotation: 144, duration: 0.9, ease: "back.out(1.4)", clearProps: "transform" });
    },
    comando: function (el) {
      var luzes = el.querySelectorAll(".luz");
      var cores = ["#22B5EE", "#EC3A97", "#FFB02E", "#FFFFFF"];
      luzes.forEach(function (l, i) {
        G().timeline({ delay: i * 0.09 })
          .to(l, { attr: { fill: cores[i] }, scale: 1.25, transformOrigin: "50% 50%", duration: 0.15 })
          .to(l, { attr: { fill: l.getAttribute("data-f") }, scale: 1, duration: 0.5, delay: 0.5 });
      });
      G().fromTo(el.querySelector("svg"), { y: 0 }, { y: -6, duration: 0.12, yoyo: true, repeat: 1, clearProps: "transform" });
      var previa = el.parentElement.querySelector(".previa");
      if (previa) {
        previa.innerHTML = '<span class="previa__eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span><strong>Gaming Zone</strong> Consolas, jogos em equipa e muita diversão.';
        previa.classList.add("on");
        clearTimeout(previa._t);
        previa._t = setTimeout(function () { previa.classList.remove("on"); }, 3200);
      }
    },
    slime: function (el) {
      var mapa = el.querySelector("feDisplacementMap");
      var corpo = el.querySelector(".o-slime");
      G().timeline()
        .to(mapa, { attr: { scale: 22 }, duration: 0.25, ease: "power2.out" })
        .to(mapa, { attr: { scale: 0 }, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      G().timeline()
        .to(corpo, { scaleX: 1.14, scaleY: 0.84, transformOrigin: "50% 100%", duration: 0.18 })
        .to(corpo, { scaleX: 1, scaleY: 1, duration: 1, ease: "elastic.out(1, 0.3)" });
    },
    arena: function (el) {
      var bola = el.querySelector(".o-bola"), alvo = el.querySelector(".o-alvo"), sombra = el.querySelector(".o-sombra");
      G().timeline()
        // centro da bola (52,82) até ao centro do alvo (168,58), encolhendo para caber no círculo azul
        .to(bola, { x: 116, y: -24, scale: 0.55, rotation: 360, transformOrigin: "50% 50%", duration: 0.45, ease: "power2.out" })
        .to(alvo, { scale: 1.06, transformOrigin: "50% 43%", duration: 0.1, yoyo: true, repeat: 1 }, "-=0.05")
        .to(bola, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "bounce.out", clearProps: "transform" }, "+=0.2");
      G().timeline().to(sombra, { x: 100, scaleX: 0.5, opacity: 0.04, duration: 0.45 }).to(sombra, { x: 0, scaleX: 1, opacity: 0.1, duration: 0.7, ease: "bounce.out" }, "+=0.15");
    },
    pincel: function (el) {
      var p = el.querySelector(".o-traco"), b = el.querySelector(".o-pincel");
      var len = p.getTotalLength();
      var st = { t: 0 };
      p.style.strokeDasharray = len;
      G().fromTo(st, { t: 0 }, {
        t: 1, duration: 1.1, ease: "power1.inOut",
        onUpdate: function () {
          p.style.strokeDashoffset = len * (1 - st.t);
          var pt = p.getPointAtLength(len * st.t);
          b.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ") rotate(" + (35 + Math.sin(st.t * 12) * 8) + ")");
        }
      });
    },
    print: function (el) {
      var prensa = el.querySelector(".o-prensa"), est = el.querySelector(".o-estampa");
      el._cor = ((el._cor || 0) + 1) % CORES_ESTAMPA.length;
      G().timeline()
        .set(est, { scale: 0, transformOrigin: "50% 50%" })
        .fromTo(prensa, { y: 0, opacity: 0 }, { y: 44, opacity: 1, duration: 0.3, ease: "power3.in" })
        .add(function () { est.setAttribute("fill", CORES_ESTAMPA[el._cor]); })
        .to(est, { scale: 1, duration: 0.45, ease: "back.out(2.2)" })
        .to(prensa, { y: 0, opacity: 0, duration: 0.35, ease: "power2.out" }, "<");
    },
    pipocas: function (el) {
      G().timeline().to(el.querySelector("svg"), { y: -10, duration: 0.18, ease: "power2.out" })
        .to(el.querySelector("svg"), { y: 0, duration: 0.6, ease: "bounce.out", clearProps: "transform" });
      el.querySelectorAll(".o-pipoca").forEach(function (k, i) {
        G().timeline({ delay: i * 0.05 })
          .to(k, { y: -16 - Math.random() * 14, x: (Math.random() - 0.5) * 10, duration: 0.22, ease: "power2.out" })
          .to(k, { y: 0, x: 0, duration: 0.5, ease: "bounce.out" });
      });
    },
    spa: function (el) {
      G().fromTo(el.querySelector("svg"), { rotationY: 0 }, { rotationY: 360, duration: 1.1, ease: "power2.inOut", clearProps: "transform" });
      G().fromTo(el.querySelector(".o-faisca"), { scale: 0.4, rotation: 0, transformOrigin: "50% 50%" }, { scale: 1.3, rotation: 90, duration: 0.6, yoyo: true, repeat: 1 });
    }
  };

  function montar(raiz) {
    (raiz || document).querySelectorAll("[data-obj]").forEach(function (el) {
      if (el._montado) return;
      var t = el.getAttribute("data-obj");
      if (!SVG[t]) return;
      el.insertAdjacentHTML("afterbegin", SVG[t]());
      el._montado = true;
      el.querySelectorAll(".luz").forEach(function (l) { l.setAttribute("data-f", l.getAttribute("fill")); });
    });
  }

  function animar(el) {
    var t = el.getAttribute("data-obj");
    if (!ACOES[t]) return;
    var agora = Date.now();
    if (el._ultimo && agora - el._ultimo < 700) return;
    el._ultimo = agora;
    if (G() && !reduz) { ACOES[t](el); return; }
    // Sem GSAP ou com movimento reduzido: reação mínima
    el.classList.remove("pulso"); void el.offsetWidth; el.classList.add("pulso");
    if (t === "comando") {
      var previa = el.parentElement.querySelector(".previa");
      if (previa) { previa.innerHTML = "<strong>Gaming Zone</strong> Consolas, jogos em equipa e muita diversão."; previa.classList.add("on"); }
    }
  }

  window.DKObjetos = { montar: montar, animar: animar };
})();
