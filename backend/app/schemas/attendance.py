from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class AttendanceSessionBase(BaseModel):
    section_id: int
    subject_id: int
    teacher_id: int
    date: date

class AttendanceSessionCreate(AttendanceSessionBase):
    pass

class AttendanceSession(AttendanceSessionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    student_id: int
    status: str # present, absent, late, excused
    remarks: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    session_id: int

class Attendance(AttendanceBase):
    id: int
    session_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class BulkAttendanceCreate(BaseModel):
    session: AttendanceSessionCreate
    records: List[AttendanceBase]
