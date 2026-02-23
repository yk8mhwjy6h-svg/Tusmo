document.addEventListener("DOMContentLoaded", function () {

  // bouton de démarage"
  const startScreen = document.getElementById("startScreen");
  const startBtn = document.getElementById("startBtn");
  const soundSkeleton = new Audio("../assets/soundSkeleton.mp3")

  startBtn.addEventListener("click", () => {
    soundSkeleton.play()
    startScreen.classList.add("hide");
    startScreen.addEventListener("transitionend", () => {
      startScreen.remove();
    }, { once: true });
  });
  // ============================================================
  // CONSTANTES ET CONFIGURATION
  // ============================================================

  const WORD_LENGTH = 5;

  // ============================================================
  // ÉLÉMENTS DU DOM
  // ============================================================

  const rows = document.querySelectorAll(".grid .row");
  const keys = document.querySelectorAll(".key");
  const del = document.getElementById("buttonReturn");
  const enter = document.getElementById("buttonEnter");
  const attempt = document.getElementById("attempt");
  const cursor = document.querySelector(".cyber-cursor");
  const playWin = document.getElementById("playWin");
  const playCount = document.getElementById("playCount");

  // bouton restart 
  const restartBtn = document.getElementById("restartBtn");

  // ============================================================
  // AUDIO
  // ============================================================

  const soundFail = new Audio("assets/soundfail.mp3");
  const soundWin = new Audio("assets/win.mp3");
  const greenCell = new Audio("assets/greenCell.mp3");
  const yellowCell = new Audio("assets/yellowCell.mp3");
  const greyCell = new Audio("assets/greyCell.mp3");

  // ============================================================
  // ÉTAT DU JEU
  // ============================================================

  function getRandomWord() {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toUpperCase();
  }

  const AuthorizedWords = new Set(WORD_LIST);

  let secret = getRandomWord();
  console.log("secret:", secret);

  let currentRow = 0;
  let currentCol = 0;
  let compteur = 6;
  let compteurWin = 0;
  let compteurPlay = 0;

  // init : toutes les cases non verrouillées par défaut
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
        // Efface automatiquement les lettres de la ligne
        for (let j = 0; j < WORD_LENGTH; j++) {
          if (rowCells[j].dataset.locked !== "1") {
            rowCells[j].innerText = "";
          }
        }
        currentCol = 0;
        return false;
      }
    }
    return true;
  }

async function colorRowAndGetCorrect() {
  // Récupère toutes les cellules de la ligne courante
  const rowCells = getRowCells(currentRow);

    // Tableau pour mémoriser les lettres correctes à transmettre à la prochaine ligne
    const correctLetters = Array(WORD_LENGTH).fill("");

    // Copie du mot secret pour "consommer" les lettres au fur et à mesure
    const secretArray = secret.split("");

    // Tableau temporaire pour le mot deviné par le joueur
    const guessArray = [];

    // ========================
    // Étape 1 : récupérer le mot deviné
    // ========================
    for (let i = 0; i < WORD_LENGTH; i++) {
      guessArray.push(rowCells[i].innerText);   // on stocke chaque lettre de la ligne
      rowCells[i].classList.remove("correct", "present", "absent"); // on nettoie les anciennes classes
    }

  // ========================
  // Étape 2 : traiter chaque case une par une (dans l'ordre)
  // ========================
  for (let i = 0; i < WORD_LENGTH; i++) {
    const letter = guessArray[i];

    await new Promise(resolve => setTimeout(resolve, 230)); // délai pour l'effet de rebond

    // Si la lettre correspond exactement à celle du mot secret à la même position
    if (letter === secretArray[i]) {
      rowCells[i].classList.add("correct");   // couleur verte sur la grille
      greenCell.currentTime = 0;
      greenCell.play();                       // joue le son green
      correctLetters[i] = letter;             // mémorise pour la prochaine ligne
      secretArray[i] = null;                  // on "consomme" la lettre du mot secret
      guessArray[i] = null;                   // on la supprime du mot deviné temporaire

        // Colore la touche correspondante du clavier
        const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
        if (keyElement) {
          keyElement.classList.remove("present", "absent"); // retire les anciennes couleurs
          keyElement.classList.add("correct");              // couleur verte
        }
      }
    else if (letter) {
      // Vérifie si la lettre est encore dans le mot secret (mal placée)
      const index = secretArray.indexOf(letter);

      if (index !== -1) {
        rowCells[i].classList.add("present"); // couleur jaune sur la grille
        yellowCell.currentTime = 0;
        yellowCell.play();                    // joue le son yellow
        secretArray[index] = null;            // on "consomme" la lettre du mot secret

        // Colore la touche correspondante du clavier
        const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
        if (keyElement && !keyElement.classList.contains("correct")) {
          keyElement.classList.remove("absent");
          keyElement.classList.add("present"); // couleur jaune
        }

      } else {
        // Lettre absente du mot secret

        rowCells[i].classList.add("absent"); // couleur grise sur la grille
        greyCell.currentTime = 0;
        greyCell.play();                     // joue le son grey

        const keyElement = document.querySelector(`.key[data-key="${letter}"]`);
        if (keyElement &&
            !keyElement.classList.contains("correct") && // ne pas rétrograder un vert
            !keyElement.classList.contains("present")) { // ne pas rétrograder un jaune
          keyElement.classList.add("absent");           // couleur grise
        }
      }
    }
  }

  // On renvoie les lettres correctes pour bloquer la prochaine ligne
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

  async function submitRow() {
    if (!rowIsFull()) return;

    const rowCells = getRowCells(currentRow);
    const letters = Array.from(rowCells).map(c => c.innerText);
    const guess = letters.join("");

    // Vérifie si le mot deviné est dans la liste des mots autorisés
    if (!AuthorizedWords.has(guess)) {
      alert("Mot non reconnu !");
      // Efface automatiquement les lettres non verrouillées de la ligne
      rowCells.forEach(cell => {
        if (cell.dataset.locked !== "1") {
          cell.classList.remove("correct", "present", "absent");
          cell.innerText = "";
        }
      });
      // Remet le curseur à la deuxième case (index 1). Si elle est verrouillée,
      // place le curseur sur la prochaine case libre.
      if (rowCells[1] && rowCells[1].dataset.locked !== "1") {
        currentCol = 1;
      } else {
        currentCol = moveToNextFreeCol();
      }
      return;
    }

    const isWinner = (guess === secret);

    const correctLetters = await colorRowAndGetCorrect();

    if (isWinner) {
      // Attendre que le dernier son greenCell.mp3 soit terminé avant de jouer soundWin
      setTimeout(() => {
        soundWin.play();
        alert("Félicitations ! Vous avez trouvé le mot secret : " + secret);
      }, 500);
      compteurWin++;
      playWin.textContent = "Parties gagnées : " + compteurWin;
      return;
    }

    compteur--;
    attempt.textContent = "Tentatives restantes : " + compteur;
    

    if (compteur <= 0) {
      soundFail.play();
      setTimeout(() => {
        alert("Dommage ! Le mot secret était : " + secret);
      }, 500);
      return;
    }


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

    // Incrementer le compteur de parties jouées
    compteurPlay++;
    playCount.textContent = "Parties jouées : " + compteurPlay;

    // vider la grille + enlever couleurs + déverrouiller
    document.querySelectorAll(".cell").forEach(cell => {
      cell.innerText = "";
      cell.classList.remove("correct", "present", "absent");
      cell.dataset.locked = "0";
    });

    // réinitialiser les couleurs du clavier
    keys.forEach(key => {
      key.classList.remove("correct", "present", "absent");
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

    restartBtn.addEventListener("click", () => {
      restartBtn.disabled = true;
      resetGame();
      restartBtn.disabled = false;
    });

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

// ============================================================
  // LOCAL STORAGE 
  // ============================================================

// Appeler saveBestScore(compteur) à la fin de submitRow() si le joueur gagne ou perd, pour enregistrer le score. Vous pouvez aussi afficher le meilleur score dans l'interface utilisateur si vous le souhaitez.

function submitRow() {
  // ... code existant ...

  if (isWinner) {
    soundWin.play();
    saveBestScore(compteur); // Enregistre le score si le joueur gagne
    setTimeout(() => {
      alert("Félicitations ! Vous avez trouvé le mot secret : " + secret);
    }, 500);
    return;
  }

  if (compteur <= 0) {
    soundFail.play();
    saveBestScore(compteur); // Enregistre le score si le joueur perd
    setTimeout(() => {
      alert("Dommage ! Le mot secret était : " + secret);
    }, 500);
    return;
  }

  // ... code existant ...
}   

// Vous pouvez aussi afficher le meilleur score dans l'interface utilisateur, par exemple dans un élément avec l'id "bestScore":

const bestScoreElement = document.getElementById("bestScore");
if (bestScoreElement) {
  const bestScore = getBestScore();
  if (bestScore) {
    bestScoreElement.textContent = "Meilleur score : " + bestScore + " tentatives restantes";
  } else {
    bestScoreElement.textContent = "Meilleur score : N/A";
  }
}   

// Local storage de l'etat de la game pour permettre au joueur de revenir à sa partie en cours même après avoir fermé l'onglet ou le navigateur. Vous pouvez stocker des informations telles que le mot secret, les tentatives restantes, la grille actuelle, etc. dans le local storage et les récupérer lors du chargement de la page pour restaurer l'état du jeu.

function saveGameState() {
  const gameState = {
    secret: secret,
    currentRow: currentRow,
    compteur: compteur,
    grid: Array.from(document.querySelectorAll(".cell")).map(cell => ({
      text: cell.innerText,
      locked: cell.dataset.locked,
      classes: cell.className
    })),
    keys: Array.from(keys).map(key => ({
      key: key.dataset.key,
      classes: key.className
    }))
  };
  localStorage.setItem("motusGameState", JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem("motusGameState");
  if (savedState) {
    const gameState = JSON.parse(savedState);
    secret = gameState.secret;
    currentRow = gameState.currentRow;
    compteur = gameState.compteur;

    // Restaurer la grille
    const cells = document.querySelectorAll(".cell");
    gameState.grid  .forEach((cellState, index) => {
      cells[index].innerText = cellState.text;
      cells[index].dataset.locked = cellState.locked;
      cells[index].className = cellState.classes;
    });

    // Restaurer les touches du clavier
    keys.forEach(key => {
      const keyState = gameState.keys.find(k => k.key === key.dataset.key);
      if (keyState) {
        key.className = keyState.classes;
      }
    });

    // Mettre à jour l'affichage des tentatives restantes
    attempt.textContent = "Tentatives restantes : " + compteur;
  }
}

// 