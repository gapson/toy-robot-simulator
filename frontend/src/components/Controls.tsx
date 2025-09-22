import React, { useEffect } from "react";
import "./Controls.css";
import { RobotState } from "../types/robot";

interface ControlsProps {
  robotState: RobotState;
  onMove: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReport: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  robotState,
  onMove,
  onRotateLeft,
  onRotateRight,
  onReport,
}) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!robotState.isPlaced) return;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          onMove();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onRotateLeft();
          break;
        case "ArrowRight":
          event.preventDefault();
          onRotateRight();
          break;
        case " ":
          event.preventDefault();
          onReport();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [robotState.isPlaced, onMove, onRotateLeft, onRotateRight, onReport]);

  return (
    <div className="controls">
      <div className="status-panel">
        <h3>Robot Status</h3>
        <div className="status-info">
          {robotState.isPlaced ? (
            <div>
              <p>
                <strong>Position:</strong> ({robotState.x}, {robotState.y})
              </p>
              <p>
                <strong>Facing:</strong> {robotState.facing}
              </p>
            </div>
          ) : (
            <p>
              <em>Robot not placed. Click on the grid to place it.</em>
            </p>
          )}
        </div>
      </div>

      <div className="control-buttons">
        <h3>Controls</h3>
        <div className="button-grid">
          <button
            onClick={onMove}
            disabled={!robotState.isPlaced}
            className="control-btn move-btn"
            data-testid="move-button"
          >
            MOVE (↑)
          </button>
          <button
            onClick={onRotateLeft}
            disabled={!robotState.isPlaced}
            className="control-btn rotate-btn"
            data-testid="left-button"
          >
            LEFT (←)
          </button>
          <button
            onClick={onRotateRight}
            disabled={!robotState.isPlaced}
            className="control-btn rotate-btn"
            data-testid="right-button"
          >
            RIGHT (→)
          </button>
          <button
            onClick={onReport}
            disabled={!robotState.isPlaced}
            className="control-btn report-btn"
            data-testid="report-button"
          >
            REPORT (Space)
          </button>
        </div>
        <div className="instructions">
          <p>
            <small>Use arrow keys or buttons to control the robot</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
