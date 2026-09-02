from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, academic, profiles, attendance, reports

app = FastAPI(
    title="Education Attendance Management System API",
    description="Backend API for managing school/college attendance.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(academic.router, prefix="/api/v1/academic", tags=["academic"])
app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["profiles"])
app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["attendance"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Attendance API is running"}
