import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RobotService } from './robot.service';
import { RobotPosition } from './robot.entity';

describe('RobotService', () => {
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
    repository = module.get<Repository<RobotPosition>>(getRepositoryToken(RobotPosition));

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('placeRobot', () => {
    it('should place robot at valid position', async () => {
      const mockPosition = { x: 1, y: 1, facing: 'NORTH', isActive: true };
      mockRepository.create.mockReturnValue(mockPosition);
      mockRepository.save.mockResolvedValue(mockPosition);

      const result = await service.placeRobot(1, 1, 'NORTH');

      expect(result).toEqual({ x: 1, y: 1, facing: 'NORTH', isPlaced: true });
      expect(mockRepository.update).toHaveBeenCalledWith({ isActive: true }, { isActive: false });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should reject invalid positions', async () => {
      // Mock getCurrentPosition to return unplaced robot for invalid position
      mockRepository.findOne.mockResolvedValue(null);
      
      const result = await service.placeRobot(-1, 0, 'NORTH');
      
      expect(result).toEqual({ x: 0, y: 0, facing: 'NORTH', isPlaced: false });
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('moveRobot', () => {
    it('should move robot north when facing north', async () => {
      const currentPosition = { x: 1, y: 1, facing: 'NORTH', isActive: true };
      const newPosition = { x: 1, y: 2, facing: 'NORTH', isActive: true };
      
      mockRepository.findOne.mockResolvedValue(currentPosition);
      mockRepository.create.mockReturnValue(newPosition);
      mockRepository.save.mockResolvedValue(newPosition);

      const result = await service.moveRobot();

      expect(result).toEqual({ x: 1, y: 2, facing: 'NORTH', isPlaced: true });
    });

    it('should not move robot off the table', async () => {
      const currentPosition = { x: 0, y: 4, facing: 'NORTH', isActive: true };
      
      mockRepository.findOne.mockResolvedValue(currentPosition);

      const result = await service.moveRobot();

      expect(result).toEqual({ x: 0, y: 4, facing: 'NORTH', isPlaced: true });
    });
  });

  describe('rotateRobot', () => {
    it('should rotate left correctly', async () => {
      const currentPosition = { x: 1, y: 1, facing: 'NORTH', isActive: true };
      const newPosition = { x: 1, y: 1, facing: 'WEST', isActive: true };
      
      mockRepository.findOne.mockResolvedValue(currentPosition);
      mockRepository.create.mockReturnValue(newPosition);
      mockRepository.save.mockResolvedValue(newPosition);

      const result = await service.rotateRobot('LEFT');

      expect(result.facing).toBe('WEST');
    });

    it('should rotate right correctly', async () => {
      const currentPosition = { x: 1, y: 1, facing: 'NORTH', isActive: true };
      const newPosition = { x: 1, y: 1, facing: 'EAST', isActive: true };
      
      mockRepository.findOne.mockResolvedValue(currentPosition);
      mockRepository.create.mockReturnValue(newPosition);
      mockRepository.save.mockResolvedValue(newPosition);

      const result = await service.rotateRobot('RIGHT');

      expect(result.facing).toBe('EAST');
    });
  });
});