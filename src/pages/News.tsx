import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Calendar, Pin, ArrowLeft, Tag, User } from 'lucide-react';
import './News.css';

const CATEGORIES = ['all', 'announcement', 'event', 'result', 'notice', 'achievement'] as const;
const CATEGORY_COLORS: Record<string, string> = {
  announcement: '#3b82f6',
  event: '#8b5cf6',
  result: '#10b981',
  notice: '#f59e0b',
  achievement: '#d4af37',
};
const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  announcement: 'Announcements',
  event: 'Events',
  result: 'Results',
  notice: 'Notices',
  achievement: 'Achievements',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { approvedNews } = useData();
  const navigate = useNavigate();
  const post = approvedNews.find(n => n.id === id);

  if (!post) {
    return (
      <div className="news-page">
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ color: '#5a6474', fontSize: 14 }}>Post not found.</div>
          <button className="back-btn" style={{ marginTop: 16 }} onClick={() => navigate('/news')}>
            <ArrowLeft size={16} /> Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="container news-detail-container">
        <button className="back-btn" onClick={() => navigate('/news')}>
          <ArrowLeft size={16} /> Back to News
        </button>
        <article className="news-detail">
          {post.imageUrl && (
            <div className="detail-img">
              <img src={post.imageUrl} alt={post.title} />
            </div>
          )}
          <div className="detail-meta">
            <span
              className="news-category"
              style={{ background: `${CATEGORY_COLORS[post.category]}20`, color: CATEGORY_COLORS[post.category] }}
            >
              <Tag size={10} /> {CATEGORY_LABELS[post.category]}
            </span>
            {post.pinned && <span className="pinned-badge"><Pin size={10} /> Pinned</span>}
          </div>
          <h1 className="detail-title">{post.title}</h1>
          <div className="detail-byline">
            <span><User size={12} /> {post.authorName} · {post.authorRole}</span>
            <span><Calendar size={12} /> {formatDate(post.createdAt)}</span>
          </div>
          {post.videoUrl && (
            <div className="detail-video">
              <video controls>
                <source src={post.videoUrl} />
              </video>
            </div>
          )}
          <div className="detail-body">
            {post.content.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

export default function News() {
  const { approvedNews } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = approvedNews.filter(post => {
    const matchCat = activeCategory === 'all' || post.category === activeCategory;
    const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="news-page">
      {/* Header */}
      <section className="news-header">
        <div className="container">
          <div className="section-label">Latest Updates</div>
          <h1 className="news-page-title">News & Events</h1>
          <p className="news-page-desc">Stay informed with the latest announcements, events, results, and achievements from Noor Academy.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="news-filters-section">
        <div className="container">
          <div className="news-filters">
            <div className="category-filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={activeCategory === cat && cat !== 'all' ? {
                    background: `${CATEGORY_COLORS[cat]}20`,
                    color: CATEGORY_COLORS[cat],
                    borderColor: `${CATEGORY_COLORS[cat]}40`,
                  } : undefined}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            <input
              className="news-search"
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="news-list-section">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="empty-news">
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div>No posts found matching your criteria.</div>
            </div>
          ) : (
            <div className="news-list-grid">
              {filtered.map((post, i) => (
                <Link key={post.id} to={`/news/${post.id}`} className={`news-list-card ${i === 0 && !search && activeCategory === 'all' ? 'featured-list' : ''}`}>
                  {post.imageUrl && (
                    <div className="news-list-img">
                      <img src={post.imageUrl} alt={post.title} />
                    </div>
                  )}
                  <div className="news-list-body">
                    <div className="news-meta">
                      <span
                        className="news-category"
                        style={{ background: `${CATEGORY_COLORS[post.category]}20`, color: CATEGORY_COLORS[post.category] }}
                      >
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      {post.pinned && <span className="pinned-badge"><Pin size={10} /> Pinned</span>}
                    </div>
                    <h3 className="news-list-title">{post.title}</h3>
                    <p className="news-list-excerpt">{post.content.slice(0, 140)}...</p>
                    <div className="news-list-footer">
                      <span>{post.authorName}</span>
                      <span><Calendar size={11} /> {formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
