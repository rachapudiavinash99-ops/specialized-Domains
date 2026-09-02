from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    name: str
    department_id: int

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class ClassGroupBase(BaseModel):
    name: str
    course_id: int

class ClassGroupCreate(ClassGroupBase):
    pass

class ClassGroup(ClassGroupBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class SectionBase(BaseModel):
    name: str
    class_id: int

class SectionCreate(SectionBase):
    pass

class Section(SectionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    name: str
    code: str
    course_id: int

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
