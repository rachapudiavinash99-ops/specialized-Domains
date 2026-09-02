from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.db.session import get_db
from app.models.attendance import Attendance, AttendanceSession
from app.models.profiles import Student
from app.schemas.reports import DashboardStats, AttendanceStat
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    # Today's stats
    today_records = db.query(Attendance).join(AttendanceSession).filter(
        AttendanceSession.date == date.today()
    ).all()
    
    t_present = sum(1 for r in today_records if r.status == 'present')
    t_absent = sum(1 for r in today_records if r.status == 'absent')
    t_late = sum(1 for r in today_records if r.status == 'late')
    t_excused = sum(1 for r in today_records if r.status == 'excused')
    t_total = len(today_records)
    t_percent = (t_present / t_total * 100) if t_total > 0 else 0.0

    today_stat = AttendanceStat(
        total_students=t_total, present=t_present, absent=t_absent,
        late=t_late, excused=t_excused, attendance_percentage=t_percent
    )

    # Overall stats
    all_records = db.query(Attendance).all()
    o_present = sum(1 for r in all_records if r.status == 'present')
    o_absent = sum(1 for r in all_records if r.status == 'absent')
    o_late = sum(1 for r in all_records if r.status == 'late')
    o_excused = sum(1 for r in all_records if r.status == 'excused')
    o_total = len(all_records)
    o_percent = (o_present / o_total * 100) if o_total > 0 else 0.0

    overall_stat = AttendanceStat(
        total_students=o_total, present=o_present, absent=o_absent,
        late=o_late, excused=o_excused, attendance_percentage=o_percent
    )

    # Low attendance (mocking calculation for < 75%)
    # In a real heavy DB, we'd use Group By queries.
    low_attendance = 0

    return DashboardStats(
        today=today_stat,
        overall=overall_stat,
        low_attendance_students=low_attendance
    )
