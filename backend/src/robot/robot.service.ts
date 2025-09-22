import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RobotPosition } from "./robot.entity";

export interface RobotState {
  x: number;
  y: number;
  facing: string;
  isPlaced: boolean;
}

@Injectable()
export class RobotService {
  private directions = ["NORTH", "EAST", "SOUTH", "WEST"];

  constructor(
    @InjectRepository(RobotPosition)
    private robotRepository: Repository<RobotPosition>,
  ) {}

  async getCurrentPosition(): Promise<RobotState> {
    const activePosition = await this.robotRepository.findOne({
      where: { isActive: true },
      order: { timestamp: "DESC" },
    });

    if (!activePosition) {
      return { x: 0, y: 0, facing: "NORTH", isPlaced: false };
    }

    return {
      x: activePosition.x,
      y: activePosition.y,
      facing: activePosition.facing,
      isPlaced: true,
    };
  }

  async placeRobot(
    x: number,
    y: number,
    facing: string = "NORTH",
  ): Promise<RobotState> {
    if (!this.isValidPosition(x, y)) {
      const current = await this.getCurrentPosition();
      return current;
    }

    // Deactivate previous positions
    await this.robotRepository.update({ isActive: true }, { isActive: false });

    // Create new position
    const newPosition = this.robotRepository.create({
      x,
      y,
      facing: facing.toUpperCase(),
      isActive: true,
    });

    await this.robotRepository.save(newPosition);
    return { x, y, facing: facing.toUpperCase(), isPlaced: true };
  }

  async moveRobot(): Promise<RobotState> {
    const current = await this.getCurrentPosition();

    if (!current.isPlaced) {
      return current;
    }

    let newX = current.x;
    let newY = current.y;

    switch (current.facing) {
      case "NORTH":
        newY += 1;
        break;
      case "SOUTH":
        newY -= 1;
        break;
      case "EAST":
        newX += 1;
        break;
      case "WEST":
        newX -= 1;
        break;
    }

    if (!this.isValidPosition(newX, newY)) {
      return current;
    }

    return await this.placeRobot(newX, newY, current.facing);
  }

  async rotateRobot(direction: "LEFT" | "RIGHT"): Promise<RobotState> {
    const current = await this.getCurrentPosition();

    if (!current.isPlaced) {
      return current;
    }

    const currentIndex = this.directions.indexOf(current.facing);
    let newIndex;

    if (direction === "LEFT") {
      newIndex =
        (currentIndex - 1 + this.directions.length) % this.directions.length;
    } else {
      newIndex = (currentIndex + 1) % this.directions.length;
    }

    const newFacing = this.directions[newIndex];
    return await this.placeRobot(current.x, current.y, newFacing);
  }

  async getHistory(): Promise<RobotPosition[]> {
    return await this.robotRepository.find({
      order: { timestamp: "DESC" },
      take: 50,
    });
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x <= 4 && y >= 0 && y <= 4;
  }
}
