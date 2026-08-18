import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData, NewsPost } from '../contexts/DataContext';
import { Newspaper, Plus, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import './TeacherDashboard.css';

const CATEGORY_OPTIONS = ['announcement', 'event', 'result', 'notice', 'achievement'] as const;
const CATEGORY_COLORS: Record<string, string> = {
  announcement: '#3b82f6', event: '#8b5cf6', result: '#10b981',
  notice: '#f59e0b', achievement: '#d4af37',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { news, addNews, deleteNews } = useData();
  const [tab, setTab] = useState<'overview' | 'post' | 'my-posts'>('overview');
  const [postForm, setPostForm] = useState({ title: '', content: '', imageUrl: '', videoUrl: '', category: 'announcement' as NewsPost['category'] });
  const [postSuccess, setPostSuccess] = useState(false);

  const myPosts = news.filter(n => n.authorId === user?.id);
  const approvedPosts = myPosts.filter(n => n.status === 'approved');
  const pendingPosts = myPosts.filter(n => n.status === 'pending');
  const rejectedPosts = myPosts.filter(n => n.status === 'rejected');

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    addNews({
      ...postForm,
      authorId: user!.id,
      authorName: user!.name,
      authorRole: 'Teacher',
      status: 'pending',
      pinned: false,
    });
    setPostForm({ title: '', content: '', imageUrl: '', videoUrl: '', category: 'announcement' });
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 4000);
  }

  return (
    <div className="teacher-page">
      <div className="teacher-header">
        <div className="teacher-header-inner">
          <div>
            <div className="teacher-greeting">Welcome back,</div>
            <h1 className="teacher-name">{user?.name}</h1>
            <div className="teacher-role-tag">{user?.role?.replace('_', ' ').toUpperCase()} PORTAL</div>
          </div>
          <div className="teacher-header-stats">
            {[
              { label: 'Total Posts', value: myPosts.length, color: '#d4af37' },
              { label: 'Approved', value: approvedPosts.length, color: '#10b981' },
              { label: 'Pending', value: pendingPosts.length, color: '#f59e0b' },
              { label: 'Rejected', value: rejectedPosts.length, color: '#ef4444' },
            ].map(({ label, value, color }) => (
              <div key={label} className="t-stat">
                <span style={{ color, fontSize: 22, fontWeight: 800 }}>{value}</span>
                <span style={{ fontSize: 11, color: '#5a6474' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <nav className="teacher-tabs">
          {([
            ['overview', 'Overview'],
            ['post', 'Submit New Post'],
            ['my-posts', `My Posts (${myPosts.length})`],
          ] as const).map(([id, label]) => (
            <button key={id} className={`teacher-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="teacher-content container">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="teacher-section">
            <div className="notice-box">
              <Clock size={16} />
              <div>
                <strong>How posting works:</strong> You can submit news posts for publishing. Each post goes to the Head Teacher for approval before it becomes visible on the school website.
              </div>
            </div>
            <div className="my-posts-preview">
              <h3 className="section-subhead">Recent Posts</h3>
              {myPosts.length === 0 ? (
                <div className="empty-teacher">You haven't submitted any posts yet. <button className="link-btn" onClick={() => setTab('post')}>Submit your first post →</button></div>
              ) : (
                <div className="my-posts-list">
                  {myPosts.slice(0, 6).map(post => (
                    <PostItem key={post.id} post={post} onDelete={() => { if (confirm('Delete?')) deleteNews(post.id); }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SUBMIT POST ── */}
        {tab === 'post' && (
          <div className="teacher-section">
            <h2 className="section-subhead">Submit a Post for Approval</h2>
            {postSuccess && (
              <div className="success-toast-teacher">
                <CheckCircle size={16} /> Post submitted! It will appear on the website after the Head Teacher approves it.
              </div>
            )}
            <div className="post-form-card">
              <form onSubmit={handlePost}>
                <div className="form-group">
                  <label className="form-label">Post Title *</label>
                  <input className="form-input" type="text" placeholder="Enter a descriptive title" value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input form-select" value={postForm.category} onChange={e => setPostForm(p => ({ ...p, category: e.target.value as any }))}>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Content *</label>
                  <textarea className="form-input form-textarea" placeholder="Write the full post content here..." value={postForm.content} onChange={e => setPostForm(p => ({ ...p, content: e.target.value }))} required rows={7} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Image URL (optional)</label>
                    <input className="form-input" type="url" placeholder="https://..." value={postForm.imageUrl} onChange={e => setPostForm(p => ({ ...p, imageUrl: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Video URL (optional)</label>
                    <input className="form-input" type="url" placeholder="https://..." value={postForm.videoUrl} onChange={e => setPostForm(p => ({ ...p, videoUrl: e.target.value }))} />
                  </div>
                </div>
                <button type="submit" className="btn-submit-post">
                  Submit for Approval →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── MY POSTS ── */}
        {tab === 'my-posts' && (
          <div className="teacher-section">
            <h2 className="section-subhead">My Posts</h2>
            {myPosts.length === 0 ? (
              <div className="empty-teacher">No posts yet.</div>
            ) : (
              <div className="my-posts-list">
                {myPosts.map(post => (
                  <PostItem key={post.id} post={post} onDelete={() => { if (confirm('Delete this post?')) deleteNews(post.id); }} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PostItem({ post, onDelete }: { post: NewsPost; onDelete: () => void }) {
  return (
    <div className="post-item">
      <div className="post-item-left">
        <span className="nm-category" style={{ color: CATEGORY_COLORS[post.category] }}>{post.category}</span>
        <div className="post-item-title">{post.title}</div>
        <div className="post-item-date">{formatDate(post.createdAt)}</div>
      </div>
      <div className="post-item-right">
        <span className={`status-badge status-${post.status}`}>
          {post.status === 'approved' && <CheckCircle size={11} />}
          {post.status === 'pending' && <Clock size={11} />}
          {post.status === 'rejected' && <XCircle size={11} />}
          {post.status}
        </span>
        {post.status !== 'approved' && (
          <button className="icon-btn delete" onClick={onDelete} title="Delete">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
