import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';
import { StoreService } from 'src/store/store.service';
import { multerDiskOptions } from 'src/utils/multer.config';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [
    // AuthModule,
    MulterModule.register(multerDiskOptions),
    JwtModule
  ],
  controllers: [MenuController],
  providers: [PrismaService, MenuService, StoreService],
  exports: [MenuService]
})
export class MenuModule {}
