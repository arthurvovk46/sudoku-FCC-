class SudokuSolver {

  validate(puzzle, coordinate, value) {
    
    if (/^[1-9.]+$/.test(puzzle)) {

      if (puzzle.length !== 81) {
        
        return { error: 'Expected puzzle to be 81 characters long' }
      }
    } else {

      return { error: 'Invalid characters in puzzle' }
    }
    if (coordinate && value) {
      
      if (/^[A-I][1-9]$/.test(coordinate)) {
        
        if (!/^[1-9]$/.test(value)) {
          
          return { error: 'Invalid value' }
        }
      } else {
        
        return { error: 'Invalid coordinate' }
      }
    } 
    return true
  }

  checkRowPlacement(puzzle, row, column, value) {

    const rowIdx = row.charCodeAt(0) - 'A'.charCodeAt(0);

    for (let i = 0; i < 9; i++) {
      
      const index = rowIdx * 9 + i;
      
      if (puzzle[index] === value 
          &&i !== (column.charCodeAt(0) - '1'.charCodeAt(0))) return "row"
    }
    return true
  }

  checkColPlacement(puzzle, row, column, value) {

    const colIdx = column.charCodeAt(0) - '1'.charCodeAt(0);

    for (let i = 0; i < 9; i++) {
      
      const index = colIdx + 9 * i;
      
      if (puzzle[index] === value 
          && i !== (row.charCodeAt(0) - 'A'.charCodeAt(0))) return "column"
    }
    return true
  }

  checkRegionPlacement(puzzle, row, column, value) {

    const rowStart = Math.floor((row.charCodeAt(0) - 'A'.charCodeAt(0)) / 3) * 3;
    const colStart = Math.floor((column.charCodeAt(0) - '1'.charCodeAt(0)) / 3) * 3;

    for (let i = rowStart; i < rowStart + 3; i++) {
      
      for (let j = colStart; j < colStart + 3; j++) {
        
        const index = j + 9 * i;
        
        if (puzzle[index] === value &&
            !(i === (row.charCodeAt(0) - 'A'.charCodeAt(0)) &&
            j === (column.charCodeAt(0) - '1'.charCodeAt(0)))) return "region"
      }
    }
    return true
  }

  solve(puzzle) {
    
    const SIZE = 9;
    const EMPTY = '.';
    const board = [];
    let row = [];
    let counter = 0;

    function isValid(board, row, col, num) {
      
      for (let i = 0; i < SIZE; i++) {
        
        if (board[row][i] === num ||
            board[i][col] === num || 
            board[row - row % 3 + Math.floor(i / 3)]
                 [col - col % 3 + i % 3] === num) return false
      }
      return true
    }
    function solve(board) {
      
      for (let row = 0; row < SIZE; row++) {
        
        for (let col = 0; col < SIZE; col++) {
          
          if (board[row][col] === EMPTY) {
            
            for (let num = 1; num <= SIZE; num++) {
              
              if (isValid(board, row, col, num.toString())) {
                
                board[row][col] = num.toString();
                
                if (solve(board)) return true
                
                board[row][col] = EMPTY;
              }
            }
            return false
          }
        }
      }
      return true
    }
    for (let i = 0; i < puzzle.length; i++) {
      
      if (counter % SIZE === 0 && counter !== 0) {
        
        board.push(row);
        row = [];
      }
      row.push(puzzle[i]);
      counter++;
    }
    board.push(row);

    if (solve(board)) {
      
      return { solution: board.flat().join('') }
    
    } else {
      
      return { error: 'Puzzle cannot be solved' }
    }
  }
}
module.exports = SudokuSolver;
