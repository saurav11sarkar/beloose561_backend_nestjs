import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { fileUpload } from '../../helpers/fileUploder';
import pick from '../../helpers/pick';
import AuthGuard from '../../middlewares/auth.guard';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { DiscountInventoryDto } from './dto/discount-inventory.dto';
import { FeatureInventoryDto } from './dto/feature-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('/my-inventory')
  @ApiOperation({ summary: 'Get my retailer inventory list' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @ApiQuery({ name: 'searchTerm', type: 'string', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'brand', type: 'string', required: false })
  @ApiQuery({ name: 'productLine', type: 'string', required: false })
  @ApiQuery({ name: 'manufacturer', type: 'string', required: false })
  @ApiQuery({ name: 'country', type: 'string', required: false })
  @ApiQuery({ name: 'wrapper', type: 'string', required: false })
  @ApiQuery({ name: 'binder', type: 'string', required: false })
  @ApiQuery({ name: 'filler', type: 'string', required: false })
  @ApiQuery({ name: 'strength', type: 'string', required: false })
  @ApiQuery({ name: 'size', type: 'string', required: false })
  @ApiQuery({ name: 'length', type: 'string', required: false })
  @ApiQuery({ name: 'flavorNotes', type: 'string', required: false })
  @ApiQuery({ name: 'smokingTime', type: 'string', required: false })
  @ApiQuery({ name: 'description', type: 'string', required: false })
  @ApiQuery({ name: 'whyYoullLikeThis', type: 'string', required: false })
  @ApiQuery({ name: 'status', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'sortBy', type: 'string', required: false })
  @ApiQuery({ name: 'sortOrder', type: 'string', required: false })
  @HttpCode(HttpStatus.OK)
  async getMyInventory(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
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
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.inventoryService.getMyInventory(
      req.user!.id,
      filters,
      options,
    );

    return {
      message: 'Inventory retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get('/opportunities/my')
  @ApiOperation({
    summary:
      'Get "Inventory Opportunities" - cigars with no sale (and/or no customer search) in the given window',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @ApiQuery({
    name: 'days',
    type: 'number',
    required: false,
    description: 'Lookback window in days (default 90)',
  })
  @HttpCode(HttpStatus.OK)
  async getInventoryOpportunities(@Req() req: Request) {
    const days = req.query.days ? Number(req.query.days) : undefined;
    const result = await this.inventoryService.getInventoryOpportunities(
      req.user!.id,
      days,
    );

    return {
      message: 'Inventory opportunities retrieved successfully',
      data: result,
    };
  }

  @Get('/opportunities/summary/my')
  @ApiOperation({
    summary:
      'Dashboard widget - count of cigars needing attention (Inventory Opportunities)',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @ApiQuery({
    name: 'days',
    type: 'number',
    required: false,
    description: 'Lookback window in days (default 90)',
  })
  @HttpCode(HttpStatus.OK)
  async getInventoryOpportunitiesSummary(@Req() req: Request) {
    const days = req.query.days ? Number(req.query.days) : undefined;
    const result = await this.inventoryService.getInventoryOpportunitiesSummary(
      req.user!.id,
      days,
    );

    return {
      message: 'Inventory opportunities summary retrieved successfully',
      data: result,
    };
  }

  @Get('/')
  @ApiOperation({ summary: 'Get all admin inventory list' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @ApiQuery({ name: 'searchTerm', type: 'string', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'brand', type: 'string', required: false })
  @ApiQuery({ name: 'productLine', type: 'string', required: false })
  @ApiQuery({ name: 'manufacturer', type: 'string', required: false })
  @ApiQuery({ name: 'country', type: 'string', required: false })
  @ApiQuery({ name: 'wrapper', type: 'string', required: false })
  @ApiQuery({ name: 'binder', type: 'string', required: false })
  @ApiQuery({ name: 'filler', type: 'string', required: false })
  @ApiQuery({ name: 'strength', type: 'string', required: false })
  @ApiQuery({ name: 'size', type: 'string', required: false })
  @ApiQuery({ name: 'length', type: 'string', required: false })
  @ApiQuery({ name: 'flavorNotes', type: 'string', required: false })
  @ApiQuery({ name: 'smokingTime', type: 'string', required: false })
  @ApiQuery({ name: 'description', type: 'string', required: false })
  @ApiQuery({ name: 'whyYoullLikeThis', type: 'string', required: false })
  @ApiQuery({ name: 'status', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'sortBy', type: 'string', required: false })
  @ApiQuery({ name: 'sortOrder', type: 'string', required: false })
  @HttpCode(HttpStatus.OK)
  async getAllInventory(@Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
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
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.inventoryService.getAllInventory(
      filters,
      options,
    );

    return {
      message: 'Inventory retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':slug/inventory-list')
  @ApiOperation({ summary: 'Get retailer inventory list' })
  @ApiQuery({ name: 'searchTerm', type: 'string', required: false })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'brand', type: 'string', required: false })
  @ApiQuery({ name: 'productLine', type: 'string', required: false })
  @ApiQuery({ name: 'manufacturer', type: 'string', required: false })
  @ApiQuery({ name: 'country', type: 'string', required: false })
  @ApiQuery({ name: 'wrapper', type: 'string', required: false })
  @ApiQuery({ name: 'binder', type: 'string', required: false })
  @ApiQuery({ name: 'filler', type: 'string', required: false })
  @ApiQuery({ name: 'strength', type: 'string', required: false })
  @ApiQuery({ name: 'size', type: 'string', required: false })
  @ApiQuery({ name: 'length', type: 'string', required: false })
  @ApiQuery({ name: 'flavorNotes', type: 'string', required: false })
  @ApiQuery({ name: 'smokingTime', type: 'string', required: false })
  @ApiQuery({ name: 'description', type: 'string', required: false })
  @ApiQuery({ name: 'whyYoullLikeThis', type: 'string', required: false })
  @ApiQuery({ name: 'status', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'sortBy', type: 'string', required: false })
  @ApiQuery({ name: 'sortOrder', type: 'string', required: false })
  @HttpCode(HttpStatus.OK)
  async getInventorys(@Param('slug') slug: string, @Req() req: Request) {
    const filters = pick(req.query, [
      'searchTerm',
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
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await this.inventoryService.getInventorys(
      slug,
      filters,
      options,
    );

    return {
      message: 'Inventory retrieved successfully',
      meta: result.meta,
      data: result.data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create inventory' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @UseInterceptors(FileInterceptor('image', fileUpload.uploadConfig))
  @HttpCode(HttpStatus.CREATED)
  async createInventory(
    @Req() req: Request,
    @Body() createInventoryDto: CreateInventoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.inventoryService.createInventory(
      req.user!.id,
      createInventoryDto,
      file,
    );

    return {
      message: 'Inventory created successfully',
      data: result,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit inventory item' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @UseInterceptors(FileInterceptor('image', fileUpload.uploadConfig))
  @HttpCode(HttpStatus.OK)
  async updateInventory(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.inventoryService.updateInventory(
      id,
      updateInventoryDto,
      file,
    );

    return {
      message: 'Inventory updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory item' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @HttpCode(HttpStatus.OK)
  async deleteInventory(@Param('id') id: string) {
    const result = await this.inventoryService.deleteInventory(id);

    return {
      message: 'Inventory deleted successfully',
      data: result,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update inventory status admin' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('admin'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'active',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async adminUpdateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const result = await this.inventoryService.adminUpdateStatus(id, status);

    return {
      message: 'Inventory status updated successfully',
      data: result,
    };
  }

  @Patch(':id/feature')
  @ApiOperation({
    summary: '⭐ Feature It - mark a cigar as Staff Pick / Daily Featured',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @HttpCode(HttpStatus.OK)
  async featureInventory(
    @Param('id') id: string,
    @Body() featureInventoryDto: FeatureInventoryDto,
  ) {
    const result = await this.inventoryService.featureInventory(
      id,
      featureInventoryDto,
    );

    return {
      message: 'Inventory marked as featured successfully',
      data: result,
    };
  }

  @Patch(':id/discount')
  @ApiOperation({ summary: '💰 Discount It - apply a % discount to a cigar' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @HttpCode(HttpStatus.OK)
  async applyDiscount(
    @Param('id') id: string,
    @Body() discountInventoryDto: DiscountInventoryDto,
  ) {
    const result = await this.inventoryService.applyDiscount(
      id,
      discountInventoryDto,
    );

    return {
      message: 'Discount applied successfully',
      data: result,
    };
  }

  @Patch(':id/discount/remove')
  @ApiOperation({ summary: 'Remove an active discount from a cigar' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('retailer'))
  @HttpCode(HttpStatus.OK)
  async removeDiscount(@Param('id') id: string) {
    const result = await this.inventoryService.removeDiscount(id);

    return {
      message: 'Discount removed successfully',
      data: result,
    };
  }
}
