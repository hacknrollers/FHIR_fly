from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import (
    CodeSystem, CodeSystemCreate, CodeSystemUpdate, 
    PaginationParams, PaginatedCodeSystemResponse
)
from app.crud import codesystem as codesystem_crud
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/codesystems", tags=["codesystems"])

@router.post("/", response_model=CodeSystem)
def create_codesystem(
    *,
    db: Session = Depends(get_db),
    codesystem_in: CodeSystemCreate
):
    """Create a new codesystem"""
    try:
        codesystem = codesystem_crud.codesystem.create(db=db, obj_in=codesystem_in)
        return codesystem
    except Exception as e:
        logger.error(f"Error creating codesystem: {e}")
        raise HTTPException(status_code=400, detail="Failed to create codesystem")

@router.get("/", response_model=PaginatedCodeSystemResponse)
def read_codesystems(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    search: Optional[str] = Query(None, description="Search term")
):
    """Retrieve codesystems with pagination"""
    try:
        skip = (page - 1) * size
        codesystems = codesystem_crud.codesystem.get_multi(
            db=db, skip=skip, limit=size, search=search
        )
        total = codesystem_crud.codesystem.count(db=db, search=search)
        pages = (total + size - 1) // size
        
        return PaginatedCodeSystemResponse(
            items=codesystems,
            total=total,
            page=page,
            size=size,
            pages=pages
        )
    except Exception as e:
        logger.error(f"Error retrieving codesystems: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve codesystems")

@router.get("/{codesystem_id}", response_model=CodeSystem)
def read_codesystem(
    *,
    db: Session = Depends(get_db),
    codesystem_id: UUID
):
    """Get a specific codesystem by ID"""
    codesystem = codesystem_crud.codesystem.get(db=db, id=codesystem_id)
    if not codesystem:
        raise HTTPException(status_code=404, detail="Codesystem not found")
    return codesystem

@router.get("/by-url/{url:path}", response_model=CodeSystem)
def read_codesystem_by_url(
    *,
    db: Session = Depends(get_db),
    url: str
):
    """Get a codesystem by URL"""
    codesystem = codesystem_crud.codesystem.get_by_url(db=db, url=url)
    if not codesystem:
        raise HTTPException(status_code=404, detail="Codesystem not found")
    return codesystem

@router.get("/by-name/{name}", response_model=CodeSystem)
def read_codesystem_by_name(
    *,
    db: Session = Depends(get_db),
    name: str
):
    """Get a codesystem by name"""
    codesystem = codesystem_crud.codesystem.get_by_name(db=db, name=name)
    if not codesystem:
        raise HTTPException(status_code=404, detail="Codesystem not found")
    return codesystem

@router.put("/{codesystem_id}", response_model=CodeSystem)
def update_codesystem(
    *,
    db: Session = Depends(get_db),
    codesystem_id: UUID,
    codesystem_in: CodeSystemUpdate
):
    """Update a codesystem"""
    codesystem = codesystem_crud.codesystem.get(db=db, id=codesystem_id)
    if not codesystem:
        raise HTTPException(status_code=404, detail="Codesystem not found")
    
    try:
        codesystem = codesystem_crud.codesystem.update(
            db=db, db_obj=codesystem, obj_in=codesystem_in
        )
        return codesystem
    except Exception as e:
        logger.error(f"Error updating codesystem: {e}")
        raise HTTPException(status_code=400, detail="Failed to update codesystem")

@router.delete("/{codesystem_id}", response_model=CodeSystem)
def delete_codesystem(
    *,
    db: Session = Depends(get_db),
    codesystem_id: UUID
):
    """Delete a codesystem"""
    codesystem = codesystem_crud.codesystem.get(db=db, id=codesystem_id)
    if not codesystem:
        raise HTTPException(status_code=404, detail="Codesystem not found")
    
    try:
        codesystem = codesystem_crud.codesystem.delete(db=db, id=codesystem_id)
        return codesystem
    except Exception as e:
        logger.error(f"Error deleting codesystem: {e}")
        raise HTTPException(status_code=400, detail="Failed to delete codesystem")
