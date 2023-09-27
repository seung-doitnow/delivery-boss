import { Controller, Get, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CartsService } from 'src/cart/carts.service';
import { MenuService } from 'src/menu/menu.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from './../order/orders.service';

@Controller('mypage')
export class MypageController {
  constructor(private readonly cartsService: CartsService, private readonly menusService: MenuService, private readonly ordersService: OrdersService, private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}
  
  @ApiExcludeEndpoint()
  @Get('carts')
  async getCartsPage(@Req() req: Request, @Res() res: Response) {
    let user;
    if (req.cookies['Bearer']) {
      user = await this.jwtService.verify(req.cookies['Bearer'], { secret: process.env.JWT_SECRET });
    }

    const menus = await this.prisma.cart.findMany({ where: { OrderId: null, }, select: { Menu: true, count: true }});
    const ids = [];
    for (let [ index, menu ] of menus.entries()) {
      menus[index]['totalPrice'] = menu.Menu.price * menu.count;
      ids.push(menu.Menu.id);
    }

    return res.render('cart', { menus, ids });
  }

  @ApiExcludeEndpoint()
  @Get('orders')
  async getOrdersPage(@Req() req: Request, @Res() res: Response) {
    let user;
    if (req.cookies['Bearer']) {
      user = await this.jwtService.verify(req.cookies['Bearer'], { secret: process.env.JWT_SECRET });
    }

    console.log(await this.ordersService.getAllOrders(user));
    return res.render('order', { orders: await this.ordersService.getAllOrders(user) });
  }
}
