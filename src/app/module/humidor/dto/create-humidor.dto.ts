import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HumidorShelfDto {
  @ApiProperty({
    example: 'Top Shelf',
    description: 'Shelf name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Premium Cigars',
    description: 'Shelf description',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}

export class CreateHumidorDto {
  @ApiProperty({
    example: 'Main Humidor',
    description: 'Humidor name',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'Front of Store',
    description: 'Humidor location',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @ApiPropertyOptional({
    example: 'Temperature Controlled Humidor',
    description: 'Humidor description',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    type: () => [HumidorShelfDto],
    description: 'List of shelfes',
    required: false,
    example: [
      {
        name: 'Top Shelf',
        description: 'Premium Cigars',
      },
      {
        name: 'Middle Shelf',
        description: 'Medium Range Cigars',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => HumidorShelfDto)
  shelfes?: HumidorShelfDto[];

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Humidor active status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
