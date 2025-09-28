from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models import CodeSystem
from app.schemas import CodeSystemCreate, CodeSystemUpdate
import logging

logger = logging.getLogger(__name__)

class CodeSystemCRUD:
    def create(self, db: Session, obj_in: CodeSystemCreate) -> CodeSystem:
        """Create a new codesystem"""
        db_obj = CodeSystem(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        logger.info(f"Created codesystem with ID: {db_obj.id}")
        return db_obj

    def get(self, db: Session, id: UUID) -> Optional[CodeSystem]:
        """Get codesystem by ID"""
        return db.query(CodeSystem).filter(CodeSystem.id == id).first()

    def get_by_url(self, db: Session, url: str) -> Optional[CodeSystem]:
        """Get codesystem by URL"""
        return db.query(CodeSystem).filter(CodeSystem.url == url).first()

    def get_by_name(self, db: Session, name: str) -> Optional[CodeSystem]:
        """Get codesystem by name"""
        return db.query(CodeSystem).filter(CodeSystem.name == name).first()

    def get_multi(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        search: Optional[str] = None
    ) -> List[CodeSystem]:
        """Get multiple codesystems with optional search"""
        query = db.query(CodeSystem)
        
        if search:
            search_filter = or_(
                CodeSystem.name.ilike(f"%{search}%"),
                CodeSystem.title.ilike(f"%{search}%"),
                CodeSystem.url.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        return query.offset(skip).limit(limit).all()

    def update(self, db: Session, db_obj: CodeSystem, obj_in: CodeSystemUpdate) -> CodeSystem:
        """Update codesystem"""
        update_data = obj_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        logger.info(f"Updated codesystem with ID: {db_obj.id}")
        return db_obj

    def delete(self, db: Session, id: UUID) -> Optional[CodeSystem]:
        """Delete codesystem"""
        obj = db.query(CodeSystem).get(id)
        if obj:
            db.delete(obj)
            db.commit()
            logger.info(f"Deleted codesystem with ID: {id}")
        return obj

    def count(self, db: Session, search: Optional[str] = None) -> int:
        """Count total codesystems"""
        query = db.query(CodeSystem)
        
        if search:
            search_filter = or_(
                CodeSystem.name.ilike(f"%{search}%"),
                CodeSystem.title.ilike(f"%{search}%"),
                CodeSystem.url.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)
        
        return query.count()

codesystem = CodeSystemCRUD()
