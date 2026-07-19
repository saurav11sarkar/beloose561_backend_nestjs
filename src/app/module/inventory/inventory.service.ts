import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import buildWhereConditions from '../../helpers/buildWhereConditions';
import { fileUpload } from '../../helpers/fileUploder';
import paginationHelper, { IOptions } from '../../helpers/pagenation';
import { IFilterParams } from '../../helpers/pick';
import { Humidor, HumidorDocument } from '../humidor/entities/humidor.entity';
import {
  MasterDatabase,
  MasterDatabaseDocument,
} from '../master-database/entities/master-database.entity';
import {
  Retailer,
  RetailerDocument,
} from '../retailer/entities/retailer.entity';
import { User, UserDocument } from '../user/entities/user.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { DiscountInventoryDto } from './dto/discount-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, InventoryDocument } from './entities/inventory.entity';
import { FeatureInventoryDto, FeatureType } from './dto/feature-inventory.dto';

const OPPORTUNITY_DAYS = 90;

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private inventoryRepository: Model<InventoryDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Retailer.name)
    private readonly retailerModel: Model<RetailerDocument>,
    @InjectModel(MasterDatabase.name)
    private readonly masterDatabaseModel: Model<MasterDatabaseDocument>,
    @InjectModel(Humidor.name)
    private readonly humidorModel: Model<HumidorDocument>,
  ) {}

  async createInventory(
    userId: string,
    createInventoryDto: CreateInventoryDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', 404);
    const retailer = await this.retailerModel.findOne({ userId: user._id });
    if (!retailer) throw new HttpException('Retailer not found', 404);
    const humidor = await this.humidorModel.findOne({ userId: user._id });
    if (!humidor) throw new HttpException('Humidor not found', 404);
    if (file) {
      const uploadedFile = await fileUpload.uploadToCloudinary(file);
      createInventoryDto.image = uploadedFile.url;
    }
    const inventory = await this.inventoryRepository.create({
      ...createInventoryDto,
      userId: user._id,
      retailerId: retailer._id,
      humidorId: humidor._id,
      status: 'under_review',
    });
    return inventory;
  }

  async getMyInventory(
    userId: string,
    params: IFilterParams,
    options: IOptions,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', 404);
    const retailer = await this.retailerModel.findOne({ userId: user._id });
    if (!retailer) throw new HttpException('Retailer not found', 404);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(
      params,
      [
        'name',
        'brand',
        'productLine',
        'manufacturer',
        'country',
        'wrapper',
        'binder',
        'filler',
        'strength',
        'size',
        'length',
        'flavorNotes',
        'smokingTime',
        'description',
        'whyYoullLikeThis',
        'status',
      ],
      {
        userId: user._id,
        retailerId: retailer._id,
      },
    );
    const result = await this.inventoryRepository
      .find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const total =
      await this.inventoryRepository.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  async getAllInventory(params: IFilterParams, options: IOptions) {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(params, [
      'name',
      'brand',
      'productLine',
      'manufacturer',
      'country',
      'wrapper',
      'binder',
      'filler',
      'strength',
      'size',
      'length',
      'flavorNotes',
      'smokingTime',
      'description',
      'whyYoullLikeThis',
      'status',
    ]);
    const result = await this.inventoryRepository
      .find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const total =
      await this.inventoryRepository.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  async getInventorys(
    shopslag: string,
    params: IFilterParams,
    options: IOptions,
  ) {
    const retailer = await this.retailerModel.findOne({ storeSlug: shopslag });
    if (!retailer) throw new HttpException('Retailer not found', 404);
    const user = await this.userModel.findById(retailer.userId);
    if (!user) throw new HttpException('User not found', 404);
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper(options);
    const whereConditions = buildWhereConditions(
      params,
      [
        'name',
        'brand',
        'productLine',
        'manufacturer',
        'country',
        'wrapper',
        'binder',
        'filler',
        'strength',
        'size',
        'length',
        'flavorNotes',
        'smokingTime',
        'description',
        'whyYoullLikeThis',
        'status',
      ],
      {
        userId: user._id,
        retailerId: retailer._id,
      },
    );
    const result = await this.inventoryRepository
      .find(whereConditions)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const total =
      await this.inventoryRepository.countDocuments(whereConditions);
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  async getInventoryById(id: string) {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) throw new HttpException('Inventory not found', 404);
    return inventory;
  }

  async updateInventory(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
    file?: Express.Multer.File,
  ) {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) throw new HttpException('Inventory not found', 404);
    if (file) {
      const uploadedFile = await fileUpload.uploadToCloudinary(file);
      updateInventoryDto.image = uploadedFile.url;
    }
    const result = await this.inventoryRepository.findByIdAndUpdate(
      id,
      updateInventoryDto,
      { new: true },
    );
    return result;
  }

  async deleteInventory(id: string) {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) throw new HttpException('Inventory not found', 404);
    const result = await this.inventoryRepository.findByIdAndDelete(id);
    return result;
  }

  async adminUpdateStatus(id: string, status: string) {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) throw new HttpException('Inventory not found', 404);
    const result = await this.inventoryRepository.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return result;
  }

  // Cigars with no sale in `days` days (or never sold since being added)
  // and/or never searched by a customer - candidates to feature or discount.
  private buildOpportunityFilter(
    retailerId: mongoose.Types.ObjectId,
    days: number,
  ) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return {
      retailerId,
      status: 'active',
      quantity: { $gt: 0 },
      $or: [
        { lastSoldDate: { $lte: cutoff } },
        { lastSoldDate: { $exists: false }, createdAt: { $lte: cutoff } },
        { lastSoldDate: null, createdAt: { $lte: cutoff } },
      ],
    };
  }

  async getInventoryOpportunities(userId: string, days = OPPORTUNITY_DAYS) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', 404);
    const retailer = await this.retailerModel.findOne({ userId: user._id });
    if (!retailer) throw new HttpException('Retailer not found', 404);

    const filter = this.buildOpportunityFilter(retailer._id, days);
    const items = await this.inventoryRepository
      .find(filter)
      .sort({ lastSoldDate: 1, createdAt: 1 });

    const now = Date.now();
    const data = items.map((item) => {
      const lastActivityDate = item.lastSoldDate ?? item.get('createdAt');
      const daysSinceLastSale = lastActivityDate
        ? Math.floor((now - new Date(lastActivityDate).getTime()) / 86400000)
        : null;
      return {
        ...item.toObject(),
        daysSinceLastSale,
        neverSearched: (item.totalSearches ?? 0) === 0,
      };
    });

    return { days, count: data.length, data };
  }

  async getInventoryOpportunitiesSummary(
    userId: string,
    days = OPPORTUNITY_DAYS,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new HttpException('User not found', 404);
    const retailer = await this.retailerModel.findOne({ userId: user._id });
    if (!retailer) throw new HttpException('Retailer not found', 404);

    const filter = this.buildOpportunityFilter(retailer._id, days);
    const count = await this.inventoryRepository.countDocuments(filter);

    return { days, count };
  }

  async featureInventory(id: string, dto: FeatureInventoryDto) {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) throw new HttpException('Inventory not found', 404);

    const type = dto.type ?? FeatureType.DAILY_FEATURED;
    const update =
      type === FeatureType.STAFF_PICK
        ? {
            isStaffPick: true,
            staffPickNote: dto.note,
            staffPickBy: dto.staffPickBy,
          }
        : { isDailyFeatured: true, featuredNote: dto.note };

    const result = await this.inventoryRepository.findByIdAndUpdate(
      id,
      update,
      { new: true },
    );
    return result;
  }

  async applyDiscount(id: string, dto: DiscountInventoryDto) {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) throw new HttpException('Inventory not found', 404);

    const discountPrice =
      inventory.price - (inventory.price * dto.discountPercentage) / 100;

    const result = await this.inventoryRepository.findByIdAndUpdate(
      id,
      {
        isOnDiscount: true,
        discountPercentage: dto.discountPercentage,
        discountPrice: Number(discountPrice.toFixed(2)),
        discountedAt: new Date(),
      },
      { new: true },
    );
    return result;
  }

  async removeDiscount(id: string) {
    const inventory = await this.inventoryRepository.findById(id);
    if (!inventory) throw new HttpException('Inventory not found', 404);

    const result = await this.inventoryRepository.findByIdAndUpdate(
      id,
      {
        isOnDiscount: false,
        $unset: { discountPercentage: '', discountPrice: '', discountedAt: '' },
      },
      { new: true },
    );
    return result;
  }
}
