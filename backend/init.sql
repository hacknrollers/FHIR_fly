-- Initialize database with extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for better performance
-- These will be created after tables are created by Alembic

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;
