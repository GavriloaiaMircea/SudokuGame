document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('maxlength', '1');
        cell.appendChild(input);
        grid.appendChild(cell);
    }
});
