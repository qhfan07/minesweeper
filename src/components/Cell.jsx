// 单个网格单元格，Cell 组件使用接收到的 props 来渲染自身状态，并处理用户交互（如点击或右键标记）：
// 通过 onClick 和 onContextMenu 等事件，调用 props 中传入的回调函数，触发父组件提供的逻辑（揭开或标记单元格）。
// 用户点击 Cell 组件，触发 onCellClick 回调。Cell 调用传入的 onCellClick，父组件 Board 处理并通知 GamePage 中的 handleCellClick 函数。
// handleCellClick 更新 GameContext 中的 grid 状态，并通知所有订阅 GameContext 的组件重新渲染。
import React from 'react';
import '../styles/cell.css';

const Cell = ({ cell, row, col, onCellClick, onFlagCell }) => {
  const handleLeftClick = () => {
    if (onCellClick) {
      onCellClick(row, col); // 触发回调，通知 Board
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (onFlagCell) {
      onFlagCell(row, col); // 触发回调，标记旗帜
    }
  };

  const getCellDisplay = () => {
    if (cell.isFlagged) {
      return '🚩';
    }
    if (cell.isSelected) {
      return cell.isMine ? '💣' : cell.adjacentMines !== undefined ? cell.adjacentMines : '';
    }
    return '';
  };

  return (
    <div
      className={`cell ${cell.isSelected ? 'selected' : 'unselected'}`}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
    >
      {getCellDisplay()}
    </div>
  );
};

export default Cell;

  