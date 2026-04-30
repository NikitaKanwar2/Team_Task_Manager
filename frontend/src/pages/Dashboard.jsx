import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3,
  Calendar
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

  if (loading) return <div className="animate-fade-in">Loading dashboard...</div>;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Hello, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your projects today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard 
          icon={<BarChart3 color="#6366f1" />} 
          label="Total Tasks" 
          value={stats?.totalTasks} 
          color="rgba(99, 102, 241, 0.1)"
        />
        <StatCard 
          icon={<CheckCircle2 color="#22c55e" />} 
          label="Completed" 
          value={stats?.statusCounts?.done} 
          color="rgba(34, 197, 94, 0.1)"
        />
        <StatCard 
          icon={<Clock color="#f59e0b" />} 
          label="In Progress" 
          value={stats?.statusCounts?.inProgress} 
          color="rgba(245, 158, 11, 0.1)"
        />
        <StatCard 
          icon={<AlertCircle color="#ef4444" />} 
          label="Overdue" 
          value={stats?.overdueTasks} 
          color="rgba(239, 68, 68, 0.1)"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={20} color="var(--primary)" />
            Task Distribution
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '200px', padding: '0 20px' }}>
             {/* Simple visual bar chart */}
             <Bar label="To Do" count={stats?.statusCounts?.todo} total={stats?.totalTasks} color="#94a3b8" />
             <Bar label="In Progress" count={stats?.statusCounts?.inProgress} total={stats?.totalTasks} color="#f59e0b" />
             <Bar label="Done" count={stats?.statusCounts?.done} total={stats?.totalTasks} color="#22c55e" />
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Tasks per User</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats?.tasksPerUser?.map((u, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem' }}>{u.name}</span>
                  <span style={{ 
                    background: 'var(--glass-bg)', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    border: '1px solid var(--glass-border)'
                  }}>{u.count} tasks</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ 
      width: '48px', 
      height: '48px', 
      borderRadius: '12px', 
      backgroundColor: color, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{label}</p>
      <h4 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</h4>
    </div>
  </div>
);

const Bar = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '100%', 
        backgroundColor: color, 
        height: `${Math.max(percentage * 2, 4)}px`,
        borderRadius: '8px 8px 0 0',
        transition: 'height 0.5s ease'
      }}></div>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{count}</span>
    </div>
  );
};

export default Dashboard;
