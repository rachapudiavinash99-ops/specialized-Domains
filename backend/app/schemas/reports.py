from pydantic import BaseModel
from typing import List

class AttendanceStat(BaseModel):
    total_students: int
    present: int
    absent: int
    late: int
    excused: int
    attendance_percentage: float

class DashboardStats(BaseModel):
    today: AttendanceStat
    overall: AttendanceStat
    low_attendance_students: int

class SubjectAttendance(BaseModel):
    subject_id: int
    subject_name: str
    attendance_percentage: float
