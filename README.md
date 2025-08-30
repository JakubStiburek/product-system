# Product System

## Local Development Environment

The system can be run in Docker containers using `docker compose`. Use these `npm` commands:

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

Code changes are automatically detected and services restart thanks to volume mounting and NestJS watch mode.

## RabbitMQ management console

By default you can access it at [http://localhost:15672](http://localhost:15672) username: `admin`, password: `password`
