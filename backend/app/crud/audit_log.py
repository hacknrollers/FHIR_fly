from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from app.models import AuditLog
import logging

logger = logging.getLogger(__name__)

class AuditLogCRUD:
    def get(self, db: Session, id: UUID) -> Optional[AuditLog]:
        """Get audit log by ID"""
        return db.query(AuditLog).filter(AuditLog.id == id).first()

    def get_multi(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        table_name: Optional[str] = None,
        operation: Optional[str] = None,
        record_id: Optional[UUID] = None,
        user_id: Optional[str] = None
    ) -> List[AuditLog]:
        """Get multiple audit logs with optional filters"""
        query = db.query(AuditLog)
        
        if table_name:
            query = query.filter(AuditLog.table_name == table_name)
        
        if operation:
            query = query.filter(AuditLog.operation == operation)
        
        if record_id:
            query = query.filter(AuditLog.record_id == record_id)
        
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        
        # Order by most recent first
        query = query.order_by(desc(AuditLog.changed_at))
        
        return query.offset(skip).limit(limit).all()

    def get_by_record(
        self, 
        db: Session, 
        table_name: str, 
        record_id: UUID
    ) -> List[AuditLog]:
        """Get all audit logs for a specific record"""
        return db.query(AuditLog).filter(
            and_(
                AuditLog.table_name == table_name,
                AuditLog.record_id == record_id
            )
        ).order_by(desc(AuditLog.changed_at)).all()

    def count(
        self, 
        db: Session, 
        table_name: Optional[str] = None,
        operation: Optional[str] = None,
        record_id: Optional[UUID] = None,
        user_id: Optional[str] = None
    ) -> int:
        """Count total audit logs"""
        query = db.query(AuditLog)
        
        if table_name:
            query = query.filter(AuditLog.table_name == table_name)
        
        if operation:
            query = query.filter(AuditLog.operation == operation)
        
        if record_id:
            query = query.filter(AuditLog.record_id == record_id)
        
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        
        return query.count()

    def create_audit_log(
        self,
        db: Session,
        table_name: str,
        operation: str,
        record_id: UUID,
        user_id: Optional[str] = None,
        old_data: Optional[dict] = None,
        new_data: Optional[dict] = None,
        meta: Optional[dict] = None
    ) -> AuditLog:
        """Create a new audit log entry"""
        audit_log = AuditLog(
            table_name=table_name,
            operation=operation,
            record_id=record_id,
            user_id=user_id,
            old_data=old_data,
            new_data=new_data,
            meta=meta
        )
        db.add(audit_log)
        db.commit()
        db.refresh(audit_log)
        logger.info(f"Created audit log for {table_name}.{operation} on record {record_id}")
        return audit_log

audit_log = AuditLogCRUD()
