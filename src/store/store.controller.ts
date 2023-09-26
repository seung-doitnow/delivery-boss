// ? 업장 메인 와이어프레임 추가 (업장 등록 CRUD)
// ? 업장 - 가게 연결, api 명세서 수정 필요

import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Post, Put, Req, Request, Res, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ownerAuthGuard } from 'src/auth/owner.jwt-auth.guard';
import { createStoreDataForm } from 'src/utils/decorator/api-file.decorator';
import { CustomRequest } from 'types/express.type';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';

// TODO 사장님은 업장 정보를 등록 및 수정, 삭제를 할 수 있어야 한다 -> 등록 / 수정 / 삭제 시 사장 권한 확인
// TODO 사장님은 업장 정보를 오직 1개만 갖고 있을 수 있어야 합니다.
// TODO 업장 정보 목록은 모두가 볼 수 있어야 합니다.
// ? 가게 이미지 추가하려면 스키마 변경해야함.

@Controller('/stores')
@ApiTags('store CRUD')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // 업장 생성
  @ApiOperation({ summary: '업장 생성' })
  @UseGuards(ownerAuthGuard)
  @ApiBearerAuth()
  @createStoreDataForm('file')
  @Post()
  async createStore(
    @UploadedFile(new ParseFilePipeBuilder().build({ fileIsRequired: true, })) file: Express.Multer.File,
    @Req() req: CustomRequest,
    @Body() createStoreDto: CreateStoreDto) {
    const ownerId = req.user.id;
    return this.storeService.createStore(ownerId, createStoreDto, file.path);
  }

  // 전체 업장 조회
  @ApiOperation({ summary: '전체 업장 조회' })
  @Get()
  async findAllStore(@Res() res: Response) {
    return res.render('storeList', { stores: await this.storeService.findAllStores() });
  }

  // 세부 업장 조회
  @ApiOperation({ summary: '세부 업장 조회' })
  @Get(':storeId')
  async findOneStore(@Param('storeId') storeId: string) {
    return await this.storeService.findOneStore(+storeId);
  }

  // 업장 정보 수정
  @ApiOperation({ summary: '업장 정보 수정' })
  @UseGuards(ownerAuthGuard)
  @ApiBearerAuth()
  @Put(':storeId')
  updateStore(@UploadedFile(new ParseFilePipeBuilder().build({ fileIsRequired: true })) file: Express.Multer.File, @Request() req: CustomRequest, @Param('storeId') storeId: string, @Body() updateStoreDto: UpdateStoreDto) {
    const ownerId = req.user.id;
    console.log('ho');
    return this.storeService.updateStore(ownerId, +storeId, updateStoreDto, file.path);
  }

  // 업장 정보 삭제
  @ApiOperation({ summary: '업장 정보 삭제' })
  @UseGuards(ownerAuthGuard)
  @ApiBearerAuth()
  @Delete(':storeId')
  async deleteStore(@Request() req: CustomRequest, @Param('storeId') storeId: string) {
    const ownerId = req.user.id;
    return this.storeService.deleteStore(ownerId, +storeId);
  }
}
