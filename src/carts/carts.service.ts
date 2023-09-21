import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CartCreateDto } from './dto/cart.create.dto';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  // * 장바구니 추가
  async createCart(customerId: number, menuId: number, body: CartCreateDto) {
    const menu = await this.prisma.menu.findUnique({ where: { id: menuId }});
    // ! 해당하는 메뉴가 없는 경우
    if (!menu) {
      throw new HttpException('메뉴를 다시 확인해주세요.', HttpStatus.PRECONDITION_FAILED);
    }
    
    await this.prisma.cart.create({ data: {
      MenuId: menuId,
      CustomerId: customerId,
      count: body.count,
      price: menu.price
    } });
    
    return { message: '장바구니에 메뉴를 담았습니다.' };
  }

  // * 장바구니 전체 조회
  async getAllCarts(customerId: number) {
    const carts = await this.prisma.cart.findMany({ where: { CustomerId: customerId } });

    // Todo: 프론트 구현하면서 리턴해줄 키-값 수정하기
    return carts.map((cart) => {
      return {
        id: cart.id,
        OrderId: cart.OrderId,
        count: cart.count,
        price: cart.price,
        status: cart.status,
      }
    });
  }
  
  // * 장바구니 메뉴 수정
  updateCart() {
    return '';
  }
  
  // * 장바구니 메뉴 삭제
  deleteCart() {
    return '';
  }
}
