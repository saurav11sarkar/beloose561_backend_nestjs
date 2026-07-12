import { Module } from '@nestjs/common';
import { MasterDatabaseService } from './master-database.service';
import { MasterDatabaseController } from './master-database.controller';

@Module({
  controllers: [MasterDatabaseController],
  providers: [MasterDatabaseService],
})
export class MasterDatabaseModule {}
