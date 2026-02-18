document.addEventListener('DOMContentLoaded', function () {

    // ---- Curseur personnalisé ----
    const cursor = document.querySelector('.cyber-cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.borderColor = 'var(--neon-pink)';
            cursor.style.boxShadow = '0 0 20px var(--neon-pink)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.borderColor = 'var(--neon-blue)';
            cursor.style.boxShadow = '0 0 12px var(--neon-blue)';
        });
    });

    // ---- Clavier ----
    const keys = document.querySelectorAll(".key");
    const del = document.querySelector("#buttonReturn");
    const rows = document.querySelectorAll(".row");
    let currentRow = 0;

    function getCurrentCells() {
        return rows[currentRow].querySelectorAll(".cell"); 
    }

    function addLetter(letter) {
        const cells = getCurrentCells(); 
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent.trim() === "") {
                cells[i].textContent = letter;
                break;
            }
        }
    }

    function deleteLetter() {
        const cells = getCurrentCells();
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].textContent.trim() !== "") {
                cells[i].textContent = "";
                break;
            }
        }
    }

    // ---- Mot secret ----
    const wordList = ["CHIEN", "BRAVE", "CRANE", "FROID", "CHAUD", "ROUGE", "GRACE", "ROUTE", "IDEAL", "JOKER"];

    function getRandomWord() {
        return wordList[Math.floor(Math.random() * wordList.length)];
    }

    const secret = getRandomWord();
    console.log("Mot secret :", secret);

    // ---- Vérification du mot ----
    function checkWord() {
        const cells = getCurrentCells();

        // Vérifie que toutes les cells sont remplies
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent.trim() === "") {
                alert("Mot incomplet !");
                return; // on sort sans valider
            }
        }

        // Colorisation
        for (let i = 0; i < secret.length; i++) {
            const lettre = cells[i].textContent.trim(); 
            if (lettre === secret[i]) {
                cells[i].style.backgroundColor = "green";
            } else if (secret.includes(lettre)) {
                cells[i].style.backgroundColor = "orange";
            } else {
                cells[i].style.backgroundColor = "red";
            }
        }

        // Passe à la row suivante
        currentRow++;
    }

    // ---- Compteur de tentatives ----
    let compteur = 6;
    const attempt = document.getElementById("attempt");
    const buttonEnter = document.getElementById("buttonEnter");
    const soundFail = new Audio("../assets/soundfail.mp3");

    attempt.textContent = 'Tentatives restantes : ' + compteur;

    buttonEnter.addEventListener('click', function () {
        if (compteur > 0) {
            checkWord(); // appel de la vérification
            compteur--;
            attempt.textContent = 'Tentatives restantes : ' + compteur;
            if (compteur === 0) {
                soundFail.play();
            }
        }
    });

    // ---- Listeners clavier ----
    del.addEventListener("click", function () {
        deleteLetter();
    });

    keys.forEach(function (key) {
        if (key.id === "buttonReturn" || key.id === "buttonEnter") return;
        key.addEventListener("click", function () {
            addLetter(key.innerText.trim());
        });
    });

    document.addEventListener('keydown', function (e) {
        e.preventDefault();
        if (e.key === "Backspace") {
            deleteLetter();
        } else if (e.key === "Delete") {
            getCurrentCells().forEach(cell => cell.textContent = ""); // "getCurrentCells()" au lieu de "cells"
        } else if (e.key === "Enter") {
            buttonEnter.click();
        } else {
            const allowedCharacters = [
                "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
                "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
                "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
            ];
            if (allowedCharacters.includes(e.key)) {
                addLetter(e.key.toUpperCase());
            }
        }
    });

})