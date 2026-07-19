import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddStaffPickDto {
  @ApiProperty({ example: 'Mike' })
  @IsString()
  @IsNotEmpty()
  staffPickBy!: string;

  @ApiProperty({
    example: 'Best Connecticut we carry. Smooth and perfect for beginners.',
  })
  @IsString()
  @IsNotEmpty()
  staffPickNote!: string;
}
