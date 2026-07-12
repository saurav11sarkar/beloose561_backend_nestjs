import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Retailer,
  RetailerDocument,
} from '../retailer/entities/retailer.entity';
import { User, UserDocument } from '../user/entities/user.entity';
import { CreateHumidorDto } from './dto/create-humidor.dto';
import { Humidor, HumidorDocument } from './entities/humidor.entity';

@Injectable()
export class HumidorService {
  constructor(
    @InjectModel(Humidor.name)
    private readonly humidorModel: Model<HumidorDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Retailer.name) private retailerModel: Model<RetailerDocument>,
  ) {}

  async createHumidor(userId: string, createHumidorDto: CreateHumidorDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const retailer = await this.retailerModel.findOne({ userId: user._id });
    if (!retailer) {
      throw new HttpException('Retailer not found', 404);
    }
    const humidor = await this.humidorModel.create({
      ...createHumidorDto,
      userId: user._id,
      retailerId: retailer._id,
    });
    return humidor;
  }
}
