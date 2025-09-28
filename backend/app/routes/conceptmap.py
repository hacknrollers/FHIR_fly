from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import (
    ConceptMap, ConceptMapCreate, ConceptMapUpdate, 
    TranslationRequest, TranslationResponse,
    PaginationParams, PaginatedConceptMapResponse
)
from app.crud import conceptmap as conceptmap_crud, codesystem as codesystem_crud
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/conceptmaps", tags=["conceptmaps"])

@router.post("/", response_model=ConceptMap)
def create_conceptmap(
    *,
    db: Session = Depends(get_db),
    conceptmap_in: ConceptMapCreate
):
    """Create a new conceptmap"""
    try:
        conceptmap = conceptmap_crud.conceptmap.create(db=db, obj_in=conceptmap_in)
        return conceptmap
    except Exception as e:
        logger.error(f"Error creating conceptmap: {e}")
        raise HTTPException(status_code=400, detail="Failed to create conceptmap")

@router.get("/", response_model=PaginatedConceptMapResponse)
def read_conceptmaps(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    source_codesystem_id: Optional[UUID] = Query(None, description="Filter by source codesystem ID"),
    target_codesystem_id: Optional[UUID] = Query(None, description="Filter by target codesystem ID"),
    search: Optional[str] = Query(None, description="Search term")
):
    """Retrieve conceptmaps with pagination"""
    try:
        skip = (page - 1) * size
        conceptmaps = conceptmap_crud.conceptmap.get_multi(
            db=db, 
            skip=skip, 
            limit=size, 
            source_codesystem_id=source_codesystem_id,
            target_codesystem_id=target_codesystem_id,
            search=search
        )
        total = conceptmap_crud.conceptmap.count(
            db=db, 
            source_codesystem_id=source_codesystem_id,
            target_codesystem_id=target_codesystem_id,
            search=search
        )
        pages = (total + size - 1) // size
        
        return PaginatedConceptMapResponse(
            items=conceptmaps,
            total=total,
            page=page,
            size=size,
            pages=pages
        )
    except Exception as e:
        logger.error(f"Error retrieving conceptmaps: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve conceptmaps")

@router.get("/{conceptmap_id}", response_model=ConceptMap)
def read_conceptmap(
    *,
    db: Session = Depends(get_db),
    conceptmap_id: UUID
):
    """Get a specific conceptmap by ID"""
    conceptmap = conceptmap_crud.conceptmap.get(db=db, id=conceptmap_id)
    if not conceptmap:
        raise HTTPException(status_code=404, detail="Conceptmap not found")
    return conceptmap

@router.put("/{conceptmap_id}", response_model=ConceptMap)
def update_conceptmap(
    *,
    db: Session = Depends(get_db),
    conceptmap_id: UUID,
    conceptmap_in: ConceptMapUpdate
):
    """Update a conceptmap"""
    conceptmap = conceptmap_crud.conceptmap.get(db=db, id=conceptmap_id)
    if not conceptmap:
        raise HTTPException(status_code=404, detail="Conceptmap not found")
    
    try:
        conceptmap = conceptmap_crud.conceptmap.update(
            db=db, db_obj=conceptmap, obj_in=conceptmap_in
        )
        return conceptmap
    except Exception as e:
        logger.error(f"Error updating conceptmap: {e}")
        raise HTTPException(status_code=400, detail="Failed to update conceptmap")

@router.delete("/{conceptmap_id}", response_model=ConceptMap)
def delete_conceptmap(
    *,
    db: Session = Depends(get_db),
    conceptmap_id: UUID
):
    """Delete a conceptmap"""
    conceptmap = conceptmap_crud.conceptmap.get(db=db, id=conceptmap_id)
    if not conceptmap:
        raise HTTPException(status_code=404, detail="Conceptmap not found")
    
    try:
        conceptmap = conceptmap_crud.conceptmap.delete(db=db, id=conceptmap_id)
        return conceptmap
    except Exception as e:
        logger.error(f"Error deleting conceptmap: {e}")
        raise HTTPException(status_code=400, detail="Failed to delete conceptmap")

@router.post("/translate", response_model=TranslationResponse)
def translate_concept(
    *,
    db: Session = Depends(get_db),
    translation_request: TranslationRequest
):
    """Translate a concept from source to target codesystem"""
    try:
        # Find source codesystem
        source_codesystem = codesystem_crud.codesystem.get_by_url(
            db=db, url=translation_request.source_codesystem
        )
        if not source_codesystem:
            source_codesystem = codesystem_crud.codesystem.get_by_name(
                db=db, name=translation_request.source_codesystem
            )
        
        if not source_codesystem:
            raise HTTPException(
                status_code=404, 
                detail=f"Source codesystem not found: {translation_request.source_codesystem}"
            )
        
        # Find target codesystem
        target_codesystem = codesystem_crud.codesystem.get_by_url(
            db=db, url=translation_request.target_codesystem
        )
        if not target_codesystem:
            target_codesystem = codesystem_crud.codesystem.get_by_name(
                db=db, name=translation_request.target_codesystem
            )
        
        if not target_codesystem:
            raise HTTPException(
                status_code=404, 
                detail=f"Target codesystem not found: {translation_request.target_codesystem}"
            )
        
        # Find translation - convert source_code string to UUID if needed
        try:
            from uuid import UUID
            source_code_uuid = UUID(translation_request.source_code)
        except ValueError:
            # If source_code is not a valid UUID, return not found
            return TranslationResponse(
                target_code=None,
                equivalence=None,
                found=False
            )
        
        conceptmap = conceptmap_crud.conceptmap.get_translation(
            db=db,
            source_codesystem_id=source_codesystem.id,
            target_codesystem_id=target_codesystem.id,
            source_code=source_code_uuid
        )
        
        if conceptmap:
            return TranslationResponse(
                target_code=conceptmap.target_code,
                equivalence=conceptmap.equivalence,
                found=True
            )
        else:
            return TranslationResponse(
                target_code=None,
                equivalence=None,
                found=False
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error translating concept: {e}")
        raise HTTPException(status_code=500, detail="Failed to translate concept")
