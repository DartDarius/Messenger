import { Test, TestingModule } from '@nestjs/testing';
import { StoryService } from './story.service';
import { StoryDBModule } from './story.db';
import { RedisModule } from '../redis.module';
import {
  defaultStory,
  authUser,
  defaultInfo,
  storyId,
} from './helpers/story.fixtures';

describe('StoryService', () => {
  let service: StoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StoryDBModule, RedisModule],
      providers: [StoryService],
    }).compile();

    service = module.get<StoryService>(StoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a story', async () => {
    const createdStory = await service.create(defaultStory, authUser);
    const { author } = createdStory;
    expect(createdStory).toEqual(createdStory);
    expect(author).toEqual(authUser);
  });

  afterEach(async () => {
    await service.deleteStoryByInfo(defaultInfo);
  });

  it('should return story by Id', async () => {
    const storyById = await service.findOne(storyId);
    expect(storyById).toEqual(storyById);
  });

  it('should remove chat by Id', async () => {
    const story = storyId;
    const result = await service.remove(story);
    expect(result).toBeDefined();
  });
});
