const board = document.getElementById('board');
const checkButton = document.getElementById('check');
let solution = [];
let currentPuzzle = [];

function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num || board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
            return false;
        }
    }
    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleRows(board) {
    let rows = [0, 1, 2];
    shuffleArray(rows);
    let newBoard = [];
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 3; j++) {
            newBoard.push([...board[i + rows[j]]]);
        }
    }
    return newBoard;
}

function shuffleColumns(board) {
    let cols = [0, 1, 2];
    shuffleArray(cols);
    for (let row = 0; row < 9; row++) {
        let newRow = [];
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 3; j++) {
                newRow.push(board[row][i + cols[j]]);
            }
        }
        board[row] = newRow;
    }
    return board;
}

function generateSudoku(difficulty) {
    let newBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(newBoard);
    newBoard = shuffleRows(newBoard);
    newBoard = shuffleColumns(newBoard);
    solution = JSON.parse(JSON.stringify(newBoard));

    let cellsToHide;
    switch(difficulty) {
        case 'easy':
            cellsToHide = 30;
            break;
        case 'medium':
            cellsToHide = 40;
            break;
        case 'hard':
            cellsToHide = 50;
            break;
    }

    currentPuzzle = JSON.parse(JSON.stringify(solution));
    while (cellsToHide > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (currentPuzzle[row][col] !== 0) {
            currentPuzzle[row][col] = 0;
            cellsToHide--;
        }
    }
}

function renderBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            if (currentPuzzle[i][j] !== 0) {
                cell.textContent = currentPuzzle[i][j];
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = 1;
                input.max = 9;
                cell.appendChild(input);
            }
            cell.addEventListener('click', highlightRelatedCells);
            board.appendChild(cell);
        }
    }
}

function highlightRelatedCells(event) {
    document.querySelectorAll('.highlighted, .selected').forEach(cell => {
        cell.classList.remove('highlighted', 'selected');
    });

    const clickedCell = event.target.closest('.cell');
    const row = parseInt(clickedCell.dataset.row);
    const col = parseInt(clickedCell.dataset.col);

    document.querySelectorAll(`.cell[data-row="${row}"]`).forEach(cell => {
        cell.classList.add('highlighted');
    });

    document.querySelectorAll(`.cell[data-col="${col}"]`).forEach(cell => {
        cell.classList.add('highlighted');
    });

    const squareRow = Math.floor(row / 3) * 3;
    const squareCol = Math.floor(col / 3) * 3;
    for (let i = squareRow; i < squareRow + 3; i++) {
        for (let j = squareCol; j < squareCol + 3; j++) {
            document.querySelector(`.cell[data-row="${i}"][data-col="${j}"]`).classList.add('highlighted');
        }
    }

    clickedCell.classList.add('selected');
}

function checkSolution() {
    const inputs = board.querySelectorAll('input');
    let correct = true;
    inputs.forEach((input, index) => {
        const row = parseInt(input.parentElement.dataset.row);
        const col = parseInt(input.parentElement.dataset.col);
        if (parseInt(input.value) !== solution[row][col]) {
            correct = false;
            input.style.backgroundColor = '#ffcccc';
        } else {
            input.style.backgroundColor = '#ccffcc';
        }
    });
    if (correct) {
        alert('Felicitări! Ai rezolvat puzzle-ul corect!');
    }
}

document.getElementById('easy').addEventListener('click', () => {
    generateSudoku('easy');
    renderBoard();
});

document.getElementById('medium').addEventListener('click', () => {
    generateSudoku('medium');
    renderBoard();
});

document.getElementById('hard').addEventListener('click', () => {
    generateSudoku('hard');
    renderBoard();
});

checkButton.addEventListener('click', checkSolution);

generateSudoku('easy');
renderBoard();
