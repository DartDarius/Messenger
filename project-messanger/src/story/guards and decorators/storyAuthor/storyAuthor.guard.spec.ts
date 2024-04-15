import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { StoryService } from '../../story.service';
import { StoryDocument } from '../../story.schema';
import { Reflector } from '@nestjs/core';
import { AuthorStoryGuard } from './storyAuthor.guard';
import { StoryDBModule } from '../../story.db';
import { RedisModule } from '../../../redis.module';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { getMockContext } from '../../helpers/getMockContext';

describe('AuthorStoryGuard', () => {
  let authorStoryGuard: AuthorStoryGuard;
  let reflector: Reflector;
  let storyService: StoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StoryDBModule, RedisModule],
      providers: [
        AuthorStoryGuard,
        StoryService,
        Reflector,
        JwtStrategy,
        ConfigService,
      ],
    }).compile();

    authorStoryGuard = module.get<AuthorStoryGuard>(AuthorStoryGuard);
    storyService = module.get<StoryService>(StoryService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(authorStoryGuard).toBeDefined();
  });

  it('should return true without metadata', async () => {
    const storyId = 'storyId';
    const authorId = 'authorId';
    const mockContext = getMockContext(storyId, authorId);

    jest.spyOn(reflector, 'get').mockImplementation(() => false);

    await expect(authorStoryGuard.canActivate(mockContext)).toBeTruthy();
  });

  it('should throw Forbidden Exception if user is not author of a story', async () => {
    const storyId = 'storyId';
    const _id = '_id';
    const authorId = 'authorId';
    const mockContext = getMockContext(storyId, authorId);

    jest.spyOn(reflector, 'get').mockImplementation(() => true);
    jest.spyOn(storyService, 'findOne').mockImplementation(function () {
      return Promise.resolve({
        author: _id,
      } as StoryDocument);
    });

    await expect(authorStoryGuard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should return true if user is author of the story', async () => {
    const storyId = 'storyId';
    const authorId = 'authorId';
    const mockContext = getMockContext(storyId, authorId);

    jest.spyOn(reflector, 'get').mockImplementation(() => true);
    jest.spyOn(storyService, 'findOne').mockImplementation(function () {
      return Promise.resolve({
        author: authorId,
      } as StoryDocument);
    });

    await expect(authorStoryGuard.canActivate(mockContext)).toBeTruthy();
  });
});
