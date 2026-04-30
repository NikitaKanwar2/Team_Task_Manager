import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Folder, Users, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your <span className="gradient-text">Projects</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Overview of all your active workspaces and teams.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           {user?.role === 'admin' && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              New Project
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>All Projects</button>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', opacity: 0.6 }}>Recently Viewed</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
           <button className="btn-secondary" style={{ width: '38px', height: '38px', padding: 0 }}><LayoutGrid size={18} /></button>
           <button className="btn-secondary" style={{ width: '38px', height: '38px', padding: 0, opacity: 0.5 }}><List size={18} /></button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="animate-pulse" style={{ color: 'var(--text-muted)' }}>Loading Projects...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {projects.map((project) => (
            <Link to={`/projects/${project._id}`} key={project._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div className="stat-card-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
                    <Folder size={26} />
                  </div>
                  <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    {project.admin?.name.split(' ')[0]}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.75rem' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', flex: 1, marginBottom: '2rem', lineHeight: '1.6' }}>
                  {project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    <Users size={16} />
                    <span>{project.members?.length} Contributors</span>
                  </div>
                  <ChevronRight size={18} color="var(--primary)" />
                </div>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'var(--primary)', filter: 'blur(50px)', opacity: 0.05, borderRadius: '50%' }}></div>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem', color: 'var(--text-muted)', border: '2px dashed var(--surface-border)', borderRadius: '20px' }}>
              <Folder size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
              <h3>No projects found</h3>
              <p>Create your first project to start collaborating with your team.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '540px', padding: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="input-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Design System 2.0" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  style={{ height: '120px', resize: 'none' }}
                  placeholder="Describe the goals and scope of this project..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;


