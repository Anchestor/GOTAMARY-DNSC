import { useState, lazy, Suspense } from 'react';
import { useAuth, getAllUsers, addUser, updateUser, deleteUserById, User } from '../contexts/AuthContext';
import { useData, NewsPost, StudentApplication } from '../contexts/DataContext';
import {
  LayoutDashboard, Newspaper, Users, UserCheck, UserPlus,
  CheckCircle, XCircle, Trash2, Pin, PinOff, Eye, Plus,
  BookOpen, ChevronDown, ChevronUp, Edit3, AlertTriangle,
  GraduationCap, FileText, Bell
} from 'lucide-react';
import './AdminDashboard.css';

const CATEGORY_OPTIONS = ['announcement', 'event', 'result', 'notice', 'achievement'] as const;
const CATEGORY_COLORS: Record<string, string> = {
  announcement: '#3b82f6', event: '#8b5cf6', result: '#10b981',
  notice: '#f59e0b', achievement: '#d4af37',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

type Tab = 'overview' | 'news' | 'pending' | 'applications' | 'staff' | 'post';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { news, approvedNews, pendingNews, applications, teachers,
    addNews, updateNewsStatus, deleteNews, togglePin, updateApplicationStatus, addTeacher, updateTeacher, deleteTeacher } = useData();
  const [tab, setTab] = useState<Tab>('overview');
  const [postForm, setPostForm] = useState({ title: '', content: '', imageUrl: '', videoUrl: '', category: 'announcement' as NewsPost['category'] });
  const [postSuccess, setPostSuccess] = useState(false);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [appNote, setAppNote] = useState('');
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'teacher' as User['role'], subject: '' });
  const [staffSuccess, setStaffSuccess] = useState('');
  const [allUsers, setAllUsers] = useState(() => getAllUsers());

  function refreshUsers() { setAllUsers(getAllUsers()); }

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    addNews({
      ...postForm,
      authorId: user!.id,
      authorName: user!.name,
      authorRole: 'Head Teacher',
      status: 'approved',
      pinned: false,
    });
    setPostForm({ title: '', content: '', imageUrl: '', videoUrl: '', category: 'announcement' });
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3000);
  }

  function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    const id = Date.now().toString();
    addUser({ ...newStaff, id, approved: true } as any);
    addTeacher({ id, name: newStaff.name, email: newStaff.email, subject: newStaff.subject, qualification: '', experience: '', bio: `${newStaff.role === 'teacher' ? 'Subject teacher' : 'Staff member'} at Noor Academy.`, role: newStaff.role as any });
    setNewStaff({ name: '', email: '', password: '', role: 'teacher', subject: '' });
    setStaffSuccess('Staff member added successfully.');
    refreshUsers();
    setTimeout(() => setStaffSuccess(''), 3000);
  }

  const pendingApps = applications.filter(a => a.status === 'pending');
  const totalStudents = applications.filter(a => a.status === 'approved').length;
  const teacherCount = allUsers.filter(u => u.role === 'teacher').length;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <GraduationCap size={20} />
          <span>Admin Portal</span>
        </div>
        <nav className="admin-nav">
          {([
            ['overview', LayoutDashboard, 'Overview'],
            ['post', Plus, 'Create Post'],
            ['news', Newspaper, 'Manage News'],
            ['pending', Bell, `Pending (${pendingNews.length})`],
            ['applications', FileText, `Applications (${pendingApps.length})`],
            ['staff', Users, 'Staff Management'],
          ] as [Tab, any, string][]).map(([id, Icon, label]) => (
            <button key={id} className={`admin-nav-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              <Icon size={16} />
              <span>{label}</span>
              {id === 'pending' && pendingNews.length > 0 && <span className="nav-badge">{pendingNews.length}</span>}
              {id === 'applications' && pendingApps.length > 0 && <span className="nav-badge">{pendingApps.length}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-user-info">
          <div className="admin-user-avatar">{user?.name.charAt(0)}</div>
          <div>
            <div className="admin-user-name">{user?.name}</div>
            <div className="admin-user-role">Head Teacher</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="admin-section">
            <h1 className="admin-page-title">Dashboard Overview</h1>
            <div className="overview-stats">
              {[
                { label: 'Total News Posts', value: news.length, color: '#3b82f6', icon: Newspaper },
                { label: 'Pending Approvals', value: pendingNews.length, color: '#f59e0b', icon: Bell },
                { label: 'Applications', value: applications.length, color: '#8b5cf6', icon: FileText },
                { label: 'Approved Students', value: totalStudents, color: '#10b981', icon: UserCheck },
                { label: 'Teachers', value: teacherCount, color: '#d4af37', icon: GraduationCap },
                { label: 'Staff Members', value: allUsers.filter(u => u.role !== 'head_teacher').length, color: '#60a5fa', icon: Users },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="stat-card">
                  <div className="stat-card-icon" style={{ background: `${color}18`, color }}><Icon size={20} /></div>
                  <div className="stat-card-value" style={{ color }}>{value}</div>
                  <div className="stat-card-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="overview-grid">
              <div className="overview-widget">
                <h3 className="widget-title">Recent Applications</h3>
                {applications.slice(0, 5).length === 0 ? (
                  <div className="empty-widget">No applications yet.</div>
                ) : (
                  <div className="widget-list">
                    {applications.slice(0, 5).map(app => (
                      <div key={app.id} className="widget-item">
                        <div>
                          <div className="widget-item-title">{app.studentName}</div>
                          <div className="widget-item-sub">{app.classApplying} · {formatDate(app.submittedAt)}</div>
                        </div>
                        <span className={`status-badge status-${app.status}`}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="overview-widget">
                <h3 className="widget-title">Pending Teacher Posts</h3>
                {pendingNews.length === 0 ? (
                  <div className="empty-widget">No pending posts.</div>
                ) : (
                  <div className="widget-list">
                    {pendingNews.map(post => (
                      <div key={post.id} className="widget-item">
                        <div>
                          <div className="widget-item-title">{post.title}</div>
                          <div className="widget-item-sub">By {post.authorName} · {formatDate(post.createdAt)}</div>
                        </div>
                        <div className="widget-actions">
                          <button className="icon-btn approve" onClick={() => updateNewsStatus(post.id, 'approved')} title="Approve"><CheckCircle size={15} /></button>
                          <button className="icon-btn reject" onClick={() => updateNewsStatus(post.id, 'rejected')} title="Reject"><XCircle size={15} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CREATE POST ── */}
        {tab === 'post' && (
          <div className="admin-section">
            <h1 className="admin-page-title">Create New Post</h1>
            {postSuccess && <div className="success-toast">✓ Post published successfully!</div>}
            <div className="post-form-card">
              <form onSubmit={handlePost}>
                <div className="form-group">
                  <label className="form-label">Post Title *</label>
                  <input className="form-input" type="text" placeholder="Enter a clear, descriptive title" value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input form-select" value={postForm.category} onChange={e => setPostForm(p => ({ ...p, category: e.target.value as any }))}>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Content *</label>
                  <textarea className="form-input form-textarea" placeholder="Write the full post content here..." value={postForm.content} onChange={e => setPostForm(p => ({ ...p, content: e.target.value }))} required rows={8} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Image URL (optional)</label>
                    <input className="form-input" type="url" placeholder="https://example.com/image.jpg" value={postForm.imageUrl} onChange={e => setPostForm(p => ({ ...p, imageUrl: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Video URL (optional)</label>
                    <input className="form-input" type="url" placeholder="https://example.com/video.mp4" value={postForm.videoUrl} onChange={e => setPostForm(p => ({ ...p, videoUrl: e.target.value }))} />
                  </div>
                </div>
                {postForm.imageUrl && (
                  <div className="img-preview">
                    <img src={postForm.imageUrl} alt="preview" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
                <button type="submit" className="btn-post">Publish Post Now</button>
              </form>
            </div>
          </div>
        )}

        {/* ── MANAGE NEWS ── */}
        {tab === 'news' && (
          <div className="admin-section">
            <h1 className="admin-page-title">Manage All Posts</h1>
            <div className="news-manage-list">
              {news.length === 0 ? (
                <div className="empty-state-admin">No posts yet.</div>
              ) : (
                news.map(post => (
                  <div key={post.id} className="news-manage-item">
                    <div className="nm-info">
                      <span className="nm-category" style={{ color: CATEGORY_COLORS[post.category] }}>{post.category}</span>
                      <div className="nm-title">{post.title}</div>
                      <div className="nm-meta">{post.authorName} · {formatDate(post.createdAt)}</div>
                    </div>
                    <div className="nm-right">
                      <span className={`status-badge status-${post.status}`}>{post.status}</span>
                      <div className="nm-actions">
                        <button className={`icon-btn ${post.pinned ? 'pinned' : ''}`} onClick={() => togglePin(post.id)} title={post.pinned ? 'Unpin' : 'Pin'}>
                          {post.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                        </button>
                        {post.status === 'pending' && <button className="icon-btn approve" onClick={() => updateNewsStatus(post.id, 'approved')}><CheckCircle size={15} /></button>}
                        {post.status === 'pending' && <button className="icon-btn reject" onClick={() => updateNewsStatus(post.id, 'rejected')}><XCircle size={15} /></button>}
                        {post.status === 'rejected' && <button className="icon-btn approve" onClick={() => updateNewsStatus(post.id, 'approved')}><CheckCircle size={15} /></button>}
                        <button className="icon-btn delete" onClick={() => { if (confirm('Delete this post?')) deleteNews(post.id); }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── PENDING ── */}
        {tab === 'pending' && (
          <div className="admin-section">
            <h1 className="admin-page-title">Pending Approvals</h1>
            {pendingNews.length === 0 ? (
              <div className="empty-state-admin">
                <CheckCircle size={40} style={{ color: '#10b981', marginBottom: 12 }} />
                <p>All caught up! No pending posts.</p>
              </div>
            ) : (
              <div className="pending-list">
                {pendingNews.map(post => (
                  <div key={post.id} className="pending-card">
                    <div className="pending-header">
                      <span className="nm-category" style={{ color: CATEGORY_COLORS[post.category] }}>{post.category}</span>
                      <div className="nm-meta">Submitted by {post.authorName} · {formatDate(post.createdAt)}</div>
                    </div>
                    <h3 className="pending-title">{post.title}</h3>
                    <p className="pending-excerpt">{post.content.slice(0, 200)}...</p>
                    <div className="pending-actions">
                      <button className="btn-approve" onClick={() => updateNewsStatus(post.id, 'approved')}>
                        <CheckCircle size={15} /> Approve & Publish
                      </button>
                      <button className="btn-reject" onClick={() => updateNewsStatus(post.id, 'rejected')}>
                        <XCircle size={15} /> Reject
                      </button>
                      <button className="btn-delete-sm" onClick={() => deleteNews(post.id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICATIONS ── */}
        {tab === 'applications' && (
          <div className="admin-section">
            <h1 className="admin-page-title">Student Applications</h1>
            <div className="app-stats">
              {[
                { label: 'Pending', count: applications.filter(a => a.status === 'pending').length, color: '#f59e0b' },
                { label: 'Approved', count: applications.filter(a => a.status === 'approved').length, color: '#10b981' },
                { label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length, color: '#ef4444' },
              ].map(({ label, count, color }) => (
                <div key={label} className="app-stat" style={{ borderColor: `${color}30`, background: `${color}08` }}>
                  <span style={{ color, fontSize: 22, fontWeight: 800 }}>{count}</span>
                  <span style={{ fontSize: 12, color: '#6b7684' }}>{label}</span>
                </div>
              ))}
            </div>
            {applications.length === 0 ? (
              <div className="empty-state-admin">No applications submitted yet.</div>
            ) : (
              <div className="applications-list">
                {applications.map(app => (
                  <div key={app.id} className="app-card">
                    <div className="app-card-header" onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}>
                      <div>
                        <div className="app-name">{app.studentName}</div>
                        <div className="app-meta">{app.classApplying} · Applied: {formatDate(app.submittedAt)}</div>
                      </div>
                      <div className="app-header-right">
                        <span className={`status-badge status-${app.status}`}>{app.status}</span>
                        {expandedApp === app.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    {expandedApp === app.id && (
                      <div className="app-details">
                        <div className="app-details-grid">
                          {[
                            ['Gender', app.gender],
                            ['DOB', app.dateOfBirth],
                            ['Guardian', app.guardianName],
                            ['Phone', app.guardianPhone],
                            ['Email', app.guardianEmail],
                            ['Address', app.address],
                            ['Prev. School', app.previousSchool || '—'],
                            ['Documents', app.documents || '—'],
                          ].map(([k, v]) => (
                            <div key={k} className="app-detail-item">
                              <span className="app-detail-key">{k}</span>
                              <span className="app-detail-val">{v}</span>
                            </div>
                          ))}
                        </div>
                        {app.notes && (
                          <div className="app-notes">
                            <strong>Notes:</strong> {app.notes}
                          </div>
                        )}
                        {app.status === 'pending' && (
                          <div className="app-action-row">
                            <input
                              className="form-input"
                              type="text"
                              placeholder="Add a note (optional)"
                              value={appNote}
                              onChange={e => setAppNote(e.target.value)}
                              style={{ flex: 1 }}
                            />
                            <button className="btn-approve" onClick={() => { updateApplicationStatus(app.id, 'approved', appNote); setAppNote(''); }}>
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button className="btn-reject" onClick={() => { updateApplicationStatus(app.id, 'rejected', appNote); setAppNote(''); }}>
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STAFF ── */}
        {tab === 'staff' && (
          <div className="admin-section">
            <h1 className="admin-page-title">Staff Management</h1>
            {staffSuccess && <div className="success-toast">{staffSuccess}</div>}

            <div className="staff-layout">
              {/* Add Staff Form */}
              <div className="add-staff-card">
                <h3 className="widget-title"><UserPlus size={16} /> Add New Staff</h3>
                <form onSubmit={handleAddStaff}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" type="text" placeholder="Staff member's name" value={newStaff.name} onChange={e => setNewStaff(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="staff@school.edu" value={newStaff.email} onChange={e => setNewStaff(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input className="form-input" type="password" placeholder="Set login password" value={newStaff.password} onChange={e => setNewStaff(p => ({ ...p, password: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role *</label>
                    <select className="form-input form-select" value={newStaff.role || 'teacher'} onChange={e => setNewStaff(p => ({ ...p, role: e.target.value as any }))}>
                      <option value="teacher">Teacher</option>
                      <option value="helper">Helper / Admin Staff</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject / Designation *</label>
                    <input className="form-input" type="text" placeholder="e.g. Mathematics, Office Staff" value={newStaff.subject} onChange={e => setNewStaff(p => ({ ...p, subject: e.target.value }))} required />
                  </div>
                  <button type="submit" className="btn-post" style={{ marginTop: 8 }}>
                    <UserPlus size={15} /> Add Staff Member
                  </button>
                </form>
              </div>

              {/* Staff List */}
              <div className="staff-list-section">
                <h3 className="widget-title">Current Staff ({allUsers.length})</h3>
                <div className="staff-list">
                  {allUsers.map(u => (
                    <div key={u.id} className="staff-item">
                      <div className="staff-avatar">{u.name.charAt(0)}</div>
                      <div className="staff-info">
                        <div className="staff-name">{u.name}</div>
                        <div className="staff-email">{u.email}</div>
                        <div className={`staff-role-tag role-${u.role}`}>{u.role?.replace('_', ' ')}</div>
                      </div>
                      {u.role !== 'head_teacher' && (
                        <button
                          className="icon-btn delete"
                          onClick={() => {
                            if (confirm(`Remove ${u.name}?`)) {
                              deleteUserById(u.id);
                              deleteTeacher(u.id);
                              refreshUsers();
                            }
                          }}
                          title="Remove staff"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
