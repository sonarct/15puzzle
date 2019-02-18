const process = require('process');
const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

const emptyTile = 0;
const directions = {
  up: 'up',
  right: 'right',
  down: 'down',
  left: 'left'
};
const moves = {
  up: [0, 1],
  right: [-1, 0],
  down: [0, -1],
  left: [1, 0]
};

// const model = [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, emptyTile],
//   [13, 14, 15, 12]
// ];

const generateModel = (x, y) => {
  let possible = [];

  for (let i = 0; i < x * y; i++) {
    possible.push(i)
  }

  let newModel = [];

  for (let iy = 0; iy < y; iy++) {
    if (!newModel[iy]) {
      newModel[iy] = [];
    }

    for (let ix = 0; ix < x; ix++) {
      const randomIndex = Math.floor(Math.random() * (possible.length - 1));

      newModel[iy][ix] = possible[randomIndex];
      possible.splice(randomIndex, 1);
    }
  }

  return newModel;
};

const model = generateModel(4, 4);

const addZero = (number) => number.toString().length === 1 ? `0${number}` : number;

const renderTileTop = () => ' ---- ';
const renderTileMid = (number) => `| ${number} |`;
const renderTileBot = () => ' ____ ';
const renderEmptyTile = () => '      ';

const renderPuzzle = () => {
  model.forEach(row => {
    let top = '';
    let mid = '';
    let bot = '';

    row.forEach((tile, index) => {
      if (tile !== emptyTile) {
        top += renderTileTop();
        mid += renderTileMid(tile === emptyTile ? '  ' : addZero(tile));
        bot += renderTileBot();
      } else {
        top += renderEmptyTile();
        mid += renderEmptyTile();
        bot += renderEmptyTile();
      }

      if (index === 3) {
        process.stdout.write(top);
        process.stdout.write('\n');
        process.stdout.write(mid);
        process.stdout.write('\n');
        process.stdout.write(bot);
        process.stdout.write('\n');

        top = '';
        mid = '';
        bot = '';
      }
    })
  });
};

const cleanStdOut = () => {
  readline.moveCursor(process.stdout, 0, -12);
  readline.clearScreenDown(process.stdout);
};

const render = () => {
  cleanStdOut();
  renderPuzzle();
};

const isGameWon = () => {
  let isWon = true;
  let initial = emptyTile;

  model.forEach((row, y) => {
    if (!isWon) {
      return
    }

    row.forEach((tile, x) => {
      if (!isWon) {
        return
      }

      if (tile === emptyTile && x === model[0].length - 1 && y === model.length - 1) {
        return;
      }

      if (tile > initial) {
        initial = tile;
      } else {
        isWon = false;
      }
    })
  });

  return isWon;
};

renderPuzzle();

const handleKeyPress = (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    const dir = directions[key.name];

    if (dir) {
      let pos = null;

      model.forEach((row, y) => {
        row.forEach((tile, x) => {
          if (tile === emptyTile) {
            pos = [x, y]
          }
        })
      });

      const newPos = [pos[0] + moves[dir][0], pos[1] + moves[dir][1]];

      if (newPos[0] < 0 || newPos[0] >= model[0].length
       || newPos[1] < 0 || newPos[1] >= model.length) {
        return;
      }

      model[pos[1]][pos[0]] = model[newPos[1]][newPos[0]];
      model[newPos[1]][newPos[0]] = emptyTile;

      if (isGameWon()) {
        cleanStdOut();
        console.log('you win');
        return
      }

      render();
    }
  }
};

process.stdin.on('keypress', handleKeyPress);
