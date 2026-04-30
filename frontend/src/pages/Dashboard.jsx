import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3,
  Calendar,
  ArrowUpRight,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div className="animate-pulse" style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Loading Workspace...</div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: '800', marginBottom: '0.75rem' }}>
          Welcome back, <span className="gradient-text">{user?.name.split(' ')[0]}</span>! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Here's an overview of your team's progress.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard 
          icon={<BarChart3 size={24} />} 
          label="Total Tasks" 
          value={stats?.totalTasks || 0} 
          color="var(--primary)"
          trend="+12%"
        />
        <StatCard 
          icon={<CheckCircle2 size={24} />} 
          label="Completed" 
          value={stats?.statusCounts?.done || 0} 
          color="#10b981"
          trend="+5%"
        />
        <StatCard 
          icon={<Clock size={24} />} 
          label="In Progress" 
          value={stats?.statusCounts?.inProgress || 0} 
          color="#f59e0b"
          trend="-2%"
        />
        <StatCard 
          icon={<AlertCircle size={24} />} 
          label="Overdue" 
          value={stats?.overdueTasks || 0} 
          color="#ef4444"
          trend="Critical"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={22} color="var(--primary)" />
              Task Distribution
            </h3>
            <button style={{ background: 'transparent', color: 'var(--text-muted)' }}><MoreVertical size={20} /></button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '30px', height: '250px', padding: '0 10px' }}>
             <Bar label="To Do" count={stats?.statusCounts?.todo || 0} total={stats?.totalTasks || 1} color="var(--text-muted)" />
             <Bar label="In Progress" count={stats?.statusCounts?.inProgress || 0} total={stats?.totalTasks || 1} color="var(--warning)" />
             <Bar label="Done" count={stats?.statusCounts?.done || 0} total={stats?.totalTasks || 1} color="var(--success)" />
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="glass-card">
            <h3 style={{ marginBottom: '2rem' }}>Top Contributors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {stats?.tasksPerUser?.map((u, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {u.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{u.name}</span>
                  </div>
                  <span style={{ 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    fontWeight: '700',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                  }}>{u.count} Tasks</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
      <div className="stat-card-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', color: trend === 'Critical' ? 'var(--error)' : 'var(--success)', background: trend === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '20px' }}>
        {trend} {trend !== 'Critical' && <ArrowUpRight size={12} />}
      </div>
    </div>
    <div>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</p>
      <h4 style={{ fontSize: '2rem', fontWeight: '800' }}>{value}</h4>
    </div>
    <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '60px', height: '60px', background: color, filter: 'blur(40px)', opacity: 0.15, borderRadius: '50%' }}></div>
  </div>
);

const Bar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ 
        width: '40px', 
        backgroundColor: color, 
        height: `${Math.max(percentage * 2, 8)}px`,
        borderRadius: '12px 12px 4px 4px',
        transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: `0 4px 15px ${color}20`
      }}></div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '700' }}>{count}</p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      </div>
    </div>
  );
};

export default Dashboard;

