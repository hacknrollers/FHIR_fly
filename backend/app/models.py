import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class CodeSystem(Base):
    __tablename__ = "codesystem"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_id = Column(Text)
    url = Column(Text)
    version = Column(Text)
    name = Column(Text)
    title = Column(Text)
    status = Column(Text)
    publisher = Column(Text)
    content = Column(Text)
    meta = Column(JSON)
    resource = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    concepts = relationship("Concept", back_populates="codesystem")
    source_conceptmaps = relationship("ConceptMap", foreign_keys="ConceptMap.source_codesystem_id", back_populates="source_codesystem")
    target_conceptmaps = relationship("ConceptMap", foreign_keys="ConceptMap.target_codesystem_id", back_populates="target_codesystem")

class Concept(Base):
    __tablename__ = "concept"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    codesystem_id = Column(UUID(as_uuid=True), ForeignKey("codesystem.id"), nullable=False)
    code = Column(Text, nullable=False)
    display = Column(Text)
    definition = Column(Text)
    properties = Column(JSON)
    raw = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    codesystem = relationship("CodeSystem", back_populates="concepts")

class ConceptMap(Base):
    __tablename__ = "conceptmap"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_codesystem_id = Column(UUID(as_uuid=True), ForeignKey("codesystem.id"), nullable=False)
    target_codesystem_id = Column(UUID(as_uuid=True), ForeignKey("codesystem.id"), nullable=False)
    source_code = Column(UUID(as_uuid=True), nullable=False)  # Matches your DB schema
    target_code = Column(UUID(as_uuid=True), nullable=False)  # Matches your DB schema
    equivalence = Column(Text)
    conceptmap_metadata = Column('metadata', JSON)  # Map to actual 'metadata' column in DB
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    source_codesystem = relationship("CodeSystem", foreign_keys=[source_codesystem_id], back_populates="source_conceptmaps")
    target_codesystem = relationship("CodeSystem", foreign_keys=[target_codesystem_id], back_populates="target_conceptmaps")

class AuditLog(Base):
    __tablename__ = "audit_log"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    table_name = Column(Text, nullable=False)
    operation = Column(Text, nullable=False)  # INSERT, UPDATE, DELETE
    record_id = Column(UUID(as_uuid=True), nullable=False)
    user_id = Column(Text)
    changed_at = Column(DateTime(timezone=True), server_default=func.now())
    old_data = Column(JSON)
    new_data = Column(JSON)
    meta = Column(JSON)
