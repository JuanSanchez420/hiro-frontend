function createConfettiBurst(x: number, y: number) {
    const colors = [
        '#a0c4ff', // Soft sky blue
        '#bde0fe', // Pale azure
        '#ffc8dd', // Light pink
        '#d4a5a5', // Rose quartz
        '#c8b6ff', // Lavender
        '#98f5e1', // Mint green
      ];
    const confettiCount = 30;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);

        // Random movement in all directions
        const angle = Math.random() * 360;
        const distance = Math.random() * 150 + 50; // Spread
        const xMove = Math.cos(angle) * distance;
        const yMove = Math.sin(angle) * distance;

        confetti.style.setProperty('--x-move', `${xMove}px`);
        confetti.style.setProperty('--y-move', `${yMove}px`);
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;

        document.body.appendChild(confetti);

        // Remove the confetti after animation
        confetti.addEventListener('animationend', () => confetti.remove());
    }
}

export default createConfettiBurst;