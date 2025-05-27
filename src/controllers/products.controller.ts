import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint, ApiBearerAuth } from '@nestjs/swagger';

import { ProductsService } from '@services/products.service';
import { CreateProductDto } from '@dtos/product.dto';
import { UpdateProductDto } from '@dtos/product.dto';
import { FilterProductsDto } from '@dtos/product.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('products')
@ApiBearerAuth('JWT-auth')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  @Get()
  getAll(@Query() params: FilterProductsDto) {
    return this.productsService.getAll(params);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }

  @Get(':id/related')
  getRelatedProducts(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getRelatedProducts(id);
  }

  @Get('slug/:slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get('slug/:slug/related')
  getRelatedProductsBySlug(@Param('slug') slug: string) {
    return this.productsService.getRelatedProductsBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateProductDto,
  ) {
    return this.productsService.update(id, changes);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }

  @ApiExcludeEndpoint()
  @Post('/raw')
  getRaw() {
    return this.productsService.getRaw();
  }
}
