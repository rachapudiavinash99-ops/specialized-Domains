from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.profiles import Teacher, Parent, Student
from app.schemas.profiles import (
    Teacher as TeacherSchema, TeacherCreate,
    Parent as ParentSchema, ParentCreate,
    Student as StudentSchema, StudentCreate
)
from app.api.deps import get_current_active_admin, get_current_user
from app.models.user import User

router = APIRouter()

# --- Teachers ---
@router.post("/teachers", response_model=TeacherSchema)
def create_teacher(
    *,
    db: Session = Depends(get_db),
    teacher_in: TeacherCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    teacher = Teacher(**teacher_in.dict())
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher

@router.get("/teachers", response_model=List[TeacherSchema])
def read_teachers(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    return db.query(Teacher).offset(skip).limit(limit).all()

# --- Students ---
@router.post("/students", response_model=StudentSchema)
def create_student(
    *,
    db: Session = Depends(get_db),
    student_in: StudentCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    student = Student(**student_in.dict())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.get("/students", response_model=List[StudentSchema])
def read_students(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    return db.query(Student).offset(skip).limit(limit).all()

# --- Parents ---
@router.post("/parents", response_model=ParentSchema)
def create_parent(
    *,
    db: Session = Depends(get_db),
    parent_in: ParentCreate,
    current_user: User = Depends(get_current_active_admin),
) -> Any:
    parent = Parent(**parent_in.dict())
    db.add(parent)
    db.commit()
    db.refresh(parent)
    return parent

@router.get("/parents", response_model=List[ParentSchema])
def read_parents(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    return db.query(Parent).offset(skip).limit(limit).all()
