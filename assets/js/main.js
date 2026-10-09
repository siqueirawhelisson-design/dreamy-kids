/* Dreamy Kids · lógica da página
   Renderiza os dados de data.js, liga as interações e as animações de scroll. */
(function () {
  "use strict";
  var DK = window.DK;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temRato = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var euro = function (n) { return n + " €"; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var wa = (DK.contacto.whatsapp || "").replace(/\D/g, "");
  var linkWA = function (msg) { return "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg); };

  /* ---------- Catálogo de escolhas (usado no formulário e nas mensagens) ---------- */
  var ESCOLHAS = {};
  DK.packs.forEach(function (p) { ESCOLHAS["pack:" + p.id] = { grupo: "Packs de aniversário", nome: p.nome + " (" + euro(p.preco) + " por criança)", curto: "o pack " + p.nome, msg: "Pack " + p.nome + " (" + euro(p.preco) + " por criança)" }; });
  DK.entradas.forEach(function (e) { ESCOLHAS["entrada:" + e.id] = { grupo: "Experiências sem aniversário", nome: e.nome + " (" + e.duracao + ", " + euro(e.preco) + ")", curto: "a experiência " + e.nome, msg: e.nome + " (" + e.duracao + ", " + euro(e.preco) + ")" }; });
  DK.cinema.planos.forEach(function (c) { ESCOLHAS["cinema:" + c.id] = { grupo: "Dreamy Cinema", nome: c.nome + " (" + euro(c.preco) + " por criança)", curto: "o " + c.nome, msg: c.nome + " (" + euro(c.preco) + " por criança)" }; });
  ESCOLHAS["outro"] = { grupo: "Outro", nome: "Ainda não sei, quero ajuda a escolher", curto: "uma festa na Dreamy Kids", msg: "" };

  // Frase principal da mensagem, em PT-PT e sem artigos estranhos ("a experiência Slime Experience")
  function pedidoDe(e) {
    return e.msg ? "Gostaria de pedir informações sobre: " + e.msg + "." : "Gostaria de pedir informações sobre as vossas festas e ajuda para escolher a melhor opção.";
  }
  // Limpa o texto livre: primeira letra maiúscula e pontuação final
  function frase(t) {
    t = t.replace(/\s+/g, " ").trim();
    if (!t) return "";
    t = t.charAt(0).toUpperCase() + t.slice(1);
    return /[.!?…]$/.test(t) ? t : t + ".";
  }
  function msgCurta(chave) {
    var e = ESCOLHAS[chave] || ESCOLHAS.outro;
    return ["Olá, Dreamy Kids!", pedidoDe(e), "Desde já, agradeço a vossa atenção."].join("\n\n");
  }

  /* Liga um CTA a uma escolha: WhatsApp direto se houver número, senão formulário */
  function ligarCTA(a, chave) {
    if (wa) {
      a.href = linkWA(msgCurta(chave));
      a.target = "_blank"; a.rel = "noopener";
    } else {
      a.href = "#reservar";
      a.setAttribute("data-escolha", chave);
    }
  }

  /* ---------- Render: packs ---------- */
  function renderPacks() {
    var g = $("#packs-grelha");
    g.innerHTML = DK.packs.map(function (p) {
      var sempre = DK.packsIncluiSempre.map(function (i) {
        var det = i === "Arena dos Desafios" ? '<small>' + esc(p.arena || DK.arenaPadrao) + '</small>' : "";
        return "<li>" + esc(i) + det + "</li>";
      }).join("");
      var ops = p.opcoes.map(function (o) { return '<li class="chip chip--' + p.cor + '">' + esc(o) + "</li>"; }).join("");
      return '<article class="pack pack--' + p.cor + (p.destaque ? " pack--destaque" : "") + '" data-tilt data-reveal>' +
        '<span class="pack__luz" aria-hidden="true"></span>' +
        '<span class="pack__deco" data-obj="estrela" aria-hidden="true"></span>' +
        (p.destaque ? '<p class="pack__selo">' + esc(p.destaque) + "</p>" : "") +
        "<h3>" + esc(p.nome) + "</h3>" +
        '<p class="pack__preco"><span class="pack__n">' + p.preco + '</span><span class="pack__u">€</span><span class="pack__por">por criança</span></p>' +
        '<div class="pack__bloco"><h4>Inclui sempre</h4><ul class="pack__lista">' + sempre + "</ul></div>" +
        '<div class="pack__bloco"><h4>' + esc(p.escolha) + '</h4><ul class="chips">' + ops + "</ul>" +
        (p.extra ? '<p class="pack__extra">' + esc(p.extra) + "</p>" : "") + "</div>" +
        '<a class="btn btn--pack" data-cta="pack:' + p.id + '">Quero este pack</a>' +
        "</article>";
    }).join("");
    $$("[data-cta]", g).forEach(function (a) { ligarCTA(a, a.getAttribute("data-cta")); });

    var c = DK.condicoes;
    var conds = ["Mínimo de " + c.minimoCriancas + " crianças por festa" + (c.maximoCriancas ? " (máximo " + c.maximoCriancas + ")" : ""),
      c.duracaoFesta + " de festa", "Menus de comida juntam-se a qualquer pack"];
    if (c.idades) conds.push("Idades: " + c.idades);
    $("#condicoes").innerHTML = conds.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
  }

  /* ---------- Render: entradas ---------- */
  function renderEntradas() {
    $("#entradas-lista").innerHTML = DK.entradas.map(function (e) {
      return '<li class="entrada" data-reveal><div class="entrada__topo"><span class="chip chip--leve">' + esc(e.duracao) + '</span><span class="entrada__preco">' + euro(e.preco) + '</span></div>' +
        "<h3>" + esc(e.nome) + "</h3><p>" + esc(e.texto) + "</p>" +
        '<a class="link-cta" data-cta="entrada:' + e.id + '">Quero experimentar</a></li>';
    }).join("");
    $$("#entradas-lista [data-cta]").forEach(function (a) { ligarCTA(a, a.getAttribute("data-cta")); });
    // preços nas estações da viagem
    $$("[data-preco-entrada]").forEach(function (el) {
      var e = DK.entradas.filter(function (x) { return x.id === el.getAttribute("data-preco-entrada"); })[0];
      if (e) el.textContent = "Sem aniversário: " + e.duracao + " · " + euro(e.preco); else el.remove();
    });
    $$(".exps [data-escolha]").forEach(function (a) { ligarCTA(a, a.getAttribute("data-escolha")); });
  }

  /* ---------- Render: cinema ---------- */
  function renderCinema() {
    $("#cinema-planos").innerHTML = DK.cinema.planos.map(function (p, i) {
      return '<article class="plano" data-reveal><h3>' + esc(p.nome) + '</h3><p class="plano__preco">' + euro(p.preco) + ' <span>por criança</span></p><ul>' +
        p.inclui.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul><a class="btn btn--rosa" data-cta="cinema:' + p.id + '">Reservar ' + esc(p.nome) + "</a></article>";
    }).join("");
    $$("#cinema-planos [data-cta]").forEach(function (a) { ligarCTA(a, a.getAttribute("data-cta")); });
    $("#cinema-horario").innerHTML = DK.cinema.horario.map(function (h) {
      return "<li><span>" + esc(h.dia) + "</span><strong>" + esc(h.horas) + "</strong></li>";
    }).join("");
  }

  /* ---------- Render: menus ---------- */
  function renderMenus() {
    $("#menus-grelha").innerHTML = DK.menus.map(function (m) {
      return '<article class="menu" data-reveal><div class="menu__img"><img src="' + m.img + '" alt="Imagem ilustrativa do ' + esc(m.nome) + '" loading="lazy" width="480" height="260"></div>' +
        '<div class="menu__corpo"><p class="menu__lema">' + esc(m.lema) + '</p><div class="menu__cab"><h3>' + esc(m.nome) + '</h3><p class="menu__preco">' + euro(m.preco) + "<span>por criança</span></p></div><ul>" +
        m.inclui.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></article>";
    }).join("");
  }

  /* ---------- Galeria: cada imagem leva ao WhatsApp a pedir informação dessa experiência ---------- */
  function renderGaleria() {
    $("#galeria-grelha").innerHTML = DK.galeria.map(function (g, i) {
      var e = ESCOLHAS[g.escolha] || ESCOLHAS.outro;
      return '<li class="galeria__item g' + (i % 8) + '" data-reveal><a data-cta="' + (g.escolha || "outro") + '" aria-label="Pedir informações sobre ' + esc(e.msg || "festas") + ' no WhatsApp">' +
        '<img src="' + g.src + '" alt="' + esc(g.legenda) + '" loading="lazy"><span class="galeria__pedir" aria-hidden="true">Pedir informações</span></a>' +
        '<span class="galeria__legenda">' + esc(g.legenda) + "</span></li>";
    }).join("");
    $$("#galeria-grelha [data-cta]").forEach(function (a) { ligarCTA(a, a.getAttribute("data-cta")); });
  }
  /* ---------- Formulário de pedido (prepara mensagem, não reserva) ---------- */
  function renderPedido() {
    var sel = $("#pedido-escolha"), form = $("#pedido");
    var grupos = {};
    Object.keys(ESCOLHAS).forEach(function (k) { (grupos[ESCOLHAS[k].grupo] = grupos[ESCOLHAS[k].grupo] || []).push(k); });
    sel.innerHTML = Object.keys(grupos).map(function (g) {
      return '<optgroup label="' + esc(g) + '">' + grupos[g].map(function (k) { return '<option value="' + k + '">' + esc(ESCOLHAS[k].nome) + "</option>"; }).join("") + "</optgroup>";
    }).join("");
    sel.value = "outro";

    var enviar = $("#pedido-enviar"), previa = $("#pedido-previa"), estado = $("#pedido-estado");
    function mensagem() {
      var f = form.elements, e = ESCOLHAS[f.escolha.value] || ESCOLHAS.outro;
      var nome = f.nome.value.replace(/\s+/g, " ").trim().replace(/(^|\s)\S/g, function (l) { return l.toUpperCase(); });
      var blocos = ["Olá, Dreamy Kids!" + (nome ? "\nChamo-me " + nome + "." : "")];
      blocos.push(pedidoDe(e));
      var dados = [];
      if (f.criancas.value) dados.push("• Número de crianças: " + f.criancas.value);
      if (f.data.value) dados.push("• Data pretendida: " + f.data.value.split("-").reverse().join("/"));
      if (dados.length) blocos.push(dados.join("\n"));
      if (frase(f.nota.value)) blocos.push(frase(f.nota.value));
      blocos.push("Podem confirmar a disponibilidade?");
      blocos.push("Desde já, agradeço a vossa atenção.");
      return blocos.join("\n\n");
    }
    function atualizar() {
      var m = mensagem();
      previa.textContent = m;
      if (wa) { enviar.href = linkWA(m); enviar.removeAttribute("aria-disabled"); }
      else if (DK.contacto.email) { enviar.href = "mailto:" + DK.contacto.email + "?subject=" + encodeURIComponent("Pedido de informações") + "&body=" + encodeURIComponent(m); enviar.textContent = "Enviar por e-mail"; enviar.removeAttribute("target"); }
      else { enviar.removeAttribute("href"); enviar.setAttribute("aria-disabled", "true"); enviar.textContent = "Contacto de reservas em breve"; }
    }
    form.addEventListener("input", atualizar);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    $("#pedido-copiar").addEventListener("click", function () {
      var m = mensagem();
      (navigator.clipboard ? navigator.clipboard.writeText(m) : Promise.reject()).then(function () {
        estado.textContent = "Mensagem copiada.";
      }, function () { estado.textContent = "Não foi possível copiar automaticamente. Seleciona o texto acima."; });
      setTimeout(function () { estado.textContent = ""; }, 3500);
    });
    atualizar();

    // CTAs que pré-selecionam uma escolha
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-escolha]");
      if (!a || wa) return;
      var k = a.getAttribute("data-escolha");
      if (ESCOLHAS[k]) { sel.value = k; atualizar(); }
    });
  }

  /* ---------- FAQ (só responde com dados confirmados) ---------- */
  function renderFAQ() {
    var c = DK.condicoes, ct = DK.contacto;
    var canal = wa ? " pelo WhatsApp" : "";
    var itens = [
      { q: "Qual é o número mínimo de crianças por festa?", r: "Todas as festas de aniversário têm um mínimo de " + c.minimoCriancas + " crianças." + (c.maximoCriancas ? " O máximo é de " + c.maximoCriancas + "." : "") },
      { q: "Quanto tempo dura uma festa?", r: c.duracaoFesta + "." },
      { q: "Posso personalizar o meu pack?", r: "Sim. Fala connosco e criamos uma festa à tua medida, com as experiências e o menu que preferires." },
      { q: "Posso adicionar menus de comida?", r: "Sim. Os menus Dreamy, Pizza e Cinema podem ser adicionados a qualquer pack." },
      { q: "Existem experiências sem aniversário?", r: "Sim. Há entradas individuais de 1 ou 2 horas e o Dreamy Cinema Night às sextas, sábados e domingos." },
      { q: "Como posso reservar?", r: "Escolhe o pack ou a experiência e envia-nos o teu pedido" + canal + ". A equipa confirma contigo os detalhes e a disponibilidade." },
      { q: "Quais são as idades recomendadas?", r: c.idades, pendente: !c.idades },
      { q: "Onde fica a Dreamy Kids?", r: ct.morada ? "Na " + ct.morada + "." : "", pendente: !ct.morada }
    ].filter(function (i) { return !i.pendente || DK.modoRevisao; });
    // Cartas que viram ao toque: a pergunta na frente, a resposta no verso
    var CORES_FAQ = ["rosa", "roxo", "azul", "amarelo"];
    var grelha = $("#faq-lista");
    grelha.innerHTML = itens.map(function (i, k) {
      var r = i.pendente ? '<span class="tag-pendente">A confirmar</span> Resposta por preencher em data.js.' : esc(i.r);
      return '<button type="button" class="carta carta--' + CORES_FAQ[k % 4] + '" aria-expanded="false" data-reveal>' +
        '<span class="carta__in">' +
        '<span class="carta__face carta__frente">' +
        '<span class="carta__q">' + esc(i.q) + '</span><span class="carta__vira" aria-hidden="true">Vira a carta</span></span>' +
        '<span class="carta__face carta__verso"><span class="carta__mini">' + esc(i.q) + '</span><span class="carta__r">' + r + '</span>' +
        '<span class="carta__vira" aria-hidden="true">Voltar</span></span>' +
        "</span></button>";
    }).join("");
    $$(".carta", grelha).forEach(function (b) {
      b.addEventListener("click", function () { b.setAttribute("aria-expanded", String(b.getAttribute("aria-expanded") !== "true")); });
    });
  }

  /* ---------- Rodapé, botão flutuante, painel de revisão, dados estruturados ---------- */
  function renderGeral() {
    var ct = DK.contacto, li = [];
    if (wa) li.push('<li><a href="' + linkWA(msgCurta("outro")) + '" target="_blank" rel="noopener">WhatsApp</a></li>');
    if (ct.telefone) li.push('<li><a href="tel:' + ct.telefone.replace(/\s/g, "") + '">' + esc(ct.telefone) + "</a></li>");
    if (ct.email) li.push('<li><a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + "</a></li>");
    if (ct.instagram) li.push('<li><a href="https://instagram.com/' + esc(ct.instagram) + '" target="_blank" rel="noopener">@' + esc(ct.instagram) + "</a></li>");
    if (ct.morada) li.push('<li><a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ct.morada) + '" target="_blank" rel="noopener">' + esc(ct.morada) + "</a></li>");
    $("#rodape-contactos").innerHTML = li.join("");
    $("#ano").textContent = new Date().getFullYear();

    var fl = $("#flutuante");
    if (wa) {
      fl.href = linkWA(msgCurta("outro"));
      fl.target = "_blank"; fl.rel = "noopener"; fl.removeAttribute("data-reservar");
      fl.setAttribute("aria-label", "Falar com a Dreamy Kids no WhatsApp");
      fl.classList.add("flutuante--wa");
      fl.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M8.8 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4 0 .5-.2 1.2-.7 1.5-.6.4-1.4.5-2.3.2-2.1-.7-3.9-2.4-4.7-4.4-.4-1-.5-2.2.2-3z"/></svg><span>Falar connosco</span>';
    }

    if (DK.modoRevisao && DK.pendentes.length) {
      var r = $("#revisao"); r.hidden = false;
      r.innerHTML = '<button type="button" aria-expanded="false" aria-controls="revisao-lista">Por confirmar <b>' + DK.pendentes.length + '</b></button>' +
        '<div id="revisao-lista" hidden><p>Modo de revisão. Desliga em data.js (modoRevisao: false) antes de publicar.</p><ol>' +
        DK.pendentes.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol></div>";
      var b = $("button", r), l = $("#revisao-lista");
      b.addEventListener("click", function () { var a = b.getAttribute("aria-expanded") === "true"; b.setAttribute("aria-expanded", String(!a)); l.hidden = a; });
      if (window.console) console.info("[Dreamy Kids] Dados por confirmar:", DK.pendentes);
    }

    var ld = { "@context": "https://schema.org", "@type": "Organization", name: "Dreamy Kids", slogan: "Onde os sonhos se tornam festas.",
      description: "Espaço de festas de aniversário e experiências infantis." };
    if (DK.contacto.morada) ld.address = { "@type": "PostalAddress", streetAddress: "Rua Natália Correia, n.º 29, Cave Direita", addressLocality: "Rio de Mouro", addressRegion: "Sintra", addressCountry: "PT" };
    if (wa) ld.telephone = "+" + wa;
    if (DK.site.url) { ld.url = DK.site.url; ld.logo = DK.site.url.replace(/\/$/, "") + "/assets/img/logo.webp"; }
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  /* ---------- Cabeçalho e menu móvel ---------- */
  function ligarTopo() {
    var topo = $("#topo"), bt = $(".topo__menu"), menu = $("#menu-movel");
    var fl = $("#flutuante"), rodape = $(".rodape");
    var onScroll = function () {
      topo.classList.toggle("topo--rolou", window.scrollY > 24);
      fl.classList.toggle("on", window.scrollY > window.innerHeight * 0.7);
      // no rodapé o botão flutuante sai, para não tapar os contactos nem o crédito
      fl.classList.toggle("no-fim", rodape.getBoundingClientRect().top < window.innerHeight - 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    function fechar() { bt.setAttribute("aria-expanded", "false"); bt.setAttribute("aria-label", "Abrir menu"); menu.hidden = true; document.body.classList.remove("sem-scroll"); }
    bt.addEventListener("click", function () {
      var aberto = bt.getAttribute("aria-expanded") === "true";
      if (aberto) return fechar();
      bt.setAttribute("aria-expanded", "true"); bt.setAttribute("aria-label", "Fechar menu"); menu.hidden = false; document.body.classList.add("sem-scroll");
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", fechar); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { fechar(); bt.focus(); } });
  }

  /* Comando: o lado por onde passa o rato inclina-se e o botão mais próximo acende */
  function ligarComando(b) {
    var svg = $("svg", b), luzes = $$(".luz", b);
    if (!svg) return;
    var apagar = function () {
      svg.classList.remove("lado-esq", "lado-dir");
      luzes.forEach(function (l) { l.style.fill = ""; l.classList.remove("acesa"); });
    };
    b.addEventListener("pointermove", function (e) {
      var ctm = svg.getScreenCTM(); if (!ctm) return;
      var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var p = pt.matrixTransform(ctm.inverse());
      svg.classList.toggle("lado-esq", p.x < 90); svg.classList.toggle("lado-dir", p.x >= 90);
      luzes.forEach(function (l) {
        var dx = p.x - l.cx.baseVal.value, dy = p.y - l.cy.baseVal.value, perto = p.x >= 90 && dx * dx + dy * dy < 9.5 * 9.5;
        l.style.fill = perto ? l.getAttribute("data-c") : "";
        l.classList.toggle("acesa", perto);
      });
    });
    b.addEventListener("pointerleave", apagar);
  }

  /* ---------- Objetos: montar, hover, toque, teclado, inclinação ---------- */  function ligarObjetos() {
    window.DKObjetos.montar();
    $$(".obj").forEach(function (b) {
      var tipo = b.getAttribute("data-obj");
      b.addEventListener("click", function () { window.DKObjetos.animar(b); });
      if (temRato) {
        // a estrela reage ao hover só em CSS (rodar, crescer, brilhar); a volta completa fica para o toque
        if (tipo !== "estrela") b.addEventListener("mouseenter", function () { window.DKObjetos.animar(b); });
        if (tipo === "comando") ligarComando(b);
        b.addEventListener("pointermove", function (e) {
          var r = b.getBoundingClientRect();
          b.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 24 + "deg");
          b.style.setProperty("--rx", -((e.clientY - r.top) / r.height - 0.5) * 24 + "deg");
        });
        b.addEventListener("pointerleave", function () { b.style.setProperty("--rx", "0deg"); b.style.setProperty("--ry", "0deg"); });
      }
    });
    // cartões com inclinação 3D e luz
    if (temRato && !reduz) {
      $$("[data-tilt]").forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          c.style.setProperty("--ry", (x - 0.5) * 6 + "deg");
          c.style.setProperty("--rx", -(y - 0.5) * 6 + "deg");
          c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
        });
        c.addEventListener("pointerleave", function () { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
      });
    }
  }

  /* ---------- Animações de scroll (GSAP) ---------- */
  function partirTitulo(el) {
    var partir = function (no) {
      Array.prototype.slice.call(no.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement("span"); s.className = "w";
            var i = document.createElement("span"); i.className = "w__i"; i.textContent = w;
            s.appendChild(i); frag.appendChild(s);
          });
          no.replaceChild(frag, n);
        } else if (n.nodeType === 1) partir(n);
      });
    };
    partir(el);
  }

  /* Scroll suave com inércia leve (Lenis), só em computador com rato e sem movimento reduzido.
     As âncoras do menu passam a deslizar pelo Lenis, com espaço para o cabeçalho. */
  var lenis = null;
  function suave(ST) {
    if (!window.Lenis || !temRato || reduz) return;
    lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    document.documentElement.classList.add("lenis-on");
    lenis.on("scroll", ST.update);
    window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    window.gsap.ticker.lagSmoothing(0);
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a) return;
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var alvo = document.querySelector(id); if (!alvo) return;
      e.preventDefault();
      lenis.scrollTo(alvo, { offset: -90, duration: 1.2 });
      history.replaceState(null, "", id);
    });
  }

  /* Animações em loop (estrelas, nuvens, brilhos) param quando a sua zona sai do ecrã */
  function pausarForaDoEcra() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("parado", !e.isIntersecting); });
    }, { rootMargin: "120px 0px" });
    $$(".hero, .intro, .est, .pedido, .cinema, .final, .packs").forEach(function (s) { io.observe(s); });
  }

  function animar() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || reduz) { document.documentElement.classList.add("sem-anim"); document.documentElement.classList.remove("pre"); return; }
    gsap.registerPlugin(ST);
    document.documentElement.classList.add("anim");

    // Hero: entrada
    var h1 = $("[data-split]"); partirTitulo(h1);
    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".topo__in > *", { opacity: 0, duration: 0.6, stagger: 0.06 })
      .from(".hero .eyebrow", { y: 14, opacity: 0, duration: 0.5 }, 0.15)
      .from(".w__i", { yPercent: 110, duration: 0.85, stagger: 0.04 }, 0.15)
      .from(".hero__sub, .hero__ctas", { y: 18, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.5)
      .from(".hero__criancas", { opacity: 0, y: 36, scale: 0.97, duration: 1.15, ease: "expo.out" }, 0.05)
      .from(".hero__aura", { opacity: 0, scale: 0.8, duration: 1.4, ease: "expo.out" }, 0.1)
      .from(".fita", { strokeDasharray: "0 1600", duration: 1.8, ease: "power2.inOut", stagger: 0.2 }, 0.3)
      .from(".hero__cena > .obj, .hero__nuvens .nv", { scale: 0, opacity: 0, duration: 0.75, stagger: 0.05, ease: "back.out(1.7)", clearProps: "transform,opacity" }, 0.45)
      .from(".scroll-ind", { opacity: 0, duration: 0.6 }, 1.2);

    // Revelações de texto e cartões: em lote, para que o que entra junto entre em cascata.
    // clearProps no fim devolve o transform ao CSS (senão o tilt e a elevação dos cartões ficam bloqueados).
    var textos = $$("[data-reveal]").filter(function (el) { return !el.closest(".hero") && el.getAttribute("data-reveal") !== "media"; });
    gsap.set(textos, { y: 26, opacity: 0 });
    ST.batch(textos, {
      start: "top 88%", once: true, interval: 0.08, batchMax: 6,
      onEnter: function (lote) {
        gsap.to(lote, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.08, overwrite: true, clearProps: "transform,opacity" });
      }
    });

    // Fotografias: abrem-se de dentro para fora; o objeto interativo chega logo a seguir
    $$('[data-reveal="media"]').forEach(function (el) {
      var imgs = $$("img", el), objs = $$(".obj", el);
      var tlm = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 86%", once: true } });
      tlm.from(imgs, { clipPath: "inset(16% 12% 16% 12% round 48px)", scale: 1.1, duration: 1.05, ease: "expo.out", stagger: 0.1, clearProps: "clipPath,transform" });
      if (objs.length) tlm.from(objs, { scale: 0.5, opacity: 0, rotation: -10, duration: 0.7, ease: "back.out(1.8)", clearProps: "transform,opacity" }, 0.3);
    });

    var mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      // Parallax subtil
      $$("[data-speed]").forEach(function (el) {
        var v = parseFloat(el.getAttribute("data-speed"));
        gsap.fromTo(el, { y: -v * 200 }, { y: v * 200, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
      });
      // Rato no hero
      // quickTo reutiliza uma única animação por camada, em vez de criar dezenas de tweens por segundo
      var hero = $(".hero"), camadas = $$(".hero__cena [data-depth]").map(function (c) {
        return { d: +c.getAttribute("data-depth"), x: gsap.quickTo(c, "x", { duration: 0.9, ease: "power2.out" }), y: gsap.quickTo(c, "y", { duration: 0.9, ease: "power2.out" }) };
      });
      var pedido = false, ex = 0, ey = 0;
      var mover = function (e) {
        ex = e.clientX; ey = e.clientY;
        if (pedido) return; pedido = true;
        requestAnimationFrame(function () {
          pedido = false;
          var x = ex / window.innerWidth - 0.5, y = ey / window.innerHeight - 0.5;
          camadas.forEach(function (c) { c.x(x * c.d * 50); c.y(y * c.d * 40); });
        });
      };
      if (temRato) hero.addEventListener("pointermove", mover);
      // Linha da jornada
      var parar = jornada();
      return function () { if (temRato) hero.removeEventListener("pointermove", mover); parar(); };
    });

    // Estrelas do cinema (só em ecrãs grandes: no telemóvel obrigava a repintar a secção inteira a cada frame)
    mm.add("(min-width: 900px)", function () {
      gsap.to(".cinema__ceu", { backgroundPosition: "0 120px", ease: "none", scrollTrigger: { trigger: ".cinema", start: "top bottom", end: "bottom top", scrub: true } });
    });

    window.addEventListener("load", function () { ST.refresh(); });
    document.documentElement.classList.remove("pre");
    suave(ST);
  }

  /* Linha contínua que liga os momentos da página e se desenha com o scroll */
  function jornada() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    var main = $("main"), svg = $(".jornada"), base = $(".jornada__base"), linha = $(".jornada__linha"), estrela = $(".jornada__estrela");
    var len = 0, trig;
    function desenhar() {
      var mr = main.getBoundingClientRect(), W = main.clientWidth;
      // a linha só fica no início: hero, introdução e cabeçalho das experiências
      var pts = $$(".hero[data-path], .intro[data-path], #experiencias > .sec-cab[data-path]", main).map(function (el) {
        var r = el.getBoundingClientRect(), lado = el.getAttribute("data-path");
        var x = lado === "l" ? W * 0.06 : lado === "r" ? W * 0.94 : W * 0.5;
        return { x: x, y: r.top - mr.top + Math.min(r.height * 0.35, 220) };
      });
      if (pts.length < 2) return;
      var d = "M" + pts[0].x + " " + pts[0].y;
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], dy = (b.y - a.y) * 0.5;
        d += " C" + a.x + " " + (a.y + dy) + " " + b.x + " " + (b.y - dy) + " " + b.x + " " + b.y;
      }
      svg.setAttribute("viewBox", "0 0 " + W + " " + main.scrollHeight);
      svg.style.height = main.scrollHeight + "px";
      base.setAttribute("d", d); linha.setAttribute("d", d);
      len = linha.getTotalLength();
      linha.style.strokeDasharray = len; linha.style.strokeDashoffset = len;
    }
    desenhar();
    svg.classList.add("on"); estrela.classList.add("on");
    trig = ST.create({
      trigger: main, start: "top top", endTrigger: "#experiencias > .sec-cab", end: "bottom 45%", scrub: 0.6,
      onRefreshInit: desenhar,
      onUpdate: function (s) {
        var p = s.progress;
        linha.style.strokeDashoffset = len * (1 - p);
        var pt = linha.getPointAtLength(len * p);
        estrela.style.transform = "translate(" + (pt.x - 14) + "px," + (pt.y - 14) + "px) rotate(" + p * 720 + "deg)";
        estrela.style.opacity = Math.min(1, (1 - p) * 12); // apaga-se ao chegar ao fim da viagem
      }
    });
    return function () { trig.kill(); svg.classList.remove("on"); estrela.classList.remove("on"); };
  }

  function iniciar() {
    renderPacks(); renderEntradas(); renderCinema(); renderMenus(); if ($("#galeria-grelha")) renderGaleria();
    renderPedido(); renderFAQ(); renderGeral(); ligarTopo(); ligarObjetos(); pausarForaDoEcra(); animar();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
