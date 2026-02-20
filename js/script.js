document.addEventListener("DOMContentLoaded", function () {

  // ============================================================
  // CONSTANTES ET CONFIGURATION
  // ============================================================

  const WORD_LENGTH = 5;
  const WORD_LIST = [
    "ABIME","ABORD","ABRIT","ACIER","AGILE","AIDER","AIMER","AINSI","AJOUT","ALBUM",
    "ALERT","ALGUE","ALIAS","AMOUR","ANGLE","ANIME","APPEL","ARBRE","ARRET","ATOME",
    "AVION","AVRIL","BAGUE","BANJO","BARBE","BARON","BASSE","BATTE","BATTU","BEIGE",
    "BETON","BIERE","BILAN","BILLE","BLANC","BLOND","BOIRE","BOITE","BOMBE","BORDS",
    "BOULE","BRAVE","BRUIT","CABLE","CADRE","CALME","CANAL","CARTE","CASSE","CAUSE",
    "CHAIR","CHAMP","CHANT","CHAUD","CHIEN","CHOIR","CHUTE","CLAIR","CLONE","CLOWN",
    "COEUR","COLLE","CONTE","COMTE","COUPE","COURT","CRAIE","CRANE","CREER","CRISE",
    "CROIX","DANSE","DEBUT","DELTA","DEMON","DEPOT","DEVIN","DOUTE","DRAME","DRAPE",
    "DROIT","ECLAT","ECRAN","ECRIT","EFFET","EGOUT","ELITE","EMAIL","ENFER","ENVOI",
    "EPAIS","ETAPE","ETUDE","EXACT","EXCES","FACON","FAIRE","FAUTE","FEMME","FICHE",
    "FINAL","FIXER","FONCE","FORCE","FOULE","FRAIS","FROID","FUMEE","FUTUR","GALET",
    "GAMIN","GANTS","GARDE","GENRE","GESTE","GLOBE","GRACE","GRAIN","GRAND","GRAVE",
    "GUIDE","HABIT","HUMAN","IDEAL","IMAGE","ISSUE","JAMBE","JEUNE","JOLIE","JOUER",
    "JUIFS","JURER","JUSTE","LARGE","LASER","LEGER","LIGNE","LIVRE","LOCAL","LOGER",
    "LUMEN","LUTTE","MAGIE","MAINS","MAIRE","MAJOR","MAMAN","MARGE","MARIN","MASSE",
    "MATCH","MATIN","METAL","MINCE","MODEM","MOINS","MONDE","MORAL","MOTIF","MOULE",
    "NAIVE","NAGER","NEIGE","NIVEA","NOEUD","NOIRE","NOMME","NORDS","NOTER","NUAGE",
    "OBJET","OCEAN","OMBRE","ONCLE","OPERA","ORDRE","ORGUE","OTAGE","OUBLI","OUIES",
    "PAIRE","PAINS","PANEL","PARIS","PARLE","PARTI","PASSE","PATCH","PAUSE","PERTE",
    "PETIT","PHOTO","PIECE","PISTE","PLAGE","PLEIN","PLUME","POCHE","POIDS","POINT",
    "PORTE","POSEE","POUCE","PRIME","PROIE","PROSE","PULSE","QUAND","QUART","QUOTA",
    "RADAR","RAIDE","RARES","RAYON","REGLE","REINE","RENDU","REPAS","RESTE","REVES",
    "RIVEE","ROBOT","ROUGE","ROUTE","RUGIR","SABLE","SALON","SAUTE","SAVON","SCENE",
    "SEUIL","SIGNE","SOLDE","SONDE","SORTI","SOUCI","SPORT","STOCK","STYLE","SUCRE",
    "SUJET","SUPER","TABLE","TACHE","TARIF","TEMPS","TEXTE","THEME","TIGRE","TIRER",
    "TITRE","TRACE","TRAIN","TRAME","TRIER","TROIS","USAGE","VENTE","VERRE","VIEUX",
    "VILLE","VIRUS","VITAL","VIVRE","VOILE","VOTER"
  ];

  // ============================================================
  // ÉLÉMENTS DU DOM
  // ============================================================

  const rows = document.querySelectorAll(".grid .row");
  const keys = document.querySelectorAll(".key");
  const del = document.getElementById("buttonReturn");
  const enter = document.getElementById("buttonEnter");
  const attempt = document.getElementById("attempt");
  const cursor = document.querySelector(".cyber-cursor");

  // bouton restart 
  const restartBtn = document.getElementById("restartBtn");

  // ============================================================
  // AUDIO
  // ============================================================

  const soundFail = new Audio("assets/soundfail.mp3");
  const soundWin = new Audio("assets/soundWin.mp3");
  const soundFault = new Audio("assets/soundfault.mp3");

  // ============================================================
  // ÉTAT DU JEU
  // ============================================================

  function getRandomWord() {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toUpperCase();
  }

  let secret = getRandomWord();
  console.log("secret:", secret);

  let currentRow = 0;
  let currentCol = 0;
  let compteur = 6;

  // ✅ init : toutes les cases non verrouillées par défaut
  document.querySelectorAll(".cell").forEach(cell => {
    cell.dataset.locked = "0";
  });

  // ============================================================
  // FONCTIONS UTILITAIRES
  // ============================================================

  function getRowCells(r) {
    return rows[r].querySelectorAll(".cell");
  }

  function moveToNextFreeCol() {
    const rowCells = getRowCells(currentRow);
    let i = 0;
    while (i < WORD_LENGTH && rowCells[i].dataset.locked === "1") i++;
    return i;
  }

  // ============================================================
  // FONCTIONS DE GAMEPLAY
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
  }

  function deleteLetter() {
    const rowCells = getRowCells(currentRow);
    let i = currentCol - 1;
    while (i >= 0 && rowCells[i].dataset.locked === "1") i--;
    if (i < 0) return;

    rowCells[i].innerText = "";
    currentCol = i;
  }

  function rowIsFull() {
    const rowCells = getRowCells(currentRow);
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (rowCells[i].innerText === "") {
        alert("Vous devez insérer 5 lettres !");
        return false;
      }
    }
    return true;
  }

  function colorRowAndGetCorrect() {
    const rowCells = getRowCells(currentRow);
    const correctLetters = Array(WORD_LENGTH).fill("");

    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = rowCells[i].innerText;

      rowCells[i].classList.remove("correct", "present", "absent");

      if (letter === secret[i]) {
        rowCells[i].classList.add("correct");
        correctLetters[i] = letter;
      } else if (secret.includes(letter)) {
        rowCells[i].classList.add("present");
      } else {
        rowCells[i].classList.add("absent");
      }
    }

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
  }

  function submitRow() {
    if (!rowIsFull()) return;

    const rowCells = getRowCells(currentRow);
    const letters = Array.from(rowCells).map(c => c.innerText);
    const guess = letters.join("");

    const isWinner = (guess === secret);

    const correctLetters = colorRowAndGetCorrect();

    if (isWinner) {
      soundWin.play();
      alert("Félicitations ! Vous avez trouvé le mot secret : " + secret);
      return;
    }

    compteur--;
    attempt.textContent = "Tentatives restantes : " + compteur;

    if (compteur <= 0) {
      soundFail.play();
      alert("Dommage ! Le mot secret était : " + secret);
      return;
    }

    soundFault.play();

    applyCorrectToNextRow(correctLetters);
    currentRow++;
    currentCol = moveToNextFreeCol();
  }

  // ============================================================
  // CURSEUR PERSONNALISÉ
  // ============================================================

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

  // BOUTON RECOMMENCER 

  function resetGame() {
    // nouveau mot
    secret = getRandomWord();
    console.log("Nouveau secret:", secret);

    // reset état
    currentRow = 0;
    compteur = 6;

    // vider la grille + enlever couleurs + déverrouiller
    document.querySelectorAll(".cell").forEach(cell => {
      cell.innerText = "";
      cell.classList.remove("correct", "present", "absent");
      cell.dataset.locked = "0";
    });

    // remettre la 1ère lettre (motus)
    const firstLetter = secret[0];
    const firstCell = getRowCells(0)[0];
    firstCell.innerText = firstLetter;
    firstCell.dataset.locked = "1";

    // remise de la position de saisie + affichage tentatives
    currentCol = moveToNextFreeCol();
    attempt.textContent = "Tentatives restantes : " + compteur;
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", resetGame);
  }

  // ============================================================
  // ÉVÉNEMENTS
  // ============================================================

  del.addEventListener("click", deleteLetter);
  enter.addEventListener("click", submitRow);

  keys.forEach((key) => {
    if (key.id === "buttonReturn" || key.id === "buttonEnter") return;
    key.addEventListener("click", () => addLetter(key.innerText.trim().toUpperCase()));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") return deleteLetter();
    if (e.key === "Enter") return submitRow();

    const l = e.key.toUpperCase();
    if (l.length === 1 && l >= "A" && l <= "Z") addLetter(l);
  });

  // ============================================================
  // INITIALISATION
  // ============================================================

  attempt.textContent = "Tentatives restantes : " + compteur;

  const firstLetter = secret[0];
  const firstCell = getRowCells(0)[0];
  firstCell.innerText = firstLetter;
  firstCell.dataset.locked = "1";

  currentCol = moveToNextFreeCol();
});