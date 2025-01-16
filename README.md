# Microservices Project

## Introduction

This project demonstrates a microservices-based architecture leveraging the following components:

- **Consul** for service discovery and configuration management.
- **JWT Authentication** for secure communication between services.
- **Traefik** for reverse proxying and load balancing.
- **Docker Compose** to manage the entire stack.

## Architecture Overview

The system consists of the following services:

1. **Consul Server**
   - Handles service discovery and acts as the central registry for all services.
2. **Auth Service**
   - Provides JWT-based authentication.
   - Exposes an endpoint for generating tokens.
3. **API Gateway**
   - Acts as the single entry point for clients.
   - Verifies JWT tokens and forwards requests to appropriate services.
4. **Student Service**
   - Manages student-related data.
5. **School Service**
   - Manages school-related data.
6. **Traefik**
   - Acts as a reverse proxy and load balancer.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js installed for local development (optional).

## Setup Instructions

### Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### Build and Run Services

Start all services using Docker Compose:

```bash
docker-compose up -d --build
```

### Access Services

- **Consul Dashboard**: [http://localhost:8500](http://localhost:8500)
- **Traefik Dashboard**: [http://localhost:8081](http://localhost:8081)
- **Auth Service**: [http://localhost:7000](http://localhost:7000)
- **API Gateway**: [http://localhost:8080](http://localhost:8080)
- **Student Service**: [http://localhost:4000](http://localhost:4000)
- **School Service**: [http://localhost:5001](http://localhost:5001)

## Detailed Endpoints

### Auth Service

1. **Generate JWT Token**
   - **URL**: `/auth/login`
   - **Method**: `POST`
   - **Payload**:
     ```json
     {
       "username": "user",
       "password": "password"
     }
     ```
   - **Response**:
     ```json
     {
       "token": "<JWT_TOKEN>"
     }
     ```

### API Gateway

1. **Get Students**
   - **URL**: `/students`
   - **Method**: `GET`
   - **Headers**:
     ```json
     {
       "Authorization": "Bearer <JWT_TOKEN>"
     }
     ```

2. **Get Schools**
   - **URL**: `/schools`
   - **Method**: `GET`
   - **Headers**:
     ```json
     {
       "Authorization": "Bearer <JWT_TOKEN>"
     }
     ```

### Student Service

1. **List Students**
   - **URL**: `/students`
   - **Method**: `GET`
   - **Response**:
     ```json
     [
       { "id": 1, "name": "Alice", "age": 22 },
       { "id": 2, "name": "Bob", "age": 24 }
     ]
     ```

### School Service

1. **List Schools**
   - **URL**: `/schools`
   - **Method**: `GET`
   - **Response**:
     ```json
     [
       { "id": 1, "name": "Engineering School", "location": "Paris" },
       { "id": 2, "name": "Business School", "location": "Lyon" }
     ]
     ```

## Security

- The API Gateway verifies JWT tokens using the `SECRET_KEY`.
- The `Auth-Service` uses a basic username-password check for token generation.
- Ensure to replace the placeholder `SECRET_KEY` with a secure key in production.

## Troubleshooting

- If services are not appearing in the Consul dashboard, verify the `address` and `port` configuration in each service.
- Check logs for any errors using:
  ```bash
  docker-compose logs <service-name>
  ```

## Future Improvements

- Implement a database for persistent storage.
- Enhance authentication to use a secure database and hashed passwords.
- Add unit and integration tests.