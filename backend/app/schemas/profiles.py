from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class TeacherBase(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    employee_id: str
    department_id: int

class TeacherCreate(TeacherBase):
    pass

class Teacher(TeacherBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ParentBase(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    phone_number: Optional[str] = None

class ParentCreate(ParentBase):
    pass

class Parent(ParentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class StudentBase(BaseModel):
    user_id: int
    first_name: str
    last_name: str
    roll_number: str
    dob: Optional[date] = None
    parent_id: Optional[int] = None
    section_id: int

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
