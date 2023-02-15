let tileset = [];
let gameOver = false;

$('#victoryModal').on('hide.bs.modal', () => {
    pausePlayerIfPlaying();
});

function randomizeTiles() {
    const tiles = document.getElementsByName('tile');
    const tileOrder = generateRandomTileSequence(tiles.length);
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].setAttribute('src', `img/img${tileOrder[i]}.png`);
        tiles[i].style.opacity = 1;
    }
    tileset = [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, true, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ];
    gameOver = false;
    pausePlayerIfPlaying();
}

function generateRandomTileSequence(length) {
    const sequence = [];
    for (let i = 1; i <= length; i++) {
        sequence.push(i);
    }
    sequence.sort(() => Math.random() - 0.5);
    return sequence;
}

function toggleTile(image) {
    if (gameOver) {
        return;
    }

    image.style.opacity =
        (image.style.opacity || !image.style.opacity) < 0.5 ? 1 : 0.15;

    const x = image.id % 5;
    const y = Math.floor(image.id / 5);
    tileset[y][x] = !tileset[y][x];

    if (tileset[y][x]) {
        if (!checkForVictory()) {
            playFile(randomLine());
        } else {
            gameOver = true;
            playFile('vivon');
            $('#victoryModal').modal('show');
        }
    }
}

function playFile(fileName) {
    pausePlayerIfPlaying();
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.setAttribute('src', `sound/${fileName}.mp3`);
    audioPlayer.play();
}

function pausePlayerIfPlaying() {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer.duration > 0 && !audioPlayer.paused) {
        audioPlayer.pause();
    }
}

function randomLine() {
    const lineCount = 283;
    const randomNumber = Math.floor(Math.random() * lineCount);
    return `line_${String(randomNumber).padStart(3, '0')}`;
}

function checkForVictory() {
    for (let x = 0; x < 5; x++) {
        if (checkColumn(x)) {
            return true;
        }
    }
    for (let y = 0; y < 5; y++) {
        if (checkRow(y)) {
            return true;
        }
    }

    return checkDiagonals();
}

function checkColumn(x) {
    for (let y = 0; y < 5; y++) {
        if (!tileset[y][x]) {
            return false;
        }
    }
    return true;
}

function checkRow(y) {
    for (let x = 0; x < 5; x++) {
        if (!tileset[y][x]) {
            return false;
        }
    }
    return true;
}

function checkDiagonals() {
    let result = true;
    for (let i = 0; i < 5; i++) {
        if (!tileset[i][i]) {
            result = false;
        }
    }
    if (result) {
        return true;
    }

    result = true;
    for (let i = 0; i < 5; i++) {
        if (!tileset[4 - i][i]) {
            result = false;
        }
    }
    return result;
}
