
const cube = _.chunk(document.querySelectorAll('#game img'), 10);

let xQueue = [];
let yQueue = [];

let runGame = false;
const time = document.querySelector('#time h2');
const flag = document.querySelector('#flags h2');
let flagsCount = 0;

let flagCells = [];
let cellsOpened = 0;

let cellsDiscovered = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

const randomMines = () => {
    let i = 0;
    while (i < 10) {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);
        if (cube[x][y].alt === '0') {
            cube[x][y].alt = '#';
            cellsDiscovered[x][y] = 9;
            xQueue.push(x);
            yQueue.push(y);
            if (x - 1 >= 0)
                cube[x - 1][y].alt = Number(cube[x - 1][y].alt) + 1;
            if (x - 1 >= 0 && y + 1 <= 9)
                cube[x - 1][y + 1].alt = Number(cube[x - 1][y + 1].alt) + 1;
            if (y + 1 <= 9)
                cube[x][y + 1].alt = Number(cube[x][y + 1].alt) + 1;
            if (x + 1 <= 9 && y + 1 <= 9)
                cube[x + 1][y + 1].alt = Number(cube[x + 1][y + 1].alt) + 1;
            if (x + 1 <= 9)
                cube[x + 1][y].alt = Number(cube[x + 1][y].alt) + 1;
            if (x + 1 <= 9 && y - 1 >= 0)
                cube[x + 1][y - 1].alt = Number(cube[x + 1][y - 1].alt) + 1;
            if (y - 1 >= 0)
                cube[x][y - 1].alt = Number(cube[x][y - 1].alt) + 1;
            if (x - 1 >= 0 && y - 1 >= 0)
                cube[x - 1][y - 1].alt = Number(cube[x - 1][y - 1].alt) + 1;
            ++i;
        }
    }
}

//Checking if i and j are a cell (between 0 and 9)
const OK = (i, j) => {
    if (i < 0 || j < 0 || i > 9 || j > 9)
        return false;
    return true;
}

const revealNearby = (i, j) => {
    //di and dj are helping me for checking the cells next to it
    let visitedCells = []
    const di = [-1, 0, 1, 0, 1, -1, 1, -1];
    const dj = [0, 1, 0, -1, 1, -1, -1, 1];
    let q = [[i, j]]; //I'm using a pair queue to store the i and j of empty cells(with alt = 0)
    while (!q.empty) {
        const [ii, jj] = q.pop(); //ii = the first value of last pair and jj = the second value of last pair while last queue's pair is removing
        console.log([ii, jj]);
        for (let p = 0; p < 8; ++p) {
            //nextI and nextJ represent the cells' i and j next to an empty cell
            const nextI = di[p] + ii;
            const nextJ = dj[p] + jj;
            if (OK(nextI, nextJ)) {
                cube[nextI][nextJ].src = `./images/${cube[nextI][nextJ].alt}Case.jpg`;
                ++cellsOpened; //cube[nextI][nextJ].alt = number of mines that cell touch 
                cellsDiscovered[nextI][nextJ] = 1;
                // 0Case.jpg = empty cell, 1Case.jpg = Cell with digit 1, 2Case.jpg = cell with digit 2, ... , 8Case.jpg = cell with digit 8
                const actualCell = [nextI, nextJ]
                if (cube[nextI][nextJ].alt === '0' && !(visitedCells.find(cell => cell[0] === actualCell[0] && cell[1] === actualCell[1]))) {
                    q.push(actualCell); //push the i and j of the empty cells
                    visitedCells.push(actualCell);
                }
            }
        }
    }
}

const clean = () => {
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            cube[i][j].alt = '0';
            cube[i][j].src = './images/unopenedCase.jpg';
        }
    }
}

const newGame = () => {
    clean();
    const game = document.querySelector('#game');
    const gameOver = document.querySelector('#gameOver');
    game.removeChild(gameOver);
    document.querySelector('#cases').style.opacity = 1;
    for (let k = 0; k < 10; ++k) {
        const x = xQueue[k];
        const y = yQueue[k];
        cube[x][y].src = './images/unopenedCase.jpg';
    }
    xQueue = [];
    yQueue = [];
    randomMines();
    runGame = true;
    flagsCount = 10;
    flag.textContent = flagsCount;
    cellsDiscovered = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
}

const gameOver = () => {
    runGame = false;
    const gameMain = document.querySelector('#game');
    let gameOver = document.createElement('div');
    gameOver.id = 'gameOver';
    let gameOverContent = document.createElement('div');
    gameOverContent.id = 'gameOverContent';
    let p = document.createElement('p');
    p.innerHTML = 'GAME OVER';
    let button = document.createElement('button');
    button.id = 'gameOverButton';
    button.innerHTML = 'Start New Game';
    gameMain.appendChild(gameOver);
    gameOver.appendChild(gameOverContent);
    gameOverContent.appendChild(p);
    gameOverContent.appendChild(button);
    document.querySelector('#cases').style.opacity = 0.5;
    button.onclick = newGame;
}

const gameWon = () => {
    runGame = false;
    const gameMain = document.querySelector('#game');
    let gameOver = document.createElement('div');
    gameOver.id = 'gameOver';
    let gameOverContent = document.createElement('div');
    gameOverContent.id = 'gameOverContent';
    let p = document.createElement('p');
    p.innerHTML = 'YOU WON';
    let button = document.createElement('button');
    button.id = 'gameOverButton';
    button.innerHTML = 'Start New Game';
    gameMain.appendChild(gameOver);
    gameOver.appendChild(gameOverContent);
    gameOverContent.appendChild(p);
    gameOverContent.appendChild(button);
    document.querySelector('#cases').style.opacity = 0.5;
    button.onclick = newGame;
    cellsOpened = 0;
}

const startGame = document.querySelector('#gameOver button');

startGame.onclick = newGame;
randomMines();

for (let i = 0; i < 10; ++i)
    for (let j = 0; j < 10; ++j) {
        cube[i][j].addEventListener("click", e => {
            if (e.target.alt === '#') {
                for (let k = 0; k < 10; ++k) {
                    const x = xQueue[k];
                    const y = yQueue[k];
                    cube[x][y].src = './images/mineCase.jpg';
                }
                e.target.src = './images/redMineCase.jpg';
                gameOver();
            } else if (cellsDiscovered[i][j] === 0) {
                ++cellsOpened;
                cellsDiscovered[i][j] = 1;
                e.target.src = `./images/${e.target.alt}Case.jpg`;
                if (e.target.alt === '0') {
                    revealNearby(i, j);
                } if (cellsOpened === 90) {
                    gameWon();
                }
            }

        })
        cube[i][j].addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            if (cellsDiscovered[i][j] === 2) {
                ++flagsCount;
                flag.textContent = flagsCount;
                ev.target.src = './images/unopenedCase.jpg';
                if (ev.target.alt === '#') {
                    cellsDiscovered[i][j] = 3;
                } else {
                    cellsDiscovered[i][j] = 0;
                }
            } else if (flagsCount && (cellsDiscovered[i][j] === 0 || cellsDiscovered[i][j] === 9)) {
                --flagsCount;
                ev.target.src = './images/flagCase.jpg';
                flag.textContent = flagsCount;
                cellsDiscovered[i][j] = 2;
            }
        }, false);
    }