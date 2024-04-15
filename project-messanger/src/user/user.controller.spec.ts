import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDBModule } from './user.db';
import {
  UserId,
  defaultUser,
  removeUser,
  userTest,
} from './helpers/user.fixtures';
import { UserDocument } from './user.schema';
import { RedisModule } from '../redis.module';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserDBModule, RedisModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = UserId;
      const user = userTest();
      jest.spyOn(service, 'findOne').mockImplementation(async () => user);
      expect(await controller.findOne(id)).toBe(user);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [defaultUser(), userTest()];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('create User', () => {
    it('should create a new user', async () => {
      const user = userTest();
      jest.spyOn(service, 'create').mockImplementation(async () => user);
      expect(await controller.create(user)).toBe(user);
    });
  });

  describe('update User by Id', () => {
    it('should update a user by Id', async () => {
      const id = UserId;
      const user = userTest().toString();
      jest.spyOn(service, 'update').mockImplementation(async () => user);
      expect(await controller.update(user, id as unknown as UserDocument)).toBe(
        user,
      );
    });
  });

  describe('delete User by Id', () => {
    it('should delete a user by ID', async () => {
      const user = removeUser();
      jest.spyOn(service, 'remove').mockImplementation(async () => user);
      expect(await controller.remove(user.id)).toBe(user);
    });
  });
});
