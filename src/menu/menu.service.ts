import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Menu, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private storeService: StoreService
  ) {}

  //* 메뉴 생성
  async createMenu(createMenuDto: CreateMenuDto): Promise<Menu> {
    // 업장 확인
    const store = await this.storeService.findOneComment(createMenuDto.StoreId);
    if (!store) {
      throw new HttpException('업장 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    // 메뉴 중복 확인
    const menu = await this.prisma.menu.findFirst({
      where: {
        name: createMenuDto.name,
      },
    });
    if(menu) {
      throw new HttpException('이미 존재하는 메뉴입니다.', HttpStatus.BAD_REQUEST);
    }

    // 메뉴 생성
    return this.prisma.menu.create({
      data: {
        StoreId: createMenuDto.StoreId,
        name: createMenuDto.name,
        price: createMenuDto.price,
        image: createMenuDto.image,
      },
    });
  }

  //* 메뉴 전체 조회
  async getMenus(menuWhereInput: Prisma.MenuWhereInput): Promise<Menu[]> {
    // 업장 확인
    const store = await this.storeService.findOneComment(Number(menuWhereInput.StoreId));
    if (!store) {
      throw new HttpException('업장 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    return this.prisma.menu.findMany({
      where: menuWhereInput,
    });
  }

  //* 특정 메뉴 조회
  async getMenu(menuWhereUniqueInput: Prisma.MenuWhereUniqueInput): Promise<Menu> {
    // 업장 확인
    const store = await this.storeService.findOneComment(Number(menuWhereUniqueInput.StoreId));
    if (!store) {
      throw new HttpException('업장 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    // 메뉴 확인
    const menu = await this.prisma.menu.findUnique({
      where: menuWhereUniqueInput,
    });
    if(!menu){
      throw new HttpException('메뉴가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    return menu;
  }

  //* 메뉴 수정
  async updateMenu(updateMenuDto: UpdateMenuDto): Promise<Menu> {
    // 가게 및 메뉴 확인
    await this.getMenu({id: updateMenuDto.menuId, StoreId: updateMenuDto.StoreId});

    // 메뉴 중복 확인
    const menu = await this.prisma.menu.findFirst({
      where: {
        name: updateMenuDto.name,
      },
    });
    if(menu) {
      throw new HttpException('이미 존재하는 메뉴입니다.', HttpStatus.BAD_REQUEST);
    }

    // 메뉴 수정
    return this.prisma.menu.update({
      where: {
        StoreId: updateMenuDto.StoreId,
        id: updateMenuDto.menuId,
      },
      data: {
        name: updateMenuDto.name,
        price: updateMenuDto.price,
        image: updateMenuDto.image,
      },
    });
  }

  //* 메뉴 삭제
  async deleteMenu(where: Prisma.MenuWhereUniqueInput): Promise<Menu> {
    // 가게 및 메뉴 확인
    await this.getMenu({id: where.id, StoreId: where.StoreId});

    // 메뉴 삭제
    return this.prisma.menu.delete({
      where,
    });
  }
}
