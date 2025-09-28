from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

# Base schemas
class BaseSchema(BaseModel):
    # Pydantic v2: enable ORM mode for SQLAlchemy models
    model_config = ConfigDict(from_attributes=True)

# CodeSystem schemas
class CodeSystemBase(BaseSchema):
    external_id: Optional[str] = None
    url: Optional[str] = None
    version: Optional[str] = None
    name: Optional[str] = None
    title: Optional[str] = None
    status: Optional[str] = None
    publisher: Optional[str] = None
    content: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None
    resource: Optional[Dict[str, Any]] = None

class CodeSystemCreate(CodeSystemBase):
    pass

class CodeSystemUpdate(BaseSchema):
    external_id: Optional[str] = None
    url: Optional[str] = None
    version: Optional[str] = None
    name: Optional[str] = None
    title: Optional[str] = None
    status: Optional[str] = None
    publisher: Optional[str] = None
    content: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None
    resource: Optional[Dict[str, Any]] = None

class CodeSystem(CodeSystemBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

# Concept schemas
class ConceptBase(BaseSchema):
    codesystem_id: UUID
    code: str
    display: Optional[str] = None
    definition: Optional[str] = None
    properties: Optional[List[Dict[str, Any]]] = None  # Changed to List[Dict] to match DB data
    raw: Optional[Dict[str, Any]] = None

class ConceptCreate(ConceptBase):
    pass

class ConceptUpdate(BaseSchema):
    codesystem_id: Optional[UUID] = None
    code: Optional[str] = None
    display: Optional[str] = None
    definition: Optional[str] = None
    properties: Optional[List[Dict[str, Any]]] = None  # Changed to List[Dict] to match DB data
    raw: Optional[Dict[str, Any]] = None

class Concept(ConceptBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

# ConceptMap schemas
class ConceptMapBase(BaseSchema):
    source_codesystem_id: UUID
    target_codesystem_id: UUID
    source_code: UUID  # Changed to UUID to match DB schema
    target_code: UUID  # Changed to UUID to match DB schema
    equivalence: Optional[str] = None
    conceptmap_metadata: Optional[Dict[str, Any]] = None  # Map to actual 'metadata' column in DB

class ConceptMapCreate(ConceptMapBase):
    pass

class ConceptMapUpdate(BaseSchema):
    source_codesystem_id: Optional[UUID] = None
    target_codesystem_id: Optional[UUID] = None
    source_code: Optional[UUID] = None  # Changed to UUID
    target_code: Optional[UUID] = None  # Changed to UUID
    equivalence: Optional[str] = None
    conceptmap_metadata: Optional[Dict[str, Any]] = None  # Map to actual 'metadata' column in DB

class ConceptMap(ConceptMapBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

# AuditLog schemas (read-only)
class AuditLog(BaseSchema):
    id: UUID
    table_name: str
    operation: str
    record_id: UUID
    user_id: Optional[str] = None
    changed_at: datetime
    old_data: Optional[Dict[str, Any]] = None
    new_data: Optional[Dict[str, Any]] = None
    meta: Optional[Dict[str, Any]] = None

# Translation schemas
class TranslationRequest(BaseSchema):
    source_codesystem: str = Field(..., description="Source codesystem URL or name")
    target_codesystem: str = Field(..., description="Target codesystem URL or name")
    source_code: str = Field(..., description="Source code to translate")

class TranslationResponse(BaseSchema):
    target_code: Optional[UUID] = None  # Changed to UUID to match DB schema
    equivalence: Optional[str] = None
    found: bool = Field(..., description="Whether translation was found")

# Health check schema
class HealthResponse(BaseSchema):
    status: str = "healthy"
    timestamp: datetime
    version: str = "1.0.0"
    database: str = "connected"

# Pagination schemas
class PaginationParams(BaseSchema):
    page: int = Field(1, ge=1, description="Page number")
    size: int = Field(10, ge=1, le=100, description="Page size")

class PaginatedResponse(BaseSchema):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int

# Specific paginated responses for each model
class PaginatedConceptResponse(BaseSchema):
    items: List[Concept]
    total: int
    page: int
    size: int
    pages: int

class PaginatedCodeSystemResponse(BaseSchema):
    items: List[CodeSystem]
    total: int
    page: int
    size: int
    pages: int

class PaginatedConceptMapResponse(BaseSchema):
    items: List[ConceptMap]
    total: int
    page: int
    size: int
    pages: int
