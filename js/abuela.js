/* ===========================================================
   ABUELA 8 BALL — logic
   Screen routing + abuela's bilingual fortune engine.
   =========================================================== */
(function () {
  "use strict";

  /* ---------- Abuela's wisdom, by mood ----------
     Each consejo: { es } = her words (shown big, uppercase),
                    { en } = the soft translation underneath.   */
  var FORTUNES = {
    amor: [
      { es: "Si tiene que pensarlo tanto, la respuesta es no.", en: "If you have to think about it this hard, the answer is no, mija." },
      { es: "No le ruegues a nadie. Tú eres el premio.", en: "Don't beg anyone. You are the prize." },
      { es: "Bloquéalo. La paz vale más que la curiosidad.", en: "Block him. Your peace is worth more than your curiosity." },
      { es: "El amor bueno no te quita el sueño, te lo da.", en: "Good love doesn't steal your sleep — it gives it to you." },
      { es: "Primero quiérete tú, lo demás llega solo.", en: "Love yourself first. The rest arrives on its own." },
      { es: "Esa persona ya te dijo quién es. Créele.", en: "That person already told you who they are. Believe them." }
    ],
    dinero: [
      { es: "Guarda algo, que la suerte es coqueta.", en: "Save a little — luck is a flirt, she comes and goes." },
      { es: "No presumas lo que todavía debes.", en: "Don't show off what you still owe on." },
      { es: "Trabaja callada y deja que el cheque hable.", en: "Work quietly and let the paycheck do the talking." },
      { es: "Cómprate el aguacate. La vida es corta.", en: "Buy the avocado. Life is short, mija." },
      { es: "Lo barato sale caro. Págalo bien una vez.", en: "Cheap things cost more later. Pay well once." },
      { es: "El dinero va y viene; tu palabra se queda.", en: "Money comes and goes — your word stays." }
    ],
    familia: [
      { es: "Llama a tu mamá. Hoy. No mañana.", en: "Call your mother. Today. Not tomorrow." },
      { es: "La familia se aguanta, pero los límites también.", en: "Family endures — but so do healthy boundaries." },
      { es: "Perdona, pero no olvides la receta del caldo.", en: "Forgive — but never forget who taught you the soup." },
      { es: "Esa tía chismosa no paga tus cuentas. Ignórala.", en: "That gossiping aunt doesn't pay your bills. Ignore her." },
      { es: "Siéntate a la mesa. Las paces se hacen comiendo.", en: "Sit at the table. Peace is made over food." },
      { es: "Tus raíces son fuertes. No las cortes por orgullo.", en: "Your roots are strong. Don't cut them over pride." }
    ],
    vida: [
      { es: "Lo que es para ti, ni aunque te quites.", en: "What is meant for you won't pass you by." },
      { es: "Descansa. El mundo gira sin tu permiso.", en: "Rest. The world keeps spinning without your permission." },
      { es: "Ponte los tenis buenos y camina hacia adelante.", en: "Put on your good shoes and walk forward." },
      { es: "No cargues piedras que no son tuyas.", en: "Don't carry stones that were never yours to carry." },
      { es: "Ríete más. Las arrugas de risa son las bonitas.", en: "Laugh more. Smile lines are the pretty wrinkles." },
      { es: "Reza si quieres, pero también muévete.", en: "Pray if you want — but get up and move too." }
    ]
  };

  var WAITING_LINES = [
    "Abuela is consulting the spirits…",
    "Abuela is reading the coffee grounds…",
    "Abuela put down her novela for this…",
    "Abuela is lighting a candle for you…",
    "Abuela says: ay, déjame pensar…"
  ];

  /* ---------- State ---------- */
  var selectedMood = "amor";
  var lastFortune = null;
  var lastQuestion = "";

  /* ---------- Tiny helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function showScreen(name) {
    $all(".screen").forEach(function (s) {
      s.classList.toggle("is-active", s.dataset.screen === name);
    });
    window.scrollTo(0, 0);
    if (history && history.replaceState) {
      history.replaceState(null, "", "#" + name);
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

  /* ---------- Mood chips ---------- */
  $all(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $all(".chip").forEach(function (c) { c.classList.remove("is-selected"); });
      chip.classList.add("is-selected");
      selectedMood = chip.dataset.mood;
    });
  });

  /* ---------- Ask form -> shake -> answer ---------- */
  var form = $("#ask-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = $("#question").value.trim();
    lastQuestion = q;

    // Roll a consejo from a random topic; avoid repeating the last one.
    var pool = FORTUNES[pick(Object.keys(FORTUNES))];
    var next = pick(pool);
    if (pool.length > 1) {
      while (next === lastFortune) { next = pick(pool); }
    }
    lastFortune = next;

    // Show the shaking screen, then reveal.
    $("#waiting-text").textContent = pick(WAITING_LINES);
    showScreen("wait");

    var delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 350 : 1900;
    window.setTimeout(function () {
      $("#echo-q").textContent = q ? "“" + q + "”" : "You came empty-handed, but abuela still answers.";
      $("#advice-text").textContent = next.es;
      $("#advice-en").textContent = next.en;
      $("#share-status").textContent = "";
      showScreen("answer");
    }, delay);
  });

  /* ---------- Share ---------- */
  $("#share-btn").addEventListener("click", function () {
    if (!lastFortune) { return; }
    var text = "Abuela 8 Ball says: “" + lastFortune.es + "” — " + lastFortune.en;
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
