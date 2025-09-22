export interface RobotState {
  x: number;
  y: number;
  facing: string;
  isPlaced: boolean;
}

export interface RobotPosition {
  id: number;
  x: number;
  y: number;
  facing: string;
  isActive: boolean;
  timestamp: string;
}
