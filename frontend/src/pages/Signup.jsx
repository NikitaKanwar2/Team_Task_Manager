import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

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
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'
          }}>
            <UserPlus color="white" size={30} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join the team and start managing tasks</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid var(--error)', 
            color: 'var(--error)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input 
              name="name"
              type="text" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div>
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Get Started
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
