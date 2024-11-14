
export const generateGrid = (rows, cols, totalMines, avoidFirstClick = null) => {
    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isMine: false,
        isSelected: false,
        isFlagged: false,
        adjacentMines: 0,
      }))
    );//初始化网格属性值
  
    let placedMines = 0;
    while (placedMines < totalMines) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);
  
      // 确保首次点击的这个格子不含地雷：randow为首次点击位置时直接跳过放置地雷循环
      if (avoidFirstClick && randomRow === avoidFirstClick.row && randomCol === avoidFirstClick.col) {
        continue;
      }
  
      if (!grid[randomRow][randomCol].isMine) {
        grid[randomRow][randomCol].isMine = true;
        placedMines++;
      }
    }
  
    return grid;
  };

  export function calculateAdjacentMines(grid) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
  
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].isMine) continue;
  
        let mineCount = 0;
        for (let [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;
          if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
            if (grid[newRow][newCol].isMine) {
              mineCount++;
            }
          }
        }
        grid[row][col].adjacentMines = mineCount;
      }
    }
  
    return grid;
  }
  
  // 递归揭露安全单元格
  export function revealSafeCells(grid, row, col) {
    if (grid[row][col].isSelected || grid[row][col].isMine) return grid;
  
    grid[row][col].isSelected = true;
  
    if (grid[row][col].adjacentMines === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
  
      for (let [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
          revealSafeCells(grid, newRow, newCol);
        }
      }
    }
  
    return grid;
  }
  
  // 检查是否所有非地雷的单元格都被揭露
  export function checkWinCondition(grid) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];
        if (!cell.isMine && !cell.isSelected) {
          return false; // 仍有未揭露的安全单元格
        }
      }
    }
    return true; // 所有安全单元格都已揭露
  }
  