import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const dest = user?.role === 'head_teacher' ? '/admin' : user?.role === 'teacher' ? '/teacher' : '/';
    navigate(dest, { replace: true });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        const dest = email.includes('head') ? '/admin' :
          email.includes('helper') ? '/' : '/teacher';
        navigate(dest);
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <GraduationCap size={28} />
          </div>
          <h1 className="login-title">Staff Login</h1>
          <p className="login-subtitle">Access the 𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊 management portal</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="you@school.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(v => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : (
              <><Shield size={16} /> Sign In to Portal</>
            )}
          </button>
        </form>

        <div className="login-demo">
          <p className="demo-title">Demo Credentials</p>
          <div className="demo-accounts">
            {[
              { role: 'Head Teacher', email: 'head@school.edu', pass: 'head123' },
              { role: 'Teacher', email: 'karim@school.edu', pass: 'teacher123' },
              { role: 'Helper', email: 'helper@school.edu', pass: 'helper123' },
            ].map(({ role, email: e, pass }) => (
              <button
                key={role}
                className="demo-account"
                onClick={() => { setEmail(e); setPassword(pass); }}
              >
                <span className="demo-role">{role}</span>
                <span className="demo-email">{e}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="login-footer">
          <Link to="/" className="login-back">← Back to Homepage</Link>
        </div>
      </div>
    </div>
  );
}
