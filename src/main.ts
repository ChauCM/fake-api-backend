import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TypeORMExceptionFilter } from '@utils/filters/typeorm.filter';
import { SeedService } from '@services/seed.service';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { SwaggerController } from './controllers/swagger.controller';

const devContentSecurityPolicy = {
  directives: {
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
    imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({
      contentSecurityPolicy: devContentSecurityPolicy,
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new TypeORMExceptionFilter());

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
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controllers!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Platzi Fake Store API Documentation',
    customfavIcon: 'https://avatars.githubusercontent.com/u/79133911?s=200&v=4',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  // Initialize SwaggerController
  const swaggerController = app.get(SwaggerController);
  swaggerController.setApp(app);

  const seedService = app.get(SeedService);
  await seedService.init();

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
