import os
import logging
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.db import engine, Base
from app.routes import codesystem, concept, conceptmap, audit_log
from app.schemas import HealthResponse
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting FHIR Backend API...")
    
    # Test database connection
    try:
        from app.db import get_sync_db
        from sqlalchemy import text
        db = get_sync_db()
        db.execute(text("SELECT 1"))
        db.close()
        logger.info("Database connection successful")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down FHIR Backend API...")

# Create FastAPI app
app = FastAPI(
    title="FHIR Backend API",
    description="A production-ready FastAPI backend for FHIR terminology services",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(codesystem.router, prefix="/api/v1")
app.include_router(concept.router, prefix="/api/v1")
app.include_router(conceptmap.router, prefix="/api/v1")
app.include_router(audit_log.router, prefix="/api/v1")

@app.get("/", response_model=dict)
def root():
    """Root endpoint"""
    return {
        "message": "FHIR Backend API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint for AWS load balancer"""
    try:
        # Test database connection
        from app.db import get_sync_db
        from sqlalchemy import text
        db = get_sync_db()
        db.execute(text("SELECT 1"))
        db.close()
        database_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        database_status = "disconnected"
    
    return HealthResponse(
        status="healthy" if database_status == "connected" else "unhealthy",
        timestamp=datetime.utcnow(),
        version="1.0.0",
        database=database_status
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url)
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
