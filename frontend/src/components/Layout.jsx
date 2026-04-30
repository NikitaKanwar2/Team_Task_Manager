import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  LogOut, 
  User as UserIcon,
  Bell,
  Search
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="glass" style={{ 
      width: '280px', 
      height: 'calc(100vh - 40px)', 
      margin: '20px',
      padding: '2rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '0.5rem' }}>
        <div style={{ 
          width: '42px', 
          height: '42px', 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
        }}>
          <CheckSquare color="white" size={24} />
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }} className="gradient-text">
          Ethara
        </h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/projects" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: 'var(--surface)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            border: '1px solid var(--surface-border)'
          }}>
            <UserIcon size={20} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="sidebar-link"
          style={{ width: '100%', color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '320px', padding: '2rem 3rem' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '3rem',
          padding: '1rem 0'
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              style={{ paddingLeft: '40px', marginBottom: 0, height: '42px', fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ width: '42px', height: '42px', padding: 0 }}>
              <Bell size={20} />
            </button>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent('User')}&background=6366f1&color=fff`} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </header>
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

