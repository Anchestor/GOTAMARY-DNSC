import { lazy, Suspense, Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import {
  GraduationCap, Users, BookOpen, Trophy, ArrowRight,
  Calendar, Pin, ChevronRight, Star, Award, Target
} from 'lucide-react';
import './Home.css';

const DarkVeil = lazy(() => import('../../background/darkveil'));
const SoftAurora = lazy(() => import('../../background/soft-aurora'));
const Orbs = lazy(() => import('../../background/orbs'));

// Per-component error boundary for visual effects
class BgBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) return this.props.fallback ?? <div className="bg-fallback" />;
    return this.props.children;
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  announcement: '#3b82f6',
  event: '#8b5cf6',
  result: '#10b981',
  notice: '#f59e0b',
  achievement: '#d4af37',
};

const CATEGORY_LABELS: Record<string, string> = {
  announcement: 'Announcement',
  event: 'Event',
  result: 'Result',
  notice: 'Notice',
  achievement: 'Achievement',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Home() {
  const { approvedNews } = useData();
  const featuredNews = approvedNews.slice(0, 6);
  const pinnedNews = approvedNews.filter(n => n.pinned);

  return (
    <div className="home">
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero-bg">
          <BgBoundary fallback={<div className="hero-bg-fallback" />}>
            <Suspense fallback={<div className="hero-bg-fallback" />}>
              <DarkVeil />
            </Suspense>
          </BgBoundary>
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={12} /> Est. 1998 · Excellence in Education
          </div>
          <h1 className="hero-title">
            Welcome to
            <span className="hero-title-accent"> 𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊 </span>
          </h1>
          <p className="hero-subtitle">
            Inspiring curiosity. Nurturing talent. Shaping tomorrow's leaders with a
            commitment to academic excellence and holistic development.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn-primary">
              Apply for Admission <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-outline">
              Learn More
            </Link>
          </div>
          <div className="hero-stats">
            {[
              { icon: Users, value: '1,200+', label: 'Students Enrolled' },
              { icon: GraduationCap, value: '98%', label: 'Pass Rate 2025' },
              { icon: BookOpen, value: '28+', label: 'Years of Excellence' },
              { icon: Trophy, value: '150+', label: 'Awards Won' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="hero-stat">
                <Icon size={20} className="stat-icon" />
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PINNED NOTICE ─── */}
      {pinnedNews.length > 0 && (
        <section className="pinned-section">
          <div className="container">
            <div className="pinned-bar">
              <span className="pinned-label"><Pin size={13} /> Important</span>
              <div className="pinned-list">
                {pinnedNews.map(post => (
                  <Link key={post.id} to={`/news/${post.id}`} className="pinned-item">
                    {post.title}
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── LATEST NEWS ─── */}
      <section className="section news-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label">Stay Updated</div>
              <h2 className="section-title">Latest News & Events</h2>
            </div>
            <Link to="/news" className="view-all">View All <ChevronRight size={16} /></Link>
          </div>

          <div className="news-grid">
            {featuredNews.length === 0 ? (
              <div className="empty-state">No news published yet.</div>
            ) : (
              featuredNews.map((post, i) => (
                <Link key={post.id} to={`/news/${post.id}`} className={`news-card ${i === 0 ? 'featured' : ''}`}>
                  {post.imageUrl && (
                    <div className="news-card-img">
                      <img src={post.imageUrl} alt={post.title} />
                    </div>
                  )}
                  <div className="news-card-body">
                    <div className="news-meta">
                      <span
                        className="news-category"
                        style={{ background: `${CATEGORY_COLORS[post.category]}20`, color: CATEGORY_COLORS[post.category] }}
                      >
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      {post.pinned && <span className="pinned-badge"><Pin size={10} /> Pinned</span>}
                    </div>
                    <h3 className="news-card-title">{post.title}</h3>
                    <p className="news-card-excerpt">{post.content.slice(0, 120)}...</p>
                    <div className="news-card-footer">
                      <span className="news-author">{post.authorName}</span>
                      <span className="news-date"><Calendar size={12} /> {formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="section features-section">
        <div className="features-bg">
          <BgBoundary fallback={<div className="aurora-fallback" />}>
            <Suspense fallback={<div className="aurora-fallback" />}>
              <SoftAurora speed={0.3} brightness={0.4} />
            </Suspense>
          </BgBoundary>
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header centered">
            <div className="section-label">Why 𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊</div>
            <h2 className="section-title">A Legacy of Excellence</h2>
            <p className="section-desc">
              We combine traditional values with modern education to create a learning
              environment where every student can thrive.
            </p>
          </div>
          <div className="features-grid">
            {[
              { icon: Award, title: 'Academic Excellence', desc: 'Consistently ranked among top schools in the district with outstanding board exam results.' },
              { icon: Users, title: 'Dedicated Faculty', desc: 'Our qualified and experienced teachers are passionate about nurturing each student\'s potential.' },
              { icon: Target, title: 'Holistic Development', desc: 'Beyond academics, we foster sports, arts, debate, and cultural activities for complete growth.' },
              { icon: BookOpen, title: 'Modern Curriculum', desc: 'Aligned with national standards while incorporating global best practices in education.' },
              { icon: GraduationCap, title: 'Student Support', desc: 'Counseling, mentoring, and career guidance to help students make the right choices.' },
              { icon: Trophy, title: 'Proven Track Record', desc: '28 years of producing graduates who lead in business, academics, and public service.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ─── */}
      <section className="cta-section">
        <div className="cta-bg">
          <BgBoundary fallback={<div className="orbs-fallback" />}>
            <Suspense fallback={<div className="orbs-fallback" />}>
              <Orbs hue={45} hoverIntensity={0.3} />
            </Suspense>
          </BgBoundary>
        </div>
        <div className="container cta-content">
          <div className="cta-text">
            <h2>Begin Your Journey at 𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊 </h2>
            <p>Applications for the 2026–27 academic year are now open. Secure your child's future today.</p>
          </div>
          <div className="cta-btns">
            <Link to="/register" className="btn-primary">Apply Now <ArrowRight size={16} /></Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
