document.addEventListener("DOMContentLoaded", function () {
  // ============================================================
  // START SCREEN
  // ============================================================
  const startScreen = document.getElementById("startScreen");
  const startBtn = document.getElementById("startBtn");
  const soundSkeleton = new Audio("assets/soundSkeleton.mp3");

  if (startBtn && startScreen) {
    startBtn.addEventListener("click", () => {
      try { soundSkeleton.currentTime = 0; soundSkeleton.play(); } catch {}
      startScreen.classList.add("hide");
      startScreen.addEventListener(
        "transitionend",
        () => startScreen.remove(),
        { once: true }
      );
    });
  }


  // ============================================================
  // CONSTANTES
  // ============================================================
  const WORD_LENGTH = 5;
  const MAX_ATTEMPTS = 6;

  if (typeof WORD_LIST === "undefined" || !Array.isArray(WORD_LIST) || WORD_LIST.length === 0) {
    console.error("WORD_LIST est introuvable. Déclare WORD_LIST avant ce script.");
    return;
  }

  const AuthorizedWords = new Set(WORD_LIST.map(w => String(w).toUpperCase()));

  // ============================================================
  // DOM
  // ============================================================
  const rows = document.querySelectorAll(".grid .row");
  const keys = Array.from(document.querySelectorAll(".key"));
  const del = document.getElementById("buttonReturn");
  const enter = document.getElementById("buttonEnter");
  const attempt = document.getElementById("attempt");
  const cursor = document.querySelector(".cyber-cursor");
  const restartBtn = document.getElementById("restartBtn");

  const playWin = document.getElementById("playWin");
  const playCount = document.getElementById("playCount");

  // ============================================================
  // AUDIO
  // ============================================================
  const soundFail = new Audio("assets/soundfail.mp3");
  const soundWin = new Audio("assets/win.mp3");
  const greenCell = new Audio("assets/greenCell.mp3");
  const yellowCell = new Audio("assets/yellowCell.mp3");
  const greyCell = new Audio("assets/greyCell.mp3");

  // ============================================================
  // LOCAL STORAGE KEYS
  // ============================================================
  const LS_STATE = "tusmo_state";
  const LS_STATS = "tusmo_stats";

  // ============================================================
  // ETAT DU JEU
  // ============================================================
  let secret = "";
  let currentRow = 0;
  let currentCol = 0;
  let compteur = MAX_ATTEMPTS;

  let compteurWin = 0;   // stats
  let compteurPlay = 0;  // stats

  // ============================================================
  // OUTILS
  // ============================================================
  function pickSecret() {
    return String(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]).toUpperCase();
  }

  function getRowCells(r) {
    return rows[r].querySelectorAll(".cell");
  }

  function initCellsLockedDefault() {
    document.querySelectorAll(".cell").forEach(cell => {
      if (!cell.dataset.locked) cell.dataset.locked = "0";
    });
  }

  function moveToNextFreeCol() {
    const rowCells = getRowCells(currentRow);
    let i = 0;
    while (i < WORD_LENGTH && rowCells[i].dataset.locked === "1") i++;
    return i; // peut valoir 5
  }

  function findKeyByLetter(letter) {
    // tes touches n'ont pas data-key => on compare le texte
    return keys.find(k => k.textContent.trim().toUpperCase() === letter);
  }

  function updateHUD() {
    if (attempt) attempt.textContent = "Tentatives restantes : " + compteur;
    if (playWin) playWin.textContent = "Parties gagnées : " + compteurWin;
    if (playCount) playCount.textContent = "Parties jouées : " + compteurPlay;
  }

  function safePlay(audio) {
    try {
      audio.currentTime = 0;
      audio.play();
    } catch {}
  }

  // ============================================================
  // STATS (persistantes)
  // ============================================================
  function loadStats() {
    try {
      const raw = localStorage.getItem(LS_STATS);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (!s) return;
      compteurWin = typeof s.wins === "number" ? s.wins : 0;
      compteurPlay = typeof s.plays === "number" ? s.plays : 0;
    } catch {}
  }

  function saveStats() {
    try {
      localStorage.setItem(LS_STATS, JSON.stringify({ wins: compteurWin, plays: compteurPlay }));
    } catch {}
  }

  // ============================================================
  // SAUVEGARDE / CHARGEMENT PARTIE (grille + clavier + secret)
  // ============================================================
  function getCellState(cell) {
    return cell.classList.contains("correct") ? "correct"
      : cell.classList.contains("present") ? "present"
      : cell.classList.contains("absent") ? "absent"
      : "";
  }

  function saveState() {
    try {
      const cells = Array.from(document.querySelectorAll(".cell")).map(c => ({
        t: c.innerText || "",
        locked: c.dataset.locked || "0",
        state: getCellState(c)
      }));

      const keysState = keys.map(k => ({
        // on garde juste l'état (pas besoin de tout className)
        correct: k.classList.contains("correct"),
        present: k.classList.contains("present"),
        absent: k.classList.contains("absent")
      }));

      const state = {
        secret,
        currentRow,
        currentCol,
        compteur,
        cells,
        keysState
      };

      localStorage.setItem(LS_STATE, JSON.stringify(state));
    } catch (e) {
      console.error("Erreur saveState", e);
    }
  }

  function applyKeyStateFromSaved(keysState) {
    if (!Array.isArray(keysState)) return;
    keys.forEach((k, i) => {
      if (!keysState[i]) return;
      k.classList.remove("correct", "present", "absent");
      if (keysState[i].absent) k.classList.add("absent");
      if (keysState[i].present) k.classList.add("present");
      if (keysState[i].correct) k.classList.add("correct");
    });
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_STATE);
      if (!raw) return false;
      const state = JSON.parse(raw);
      if (!state || !state.secret) return false;

      secret = state.secret;
      currentRow = typeof state.currentRow === "number" ? state.currentRow : 0;
      currentCol = typeof state.currentCol === "number" ? state.currentCol : 0;
      compteur = typeof state.compteur === "number" ? state.compteur : MAX_ATTEMPTS;

      // cellules
      const domCells = document.querySelectorAll(".cell");
      if (Array.isArray(state.cells)) {
        state.cells.forEach((c, i) => {
          const cell = domCells[i];
          if (!cell) return;
          cell.innerText = c.t || "";
          cell.dataset.locked = c.locked || "0";
          cell.classList.remove("correct", "present", "absent");
          if (c.state) cell.classList.add(c.state);
        });
      }

      // clavier
      applyKeyStateFromSaved(state.keysState);

      // recalcul col à partir des lock
      currentCol = moveToNextFreeCol();

      updateHUD();
      return true;
    } catch (e) {
      console.error("Erreur loadState", e);
      return false;
    }
  }

  function clearBoard() {
    document.querySelectorAll(".cell").forEach(cell => {
      cell.innerText = "";
      cell.dataset.locked = "0";
      cell.classList.remove("correct", "present", "absent");
    });
    keys.forEach(k => k.classList.remove("correct", "present", "absent"));
  }

  function lockFirstLetter() {
    const firstCell = getRowCells(0)[0];
    firstCell.innerText = secret[0];
    firstCell.dataset.locked = "1";
  }

  // ============================================================
  // GAMEPLAY
  // ============================================================
  function addLetter(letter) {
    if (currentRow >= rows.length) return;

    const rowCells = getRowCells(currentRow);

    while (currentCol < WORD_LENGTH && rowCells[currentCol].dataset.locked === "1") {
      currentCol++;
    }
    if (currentCol >= WORD_LENGTH) return;

    rowCells[currentCol].innerText = letter;
    currentCol++;

    while (currentCol < WORD_LENGTH && rowCells[currentCol].dataset.locked === "1") {
      currentCol++;
    }

    saveState();
  }

  function deleteLetter() {
    const rowCells = getRowCells(currentRow);
    let i = currentCol - 1;

    while (i >= 0 && rowCells[i].dataset.locked === "1") i--;
    if (i < 0) return;

    rowCells[i].innerText = "";
    currentCol = i;

    saveState();
  }

  function rowIsFull() {
    const rowCells = getRowCells(currentRow);
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (rowCells[i].innerText === "") {
        alert("Vous devez insérer 5 lettres !");
        // efface seulement non verrouillées
        for (let j = 0; j < WORD_LENGTH; j++) {
          if (rowCells[j].dataset.locked !== "1") rowCells[j].innerText = "";
        }
        currentCol = moveToNextFreeCol();
        saveState();
        return false;
      }
    }
    return true;
  }

  // Coloration avec gestion des doublons + animation
  async function colorRowAndGetCorrect() {
    const rowCells = getRowCells(currentRow);

    const correctLetters = Array(WORD_LENGTH).fill("");
    const secretArray = secret.split("");
    const guessArray = [];
    const cellStates = Array(WORD_LENGTH).fill("");

    // récupérer guess + reset classes
    for (let i = 0; i < WORD_LENGTH; i++) {
      guessArray.push(rowCells[i].innerText);
      rowCells[i].classList.remove("correct", "present", "absent");
    }

    // Passe 1 invisible : identifier les verts pour éviter les doublons
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessArray[i] === secretArray[i]) {
        cellStates[i] = "correct";
        correctLetters[i] = guessArray[i];
        secretArray[i] = null;
      }
    }

    // Passe 2 invisible : identifier les jaunes et gris
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (cellStates[i] !== "") continue; // déjà marqué vert

      const letter = guessArray[i];
      const idx = secretArray.indexOf(letter);
      if (idx !== -1) {
        cellStates[i] = "present";
        secretArray[idx] = null;
      } else {
        cellStates[i] = "absent";
      }
    }

    // Passe 3 : Coloration une à une, de gauche à droite
    for (let i = 0; i < WORD_LENGTH; i++) {
      await new Promise(res => setTimeout(res, 230));

      const state = cellStates[i];
      rowCells[i].classList.add(state);

      // Jouer le son et mettre à jour le clavier
      if (state === "correct") {
        safePlay(greenCell);
        const keyEl = findKeyByLetter(guessArray[i]);
        if (keyEl) {
          keyEl.classList.remove("present", "absent");
          keyEl.classList.add("correct");
        }
      } else if (state === "present") {
        safePlay(yellowCell);
        const keyEl = findKeyByLetter(guessArray[i]);
        if (keyEl && !keyEl.classList.contains("correct")) {
          keyEl.classList.remove("absent");
          keyEl.classList.add("present");
        }
      } else if (state === "absent") {
        safePlay(greyCell);
        const keyEl = findKeyByLetter(guessArray[i]);
        if (
          keyEl &&
          !keyEl.classList.contains("correct") &&
          !keyEl.classList.contains("present")
        ) {
          keyEl.classList.add("absent");
        }
      }
    }

    saveState();
    return correctLetters;
  }

  function applyCorrectToNextRow(correctLetters) {
    if (currentRow + 1 >= rows.length) return;

    const nextCells = getRowCells(currentRow + 1);
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (correctLetters[i]) {
        nextCells[i].innerText = correctLetters[i];
        nextCells[i].dataset.locked = "1";
      } else {
        nextCells[i].dataset.locked = "0";
      }
    }
    saveState();
  }

  async function submitRow() {
    if (!rowIsFull()) return;

    const rowCells = getRowCells(currentRow);
    const guess = Array.from(rowCells).map(c => c.innerText).join("");

    if (!AuthorizedWords.has(guess)) {
      alert("Mot non reconnu !");
      rowCells.forEach(cell => {
        if (cell.dataset.locked !== "1") {
          cell.classList.remove("correct", "present", "absent");
          cell.innerText = "";
        }
      });
      currentCol = moveToNextFreeCol();
      saveState();
      return;
    }

    const isWinner = (guess === secret);

    const correctLetters = await colorRowAndGetCorrect();

    if (isWinner) {
      safePlay(soundWin);
      setTimeout(() => alert("Félicitations ! Vous avez trouvé le mot secret : " + secret), 400);

      compteurWin++;
      saveStats();

      // on peut garder l'état (ou pas). Ici on sauvegarde juste stats + état courant
      updateHUD();
      saveState();
      return;
    }

    compteur--;
    updateHUD();

    if (compteur <= 0) {
      safePlay(soundFail);
      setTimeout(() => alert("Dommage ! Le mot secret était : " + secret), 400);
      saveState();
      return;
    }

    applyCorrectToNextRow(correctLetters);

    currentRow++;
    if (currentRow >= rows.length) {
      saveState();
      return;
    }

    currentCol = moveToNextFreeCol();
    saveState();
  }

  // ============================================================
  // CURSEUR
  // ============================================================
  if (cursor) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });

    document.addEventListener("mousedown", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(0.7)";
    });

    document.addEventListener("mouseup", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });

    document.querySelectorAll("a, button, .key").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.borderColor = "var(--neon-pink)";
        cursor.style.boxShadow = "0 0 20px var(--neon-pink)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.borderColor = "var(--neon-blue)";
        cursor.style.boxShadow = "0 0 12px var(--neon-blue)";
      });
    });
  }

  // ============================================================
  // RESTART
  // ============================================================
  function resetGame() {
    // nouvelle partie
    secret = pickSecret();
    currentRow = 0;
    compteur = MAX_ATTEMPTS;

    // stats : partie jouée
    compteurPlay++;
    saveStats();

    clearBoard();
    lockFirstLetter();

    currentCol = moveToNextFreeCol();
    updateHUD();
    saveState();

    console.log("Nouveau secret:", secret);
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      restartBtn.disabled = true;
      resetGame();
      restartBtn.disabled = false;
    });
  }

  // ============================================================
  // EVENTS
  // ============================================================
  if (del) del.addEventListener("click", deleteLetter);
  if (enter) enter.addEventListener("click", submitRow);

  keys.forEach((key) => {
    // ignore les deux touches icône
    if (key.id === "buttonReturn" || key.id === "buttonEnter") return;
    key.addEventListener("click", () => addLetter(key.textContent.trim().toUpperCase()));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") return deleteLetter();
    if (e.key === "Enter") return submitRow();

    const l = e.key.toUpperCase();
    if (l.length === 1 && l >= "A" && l <= "Z") addLetter(l);
  });

  // ============================================================
  // INIT
  // ============================================================
  initCellsLockedDefault();
  loadStats();

  // Charger la partie si elle existe, sinon en créer une
  const loaded = loadState();
  if (!loaded) {
    secret = pickSecret();
    clearBoard();
    lockFirstLetter();
    currentRow = 0;
    compteur = MAX_ATTEMPTS;
    currentCol = moveToNextFreeCol();
    saveState();
  }

  updateHUD();
  console.log("secret FINAL:", secret);
  function resetStats() {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser les statistiques ?")) {
      resetGame();
      compteurWin = 0;
      compteurPlay = 0;
      playWin.textContent = "Parties gagnées : " + compteurWin;
      playCount.textContent = "Parties jouées : " + compteurPlay;
      saveState();
    }
  }
  const resetStatsBtn = document.getElementById("resetStatsBtn");
  resetStatsBtn.addEventListener("click", resetStats);
});
  
