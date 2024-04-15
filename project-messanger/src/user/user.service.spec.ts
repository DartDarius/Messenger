import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDBModule } from './user.db';
import {
  defaultUser,
  defaultName,
  UserId,
  updateUser,
  userTest,
} from './helpers/user.fixtures';
import { RedisModule } from '../redis.module';

describe('UserService', () => {
  let service: UserService;

  async function createUserAndGetId(userDto = defaultUser()) {
    const createdUser = await service.create(userDto);
    return createdUser._id.toString();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserDBModule, RedisModule],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should created a user', async () => {
    const createUserDto = defaultUser();
    const createUser = await service.create(createUserDto);
    expect(createUser).toBeDefined();
    expect(createUser.name).toBeDefined();
  });

  afterEach(async () => {
    await service.deleteUserByName(defaultName);
    await service.deleteUserByName(updateUser.toString());
  });

  it('should return all users', async () => {
    const users = await service.findAll();
    expect(users).toBeInstanceOf(Array);
  });

  it('should return a user by id', async () => {
    const userDto = defaultUser();
    const userById = await createUserAndGetId(userDto);
    const result = await service.findOne(userById);
    expect(result).toBeDefined();
  });

  it('should update user by id', async () => {
    const userDto = userTest();
    const userById = await createUserAndGetId(userDto);
    const user = await service.update(userById, updateUser());
    expect(user?.name).toBeTruthy();
    expect(user?.lastName).toBeTruthy();
  });

  it('should delete a user by id', async () => {
    const user = UserId;
    const result = await service.remove(user);
    expect(result).toBeDefined();
  });
});
