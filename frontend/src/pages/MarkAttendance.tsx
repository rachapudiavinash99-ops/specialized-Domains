import React, { useState, useEffect } from 'react';
import api from '../api/client';

export default function MarkAttendance() {
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [attendanceData, setAttendanceData] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Load metadata for dropdowns
    api.get('/academic/classes').then(res => setSections(res.data));
    api.get('/academic/courses').then(res => setSubjects(res.data)); // Mocking subjects for now
  }, []);

  const loadStudents = async () => {
    if (!selectedSection) return;
    setLoading(true);
    try {
      const res = await api.get(`/profiles/students`);
      // Mock filtering by section ID for now
      setStudents(res.data);
      
      // Initialize all as present
      const initData: Record<number, string> = {};
      res.data.forEach((s: any) => {
        initData[s.id] = 'present';
      });
      setAttendanceData(initData);
      setSuccessMsg('');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async () => {
    if (!selectedSection || !selectedSubject || !date) {
      setErrorMsg("Please select section, subject, and date.");
      return;
    }

    setLoading(true);
    try {
      const records = students.map((s: any) => ({
        student_id: s.id,
        status: attendanceData[s.id],
        remarks: ""
      }));

      const payload = {
        session: {
          section_id: parseInt(selectedSection),
          subject_id: parseInt(selectedSubject),
          teacher_id: 1, // Mock teacher ID for now
          date: date
        },
        records: records
      };

      await api.post('/attendance/mark', payload);
      setSuccessMsg("Attendance successfully recorded!");
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || "Failed to submit attendance. Duplicate?");
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section (Class)</label>
          <select 
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Class...</option>
            {sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <select 
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Subject...</option>
            {/* Mocking subjects array using courses for now */}
            {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={loadStudents}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
          >
            Load Roster
          </button>
        </div>
      </div>

      {errorMsg && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{errorMsg}</div>}
      {successMsg && <div className="mb-4 text-green-600 bg-green-100 p-3 rounded">{successMsg}</div>}

      {students.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student: any) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.roll_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center space-x-2">
                      {['present', 'absent', 'late', 'excused'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(student.id, status)}
                          className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                            attendanceData[student.id] === status 
                              ? (status === 'present' ? 'bg-green-600 text-white' : 
                                 status === 'absent' ? 'bg-red-600 text-white' : 
                                 status === 'late' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white')
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={submitAttendance}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 font-medium"
            >
              {loading ? 'Submitting...' : 'Submit Final Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
