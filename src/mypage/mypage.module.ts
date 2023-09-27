import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CartsModule } from 'src/cart/carts.module';
import { MenuModule } from 'src/menu/menu.module';
import { OrdersModule } from 'src/order/orders.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MypageController } from './mypage.controller';

@Module({
  imports: [CartsModule, MenuModule, PrismaModule, JwtModule, OrdersModule],
  controllers: [MypageController],
  providers: [],
})
export class MypageModule {}
