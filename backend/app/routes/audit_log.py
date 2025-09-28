from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import AuditLog, PaginatedResponse
from app.crud import audit_log as audit_log_crud
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/audit-logs", tags=["audit-logs"])

@router.get("/", response_model=PaginatedResponse)
def read_audit_logs(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    table_name: Optional[str] = Query(None, description="Filter by table name"),
    operation: Optional[str] = Query(None, description="Filter by operation"),
    record_id: Optional[UUID] = Query(None, description="Filter by record ID"),
    user_id: Optional[str] = Query(None, description="Filter by user ID")
):
    """Retrieve audit logs with pagination and filters"""
    try:
        skip = (page - 1) * size
        audit_logs = audit_log_crud.audit_log.get_multi(
            db=db,
            skip=skip,
            limit=size,
            table_name=table_name,
            operation=operation,
            record_id=record_id,
            user_id=user_id
        )
        total = audit_log_crud.audit_log.count(
            db=db,
            table_name=table_name,
            operation=operation,
            record_id=record_id,
            user_id=user_id
        )
        pages = (total + size - 1) // size
        
        return PaginatedResponse(
            items=audit_logs,
            total=total,
            page=page,
            size=size,
            pages=pages
        )
    except Exception as e:
        logger.error(f"Error retrieving audit logs: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve audit logs")

@router.get("/{audit_log_id}", response_model=AuditLog)
def read_audit_log(
    *,
    db: Session = Depends(get_db),
    audit_log_id: UUID
):
    """Get a specific audit log by ID"""
    audit_log = audit_log_crud.audit_log.get(db=db, id=audit_log_id)
    if not audit_log:
        raise HTTPException(status_code=404, detail="Audit log not found")
    return audit_log

@router.get("/record/{table_name}/{record_id}", response_model=List[AuditLog])
def read_audit_logs_by_record(
    *,
    db: Session = Depends(get_db),
    table_name: str,
    record_id: UUID
):
    """Get all audit logs for a specific record"""
    try:
        audit_logs = audit_log_crud.audit_log.get_by_record(
            db=db, table_name=table_name, record_id=record_id
        )
        return audit_logs
    except Exception as e:
        logger.error(f"Error retrieving audit logs for record: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve audit logs")
