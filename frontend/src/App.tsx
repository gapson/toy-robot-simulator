import React, { useState, useEffect } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import Controls from "./components/Controls";
import { robotApi } from "./services/api";
import { RobotState } from "./types/robot";

const App: React.FC = () => {
  const [robotState, setRobotState] = useState<RobotState>({
    x: 0,
    y: 0,
    facing: "NORTH",
    isPlaced: false,
  });

  const [reportMessage, setReportMessage] = useState<string>("");

  useEffect(() => {
    loadRobotPosition();
  }, []);

  const loadRobotPosition = async () => {
    try {
      const position = await robotApi.getCurrentPosition();
      setRobotState(position);
    } catch (error) {
      console.error("Failed to load robot position:", error);
    }
  };

  const handleCellClick = async (x: number, y: number) => {
    try {
      const newState = await robotApi.placeRobot(x, y, "NORTH");
      setRobotState(newState);
      setReportMessage("");
    } catch (error) {
      console.error("Failed to place robot:", error);
    }
  };

  const handleMove = async () => {
    try {
      const newState = await robotApi.moveRobot();
      setRobotState(newState);
    } catch (error) {
      console.error("Failed to move robot:", error);
    }
  };

  const handleRotateLeft = async () => {
    try {
      const newState = await robotApi.rotateRobot("LEFT");
      setRobotState(newState);
    } catch (error) {
      console.error("Failed to rotate robot left:", error);
    }
  };

  const handleRotateRight = async () => {
    try {
      const newState = await robotApi.rotateRobot("RIGHT");
      setRobotState(newState);
    } catch (error) {
      console.error("Failed to rotate robot right:", error);
    }
  };

  const handleReport = () => {
    if (robotState.isPlaced) {
      const message = `${robotState.x},${robotState.y},${robotState.facing}`;
      setReportMessage(message);
      alert(`Robot Report: ${message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Toy Robot Simulator</h1>
        <p>
          Click on the grid to place the robot, then use controls to move it
          around!
        </p>
      </header>

      <div className="game-container">
        <GameBoard robotState={robotState} onCellClick={handleCellClick} />
        <Controls
          robotState={robotState}
          onMove={handleMove}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onReport={handleReport}
        />
      </div>

      {reportMessage && (
        <div className="report-display">
          <strong>Latest Report:</strong> {reportMessage}
        </div>
      )}

      <footer className="instructions-footer">
        <h3>Instructions:</h3>
        <ul>
          <li>Click any cell on the 5x5 grid to place the robot</li>
          <li>Use MOVE button or ↑ arrow key to move forward</li>
          <li>Use LEFT/RIGHT buttons or ← → arrow keys to rotate</li>
          <li>Use REPORT button or spacebar to get current position</li>
          <li>Robot cannot fall off the table - invalid moves are ignored</li>
        </ul>
      </footer>
    </div>
  );
};

export default App;
