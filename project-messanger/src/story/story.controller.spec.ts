import { Test, TestingModule } from '@nestjs/testing';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { RedisModule } from '../redis.module';
import { StoryDBModule } from './story.db';
import { defaultStory, removeStory, storyId } from './helpers/story.fixtures';
import { StoryDocument } from './story.schema';

describe('StoryController', () => {
  let controller: StoryController;
  let service: StoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StoryDBModule, RedisModule],
      controllers: [StoryController],
      providers: [StoryService],
    }).compile();

    controller = module.get<StoryController>(StoryController);
    service = module.get<StoryService>(StoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a story by id', async () => {
      const id = storyId;
      const story = defaultStory;
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => story as StoryDocument);
      expect(await controller.findOne(id)).toBe(story);
    });
  });

  describe('create Story', () => {
    it('should create a new story', async () => {
      const story = defaultStory;
      jest
        .spyOn(service, 'create')
        .mockImplementation(async (story) => story as StoryDocument);
      expect(await controller.create(story, {})).toBe(story);
    });
  });

  describe('delete story by Id', () => {
    it('should delete a story by ID', async () => {
      const story = removeStory;
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => story as StoryDocument);
      expect(await controller.remove(story.id)).toEqual(story);
    });
  });
});
