//子组件Board 接收父组件GamePage传来的 props 并将它们传递给它的子组件 Cell 组件，渲染多个Cell组件，形成网格：
import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import Cell from './Cell';
import '../styles/board.css';

const Board = () => {
  const { grid, currentDifficulty, handleCellClick, handleFlagCell } = useContext(GameContext);

  return (
    <div className={`board ${currentDifficulty}`}>
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            onCellClick={handleCellClick} // 确保正确传递
            onFlagCell={handleFlagCell}   // 确保正确传递
          />
        ))
      )}
    </div>
  );
};

export default Board;
