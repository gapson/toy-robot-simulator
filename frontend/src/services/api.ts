import axios from "axios";
import { RobotState, RobotPosition } from "../types/robot";

const API_BASE = "http://localhost:3001";

export const robotApi = {
  getCurrentPosition: async (): Promise<RobotState> => {
    const response = await axios.get(`${API_BASE}/robot/position`);
    return response.data;
  },

  placeRobot: async (
    x: number,
    y: number,
    facing: string = "NORTH",
  ): Promise<RobotState> => {
    const response = await axios.post(`${API_BASE}/robot/place`, {
      x,
      y,
      facing,
    });
    return response.data;
  },

  moveRobot: async (): Promise<RobotState> => {
    const response = await axios.put(`${API_BASE}/robot/move`);
    return response.data;
  },

  rotateRobot: async (direction: "LEFT" | "RIGHT"): Promise<RobotState> => {
    const response = await axios.put(`${API_BASE}/robot/rotate`, { direction });
    return response.data;
  },

  getHistory: async (): Promise<RobotPosition[]> => {
    const response = await axios.get(`${API_BASE}/robot/history`);
    return response.data;
  },
};
