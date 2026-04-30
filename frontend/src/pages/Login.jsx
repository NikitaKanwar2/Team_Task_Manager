import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, CheckSquare, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled in context
    }
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
        top: '-10%', 
        left: '-10%', 
        width: '40vw', 
        height: '40vw', 
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>
      <div style={{ 
        position: 'absolute', 
        bottom: '-10%', 
        right: '-10%', 
        width: '50vw', 
        height: '50vw', 
        background: 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        zIndex: 0
      }}></div>

      <div className="glass-card animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '460px', 
        padding: '3.5rem',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 15px 30px rgba(251, 146, 60, 0.3)',
            transform: 'rotate(-6deg)'
          }}>
            <CheckSquare color="white" size={36} />
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.05em' }} className="gradient-text">Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>The future of task management awaits.</p>
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
            gap: '12px',
            animation: 'fadeIn 0.3s ease'
          }}>
            <Sparkles size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label style={{ color: 'var(--text)', fontWeight: '600' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '48px', height: '54px', border: '1px solid rgba(255,255,255,0.05)' }}
              />
            </div>
          </div>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label style={{ marginBottom: 0, color: 'var(--text)', fontWeight: '600' }}>Password</label>
              <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '700' }}>Forgot?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '48px', height: '54px', border: '1px solid rgba(255,255,255,0.05)' }}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', height: '56px', fontSize: '1.15rem', borderRadius: '16px' }}>
            Sign In to Dashboard
          </button>
        </form>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            New to Ethara? <Link to="/signup" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: '800' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
