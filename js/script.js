document.addEventListener("DOMContentLoaded", function () {

  // ---- Curseur personnalisé ----
  const cursor = document.querySelector(".cyber-cursor");

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

  // ---- Mot secret ----
  const WORD_LIST = [
  "ABIME","ABORD","ABRIT","ACIER","AGILE","AIDER","AIMER","AINSI","AJOUT","ALBUM",
  "ALERT","ALGUE","ALIAS","AMOUR","ANGLE","ANIME","APPEL","ARBRE","ARRET","ATOME",
  "AVION","AVRIL","BAGUE","BANJO","BARBE","BARON","BASSE","BATEE","BATTU","BEIGE",
  "BETON","BIERE","BILAN","BILLE","BLADE","BLANC","BLOND","BOIRE","BOITE","BOMBE",
  "BORDS","BOULE","BRAVE","BRUIT","CABLE","CADRE","CALME","CANAL","CARTE","CASSE",
  "CAUSE","CHAIR","CHAMP","CHANT","CHAUD","CHIEN","CHOIR","CHUTE","CIGAR","CLAIR",
  "CLONE","CLOWN","COEUR","COLLE","CONTE","COUPE","COURT","CRANE","CREER","CRISE",
  "CROIX","DANSE","DEBUT","DELTA","DEMON","DEPOT","DESSI","DEVIN","DOUTE","DRAME",
  "DROIT","ECLAT","ECRAN","ECRIT","EFFET","EGOUT","ELITE","EMAIL","ENFER","ENVOI",
  "EPAIS","ESPOI","ETAPE","ETOIL","ETUDE","EXACT","EXCES","FACON","FAIRE","FAUTE",
  "FEMME","FICHE","FINAL","FIXER","FLUID","FONCE","FORCE","FOULE","FRAIS","FROID",
  "FUMEE","FUTUR","GALET","GAMIN","GANTS","GARDE","GENRE","GESTE","GLOBE","GRACE",
  "GRAIN","GRAND","GRAVE","GUIDE","HABIT","HUMAN","IDEAL","IMAGE","IMPER","INBOX",
  "ISSUE","JAMBE","JEUNE","JOLIE","JOUER","JUIFS","JURER","JUSTE","LARGE","LASER",
  "LEGER","LENTI","LETTRE","LIGNE","LIVRE","LOCAL","LOGER","LUMEN","LUTTE","MAGIE",
  "MAINS","MAIRE","MAJOR","MAMAN","MARGE","MARIN","MASSE","MATCH","MATIN","METAL",
  "MINCE","MODEM","MOINS","MONDE","MORAL","MOTIF","MOULE","MUSIQ","NAIVE","NAGER",
  "NEIGE","NERVE","NIVEA","NOEUD","NOIRE","NOMME","NORDS","NOTER","NUAGE","OBJET",
  "OCEAN","OMBRE","ONCLE","OPERA","ORDRE","ORGUE","OTAGE","OUBLI","OUIES","PAIRE",
  "PAINS","PANEL","PARIS","PARLE","PARTI","PASSE","PATCH","PAUSE","PERTE","PETIT",
  "PHOTO","PIECE","PISTE","PLAGE","PLEIN","PLUME","POCHE","POIDS","POINT","POMME",
  "PORTE","POSEE","POUCE","PRIME","PRIXS","PROIE","PROSE","PULSE","QUAND","QUART",
  "QUEEN","QUOTA","RADAR","RAIDE","RARES","RAYON","REGLE","REINE","RENDU","REPAS",
  "RESTE","REVES","RIGOL","RIVEE","ROBOT","ROUGE","ROUTE","RUGIR","SABLE","SALON",
  "SAUTE","SAVON","SCENE","SEUIL","SIGNE","SILENCE","SOLDE","SONDE","SORTI","SOUCI",
  "SPORT","STOCK","STYLE","SUCRE","SUJET","SUPER","TABLE","TACHE","TAILLE","TARIF",
  "TEMPS","TEXTE","THEME","TIGRE","TIRER","TITRE","TRACE","TRAIN","TRAME","TRIER",
  "TROIS","USAGE","UTILE","VALEUR","VENTE","VERRE","VIEUX","VIGUE","VILLE","VIRUS",
  "VITAL","VIVRE","VOILE","VOTER"
];
    
  const secret = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toUpperCase();
  console.log("secret:", secret);

  // ---- DOM ----
  const rows = document.querySelectorAll(".grid .row");
  const keys = document.querySelectorAll(".key");
  const del = document.getElementById("buttonReturn");
  const enter = document.getElementById("buttonEnter");

  // ---- Compteur ----
  let compteur = 6;
  const attempt = document.getElementById("attempt");
  const soundFail = new Audio("assets/soundfail.mp3");
  const soundWin = new Audio("assets/soundWin.mp3");
  attempt.textContent = "Tentatives restantes : " + compteur;

  // ---- Etat ----
  let currentRow = 0;
  const WORD_LENGTH = 5;

  function getRowCells(r) {
    return rows[r].querySelectorAll(".cell");
  }

  // va a la première colonne libre
  function moveToNextFreeCol() {
    const rowCells = getRowCells(currentRow);
    let i = 0;
    while (i < WORD_LENGTH && rowCells[i].dataset.locked === "1") i++;
    return i; 
  }

  // position courante = première case libre de la ligne
  let currentCol = moveToNextFreeCol();

  function addLetter(letter) {
    if (currentRow >= rows.length) return;

    const rowCells = getRowCells(currentRow);
    // trouver la prochaine case libre (non verrouillée + vide)
    while (currentCol < WORD_LENGTH && (rowCells[currentCol].dataset.locked === "1")) {
      currentCol++;
    }
    if (currentCol >= WORD_LENGTH) return;

    rowCells[currentCol].innerText = letter;
    currentCol++;

    // sauvager la position courante pour la prochaine lettre
    while (currentCol < WORD_LENGTH && rowCells[currentCol].dataset.locked === "1") {
      currentCol++;
    }
  }

  function deleteLetter() {
    const rowCells = getRowCells(currentRow);

    // revenir en arrière jusqu'à une case non verrouillée
    let i = currentCol - 1;
    while (i >= 0 && rowCells[i].dataset.locked === "1") i--;
    if (i < 0) return;

    rowCells[i].innerText = "";
    currentCol = i;
  }

  function rowIsFull() {
    const rowCells = getRowCells(currentRow);
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (rowCells[i].innerText === "") return false;
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

  // recopie les lettres correctes sur la ligne suivante 
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
    
    const correctLetters = colorRowAndGetCorrect();
    const guess = Array.from(getRowCells(currentRow)).map(c => c.innerText).join("");
    //   si la ligne est verte, le joueur a gagné et on envoie un message de félicitations. Sinon, on décrémente le compteur et on passe à la ligne suivante.
     if (guess === secret) {
       soundWin.play();
       alert("Félicitations ! Vous avez trouvé le mot secret !");
       return;
     } 
    
    // compteur
    compteur--;
    attempt.textContent = "Tentatives restantes : " + compteur;

    if (compteur <= 0) {
      soundFail.play();
      return;
    }
    applyCorrectToNextRow(correctLetters);

    // ligne suivante
    currentRow++;
    currentCol = moveToNextFreeCol();
  }

  // ---- Events ----
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
  // ---- afficher la premiere lettre du mot secret ----
  const firstLetter = secret[0];
  const firstCell = getRowCells(0)[0];
  firstCell.innerText = firstLetter;
  firstCell.dataset.locked = "1";   
});
