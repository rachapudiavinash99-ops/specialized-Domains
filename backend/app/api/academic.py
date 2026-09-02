from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.academic import Department, Course, ClassGroup, Section, Subject
from app.schemas.academic import (
    Department as DepartmentSchema, DepartmentCreate,
    Course as CourseSchema, CourseCreate,
    ClassGroup as ClassGroupSchema, ClassGroupCreate,
    Section as SectionSchema, SectionCreate,
    Subject as SubjectSchema, SubjectCreate
)
from app.api.deps import get_current_active_admin, get_current_user
from app.models.user import User

router = APIRouter()

# --- Departments ---
@router.post("/departments", response_model=DepartmentSchema)
def create_department(
    *,
    db: Session = Depends(get_db),
    department_in: DepartmentCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    department = Department(**department_in.dict())
    db.add(department)
    db.commit()
    db.refresh(department)
    return department

@router.get("/departments", response_model=List[DepartmentSchema])
def read_departments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    return db.query(Department).offset(skip).limit(limit).all()

# --- Courses ---
@router.post("/courses", response_model=CourseSchema)
def create_course(
    *,
    db: Session = Depends(get_db),
    course_in: CourseCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    course = Course(**course_in.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.get("/courses", response_model=List[CourseSchema])
def read_courses(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    return db.query(Course).offset(skip).limit(limit).all()

# --- Classes ---
@router.post("/classes", response_model=ClassGroupSchema)
def create_class(
    *,
    db: Session = Depends(get_db),
    class_in: ClassGroupCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    db_class = ClassGroup(**class_in.dict())
    db.add(db_class)
    db.commit()
    db.refresh(db_class)
    return db_class

@router.get("/classes", response_model=List[ClassGroupSchema])
def read_classes(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    return db.query(ClassGroup).offset(skip).limit(limit).all()
