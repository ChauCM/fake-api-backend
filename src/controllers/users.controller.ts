import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Put,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

import { UsersService } from '@services/users.service';
import { CreateUserDto, ValidateUserDto, UpdateUserDto } from '@dtos/user.dto';
import { FilterUsersDto } from '@dtos/user.dto';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  @Get()
  getAll(@Query() params: FilterUsersDto) {
    return this.usersService.getAll(params);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        avatar: { type: 'string' }
      }
    }
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('is-available')
  @ApiOperation({ summary: 'Check if user email is available' })
  @ApiBody({ type: ValidateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Email availability checked',
    schema: {
      type: 'object',
      properties: {
        isAvailable: { type: 'boolean' }
      }
    }
  })
  isAvailable(@Body() dto: ValidateUserDto) {
    return this.usersService.isAvailable(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        avatar: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateUserDto,
  ) {
    return this.usersService.update(id, changes);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
