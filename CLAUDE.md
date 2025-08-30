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

## Environment Setup

The product-review-processor requires RabbitMQ running on localhost:5672 for message queue functionality.