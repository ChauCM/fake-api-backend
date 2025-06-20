import { Controller, Post, UseGuards, Req, Get, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '@db/entities/user.entity';

import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';
import { Payload } from '@models/payload.model';
import { RefreshTokenDto, LoginDto, RegisterDto } from '@dtos/auth.dto';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { Role } from '@models/roles';

// Extend Express Request type to include user
interface RequestWithUser extends Request {
  user: User | Payload;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
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
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      avatar: 'https://api.lorem.space/image/avatar?w=150&h=150',
      role: Role.customer
    });
    return user;
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto, @Req() req: RequestWithUser) {
    const user = req.user as User;
    return {
      access_token: this.authService.generateAccessToken(user),
      refresh_token: this.authService.generateRefreshToken(user),
    };
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
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
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: RequestWithUser) {
    const payload = req.user as Payload;
    if (!payload.userId) {
      throw new NotFoundException('User not found');
    }
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.generateAccessTokenByRefreshToken(dto.refreshToken);
  }
}
