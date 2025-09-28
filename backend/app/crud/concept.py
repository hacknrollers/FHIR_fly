from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import Concept
from app.schemas import ConceptCreate, ConceptUpdate
import logging

logger = logging.getLogger(__name__)

class ConceptCRUD:
    def create(self, db: Session, obj_in: ConceptCreate) -> Concept:
        """Create a new concept"""
        db_obj = Concept(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        logger.info(f"Created concept with ID: {db_obj.id}")
        return db_obj

    def get(self, db: Session, id: UUID) -> Optional[Concept]:
        """Get concept by ID"""
        return db.query(Concept).filter(Concept.id == id).first()

    def get_by_code(self, db: Session, codesystem_id: UUID, code: str) -> Optional[Concept]:
        """Get concept by codesystem ID and code"""
        return db.query(Concept).filter(
            and_(Concept.codesystem_id == codesystem_id, Concept.code == code)
        ).first()

    def get_by_codesystem(self, db: Session, codesystem_id: UUID) -> List[Concept]:
        """Get all concepts for a codesystem"""
        return db.query(Concept).filter(Concept.codesystem_id == codesystem_id).all()

    def get_multi(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        codesystem_id: Optional[UUID] = None,
        search: Optional[str] = None
    ) -> List[Concept]:
        """Get multiple concepts with optional filters"""
        query = db.query(Concept)
        
        if codesystem_id:
            query = query.filter(Concept.codesystem_id == codesystem_id)
        
        if search:
            search_filter = or_(
                Concept.code.ilike(f"%{search}%"),
                Concept.display.ilike(f"%{search}%"),
                Concept.definition.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        return query.offset(skip).limit(limit).all()

    def update(self, db: Session, db_obj: Concept, obj_in: ConceptUpdate) -> Concept:
        """Update concept"""
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        logger.info(f"Updated concept with ID: {db_obj.id}")
        return db_obj

    def delete(self, db: Session, id: UUID) -> Optional[Concept]:
        """Delete concept"""
        obj = db.query(Concept).get(id)
        if obj:
            db.delete(obj)
            db.commit()
            logger.info(f"Deleted concept with ID: {id}")
        return obj

    def count(
        self, 
        db: Session, 
        codesystem_id: Optional[UUID] = None,
        search: Optional[str] = None
    ) -> int:
        """Count total concepts"""
        query = db.query(Concept)
        
        if codesystem_id:
            query = query.filter(Concept.codesystem_id == codesystem_id)
        
        if search:
            search_filter = or_(
                Concept.code.ilike(f"%{search}%"),
                Concept.display.ilike(f"%{search}%"),
                Concept.definition.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        return query.count()

concept = ConceptCRUD()
