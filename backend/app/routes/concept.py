from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import (
    Concept, ConceptCreate, ConceptUpdate, 
    PaginationParams, PaginatedConceptResponse
)
from app.crud import concept as concept_crud, conceptmap as conceptmap_crud
from app.models import Concept as ConceptModel
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/concepts", tags=["concepts"])

@router.post("/", response_model=Concept)
def create_concept(
    *,
    db: Session = Depends(get_db),
    concept_in: ConceptCreate
):
    """Create a new concept"""
    try:
        concept = concept_crud.concept.create(db=db, obj_in=concept_in)
        return concept
    except Exception as e:
        logger.error(f"Error creating concept: {e}")
        raise HTTPException(status_code=400, detail="Failed to create concept")

@router.get("/", response_model=PaginatedConceptResponse)
def read_concepts(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    codesystem_id: Optional[UUID] = Query(None, description="Filter by codesystem ID"),
    search: Optional[str] = Query(None, description="Search term")
):
    """Retrieve concepts with pagination"""
    try:
        logger.info(f"/concepts search=<{search}> page={page} size={size} codesystem_id={codesystem_id}")
        skip = (page - 1) * size
        concepts = concept_crud.concept.get_multi(
            db=db, skip=skip, limit=size, codesystem_id=codesystem_id, search=search
        )
        total = concept_crud.concept.count(
            db=db, codesystem_id=codesystem_id, search=search
        )
        pages = (total + size - 1) // size
        # Merge ConceptMap mappings into concept properties for easier consumption
        concept_ids = [c.id for c in concepts]
        mappings = conceptmap_crud.conceptmap.get_by_concept_ids(db=db, concept_ids=concept_ids)
        logger.info(f"Found {len(mappings)} conceptmap rows for {len(concept_ids)} concepts")

        # Build lookup dictionaries
        source_map = {}
        target_map = {}
        for m in mappings:
            source_map.setdefault(m.source_code, []).append(m)
            target_map.setdefault(m.target_code, []).append(m)

        enriched_items = []
        for c in concepts:
            props = list(c.properties or [])
            # If this concept is NAMASTE (source), attach its ICD11 mapping(s)
            if c.id in source_map:
                for m in source_map[c.id]:
                    props.append({
                        "code": "icd11Mapping",
                        "valueCode": str(m.target_code),
                        "equivalence": m.equivalence
                    })
            # If this concept is ICD11 (target), attach its NAMASTE mapping(s)
            if c.id in target_map:
                for m in target_map[c.id]:
                    props.append({
                        "code": "namasteMapping",
                        "valueCode": str(m.source_code),
                        "equivalence": m.equivalence
                    })
            # Create a shallow copy model with updated properties
            enriched = ConceptModel(
                id=c.id,
                codesystem_id=c.codesystem_id,
                code=c.code,
                display=c.display,
                definition=c.definition,
                properties=props,
                raw=c.raw,
                created_at=c.created_at,
                updated_at=c.updated_at
            )
            enriched_items.append(enriched)

        return PaginatedConceptResponse(
            items=enriched_items,
            total=total,
            page=page,
            size=size,
            pages=pages
        )
    except Exception as e:
        logger.error(f"Error retrieving concepts: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve concepts")

@router.get("/{concept_id}", response_model=Concept)
def read_concept(
    *,
    db: Session = Depends(get_db),
    concept_id: UUID
):
    """Get a specific concept by ID"""
    concept = concept_crud.concept.get(db=db, id=concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    return concept

@router.get("/by-code/{codesystem_id}/{code}", response_model=Concept)
def read_concept_by_code(
    *,
    db: Session = Depends(get_db),
    codesystem_id: UUID,
    code: str
):
    """Get a concept by codesystem ID and code"""
    concept = concept_crud.concept.get_by_code(
        db=db, codesystem_id=codesystem_id, code=code
    )
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    return concept

@router.get("/codesystem/{codesystem_id}", response_model=List[Concept])
def read_concepts_by_codesystem(
    *,
    db: Session = Depends(get_db),
    codesystem_id: UUID
):
    """Get all concepts for a specific codesystem"""
    try:
        concepts = concept_crud.concept.get_by_codesystem(
            db=db, codesystem_id=codesystem_id
        )
        return concepts
    except Exception as e:
        logger.error(f"Error retrieving concepts for codesystem: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve concepts")

@router.put("/{concept_id}", response_model=Concept)
def update_concept(
    *,
    db: Session = Depends(get_db),
    concept_id: UUID,
    concept_in: ConceptUpdate
):
    """Update a concept"""
    concept = concept_crud.concept.get(db=db, id=concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    try:
        concept = concept_crud.concept.update(
            db=db, db_obj=concept, obj_in=concept_in
        )
        return concept
    except Exception as e:
        logger.error(f"Error updating concept: {e}")
        raise HTTPException(status_code=400, detail="Failed to update concept")

@router.delete("/{concept_id}", response_model=Concept)
def delete_concept(
    *,
    db: Session = Depends(get_db),
    concept_id: UUID
):
    """Delete a concept"""
    concept = concept_crud.concept.get(db=db, id=concept_id)
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    try:
        concept = concept_crud.concept.delete(db=db, id=concept_id)
        return concept
    except Exception as e:
        logger.error(f"Error deleting concept: {e}")
        raise HTTPException(status_code=400, detail="Failed to delete concept")
