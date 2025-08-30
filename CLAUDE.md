# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a NestJS monorepo with two microservices:

- **product-service** (`apps/product-service/`) - Main HTTP API service running on port 3000
- **product-review-processor** (`apps/product-review-processor/`) - RabbitMQ microservice for processing review events

The project uses NestJS CLI for managing the monorepo structure with applications defined in `nest-cli.json`.

## Architecture

- **product-service**: Standard NestJS HTTP application with Express platform
- **product-review-processor**: NestJS microservice using RabbitMQ transport (amqp://localhost:5672, queue: 'event_queue')
- Both services share the same AppModule from product-service (line 3 in product-review-processor/main.ts)

## Development Commands

```bash
# Build
npm run build

# Development
npm run start:dev        # Start with file watching
npm run start:debug      # Start in debug mode with watching

# Production
npm run start:prod       # Run built application

# Code Quality
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Run tests with coverage
npm run test:e2e         # Run e2e tests
npm run test:debug       # Run tests in debug mode

# Specific app commands
nest start product-service
nest start product-review-processor
```

## Testing

- Jest is configured with TypeScript support (`ts-jest`)
- Test files use `.spec.ts` suffix
- E2E tests are in each app's `test/` directory
- Coverage reports generated in `./coverage/`
- Tests run from `apps/` root directory

## Dependencies

Key dependencies:

- NestJS framework with microservices support
- RabbitMQ via `amqplib` and `amqp-connection-manager`
- TypeScript with ESLint and Prettier for code quality

## Application Structure

The application follows Domain-Driven Design (DDD) and Clean Architecture principles:

### Layered Architecture

- **Domain Layer** (`domain/`): Contains business entities, value objects, and domain logic
  - `Product` entity with validation using `class-validator`
  - `ProductId` value object for type-safe identifiers
  - Domain entities extend `ValidatedClass` for automatic validation

- **Application Layer** (`application/`): Contains use cases and application services
  - `CreateProductUseCase`: Orchestrates product creation flow
  - Use cases handle business logic and coordinate between layers

- **Infrastructure Layer** (`infrastracture/`): Contains adapters and external integrations
  - `ProductAdapter`: Maps between domain entities and database entities
  - Handles price conversion (cents ↔ euros) using transformers

- **API Layer** (`dtos/`, `*.controller.ts`): HTTP interface and data transfer objects
  - DTOs with Swagger documentation (`@ApiProperty`, `@ApiPropertyOptional`)
  - Controllers delegate to use cases

### Key Patterns

- **Entity Separation**: Domain entities (`domain/products/product.entity.ts`) vs DB entities (`entities/product.entity.ts`)
- **Value Objects**: `ProductId` provides type safety and validation
- **Adapters**: Convert between domain and infrastructure layers
- **Price Handling**: Stored as cents (integers) in domain, converted to euros (decimal) in database
- **Validation**: Domain entities self-validate, DTOs validate API input

### API Endpoints

- `POST /api/v1/products` - Create new product
  - Input: `CreateProductDto` (name, price in cents, optional description)
  - Output: `CreateProductResponseDto` with generated UUID
  - Swagger documentation included

## Environment Setup

The product-review-processor requires RabbitMQ running on localhost:5672 for message queue functionality.

## Memory

Always use create method on a class that inherits from the ValidatedClass instead of using default new constructor.

