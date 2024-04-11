var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Sudoku = /** @class */ (function () {
    function Sudoku() {
        this.board = Array.from({ length: 9 }, function () { return Array(9).fill(null); });
        this.solution = null;
        this.setupBoard();
    }
    Sudoku.prototype.createSolution = function () {
        var nums = Array.from({ length: 9 }, function (_, i) { return i+1; });
        var rotations = Math.floor(Math.random() * 9);
        for (var i = 0; i < rotations; i++) {
            nums.push(nums.shift());
        }
        for (var ix = 0; ix < 9; ix++) {
            for (var iy = 0; iy < 9; iy++) {
                this.board[ix][iy] = nums[iy];
            }
            nums.push(nums.shift());
        }
        this.solution = this.board.map(function (row) { return __spreadArray([], row, true); });
    };
    Sudoku.prototype.setupBoard = function () {
        this.createSolution();
        var removalChance = 0.1;
        for (var ix = 0; ix < 9; ix++) {
            for (var iy = 0; iy < 9; iy++) {
                var r = Math.random();
                if (r < removalChance) {
                    this.board[ix][iy] = 111;
                }
            }
        }
    };
    Sudoku.prototype.checkMove = function (x, y, given) {
        console.log("Given and solutio ", given);
        console.log(this.solution[x][y]);
        if (parseInt(this.solution[x][y]) == parseInt(given)) {
            
            return true;
        }
        else {
            return false;
        }
    };
    Sudoku.prototype.winState = function () {
        if (this.solution && JSON.stringify(this.board) === JSON.stringify(this.solution)) {
            return true;
        }
        else {
            return false;
        }
    };
    // Sudoku.prototype.getInput = function () {
    //     var x = null;
    //     var y = null;
    //     var number = null;
    //     var notValid = true;
    //     while (notValid) {
    //         console.log("Type in an x and y coordinate like this: x y chosenNumber");
    //         // var input = prompt("Enter coordinates and number:").split(" ");
    //         x = 0
    //         y = 0
    //         // x = parseInt(x);
    //         // y = parseInt(y);
    //         // number = parseInt(input[2]);
    //         if (x >= 1 && x <= 9 && y >= 1 && y <= 9) {
    //             return [x - 1, y - 1, number];
    //         }
    //     }
    //     return [0, 0, 0]; // Dummy return statement
    // };
    Sudoku.prototype.gameLoop = function (x, y, given) {
        var _a;
        console.log(this.board.map(function (row) { return row.join(" "); }).join("\n"));
        console.log((_a = this.solution) === null || _a === void 0 ? void 0 : _a.map(function (row) { return row.join(" "); }).join("\n"));
        console.log(x, y , given)
        if (x != null && y != null && given != null) {
            console.log(x, y)
            if (this.checkMove(x, y, given)) {
                this.board[x][y] = given;
                return true;
            } else {
                return false;
            }
        }
    };

    Sudoku.prototype.getBoard = function () {
        return this.board;
    }
    return Sudoku;
}());

var s = new Sudoku;
selected = 1;

table = document.querySelectorAll("td");

table.forEach(cell => {
    var ID = cell.id;
    var xy = ID.split('-');
    var row = parseInt(xy[0]-1);
    var col = parseInt(xy[1]-1);
    console.log(s.board[row][col])
    var cellValue = s.board[row][col];
    cell.textContent = cellValue;

    cell.addEventListener('click', (a) => {
        var ID = cell.id;
        var xy = ID.split('-');
        var row = parseInt(xy[0]-1);
        var col = parseInt(xy[1]-1);
        // console.log(a.target.id);
        console.log(row, col, parseInt(selected))
        var success = s.gameLoop(col, row, selected)
        var e = document.getElementById("response");
        if (success) {
            e.innerHTML = "Success!";
            e.classList.add('success');
        } else {
            e.innerHTML = "Incorrect!";
            e.classList.add('fail');
        }
        var cellValue = s.board[row][col];
        cell.textContent = cellValue;
    })
});

all_choices = document.querySelectorAll(".chosenNum")

all_choices.forEach(bt => (
    bt.addEventListener('click', (a) => {
        selected = a.target.id
        console.log(selected);
    })
))