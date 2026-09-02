import React, { useState } from 'react';
import api from '../api/client';

export default function Reports() {
  const [reportType, setReportType] = useState('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setError('');
    setData([]);

    try {
      // In a fully finished version, this would hit the specific report endpoints
      // For now we will mock fetch students and pretend it's a report
      const res = await api.get('/profiles/students');
      
      // Mocking report aggregation
      const mockReportData = res.data.map((student: any) => ({
        rollNo: student.roll_number,
        name: `${student.first_name} ${student.last_name}`,
        totalClasses: 40,
        present: Math.floor(Math.random() * 10) + 30,
        absent: Math.floor(Math.random() * 5),
        late: Math.floor(Math.random() * 3),
      }));

      // Calculate percentages
      const finalData = mockReportData.map((d: any) => ({
        ...d,
        percentage: ((d.present / d.totalClasses) * 100).toFixed(1)
      }));

      setData(finalData);
    } catch (err) {
      setError('Failed to generate report. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    
    const headers = ['Roll No', 'Name', 'Total Classes', 'Present', 'Absent', 'Late', 'Percentage'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        [row.rollNo, row.name, row.totalClasses, row.present, row.absent, row.late, `${row.percentage}%`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_report_${date}.csv`;
    link.click();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Analytics & Reports</h2>
      
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6 bg-gray-50 p-4 rounded-md border">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Report Type</label>
          <select 
            value={reportType}
            onChange={e => setReportType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="daily">Daily Report</option>
            <option value="monthly">Monthly Summary</option>
            <option value="semester">Semester Overview</option>
            <option value="low_attendance">Low Attendance Alert</option>
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Date/Period</label>
          <input 
            type="date" 
            value={date}
            onChange={e => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="flex items-end space-x-2">
          <button 
            onClick={generateReport}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          
          <button 
            onClick={handleExportCSV}
            disabled={data.length === 0}
            className={`px-4 py-2 rounded shadow ${data.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {data.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-600 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-red-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-yellow-600 uppercase tracking-wider">Late</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row: any, i: number) => (
                <tr key={i} className={parseFloat(row.percentage) < 75 ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.rollNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{row.totalClasses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-green-600 font-bold">{row.present}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-500 font-bold">{row.absent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-yellow-600">{row.late}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold">
                    <span className={parseFloat(row.percentage) < 75 ? 'text-red-600' : 'text-green-600'}>
                      {row.percentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
