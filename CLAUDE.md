# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run start:dev` - Start development server with watch mode (port 3001)
- `npm run build` - Build for production 
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

### Testing
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage report

### Database
- `npm run seed` - Run database seeding manually (usually auto-runs on startup)

## Architecture Overview

This is a **NestJS-based fake e-commerce API** providing both REST and GraphQL endpoints. The application uses SQLite in-memory database that resets on each restart.

### Key Framework Components
- **NestJS**: Main framework with dependency injection
- **TypeORM**: Database ORM with entity relationships
- **JWT + Passport**: Authentication system
- **Apollo Server**: GraphQL implementation
- **Swagger**: Auto-generated API documentation at `/docs`

### Core Application Flow
1. **Bootstrap** (`src/main.ts`): Sets up global pipes, filters, CORS, Helmet security, and Swagger docs
2. **Database**: SQLite in-memory database with auto-seeding via `SeedService`
3. **API Prefix**: All REST endpoints prefixed with `/api/v1/`
4. **GraphQL**: Available at `/graphql` endpoint

### Database Architecture
- **In-memory SQLite**: Database resets on each application restart
- **Auto-seeding**: `SeedService` populates database with mock data on startup
- **Entities**: User, Category, Product with proper relationships
- **Config**: Database configuration in `data-source.ts`

### Authentication System
- **JWT-based**: Access and refresh tokens
- **Passport strategies**: Local (login) and JWT (protected routes)
- **Guards**: `@nestjs/common` guards protect routes
- **Roles**: Admin and Customer roles for authorization

### API Structure
- **REST Controllers**: Handle HTTP requests (`src/controllers/`)
- **GraphQL Resolvers**: Handle GraphQL queries/mutations (`src/resolvers/`)
- **Services**: Business logic layer (`src/services/`)
- **DTOs**: Request/response validation (`src/dtos/`)
- **Entities**: Database models (`src/database/entities/`)

### Key Directories
- `src/controllers/` - REST API endpoints
- `src/services/` - Business logic
- `src/resolvers/` - GraphQL resolvers
- `src/database/` - Entities, seeds, and database config
- `src/guards/` - Authentication guards
- `src/strategies/` - Passport authentication strategies
- `src/dtos/` - Data transfer objects for validation
- `src/utils/` - Utility functions and filters

### Development Notes
- Server runs on port 3001 by default
- Database is seeded automatically on startup with mock users, categories, and products
- Uses TypeScript path mapping for clean imports (e.g., `@services/`, `@db/`)
- Comprehensive validation with class-validator decorators
- Global exception filters for TypeORM and Multer errors
- Rate limiting enabled via Throttler guard