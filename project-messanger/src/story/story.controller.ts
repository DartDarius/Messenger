import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoryAuthor } from './guards and decorators/storyAuthor/storyAuthor.decorator';
import { JwtGuard } from './guards and decorators/jwt.guard';
import { AuthorStoryGuard } from './guards and decorators/storyAuthor/storyAuthor.guard';
import { SubscribeGuard } from './guards and decorators/subscribeGuard/subscribe.guard';
import { Subscribes } from './guards and decorators/subscribeGuard/subscribe.decorator';
import { Subscribe } from './helpers/subscribe.enum';

@ApiTags('story')
@Controller('story')
@UseGuards(SubscribeGuard)
@UseGuards(AuthorStoryGuard)
@UseGuards(JwtGuard)
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @Subscribes(Subscribe.Premium)
  create(@Body() createStoryDto: CreateStoryDto, @Request() req: any) {
    const { user } = req;
    return this.storyService.create(createStoryDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storyService.findOne(id);
  }

  @StoryAuthor()
  @Delete(':storyId')
  remove(@Param('storyId') storyId: string) {
    return this.storyService.remove(storyId);
  }
}
