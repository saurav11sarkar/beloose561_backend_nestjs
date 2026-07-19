import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum FeatureType {
  STAFF_PICK = 'staff_pick',
  DAILY_FEATURED = 'daily_featured',
}

export class FeatureInventoryDto {
  @ApiPropertyOptional({
    enum: FeatureType,
    example: FeatureType.DAILY_FEATURED,
    default: FeatureType.DAILY_FEATURED,
  })
  @IsOptional()
  @IsEnum(FeatureType)
  type?: FeatureType;

  @ApiPropertyOptional({ example: 'Best Connecticut we carry' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: 'Mike' })
  @IsOptional()
  @IsString()
  staffPickBy?: string;
}
