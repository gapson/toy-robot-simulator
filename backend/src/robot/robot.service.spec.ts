import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RobotService } from "./robot.service";
import { RobotPosition } from "./robot.entity";

describe("RobotService", () => {
  let service: RobotService;
  let repository: Repository<RobotPosition>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RobotService,
        {
          provide: getRepositoryToken(RobotPosition),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RobotService>(RobotService);
    repository = module.get<Repository<RobotPosition>>(
      getRepositoryToken(RobotPosition),
    );
  });

  describe("placeRobot", () => {
    it("should place robot at valid position", async () => {
      mockRepository.create.mockReturnValue({ x: 1, y: 1, facing: "NORTH" });
      mockRepository.save.mockResolvedValue({ x: 1, y: 1, facing: "NORTH" });

      const result = await service.placeRobot(1, 1, "NORTH");

      expect(result).toEqual({ x: 1, y: 1, facing: "NORTH", isPlaced: true });
      expect(mockRepository.update).toHaveBeenCalledWith(
        { isActive: true },
        { isActive: false },
      );
    });

    it("should reject invalid positions", async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.placeRobot(-1, 0, "NORTH");

      expect(result.isPlaced).toBe(false);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("moveRobot", () => {
    it("should move robot north when facing north", async () => {
      mockRepository.findOne.mockResolvedValue({
        x: 1,
        y: 1,
        facing: "NORTH",
        isActive: true,
      });
      mockRepository.create.mockReturnValue({ x: 1, y: 2, facing: "NORTH" });
      mockRepository.save.mockResolvedValue({ x: 1, y: 2, facing: "NORTH" });

      const result = await service.moveRobot();

      expect(result).toEqual({ x: 1, y: 2, facing: "NORTH", isPlaced: true });
    });

    it("should not move robot off the table", async () => {
      mockRepository.findOne.mockResolvedValue({
        x: 0,
        y: 4,
        facing: "NORTH",
        isActive: true,
      });

      const result = await service.moveRobot();

      expect(result).toEqual({ x: 0, y: 4, facing: "NORTH", isPlaced: true });
    });
  });

  describe("rotateRobot", () => {
    it("should rotate left correctly", async () => {
      mockRepository.findOne.mockResolvedValue({
        x: 1,
        y: 1,
        facing: "NORTH",
        isActive: true,
      });
      mockRepository.create.mockReturnValue({ x: 1, y: 1, facing: "WEST" });
      mockRepository.save.mockResolvedValue({ x: 1, y: 1, facing: "WEST" });

      const result = await service.rotateRobot("LEFT");

      expect(result.facing).toBe("WEST");
    });

    it("should rotate right correctly", async () => {
      mockRepository.findOne.mockResolvedValue({
        x: 1,
        y: 1,
        facing: "NORTH",
        isActive: true,
      });
      mockRepository.create.mockReturnValue({ x: 1, y: 1, facing: "EAST" });
      mockRepository.save.mockResolvedValue({ x: 1, y: 1, facing: "EAST" });

      const result = await service.rotateRobot("RIGHT");

      expect(result.facing).toBe("EAST");
    });
  });
});
