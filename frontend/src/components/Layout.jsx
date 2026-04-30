import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  LogOut, 
  User as UserIcon,
  Bell
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
      width: '260px', 
      height: 'calc(100vh - 40px)', 
      margin: '20px',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '1rem' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <CheckSquare color="white" size={24} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Ethara
        </h1>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink 
          to="/" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            textDecoration: 'none',
            color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
            transition: 'all 0.2s'
          })}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/projects" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            textDecoration: 'none',
            color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
            transition: 'all 0.2s'
          })}
        >
          <FolderKanban size={20} />
          <span>Projects</span>
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            background: 'var(--surface)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            border: '1px solid var(--surface-border)'
          }}>
            <UserIcon size={18} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.75rem 1rem',
            width: '100%',
            color: '#ef4444',
            background: 'transparent',
            borderRadius: '10px',
            textAlign: 'left'
          }}
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
      <main style={{ flex: 1, marginLeft: '300px', padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <button style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="btn-secondary">
            <Bell size={20} />
          </button>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
