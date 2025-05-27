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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

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
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('is-available')
  isAvailable(@Body() dto: ValidateUserDto) {
    return this.usersService.isAvailable(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() changes: UpdateUserDto,
  ) {
    return this.usersService.update(id, changes);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
