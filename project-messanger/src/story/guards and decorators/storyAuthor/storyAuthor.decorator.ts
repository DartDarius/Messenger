import { SetMetadata } from '@nestjs/common';

export const STORY_AUTHOR_KEY = 'StoryAuthor';
export const StoryAuthor = () => SetMetadata(STORY_AUTHOR_KEY, true);
