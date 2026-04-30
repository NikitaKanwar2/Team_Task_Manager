import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, CheckSquare, ShieldCheck, Zap } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member'
  });
  const { signup, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      // Error is handled in context
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      width: '100vw',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      background: '#020617'
    }}>
      {/* Decorative Background Elements */}
      <div style={{ 
        position: 'absolute', 
        top: '20%', 
        right: '-5%', 
        width: '35vw', 
        height: '35vw', 
        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>
      <div style={{ 
        position: 'absolute', 
        bottom: '10%', 
        left: '-5%', 
        width: '45vw', 
        height: '45vw', 
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>

      <div className="glass-card animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '3.5rem',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 15px 30px rgba(244, 63, 94, 0.3)',
            transform: 'rotate(6deg)'
          }}>
            <UserPlus color="white" size={36} />
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.05em' }} className="gradient-text">Join Ethara</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>Experience the peak of productivity.</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.08)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: 'var(--error)', 
            padding: '1rem 1.25rem', 
            borderRadius: '12px', 
            marginBottom: '2rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label style={{ color: 'var(--text)', fontWeight: '600' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="name"
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                required
                style={{ paddingLeft: '48px', height: '52px', border: '1px solid rgba(255,255,255,0.05)' }}
              />
            </div>
          </div>
          <div className="input-group">
            <label style={{ color: 'var(--text)', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="email"
                type="email" 
                placeholder="name@company.com" 
                value={formData.email}
                onChange={handleChange}
                required
                style={{ paddingLeft: '48px', height: '52px', border: '1px solid rgba(255,255,255,0.05)' }}
              />
            </div>
          </div>
          <div className="input-group">
            <label style={{ color: 'var(--text)', fontWeight: '600' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                style={{ paddingLeft: '48px', height: '52px', border: '1px solid rgba(255,255,255,0.05)' }}
              />
            </div>
          </div>
          <div className="input-group">
            <label style={{ color: 'var(--text)', fontWeight: '600' }}>Your Role</label>
            <div style={{ position: 'relative' }}>
              <Zap size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', zIndex: 1 }} />
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                style={{ paddingLeft: '48px', height: '52px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', height: '56px', fontSize: '1.15rem', borderRadius: '16px' }}>
            Get Started Now
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Already a member? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;


