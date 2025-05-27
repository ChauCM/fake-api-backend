import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Controller('swagger')
export class SwaggerController {
    private app: INestApplication;

    setApp(app: INestApplication) {
        this.app = app;
    }

    @Get('json')
    getSwaggerJson(@Res() res: Response) {
        const config = new DocumentBuilder()
            .setTitle('Platzi Fake Store API')
            .setDescription('The Platzi Fake Store API description')
            .setVersion('1.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'JWT',
                    description: 'Enter JWT token',
                    in: 'header',
                },
                'JWT-auth',
            )
            .build();
        const document = SwaggerModule.createDocument(this.app, config);
        res.setHeader('Content-Type', 'application/json');
        res.send(document);
    }

    @Get('yaml')
    getSwaggerYaml(@Res() res: Response) {
        const config = new DocumentBuilder()
            .setTitle('Platzi Fake Store API')
            .setDescription('The Platzi Fake Store API description')
            .setVersion('1.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'JWT',
                    description: 'Enter JWT token',
                    in: 'header',
                },
                'JWT-auth',
            )
            .build();
        const document = SwaggerModule.createDocument(this.app, config);
        const yaml = require('js-yaml');
        const yamlString = yaml.dump(document);
        res.setHeader('Content-Type', 'text/yaml');
        res.send(yamlString);
    }
}
