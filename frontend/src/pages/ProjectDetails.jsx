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
  User as UserIcon,
  ChevronLeft,
  ArrowRight
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading Board...</div>
    </div>
  );
  if (!project) return <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>Project not found</div>;

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div>
      {/* Header */}
      <button onClick={() => navigate('/projects')} className="btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
        <ChevronLeft size={16} /> Back to Projects
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
        <div style={{ maxWidth: '70%' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }} className="gradient-text">{project.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {user?.role === 'admin' && (
            <>
              <button className="btn-secondary" onClick={() => setShowMemberModal(true)}>
                <UserPlus size={18} />
                <span>Invite</span>
              </button>
              <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                <Plus size={18} />
                <span>New Task</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Task Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', minHeight: '60vh' }}>
        {columns.map(column => (
          <div key={column} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: column === 'To Do' ? 'var(--text-muted)' : column === 'In Progress' ? 'var(--warning)' : 'var(--success)' }}></div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {column}
                </h3>
              </div>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                {tasks.filter(t => t.status === column).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1, background: 'rgba(255,255,255,0.01)', borderRadius: '20px', padding: '1rem' }}>
              {tasks.filter(t => t.status === column).map(task => (
                <div key={task._id} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${task.priority === 'High' ? 'var(--error)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ 
                      fontSize: '0.65rem', 
                      fontWeight: '800', 
                      padding: '3px 10px', 
                      borderRadius: '20px',
                      background: task.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : task.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: task.priority === 'High' ? 'var(--error)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {task.priority}
                    </div>
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        style={{ background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                        className="hover-error"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  <h4 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.4' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {task.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.7rem', fontWeight: '800' }}>
                        {task.assignedTo?.name.charAt(0)}
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text)' }}>{task.assignedTo?.name.split(' ')[0]}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                      <Calendar size={14} />
                      <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {column !== 'To Do' && (
                      <button 
                        onClick={() => handleUpdateStatus(task._id, column === 'Done' ? 'In Progress' : 'To Do')}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', height: '32px' }}
                      >
                        Back
                      </button>
                    )}
                    {column !== 'Done' && (
                      <button 
                        onClick={() => handleUpdateStatus(task._id, column === 'To Do' ? 'In Progress' : 'Done')}
                        className="btn-primary"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', height: '32px' }}
                      >
                        {column === 'To Do' ? 'Start' : 'Complete'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === column).length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--surface-border)', borderRadius: '16px', opacity: 0.3 }}>
                   <p style={{ fontSize: '0.85rem' }}>No tasks {column.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '540px', padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Title</label>
                <input 
                  type="text" 
                  placeholder="What needs to be done?" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  style={{ height: '100px', resize: 'none' }}
                  placeholder="Provide some context..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} required />
                </div>
              </div>
              <div className="input-group">
                <label>Assignee</label>
                <select value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} required>
                  <option value="">Select Team Member</option>
                  {project.members?.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                <UserPlus size={30} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Invite Member</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add a collaborator to this workspace.</p>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="input-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="collaborator@company.com" 
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

