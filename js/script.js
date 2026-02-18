document.addEventListener('DOMContentLoaded', function(event) {
    event.preventDefault();

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
    })

    // Compteur qui affiche le nombre de tentatives
    let compteur = 6;
    const attempt = document.getElementById("attempt");
    const buttonEnter = document.getElementById("buttonEnter");
    const soundFail = new Audio("../assets/soundfail.mp3");

    attempt.textContent = 'Tentatives restantes : ' + compteur;

    buttonEnter.addEventListener('click', function () {
        if (compteur > 0) {
            compteur --;
            attempt.textContent = 'Tentatives restantes : ' + compteur;
        } else if (compteur === 0) {
            soundFail.play();
            return;
        }
    });



});

