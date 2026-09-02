import sys
import os
from datetime import date
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models.user import User
from app.models.academic import Department, Course, ClassGroup, Section, Subject
from app.models.profiles import Teacher, Student, Parent, TeacherAssignment
from app.core.security import get_password_hash

def seed_data():
    db = SessionLocal()
    
    # 1. Create Admin
    admin_email = "admin@school.com"
    if not db.query(User).filter(User.email == admin_email).first():
        admin = User(
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.commit()
        print(f"Created admin: {admin_email} / admin123")

    # 2. Create Teacher User
    teacher_email = "teacher@school.com"
    teacher_user = db.query(User).filter(User.email == teacher_email).first()
    if not teacher_user:
        teacher_user = User(
            email=teacher_email,
            hashed_password=get_password_hash("teacher123"),
            role="teacher",
            is_active=True
        )
        db.add(teacher_user)
        db.commit()
        db.refresh(teacher_user)
        print(f"Created teacher: {teacher_email} / teacher123")
        
        # Create Department
        dept = Department(name="Computer Science", description="CS Dept")
        db.add(dept)
        db.commit()
        db.refresh(dept)
        
        # Create Teacher Profile
        teacher_profile = Teacher(
            user_id=teacher_user.id,
            first_name="John",
            last_name="Doe",
            employee_id="EMP001",
            department_id=dept.id
        )
        db.add(teacher_profile)
        db.commit()
        
        # Create Course, Class, Section, Subject
        course = Course(name="B.Tech CS", department_id=dept.id)
        db.add(course)
        db.commit()
        db.refresh(course)
        
        cls = ClassGroup(name="Year 1", course_id=course.id)
        db.add(cls)
        db.commit()
        db.refresh(cls)
        
        sec = Section(name="A", class_id=cls.id)
        db.add(sec)
        db.commit()
        db.refresh(sec)
        
        sub = Subject(name="Programming 101", code="CS101", course_id=course.id)
        db.add(sub)
        db.commit()
        db.refresh(sub)
        
        # Assign Teacher
        ta = TeacherAssignment(
            teacher_id=teacher_profile.id,
            section_id=sec.id,
            subject_id=sub.id
        )
        db.add(ta)
        db.commit()
        
        # Create Student User & Profile
        student_email = "student@school.com"
        student_user = User(
            email=student_email,
            hashed_password=get_password_hash("student123"),
            role="student",
            is_active=True
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)
        
        student_profile = Student(
            user_id=student_user.id,
            first_name="Alice",
            last_name="Smith",
            roll_number="CS-001",
            dob=date(2005, 1, 1),
            section_id=sec.id
        )
        db.add(student_profile)
        db.commit()
        
        print("Created demo academic structure, teacher profile, and student.")

    db.close()

if __name__ == "__main__":
    print("Seeding database...")
    seed_data()
    print("Done!")
