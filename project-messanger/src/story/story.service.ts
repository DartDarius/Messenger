import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { CreateStoryDto } from './dto/create-story.dto';
import { Connection } from 'mongoose';
import { Story, StoryDocument } from './story.schema';

@Injectable()
export class StoryService {
  private readonly storyModel;
  constructor(
    @InjectConnection('story') private readonly connection: Connection,
  ) {
    this.storyModel = this.connection.model<StoryDocument>(Story.name);
  }
  create(createStoryDto: CreateStoryDto, user: string) {
    const createdStory = new this.storyModel({
      ...createStoryDto,
      author: user,
    });
    return createdStory.save();
  }

  async findOne(id: string) {
    const story = await this.storyModel.findById(id);
    if (!story) {
      throw new ForbiddenException('Story with this Id was not found');
    }
    return story;
  }

  async remove(id: string) {
    return await this.storyModel.findByIdAndDelete(id);
  }

  async deleteStoryByInfo(info: string) {
    return await this.storyModel.deleteMany({ info });
  }
}
