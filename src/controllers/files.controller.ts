import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Response, Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { editFileName } from '@utils/file-utils';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigType } from '@nestjs/config';
import config from '@config/config';

@ApiTags('files')
@ApiBearerAuth('JWT-auth')
@Controller('files')
export class FilesController {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {
    // Ensure upload directory exists
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    const uploadDir = './upload';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }

  private getBaseUrl(req: Request): string {
    // First try to use the configured API_URL
    if (this.configService.apiUrl && this.configService.apiUrl !== 'http://localhost:3001') {
      return this.configService.apiUrl;
    }

    // Fallback to dynamic detection from request
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.headers.host;

    if (host) {
      return `${protocol}://${host}`;
    }

    // Final fallback
    return 'http://localhost:3001';
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (max 5MB, supported formats: images, PDF, text, Word documents)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        originalname: { type: 'string' },
        filename: { type: 'string' },
        location: { type: 'string' },
        size: { type: 'number' },
        mimetype: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid file type or no file uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 413, description: 'File too large' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './upload',
        filename: editFileName,
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, callback) => {
        // Validate file type
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'text/plain',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: any, @Req() req: Request) {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }

      const baseUrl = this.getBaseUrl(req);

      return {
        originalname: file.originalname,
        filename: file.filename,
        location: `${baseUrl}/api/v1/files/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('File upload failed');
    }
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Get uploaded file' })
  @ApiParam({ name: 'filename', description: 'Name of the file to retrieve' })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 400, description: 'File not found' })
  @ApiResponse({ status: 500, description: 'Error serving file' })
  seeUploadedFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const filePath = path.join('./upload', filename);

      if (!fs.existsSync(filePath)) {
        throw new BadRequestException('File not found');
      }

      return res.sendFile(filename, { root: './upload' });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error serving file');
    }
  }
}
