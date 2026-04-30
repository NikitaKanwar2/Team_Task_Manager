import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Folder, Users, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      const res = await axios.get('http://localhost:5001/api/projects', {
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
      await axios.post('http://localhost:5001/api/projects', newProject, {
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
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track your team projects</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowModal(true)}>
            <Plus size={20} />
            New Project
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => (
            <Link to={`/projects/${project._id}`} key={project._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px' }}>
                    <Folder color="var(--primary)" size={24} />
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flex: 1, marginBottom: '1.5rem' }}>
                  {project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <Users size={16} />
                    <span>{project.members?.length} Members</span>
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Admin: {project.admin?.name}</span>
                </div>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No projects found. Create one to get started!
            </div>
          )}
        </div>
      )}

      {/* Simple Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <label>Project Name</label>
              <input 
                type="text" 
                placeholder="e.g. Website Redesign" 
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
              <label>Description</label>
              <textarea 
                style={{ height: '100px' }}
                placeholder="What is this project about?"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                required
              ></textarea>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
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
