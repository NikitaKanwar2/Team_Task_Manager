import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  UserPlus, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreVertical,
  Calendar,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const projectRes = await axios.get(`${API_URL}/projects/${id}`, config);
      const tasksRes = await axios.get(`${API_URL}/projects/${id}/tasks`, config);
      
      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/projects/${id}/tasks`, newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
      fetchProjectAndTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/projects/${id}/members`, { email: memberEmail }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowMemberModal(false);
      setMemberEmail('');
      fetchProjectAndTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjectAndTasks();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjectAndTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user?.role === 'admin' && (
            <>
              <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowMemberModal(true)}>
                <UserPlus size={18} />
                Add Member
              </button>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowTaskModal(true)}>
                <Plus size={18} />
                New Task
              </button>
            </>
          )}
        </div>
      </div>

      {/* Task Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', overflowX: 'auto' }}>
        {columns.map(column => (
          <div key={column} style={{ minWidth: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {column}
              </h3>
              <span style={{ background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                {tasks.filter(t => t.status === column).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === column).map(task => (
                <div key={task._id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: '700', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: task.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : task.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: task.priority === 'High' ? 'var(--error)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)',
                      textTransform: 'uppercase'
                    }}>
                      {task.priority}
                    </span>
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        style={{ background: 'transparent', color: 'var(--text-muted)' }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    {task.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <UserIcon size={12} color="white" />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{task.assignedTo?.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      <Calendar size={12} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {column !== 'To Do' && (
                      <button 
                        onClick={() => handleUpdateStatus(task._id, column === 'Done' ? 'In Progress' : 'To Do')}
                        style={{ flex: 1, padding: '4px', fontSize: '0.75rem', border: '1px solid var(--surface-border)', background: 'transparent', color: 'var(--text-muted)' }}
                      >
                        ← Move
                      </button>
                    )}
                    {column !== 'Done' && (
                      <button 
                        onClick={() => handleUpdateStatus(task._id, column === 'To Do' ? 'In Progress' : 'Done')}
                        style={{ flex: 1, padding: '4px', fontSize: '0.75rem', border: '1px solid var(--surface-border)', background: 'transparent', color: 'var(--text-muted)' }}
                      >
                        {column === 'To Do' ? 'Start' : 'Finish'} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <label>Title</label>
              <input 
                type="text" 
                placeholder="Task title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                required
              />
              <label>Description</label>
              <textarea 
                style={{ height: '80px' }}
                placeholder="Task details"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                required
              ></textarea>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} required />
                </div>
              </div>
              <label>Assign To</label>
              <select value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} required>
                <option value="">Select Member</option>
                {project.members?.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <label>Member Email</label>
              <input 
                type="email" 
                placeholder="user@example.com" 
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Note: The user must already have an account in the system.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
