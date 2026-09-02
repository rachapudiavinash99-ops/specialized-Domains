from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.attendance import AttendanceSession, Attendance
from app.schemas.attendance import (
    AttendanceSession as AttendanceSessionSchema,
    Attendance as AttendanceSchema,
    BulkAttendanceCreate
)
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/mark", response_model=List[AttendanceSchema])
def mark_attendance(
    *,
    db: Session = Depends(get_db),
    bulk_in: BulkAttendanceCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Mark attendance for a class/section in bulk.
    """
    # 1. Create or get session
    session = db.query(AttendanceSession).filter(
        AttendanceSession.section_id == bulk_in.session.section_id,
        AttendanceSession.subject_id == bulk_in.session.subject_id,
        AttendanceSession.date == bulk_in.session.date
    ).first()

    if not session:
        session = AttendanceSession(**bulk_in.session.dict())
        db.add(session)
        db.commit()
        db.refresh(session)
    
    # 2. Add attendance records
    created_records = []
    try:
        for record_in in bulk_in.records:
            existing = db.query(Attendance).filter(
                Attendance.session_id == session.id,
                Attendance.student_id == record_in.student_id
            ).first()
            if existing:
                # Update existing record
                existing.status = record_in.status
                existing.remarks = record_in.remarks
                created_records.append(existing)
            else:
                record = Attendance(session_id=session.id, **record_in.dict())
                db.add(record)
                created_records.append(record)
        
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Duplicate attendance record detected.")

    return created_records

@router.get("/session/{session_id}", response_model=List[AttendanceSchema])
def get_attendance_by_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    records = db.query(Attendance).filter(Attendance.session_id == session_id).all()
    return records
