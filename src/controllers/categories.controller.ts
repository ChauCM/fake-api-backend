import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

import { CategoriesService } from '@services/categories.service';
import { ProductsService } from '@services/products.service';
import { FilterProductsDto } from '@dtos/product.dto';
import { UpdateCategoryDto } from '@dtos/category.dto';
import { CreateCategoryDto } from '@dtos/category.dto';
import { FilterCategoriesDto } from '@dtos/category.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
@Controller('categories')
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
  ) {}

  @Get()
  getAll(@Query() params: FilterCategoriesDto) {
    return this.categoriesService.getAll(params);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findById(id);
  }

  @Get('slug/:slug')
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        image: { type: 'string' },
        slug: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() category: CreateCategoryDto) {
    return this.categoriesService.create(category);
  }

  @Get(':id/products')
  getProductsByCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query() params: FilterProductsDto,
  ) {
    return this.productsService.byCategory(id, params);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        image: { type: 'string' },
        slug: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, changes);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.delete(id);
  }
}
