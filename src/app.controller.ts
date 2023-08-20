import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dtos/user.dto';
import { TweetDto } from './dtos/tweet.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHealth(): string {
    return this.appService.getHealth();
  }

  @Post('sign-up')
  @HttpCode(200)
  signUp(@Body() body: CreateUserDto) {
    try {
      this.appService.signUp(body);
    } catch (error) {
      throw new HttpException('All fields are required!', 400);
    }
  }

  @Post('tweets')
  postTweet(@Body() body: TweetDto) {
    this.appService.postTweet(body);
  }

  @Get('tweets')
  getLatestTweets(@Query('page') page: number) {
    return this.appService.getLatestTweets(page);
  }

  @Get('tweets/:username')
  getTweetsFromUser(@Param('username') username: string) {
    return this.appService.getTweetsFromUser(username);
  }
}
