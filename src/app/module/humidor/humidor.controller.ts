import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import AuthGuard from '../../middlewares/auth.guard';
import { CreateHumidorDto } from './dto/create-humidor.dto';
import { HumidorService } from './humidor.service';

@ApiTags('humidor')
@Controller('humidor')
export class HumidorController {
  constructor(private readonly humidorService: HumidorService) {}

  @Post()
  @ApiOperation({ summary: 'Create Humidor' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @HttpCode(HttpStatus.CREATED)
  async createHumidor(
    @Req() req: Request,
    @Body() createHumidorDto: CreateHumidorDto,
  ) {
    const result = await this.humidorService.createHumidor(
      req.user!.id,
      createHumidorDto,
    );

    return {
      message: 'Humidor created successfully',
      data: result,
    };
  }
}
