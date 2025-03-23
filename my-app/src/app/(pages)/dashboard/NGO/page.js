'use client';
import { useAuth } from '@/AuthContext/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from '@/styles/dashboard.module.css';

export default function NGODashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Education',
    requiredVolunteers: '',
    startDate: '',
    endDate: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    }
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    estimatedHours: '',
    deadline: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'NGO') {
      router.push('/auth/login');
      return;
    }
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        fetch('/api/projects').then(res => res.json()),
        fetch('/api/tasks?org=' + user._id).then(res => res.json())
      ]);

      setProjects(projectsRes.projects || []);
      setTasks(tasksRes.tasks || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProject,
          organization: user._id
        })
      });

      if (res.ok) {
        toast.success('Project created successfully');
        setShowProjectModal(false);
        setNewProject({
          title: '',
          description: '',
          category: 'Education',
          requiredVolunteers: '',
          startDate: '',
          endDate: '',
          location: {
            address: '',
            city: '',
            state: '',
            pincode: ''
          }
        });
        loadDashboardData();
      } else {
        toast.error('Failed to create project');
      }
    } catch (error) {
      toast.error('Error creating project');
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (res.ok) {
        toast.success('Task created successfully');
        setShowTaskModal(false);
        setNewTask({
          title: '',
          description: '',
          projectId: '',
          estimatedHours: '',
          deadline: ''
        });
        loadDashboardData();
      } else {
        toast.error('Failed to create task');
      }
    } catch (error) {
      toast.error('Error creating task');
    }
  };

  const handleTaskStatusUpdate = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success('Task status updated');
        loadDashboardData();
      } else {
        toast.error('Failed to update task status');
      }
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Projects</h2>
          <button className={styles.createButton} onClick={() => setShowProjectModal(true)}>
            Create New Project
          </button>
        </div>

        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Category</th>
                <th>Volunteers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td>{project.assignedVolunteers?.length || 0} / {project.requiredVolunteers}</td>
                  <td>{project.status}</td>
                  <td>
                    <button 
                      className={styles.button}
                      onClick={() => router.push(`/dashboard/NGO/projects/${project._id}`)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Tasks Management</h2>
          <button className={styles.createButton} onClick={() => setShowTaskModal(true)}>
            Create New Task
          </button>
        </div>

        <div className={styles.table}>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.project?.title}</td>
                  <td>{task.assignedTo?.name || 'Unassigned'}</td>
                  <td>{task.status}</td>
                  <td>
                    {task.status === 'Completed' && (
                      <button 
                        onClick={() => handleTaskStatusUpdate(task._id, 'Verified')}
                        className={styles.verifyButton}
                      >
                        Verify Completion
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showProjectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New Project</h3>
            <form onSubmit={createProject}>
              <div className={styles.formGroup}>
                <label>Title:</label>
                <input
                  className={styles.input}
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  className={styles.textarea}
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Category:</label>
                <select
                  className={styles.select}
                  value={newProject.category}
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                  required
                >
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Social Welfare">Social Welfare</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Required Volunteers:</label>
                <input
                  className={styles.input}
                  type="number"
                  value={newProject.requiredVolunteers}
                  onChange={(e) => setNewProject({...newProject, requiredVolunteers: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Start Date:</label>
                <input
                  className={styles.input}
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>End Date:</label>
                <input
                  className={styles.input}
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Location:</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Address"
                  value={newProject.location.address}
                  onChange={(e) => setNewProject({
                    ...newProject, 
                    location: {...newProject.location, address: e.target.value}
                  })}
                  required
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="City"
                  value={newProject.location.city}
                  onChange={(e) => setNewProject({
                    ...newProject, 
                    location: {...newProject.location, city: e.target.value}
                  })}
                  required
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="State"
                  value={newProject.location.state}
                  onChange={(e) => setNewProject({
                    ...newProject, 
                    location: {...newProject.location, state: e.target.value}
                  })}
                  required
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Pincode"
                  value={newProject.location.pincode}
                  onChange={(e) => setNewProject({
                    ...newProject, 
                    location: {...newProject.location, pincode: e.target.value}
                  })}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.button}>Create Project</button>
                <button 
                  type="button" 
                  onClick={() => setShowProjectModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Create New Task</h3>
            <form onSubmit={createTask}>
              <div className={styles.formGroup}>
                <label>Title:</label>
                <input
                  className={styles.input}
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description:</label>
                <textarea
                  className={styles.textarea}
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Project:</label>
                <select
                  className={styles.select}
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Estimated Hours:</label>
                <input
                  className={styles.input}
                  type="number"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask({...newTask, estimatedHours: e.target.value})}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Deadline:</label>
                <input
                  className={styles.input}
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.button}>Create Task</button>
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}