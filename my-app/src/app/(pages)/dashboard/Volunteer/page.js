// src/app/(pages)/dashboard/Volunteer/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/AuthContext/AuthContext';
import toast from 'react-hot-toast';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('available');
  const [tasks, setTasks] = useState([]);
  const [hoursLogs, setHoursLogs] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackForm, setFeedbackForm] = useState({
    message: '',
    type: 'Query',
    projectId: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    loadDashboardData();
  }, [user, activeTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, hoursRes, feedbackRes] = await Promise.all([
        fetch(`/api/tasks?filter=${activeTab}`).then(res => res.json()),
        fetch('/api/hours').then(res => res.json()),
        fetch('/api/feedback').then(res => res.json())
      ]);

      setTasks(tasksRes.tasks || []);
      setHoursLogs(hoursRes.logs || []);
      setFeedback(feedbackRes.feedback || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
    setIsLoading(false);
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });

      if (res.ok) {
        toast.success(`Task ${action} successfully`);
        loadDashboardData();
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackForm)
      });

      if (res.ok) {
        toast.success('Feedback submitted successfully');
        setFeedbackForm({ message: '', type: 'Query', projectId: '' });
        loadDashboardData();
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (error) {
      toast.error('Error submitting feedback');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      {/* Task Management Section */}
      <div className="section">
        <div className="section-header">
          <h2>Tasks</h2>
          <div className="tabs">
            <button 
              className={activeTab === 'available' ? 'active' : ''} 
              onClick={() => setActiveTab('available')}
            >
              Available
            </button>
            <button 
              className={activeTab === 'accepted' ? 'active' : ''} 
              onClick={() => setActiveTab('accepted')}
            >
              Accepted
            </button>
            <button 
              className={activeTab === 'completed' ? 'active' : ''} 
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.title}</td>
                  <td>{task.estimatedHours}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === 'Available' && (
                      <button onClick={() => handleTaskAction(task._id, 'accept')}>
                        Accept
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button onClick={() => handleTaskAction(task._id, 'complete')}>
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hours Tracking Section */}
      <div className="section">
        <h2>Hours Log</h2>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Task</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {hoursLogs.map(log => (
                <tr key={log._id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{log.task?.title}</td>
                  <td>{log.hours}</td>
                  <td>{log.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="section">
        <h2>Communication</h2>
        <form onSubmit={submitFeedback} className="feedback-form">
          <select 
            value={feedbackForm.type}
            onChange={(e) => setFeedbackForm({...feedbackForm, type: e.target.value})}
          >
            <option value="Query">Query</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Issue">Issue</option>
          </select>
          <textarea
            value={feedbackForm.message}
            onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
            placeholder="Enter your message"
            required
          />
          <button type="submit">Submit</button>
        </form>

        <div className="feedback-responses">
          <h3>Responses</h3>
          {feedback.map(item => (
            <div key={item._id} className="feedback-item">
              <p><strong>{item.type}:</strong> {item.message}</p>
              {item.response && (
                <p className="response"><strong>Response:</strong> {item.response}</p>
              )}
              <span className="date">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section {
          background: #fff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .tabs {
          display: flex;
          gap: 10px;
        }
        .tabs button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background: #f0f0f0;
        }
        .tabs button.active {
          background: #0066cc;
          color: white;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background: #0066cc;
          color: white;
        }
        .feedback-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }
        textarea {
          min-height: 100px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .feedback-item {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }
        .response {
          margin-top: 5px;
          padding-left: 20px;
          color: #666;
        }
        .date {
          font-size: 0.8em;
          color: #666;
        }
      `}</style>
    </div>
  );
}