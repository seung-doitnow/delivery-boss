import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly info: string;

  // @IsNumber()
  // @IsNotEmpty()
  // @ApiProperty()
  // readonly OwnerId: number;

  // * 가게 이미지 필요하면 넣기, 근데 추가할려면 schema에도 추가해야함!
  // * 이미지 
  //   @IsString()
  //   @ApiProperty()
  //   readonly info: image;
}
