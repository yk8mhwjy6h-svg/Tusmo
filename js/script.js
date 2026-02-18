document.addEventListener('DOMContentLoaded', function() {

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

    // ---- Compteur de tentatives ----
    let compteur = 6;
    const attempt = document.getElementById("attempt");
    const buttonEnter = document.getElementById("buttonEnter");
    const soundFail = new Audio("../assets/soundfail.mp3");

    attempt.textContent = 'Tentatives restantes : ' + compteur;

    buttonEnter.addEventListener('click', function () {
        if (compteur > 1) {
            compteur--;
            attempt.textContent = 'Tentatives restantes : ' + compteur;
        } else {
            compteur --;
            attempt.textContent = 'Tentatives restantes : ' + compteur;
            soundFail.play();
        }
    });

    // ---- Clavier ----
    const keys = document.querySelectorAll(".key")
    const del = document.querySelector("#buttonReturn")
    const cells = [
        document.querySelector(".cell1"),
        document.querySelector(".cell2"),
        document.querySelector(".cell3"),
        document.querySelector(".cell4"),
        document.querySelector(".cell5")
    ]

    function addLetter(letter) {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].innerText === "") {
                cells[i].innerText = letter;
                break;
            }
        }
    }

    function deleteLetter() {
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].innerText !== "") {
                cells[i].innerText = "";
                break;
            }
        }
    }

    del.addEventListener("click", function () {
        deleteLetter();
    })

    keys.forEach(function (key) {
        // on ignore buttonReturn et buttonEnter car ce sont des icônes
        if (key.id === "buttonReturn" || key.id === "buttonEnter") return;
        key.addEventListener("click", function () {
            addLetter(key.innerText.trim());
        })
    })

    document.addEventListener('keydown', function (e) {
        e.preventDefault();
        if (e.key === "Backspace") {
            deleteLetter();
        } else if (e.key === "Delete") {
            cells.forEach(cell => cell.innerText = "");
        } else if (e.key === "Enter") {
            buttonEnter.click();
        } else {
            const allowedCharacters = [
                "A","B","C","D","E","F","G","H","I","J","K","L","M",
                "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
                "a","b","c","d","e","f","g","h","i","j","k","l","m",
                "n","o","p","q","r","s","t","u","v","w","x","y","z"
            ];
            if (allowedCharacters.includes(e.key)) {
                addLetter(e.key.toUpperCase());
            }
        }
    })

})