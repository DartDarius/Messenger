import {
  Injectable,
  ExecutionContext,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';
import { StoryService } from '../../story.service';
import { Reflector } from '@nestjs/core';
import { STORY_AUTHOR_KEY } from './storyAuthor.decorator';

@Injectable()
export class AuthorStoryGuard implements CanActivate {
  constructor(
    private readonly storyService: StoryService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const authorRequired = this.reflector.get<boolean>(
      STORY_AUTHOR_KEY,
      context.getHandler(),
    );

    if (!authorRequired) {
      return true;
    }
    const { _id } = context.switchToHttp().getRequest().user;
    console.log(_id);
    const storyId =
      context.switchToHttp().getRequest().params.storyId ??
      context.switchToHttp().getRequest().body.storyId;
    const { author } = await this.storyService.findOne(storyId);
    const authorStory = author === _id;

    if (!authorStory) {
      throw new ForbiddenException('You are not an author of the story!');
    }
    return true;
  }
}
