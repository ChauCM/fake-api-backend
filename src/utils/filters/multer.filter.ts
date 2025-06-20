import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { MulterError } from 'multer';
import { Request, Response } from 'express';

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: MulterError, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();
        const request = context.getRequest<Request>();
        const { url } = request;

        let errorMessage = 'File upload error';
        let statusCode = HttpStatus.BAD_REQUEST;

        switch (exception.code) {
            case 'LIMIT_FILE_SIZE':
                errorMessage = 'File too large. Maximum size is 5MB';
                break;
            case 'LIMIT_FILE_COUNT':
                errorMessage = 'Too many files uploaded';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                errorMessage = 'Unexpected file field';
                break;
            case 'LIMIT_FIELD_KEY':
                errorMessage = 'Field name too long';
                break;
            case 'LIMIT_FIELD_VALUE':
                errorMessage = 'Field value too long';
                break;
            case 'LIMIT_FIELD_COUNT':
                errorMessage = 'Too many fields';
                break;
            case 'LIMIT_PART_COUNT':
                errorMessage = 'Too many parts';
                break;
            default:
                errorMessage = 'File upload failed';
                statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        const errorResponse = {
            path: url,
            timestamp: new Date().toISOString(),
            name: 'MulterError',
            message: errorMessage,
            code: exception.code,
        };

        response.status(statusCode).json(errorResponse);
    }
}
