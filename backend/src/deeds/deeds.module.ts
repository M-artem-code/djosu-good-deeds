import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeedsController } from './deeds.controller';
import { DeedsService } from './deeds.service';
import { Deed, DeedSchema } from './schemas/deed.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Deed.name, schema: DeedSchema }])],
  controllers: [DeedsController],
  providers: [DeedsService],
  exports: [DeedsService],
})
export class DeedsModule {}
