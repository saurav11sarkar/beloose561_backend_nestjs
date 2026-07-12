import { Injectable } from '@nestjs/common';
import { CreateMasterDatabaseDto } from './dto/create-master-database.dto';
import { UpdateMasterDatabaseDto } from './dto/update-master-database.dto';

@Injectable()
export class MasterDatabaseService {
  create(createMasterDatabaseDto: CreateMasterDatabaseDto) {
    return 'This action adds a new masterDatabase';
  }

  findAll() {
    return `This action returns all masterDatabase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} masterDatabase`;
  }

  update(id: number, updateMasterDatabaseDto: UpdateMasterDatabaseDto) {
    return `This action updates a #${id} masterDatabase`;
  }

  remove(id: number) {
    return `This action removes a #${id} masterDatabase`;
  }
}
