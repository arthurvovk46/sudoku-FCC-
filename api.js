'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      
      const { puzzle, coordinate, value } = req.body;
      
      try {

        if (!puzzle || !coordinate || !value) {

          res.json({ error: 'Required field(s) missing' });

        } else if (solver.validate(puzzle, coordinate, value) === true) {

          const [row, column] = coordinate;
          const rowConflict = solver.checkRowPlacement(puzzle, row, column, value);
          const colConflict = solver.checkColPlacement(puzzle, row, column, value);
          const regionConflict = solver.checkRegionPlacement(puzzle, row, column, value);
          let response = { valid: true, conflict: [] };
          
          if (rowConflict !== true) {
            
            response.valid = false;
            response.conflict.push(rowConflict);
          }
          if (colConflict !== true) {
            
            response.valid = false;
            response.conflict.push(colConflict);
          }
          if (regionConflict !== true) {
            
            response.valid = false;
            response.conflict.push(regionConflict);
          }
          if (response.valid) {
            
            delete response.conflict;
          }
          res.json(response);

        } else {
          
          res.json(solver.validate(puzzle, coordinate, value));
        }
      } catch (error) {

        console.error(error);
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {

      const { puzzle } = req.body;

      try {

        if (!puzzle) {
          
          res.json({ error: 'Required field missing' });

        } else if (solver.validate(puzzle) === true) {
          
          res.json(solver.solve(puzzle));
          
        } else {

          res.json(solver.validate(puzzle));
        }
      } catch (error) {

        console.error(error);
      }
    });
};
