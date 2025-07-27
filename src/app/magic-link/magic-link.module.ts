import { Module } from '@nestjs/common';
import { MagicLinkService } from './magic-link/magic-link.service';
import { MagicLinkController } from './magic-link.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MagicLink, MagicLinkSchema } from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MagicLink.name, schema: MagicLinkSchema },
    ]),
  ],
  controllers: [MagicLinkController],
  providers: [MagicLinkService],
  exports: [MagicLinkService],
})
export class MagicLinkModule {}
