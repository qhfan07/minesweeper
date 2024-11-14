export const generateGrid = (rows, cols, totalMines, avoidFirstClick = null) => {
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isSelected: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  // 生成所有可用位置的列表（避免首次点击位置）
  const availablePositions = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!(avoidFirstClick && row === avoidFirstClick.row && col === avoidFirstClick.col)) {
        availablePositions.push({ row, col });
      }
    }
  }

  // 确保只放置指定数量的地雷
  for (let i = 0; i < totalMines; i++) {
    // 从可用位置中随机选择一个位置来放置地雷
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const { row, col } = availablePositions.splice(randomIndex, 1)[0];
    grid[row][col].isMine = true;
  }

  return grid;
};
