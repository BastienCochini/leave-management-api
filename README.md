# Leave Management API

## Description

The **Leave Management API** is a REST API designed to manage employee absences. It exposes CRUD routes for **Employee** and **Leave** resources. The API uses **Fastify** for routing and performance, and connects to a PostgreSQL database via **Knex** for query building.

The API is built with **TypeScript**, and the compilation is managed by **tsup**.

## Prerequisites

Before starting, make sure you have [Docker](https://www.docker.com/) and [Yarn](https://yarnpkg.com/) installed on your machine.

## Installation

Clone the repository to your local machine:
```bash
  git clone https://github.com/BastienCochini/leave-management-api.git
```

Then, install the dependencies:
```bash
  yarn
```
## Running the API Locally

To run the API locally, you can use Docker and Docker Compose.

### Starting the Docker Services (API + Database)

To start the API and database using Docker, run the command:
```bash
  yarn docker:dev
  ```
This will:
- Start the services in Docker using `docker-compose`.
- Show the logs of the API in real-time.

### Running Migrations and Seeders

On the first launch, you need to run migrations and seeders to initialize the database with the correct tables and test data.

In a new terminal, execute:
```bash
  yarn migrateandseed
```
This command will:
- Build the migrations using `tsup`.
- Execute the migrations to set up the database schema.
- Build the seeders and populate the database with initial data.

## Available Scripts

- `yarn docker:dev`: Starts the API and PostgreSQL database in Docker with real-time logs.
- `yarn docker:up`: Starts the Docker services for the API and database.
- `yarn docker:stop`: Stops the running Docker services.
- `yarn docker:watch`: Displays the real-time logs for the API.
- `yarn dev`: Runs the API in development mode with `nodemon` for automatic restarts.
- `yarn build`: Compiles the project for production.
- `yarn start`: Starts the production server.
- `yarn migrate:build`: Compiles migrations.
- `yarn migrate:exec`: Executes the migrations.
- `yarn migrate`: Runs both the build and execution of migrations.
- `yarn seed:build`: Compiles the seeders.
- `yarn seed:exec`: Executes the seeders.
- `yarn seed`: Runs both the build and execution of seeders.
- `yarn migrateandseed`: Runs both migrations and seeders in sequence.
- `yarn lint`: Runs ESLint to fix linting issues in the code.

## Testing

The project doesn't currently include a dedicated testing setup.
