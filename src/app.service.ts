import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Tweet } from './entities/tweet.entity';
import { CreateUserDto } from './dtos/user.dto';
import { TweetDto } from './dtos/tweet.dto';

@Injectable()
export class AppService {
  private users: User[];
  private tweets: Tweet[];

  constructor() {
    (this.users = [
      new User(
        'Diego',
        'https://avatars.githubusercontent.com/u/114487600?v=4',
      ),
    ]),
      (this.tweets = []);
  }

  getHealth(): string {
    return "I'm okay!";
  }

  signUp(body: CreateUserDto) {
    const user = new User(body.username, body.avatar);
    this.users.push(user);
  }

  postTweet(body: TweetDto) {
    const user = this.users.find((u) => u.getUsername() === body.username);

    if (!user) throw new UnauthorizedException();

    const tweet = new Tweet(user, body.tweet);

    this.tweets.push(tweet);
  }

  getLatestTweets(page: number) {
    const tweetsList = [];
    let latestTweets: Tweet[];
    const numberPage = Number(page);

    console.log({ numberPage });
    console.log({ t: this.tweets });

    if (numberPage < 1) {
      throw new HttpException('Informe uma página válida!', 400);
    }

    if (this.tweets.length > 15 && numberPage) {
      latestTweets = this.tweets.slice(
        -15 * numberPage,
        this.tweets.length - 15 * (numberPage - 1),
      );
    } else {
      if (!numberPage) {
        latestTweets = this.tweets.slice(-15);
      } else {
        latestTweets = [...this.tweets];
      }
    }
    console.log({ latestTweets });

    latestTweets.forEach((t) => {
      tweetsList.push({
        avatar: t.getUser().getAvatar(),
        username: t.getUser().getUsername(),
        tweet: t.getTweet(),
      });
    });

    return tweetsList;
  }

  getTweetsFromUser(username: string) {
    const tweetsList = [];
    const userTweets = this.tweets.filter(
      (t) => t.getUser().getUsername() === username,
    );
    if (userTweets.length > 0) {
      userTweets.forEach((t) => {
        tweetsList.push({
          avatar: t.getUser().getAvatar(),
          username: t.getUser().getUsername(),
          tweet: t.getTweet(),
        });
      });
    }

    return tweetsList;
  }
}
