# Product System

This project is structured as a monorepo of 2 backend services.

## System Components

### Product Service

This service exposes a REST API which allows users to manipulate: products and reviews.

### Product Review Processor

This service handles events coming from Product Service and calculates average
product ratings. It can be replicated in order to scale the system horizontally
thanks to RMQ supporting multiple consumers.

### RabbitMQ

As a transport layer for inter-service communication we've used RabbitMQ but
thanks to NestJS framework this can be swapped for different infrastructure.

### PostgreSQL

For persisting products and reviews an SQL database offers best capabilities. It
can easily support entity relationships and allows for flexible querying.

### MongoDB

For storing denormalised aggregate data a NoSQL database is perfect. It offers
quick updates and retrievals.

### Cache

Currently 2 resources are being cached.

- Automatic response caching set up on the `GET /api/v1/products/:id/reviews` endpoint.
- The average ratings are also cached using the `AverageRatingService`

The cache is now only in-memory but thanks to NestJS it can be swapped for Redis easily.
If needed the setting can be controlled by environment varable and use Redis
only in production.

## System Design Decisions

### API versioning

For ease of use versioning of API endpoints is part of the URL. Every endpoint is prefixed
with `api/:version`, e.g. `api/v1/products`

### Domain-Driven Design

In order to separate implementation details from business logic this project employs DDD.
In both services you'll find `domain` directory containing only domain related classes.
These classes protect domain object invariants using validation of inputs upon instantiation.
This is done automatically, see `ValidatedClass`.

### NestJS

The project stands on the shoulders of NestJS framework. Thanks to this robust library
many complex features are available for a fraction of the development efforts:

- monorepo
- microservices
- modularisation
- dependency injection
- ORM support
- etc.

### TypeORM

This is the default ORM supported by NestJS unlike Prisma it offers interface for both
PostgreSQL and MongoDB. This allows us to abstract most details about data persistence.

Current setting allows for easy developer experience because in the docker environment
the auto-sync feature of TypeORM is on. Meaning that any changes to database schema
are automatically applied.

For production environment a migration system must be added. TypeORM supports that as well.

### Testing

All tests found in the project are unit tests related to the domain objects.
For the lack of time no e2e or integration tests are included.

Before the system can be moved to the production environment this has to be amended.

---

## Local Development Environment

The system can be run in Docker containers using `docker compose`. Use these
`npm` commands:

### Starting the System

- First time running the system:

```shell
npm run docker:up
```

This will build all images and start containers in detached mode.

### Following Logs

- View logs from all services:

```shell
npm run docker:logs
```

- View logs from specific service:

```shell
npm run docker:logs:product-service    # Product service only
npm run docker:logs:processor          # Product review processor only
npm run docker:logs:rabbitmq           # RabbitMQ only
```

### Stopping the System

```shell
npm run docker:down
```

### Restarting with Fresh Build

```shell
npm run docker:restart
```

## Hot Reloading

Code changes are automatically detected and services restart thanks to volume
mounting and NestJS watch mode.

## RabbitMQ management console

By default you can access it at [http://localhost:15672](http://localhost:15672)
username: `admin`, password: `password`

### API documentation

While `product-service` is running, you can access the OpenAPI documentation by
visiting [http://localhost:3000/docs](http://localhost:3000/docs)

or downloading the documentation in JSON format:

```shell
npm run docs:download
```

you'll then find the document in `./docs/api-spec.json`. Import it into your
favourite API client like Postman or Bruno.

### Environment Variables

All environment variables are set in `docker-compose.yml` file directly for
simplicity but if this system would be deployed in production proper secret
management must be added.
