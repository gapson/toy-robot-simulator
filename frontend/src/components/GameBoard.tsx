import React from "react";
import "./GameBoard.css";
import { RobotState } from "../types/robot";

interface GameBoardProps {
  robotState: RobotState;
  onCellClick: (x: number, y: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ robotState, onCellClick }) => {
  const renderRobot = () => {
    const arrows = {
      NORTH: "↑",
      EAST: "→",
      SOUTH: "↓",
      WEST: "←",
    };

    return (
      <div className="robot">
        <span className="robot-arrow">
          {arrows[robotState.facing as keyof typeof arrows] || "↑"}
        </span>
      </div>
    );
  };

  const renderGrid = () => {
    const grid = [];
    // Render from top to bottom (y=4 to y=0)
    for (let y = 4; y >= 0; y--) {
      const row = [];
      for (let x = 0; x <= 4; x++) {
        const isRobotHere =
          robotState.isPlaced && robotState.x === x && robotState.y === y;
        row.push(
          <div
            key={`${x}-${y}`}
            className={`grid-cell ${isRobotHere ? "has-robot" : ""}`}
            onClick={() => onCellClick(x, y)}
            data-testid={`cell-${x}-${y}`}
          >
            <span className="coordinates">
              {x},{y}
            </span>
            {isRobotHere && renderRobot()}
          </div>,
        );
      }
      grid.push(
        <div key={y} className="grid-row">
          {row}
        </div>,
      );
    }
    return grid;
  };

  return (
    <div className="game-board">
      <div className="grid-container">{renderGrid()}</div>
    </div>
  );
};

export default GameBoard;
