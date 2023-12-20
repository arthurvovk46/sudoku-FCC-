const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

suite('Unit Tests', () => {

  const puzzleValid = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  const puzzleInvChar = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..600";
  const puzzleInvLen = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6";
  const puzzleInvalid = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..666";
  const solution = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
  
  suite('1. Puzzle string validation', () => {

    test("1) valid puzzle string of 81 characters", () => {

      assert.isTrue(solver.validate(puzzleValid));
    });

    test("2) puzzle string with invalid characters", () => {

      assert.property(solver.validate(puzzleInvChar), 'error');
      assert.equal(solver.validate(puzzleInvChar).error, 'Invalid characters in puzzle');
    });

    test("3) puzzle string that is not 81 characters in length", () => {

      assert.property(solver.validate(puzzleInvLen), 'error');
      assert.equal(
        solver.validate(puzzleInvLen).error,
        'Expected puzzle to be 81 characters long'
      );
    });
  });
  
  suite('2. Row placement validation', () => {

    test("4) valid row placement", () => {

      assert.isTrue(solver.checkRowPlacement(puzzleValid, "A", "1", "7"));
    });

    test("5) invalid row placement", () => {

      assert.equal(solver.checkRowPlacement(puzzleValid, "A", "1", "1"), "row");
    });

  });

  suite('3. Column placement validation', () => {

    test("6) valid column placement", () => {

      assert.isTrue(solver.checkColPlacement(puzzleValid, "A", "1", "7"));
    });

    test("7) invalid column placement", () => {

      assert.equal(solver.checkColPlacement(puzzleValid, "A", "1", "1"), "column");
    });

  });

  suite('4. Region placement validation', () => {

    test("8) valid region placement", () => {

      assert.isTrue(solver.checkRegionPlacement(puzzleValid, "A", "1", "7"));
    });

    test("9) invalid region placement", () => {

      assert.equal(solver.checkRegionPlacement(puzzleValid, "A", "1", "9"), "region");
    });

  });

  suite('5. Solver validation', () => {

    test("10) valid puzzle string pass the solver", () => {

      assert.property(solver.solve(puzzleValid), "solution");
      assert.equal(solver.solve(puzzleValid).solution.length, 81);
    });

    test("11) invalid puzzle strings fail the solver", () => {

      assert.property(solver.solve(puzzleInvalid), "error");
      assert.equal(solver.solve(puzzleInvalid).error, 'Puzzle cannot be solved');
    });

    test("12) Solver returns the expected solution", () => {

      assert.property(solver.solve(puzzleValid), "solution");
      assert.equal(solver.solve(puzzleValid).solution, solution);
    });
  });
});
