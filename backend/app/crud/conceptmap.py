from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from app.models import ConceptMap
from app.schemas import ConceptMapCreate, ConceptMapUpdate
import logging

logger = logging.getLogger(__name__)

class ConceptMapCRUD:
    def create(self, db: Session, obj_in: ConceptMapCreate) -> ConceptMap:
        """Create a new conceptmap"""
        db_obj = ConceptMap(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        logger.info(f"Created conceptmap with ID: {db_obj.id}")
        return db_obj

    def get(self, db: Session, id: UUID) -> Optional[ConceptMap]:
        """Get conceptmap by ID"""
        return db.query(ConceptMap).filter(ConceptMap.id == id).first()

    def get_translation(
        self, 
        db: Session, 
        source_codesystem_id: UUID, 
        target_codesystem_id: UUID, 
        source_code: UUID
    ) -> Optional[ConceptMap]:
        """Get translation for a specific source code"""
        return db.query(ConceptMap).filter(
            and_(
                ConceptMap.source_codesystem_id == source_codesystem_id,
                ConceptMap.target_codesystem_id == target_codesystem_id,
                ConceptMap.source_code == source_code
            )
        ).first()

    def get_multi(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        source_codesystem_id: Optional[UUID] = None,
        target_codesystem_id: Optional[UUID] = None,
        search: Optional[str] = None
    ) -> List[ConceptMap]:
        """Get multiple conceptmaps with optional filters"""
        query = db.query(ConceptMap)
        
        if source_codesystem_id:
            query = query.filter(ConceptMap.source_codesystem_id == source_codesystem_id)
        
        if target_codesystem_id:
            query = query.filter(ConceptMap.target_codesystem_id == target_codesystem_id)
        
        if search:
            # Since source_code and target_code are UUIDs, we can't search them with ilike
            # Only search equivalence field
            search_filter = ConceptMap.equivalence.ilike(f"%{search}%")
            query = query.filter(search_filter)
        
        return query.offset(skip).limit(limit).all()

    def update(self, db: Session, db_obj: ConceptMap, obj_in: ConceptMapUpdate) -> ConceptMap:
        """Update conceptmap"""
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        logger.info(f"Updated conceptmap with ID: {db_obj.id}")
        return db_obj

    def delete(self, db: Session, id: UUID) -> Optional[ConceptMap]:
        """Delete conceptmap"""
        obj = db.query(ConceptMap).get(id)
        if obj:
            db.delete(obj)
            db.commit()
            logger.info(f"Deleted conceptmap with ID: {id}")
        return obj

    def count(
        self, 
        db: Session, 
        source_codesystem_id: Optional[UUID] = None,
        target_codesystem_id: Optional[UUID] = None,
        search: Optional[str] = None
    ) -> int:
        """Count total conceptmaps"""
        query = db.query(ConceptMap)
        
        if source_codesystem_id:
            query = query.filter(ConceptMap.source_codesystem_id == source_codesystem_id)
        
        if target_codesystem_id:
            query = query.filter(ConceptMap.target_codesystem_id == target_codesystem_id)
        
        if search:
            # Since source_code and target_code are UUIDs, we can't search them with ilike
            # Only search equivalence field
            search_filter = ConceptMap.equivalence.ilike(f"%{search}%")
            query = query.filter(search_filter)
        
        return query.count()

    def get_by_concept_ids(
        self,
        db: Session,
        concept_ids: List[UUID]
    ) -> List[ConceptMap]:
        """Fetch all conceptmap rows where either source_code or target_code is in concept_ids."""
        if not concept_ids:
            return []
        return db.query(ConceptMap).filter(
            or_(
                ConceptMap.source_code.in_(concept_ids),
                ConceptMap.target_code.in_(concept_ids)
            )
        ).all()

conceptmap = ConceptMapCRUD()
