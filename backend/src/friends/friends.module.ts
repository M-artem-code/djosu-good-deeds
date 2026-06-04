import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeedsModule } from '../deeds/deeds.module';
import { UsersModule } from '../users/users.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { Friendship, FriendshipSchema } from './schemas/friendship.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friendship.name, schema: FriendshipSchema }]),
    forwardRef(() => UsersModule),
    DeedsModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
