from typing import Optional, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from app.crud import audit_log as audit_log_crud
import logging

logger = logging.getLogger(__name__)

def create_audit_log(
    db: Session,
    table_name: str,
    operation: str,
    record_id: UUID,
    user_id: Optional[str] = None,
    old_data: Optional[Dict[str, Any]] = None,
    new_data: Optional[Dict[str, Any]] = None,
    meta: Optional[Dict[str, Any]] = None
):
    """Create an audit log entry"""
    try:
        return audit_log_crud.audit_log.create_audit_log(
            db=db,
            table_name=table_name,
            operation=operation,
            record_id=record_id,
            user_id=user_id,
            old_data=old_data,
            new_data=new_data,
            meta=meta
        )
    except Exception as e:
        logger.error(f"Failed to create audit log: {e}")
        # Don't raise exception to avoid breaking the main operation

def audit_create(db: Session, table_name: str, record_id: UUID, new_data: Dict[str, Any], user_id: Optional[str] = None):
    """Audit a create operation"""
    create_audit_log(
        db=db,
        table_name=table_name,
        operation="INSERT",
        record_id=record_id,
        user_id=user_id,
        new_data=new_data
    )

def audit_update(db: Session, table_name: str, record_id: UUID, old_data: Dict[str, Any], new_data: Dict[str, Any], user_id: Optional[str] = None):
    """Audit an update operation"""
    create_audit_log(
        db=db,
        table_name=table_name,
        operation="UPDATE",
        record_id=record_id,
        user_id=user_id,
        old_data=old_data,
        new_data=new_data
    )

def audit_delete(db: Session, table_name: str, record_id: UUID, old_data: Dict[str, Any], user_id: Optional[str] = None):
    """Audit a delete operation"""
    create_audit_log(
        db=db,
        table_name=table_name,
        operation="DELETE",
        record_id=record_id,
        user_id=user_id,
        old_data=old_data
    )
