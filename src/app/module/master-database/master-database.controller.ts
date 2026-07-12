import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MasterDatabaseService } from './master-database.service';
import { CreateMasterDatabaseDto } from './dto/create-master-database.dto';
import { UpdateMasterDatabaseDto } from './dto/update-master-database.dto';

@Controller('master-database')
export class MasterDatabaseController {
  constructor(private readonly masterDatabaseService: MasterDatabaseService) {}

  @Post()
  create(@Body() createMasterDatabaseDto: CreateMasterDatabaseDto) {
    return this.masterDatabaseService.create(createMasterDatabaseDto);
  }

  @Get()
  findAll() {
    return this.masterDatabaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.masterDatabaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMasterDatabaseDto: UpdateMasterDatabaseDto) {
    return this.masterDatabaseService.update(+id, updateMasterDatabaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.masterDatabaseService.remove(+id);
  }
}
