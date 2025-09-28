# FHIR Backend API

A production-ready FastAPI backend for FHIR terminology services, compatible with AWS deployment.

## Features

- **FastAPI** with automatic API documentation
- **SQLAlchemy** ORM with **Alembic** migrations
- **PostgreSQL** database support (Supabase compatible)
- **CRUD APIs** for all FHIR terminology resources
- **Concept translation** endpoint
- **Audit logging** for all operations
- **CORS middleware** for frontend integration
- **Docker** support for deployment
- **Health checks** for AWS load balancer
- **Comprehensive error handling** and logging

## Database Schema

### Tables

1. **codesystem** - FHIR CodeSystem resources
2. **concept** - Individual concepts within codesystems
3. **conceptmap** - Mappings between concepts
4. **audit_log** - Audit trail for all operations

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your database credentials
# For Supabase:
DB_HOST=your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSLMODE=require
```

### 2. Local Development

```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload
```

### 3. Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## API Endpoints

### Health Check
- `GET /health` - Health check for load balancer

### CodeSystems
- `GET /api/v1/codesystems/` - List codesystems
- `POST /api/v1/codesystems/` - Create codesystem
- `GET /api/v1/codesystems/{id}` - Get codesystem
- `PUT /api/v1/codesystems/{id}` - Update codesystem
- `DELETE /api/v1/codesystems/{id}` - Delete codesystem

### Concepts
- `GET /api/v1/concepts/` - List concepts
- `POST /api/v1/concepts/` - Create concept
- `GET /api/v1/concepts/{id}` - Get concept
- `PUT /api/v1/concepts/{id}` - Update concept
- `DELETE /api/v1/concepts/{id}` - Delete concept

### ConceptMaps
- `GET /api/v1/conceptmaps/` - List conceptmaps
- `POST /api/v1/conceptmaps/` - Create conceptmap
- `GET /api/v1/conceptmaps/{id}` - Get conceptmap
- `PUT /api/v1/conceptmaps/{id}` - Update conceptmap
- `DELETE /api/v1/conceptmaps/{id}` - Delete conceptmap
- `POST /api/v1/conceptmaps/translate` - Translate concept

### Audit Logs (Read-only)
- `GET /api/v1/audit-logs/` - List audit logs
- `GET /api/v1/audit-logs/{id}` - Get audit log

## Translation Endpoint

Translate concepts between codesystems:

```bash
POST /api/v1/conceptmaps/translate
{
  "source_codesystem": "http://loinc.org",
  "target_codesystem": "http://snomed.info/sct",
  "source_code": "33747-0"
}
```

Response:
```json
{
  "target_code": "123456789",
  "equivalence": "equivalent",
  "found": true
}
```

## Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## AWS Deployment

### ECS/EKS Deployment

1. Build and push Docker image to ECR
2. Create RDS PostgreSQL instance
3. Configure environment variables
4. Deploy using ECS task definition or Kubernetes manifests

### Lambda Deployment

For serverless deployment, consider using:
- **Mangum** adapter for FastAPI
- **RDS Proxy** for database connections
- **API Gateway** for HTTP routing

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | postgres |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `DB_SSLMODE` | SSL mode | require |
| `DEBUG` | Debug mode | False |
| `LOG_LEVEL` | Logging level | INFO |
| `ALLOWED_ORIGINS` | CORS origins | http://localhost:3000 |

## Development

### Project Structure

```
backend/
├── app/
│   ├── crud/          # Database operations
│   ├── routes/        # API endpoints
│   ├── utils/         # Utility functions
│   ├── db.py          # Database configuration
│   ├── models.py      # SQLAlchemy models
│   ├── schemas.py     # Pydantic schemas
│   └── main.py        # FastAPI app
├── alembic/           # Database migrations
├── Dockerfile         # Container configuration
├── docker-compose.yml # Local development
└── requirements.txt   # Python dependencies
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## License

MIT License
