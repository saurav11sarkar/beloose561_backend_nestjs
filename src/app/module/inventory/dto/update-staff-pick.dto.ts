import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStaffPickDto {
  @ApiPropertyOptional({ example: 'Mike' })
  @IsOptional()
  @IsString()
  staffPickBy?: string;

  @ApiPropertyOptional({
    example: 'Best Connecticut we carry. Smooth and perfect for beginners.',
  })
  @IsOptional()
  @IsString()
  staffPickNote?: string;
}
