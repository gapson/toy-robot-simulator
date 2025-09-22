import { Controller, Get, Post, Body, Put } from "@nestjs/common";
import { RobotService, RobotState } from "./robot.service";

@Controller("robot")
export class RobotController {
  constructor(private readonly robotService: RobotService) {}

  @Get("position")
  async getCurrentPosition(): Promise<RobotState> {
    return await this.robotService.getCurrentPosition();
  }

  @Post("place")
  async placeRobot(
    @Body() body: { x: number; y: number; facing?: string },
  ): Promise<RobotState> {
    return await this.robotService.placeRobot(body.x, body.y, body.facing);
  }

  @Put("move")
  async moveRobot(): Promise<RobotState> {
    return await this.robotService.moveRobot();
  }

  @Put("rotate")
  async rotateRobot(
    @Body() body: { direction: "LEFT" | "RIGHT" },
  ): Promise<RobotState> {
    return await this.robotService.rotateRobot(body.direction);
  }

  @Get("history")
  async getHistory() {
    return await this.robotService.getHistory();
  }
}
