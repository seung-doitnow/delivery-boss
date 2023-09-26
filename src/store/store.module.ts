import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'src/prisma/prisma.module';
import { multerDiskOptions } from 'src/utils/multer.config';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [PrismaModule, MulterModule.register(multerDiskOptions)],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
