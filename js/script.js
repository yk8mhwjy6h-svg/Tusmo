
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
document.addEventListener("DOMContentLoaded", function () {

    const keys = document.querySelectorAll(".key")
    const cell = document.querySelector(".cell")
    const del = document.querySelector("#buttonReturn")
    const row = document.querySelector(".row")

   

    del.addEventListener("click", function () {
        row.innerText = row.innerText.slice(0, -1)
    })

    keys.forEach(function (key) {
        console.log(key)
        key.addEventListener("click", function () {
            cell.innerText += key.innerText;
        })

    })
    document.addEventListener('keydown', function (e) {
    if (e.key === "Backspace") {
        if (row.innerText.length <= 1) {
            row.innerText = "";
        } else {
            row.innerText = row.innerText.slice(0, -1);
        }
    } else if (e.key === "Delete") {
        row.innerText = "";
    } else if (e.key === "Enter") {
        
    } else {
        const allowedCharacters = [
            "A","B","C","D","E","F","G","H","I","J","K","L","M",
            "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
            "a","b","c","d","e","f","g","h","i","j","k","l","m",
            "n","o","p","q","r","s","t","u","v","w","x","y","z"
        ];
        if (allowedCharacters.includes(e.key)) {
            row.innerText += e.key;
        }
    }
});

})