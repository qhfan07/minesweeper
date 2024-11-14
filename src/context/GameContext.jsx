import React, { createContext, useState, useCallback } from 'react';
import { generateGrid } from '../utils/generateGrid';
import { calculateAdjacentMines } from '../utils/calculateAdjacentMines';
import { revealSafeCells } from '../utils/revealSafeCells';
import { checkWinCondition } from '../utils/checkWinCondition';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [remainingMines, setRemainingMines] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true); // 标记第一次点击
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [hoveredCell, setHoveredCell] = useState(null);

  // 用 useCallback 包裹 initializeGrid，防止不必要的重新创建
  const initializeGrid = useCallback((rows, cols, mines) => {
    const newGrid = generateGrid(rows, cols, mines);
    setGrid(newGrid);
    setRemainingMines(mines);
    setGameOver(false);
    setIsWin(false);
    setIsFirstClick(true); // 每次初始化时重置为首次点击
  }, []);

  // 设置当前难度的函数
  const updateDifficulty = useCallback((difficulty) => {
    setCurrentDifficulty(difficulty);
  }, []);

  const handleCellClick = (row, col) => {
    if (gameOver || grid[row][col].isFlagged || grid[row][col].isSelected) return;

    // 在第一次点击时生成雷阵，并确保初始点击无雷
    if (isFirstClick) {
      const rows = grid.length;
      const cols = grid[0].length;
      const totalMines = remainingMines;
      const newGrid = generateGrid(rows, cols, totalMines, { row, col });
      setGrid(newGrid);
      setIsFirstClick(false);
  
      // 手动设置第一次点击的格子为已揭示状态
      newGrid[row][col].isSelected = true;
      newGrid[row][col].adjacentMines = calculateAdjacentMines(newGrid, row, col);
      setGrid(newGrid);
      return;
    }
  
    const updatedGrid = [...grid];

    if (updatedGrid[row][col].isMine) {
      setGameOver(true); // 如果点击到雷，游戏结束
      updatedGrid[row][col].isSelected = true;
    } else {
      updatedGrid[row][col].isSelected = true;
      updatedGrid[row][col].adjacentMines = calculateAdjacentMines(updatedGrid, row, col); // 仅计算当前格子的雷数
    }

    setGrid(updatedGrid);

    if (checkWinCondition(updatedGrid)) {
      setIsWin(true);
      setGameOver(true);
    }
  };

  const handleFlagCell = (row, col) => {
    if (gameOver || grid[row][col].isSelected) return;

    const updatedGrid = [...grid];
    updatedGrid[row][col].isFlagged = !updatedGrid[row][col].isFlagged;
    setRemainingMines((prev) => prev + (updatedGrid[row][col].isFlagged ? -1 : 1));
    setGrid(updatedGrid);
  };

  const handleMouseEnter = (row, col) => setHoveredCell({ row, col });
  const handleMouseLeave = () => setHoveredCell(null);

  return (
    <GameContext.Provider
      value={{
        grid,
        gameOver,
        isWin,
        remainingMines,
        currentDifficulty,
        setCurrentDifficulty: updateDifficulty,
        initializeGrid,
        handleCellClick,
        handleFlagCell,
        hoveredCell,
        setGameOver,
        setIsWin,
        handleMouseEnter,
        handleMouseLeave,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
