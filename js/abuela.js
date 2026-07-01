/* ===========================================================
   ABUELA 8 BALL — logic
   Screen routing + abuela's bilingual fortune engine.
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Abuela's responses ----------
     She only ever says one of these, in her multicolour Dandelion hand. */
  var RESPONSES = [
    "Ni empieces con ese tiki tiki",
    "Sana, sana, culito de rana. Si no se sana hoy, se sana mañana!",
    "…FUACATA!",
    "No andes descalsa",
    "No me jodas",
    "Oigo...",
    "Oye, y ven aca….",
    "Que se yo"
  ];

  /* palette cycled per letter, matching the wordmarks */
  var WM_COLORS = [
    "var(--pk-olive)", "var(--pk-orange)", "var(--pk-ink)",
    "var(--pk-sky-deep)", "var(--pk-pink-deep)", "var(--pk-yellow-deep)"
  ];

  /* Render text into el as multicolour Dandelion letters (spaces preserved). */
  function renderWordmark(el, text) {
    el.textContent = "";
    el.setAttribute("aria-label", text);
    var ci = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === " ") { el.appendChild(document.createTextNode(" ")); continue; }
      var span = document.createElement("span");
      span.className = "wm";
      span.setAttribute("aria-hidden", "true");
      span.style.color = WM_COLORS[ci % WM_COLORS.length];
      span.textContent = ch;
      el.appendChild(span);
      ci++;
    }
    // scale to length so long sayings still fit the doily's open middle
    var n = text.length;
    var size = n <= 12 ? 8 : n <= 22 ? 6.4 : n <= 34 ? 5 : 4;
    el.style.fontSize = size + "cqw";
  }

  var WAITING_LINES = [
    "Abuela is consulting the spirits…",
    "Abuela is reading the coffee grounds…",
    "Abuela put down her novela for this…",
    "Abuela is lighting a candle for you…",
    "Abuela says: ay, déjame pensar…"
  ];

  /* ---------- State ---------- */
  var lastResponse = null;
  var lastQuestion = "";

  /* ---------- Tiny helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  var QUESTION_PREFIX = "Dear abuela... ";

  function showScreen(name) {
    $all(".screen").forEach(function (s) {
      s.classList.toggle("is-active", s.dataset.screen === name);
    });
    window.scrollTo(0, 0);
    if (history && history.replaceState) {
      history.replaceState(null, "", "#" + name);
    }
    // On the ask screen, start the letter with the caret live after the dots.
    if (name === "ask") {
      var qa = $("#question");
      if (qa) {
        qa.value = QUESTION_PREFIX;
        window.setTimeout(function () {
          qa.focus();
          var n = qa.value.length;
          try { qa.setSelectionRange(n, n); } catch (e) {}
        }, 60);
      }
    }
  }

  /* ---------- Navigation (any element with data-go) ---------- */
  $all("[data-go]").forEach(function (el) {
    el.addEventListener("click", function () { showScreen(el.dataset.go); });
  });

  /* ---------- Focused landing: tap the orb to reveal the UI ---------- */
  var focusBall = $("#focus-ball");
  var focusRoot = $("#focus-root");
  if (focusBall && focusRoot) {
    focusBall.addEventListener("click", function () {
      focusRoot.classList.toggle("revealed");
    });
  }

  /* ---------- Ask form -> shake -> answer ---------- */
  var form = $("#ask-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = $("#question").value.trim();
    // Treat the untouched "Dear abuela..." scaffold as no question.
    if (q === QUESTION_PREFIX.trim()) { q = ""; }
    lastQuestion = q;

    // Pick one of abuela's responses; avoid repeating the last one.
    var next = pick(RESPONSES);
    if (RESPONSES.length > 1) {
      while (next === lastResponse) { next = pick(RESPONSES); }
    }
    lastResponse = next;

    // Show the shaking screen, then reveal.
    $("#waiting-text").textContent = pick(WAITING_LINES);
    showScreen("wait");

    var delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 350 : 1900;
    window.setTimeout(function () {
      $("#echo-q").textContent = q ? "“" + q + "”" : "You came empty-handed, but abuela still answers.";
      renderWordmark($("#advice-text"), next);
      $("#share-status").textContent = "";
      showScreen("answer");
    }, delay);
  });

  /* ---------- Share ---------- */
  $("#share-btn").addEventListener("click", function () {
    if (!lastResponse) { return; }
    var text = "Abuela 8 Ball says: “" + lastResponse + "”";
    var status = $("#share-status");

    if (navigator.share) {
      navigator.share({ title: "Abuela 8 Ball", text: text }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        status.textContent = "Copied! Now go share abuela's wisdom. 💛";
      }, function () {
        status.textContent = text;
      });
    } else {
      status.textContent = text;
    }
  });

  /* ---------- Honor an incoming hash (deep link / refresh) ---------- */
  var valid = ["intro", "ask", "wait", "answer", "about"];
  var initial = (location.hash || "").replace("#", "");
  // Never land directly on the transient wait/answer screens on load.
  if (valid.indexOf(initial) !== -1 && initial !== "wait" && initial !== "answer") {
    showScreen(initial);
  }
})();
