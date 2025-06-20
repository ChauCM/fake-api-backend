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
import { ApiTags, ApiExcludeEndpoint, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        category: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        price: { type: 'number' },
        description: { type: 'string' },
        images: { type: 'array', items: { type: 'string' } },
        category: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateProductDto,
  ) {
    return this.productsService.update(id, changes);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.delete(id);
  }

  @ApiExcludeEndpoint()
  @Post('/raw')
  getRaw() {
    return this.productsService.getRaw();
  }
}
