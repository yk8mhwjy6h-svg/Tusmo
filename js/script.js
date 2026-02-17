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