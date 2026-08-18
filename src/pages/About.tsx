import { lazy, Suspense, Component, ReactNode } from 'react';
import { useData } from '../contexts/DataContext';
import { Mail, Phone, BookOpen, Clock, Building, Users, Award, MapPin } from 'lucide-react';
import './About.css';

const Balatro = lazy(() => import('../../background/balatro'));

class BgBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() {
    if (this.state.err) return this.props.fallback ?? <div className="bg-fallback" />;
    return this.props.children;
  }
}

const ROLE_LABELS: Record<string, string> = {
  head_teacher: 'Head Teacher & Principal',
  teacher: 'Subject Teacher',
  helper: 'Administrative Staff',
};

const ROLE_COLORS: Record<string, string> = {
  head_teacher: '#d4af37',
  teacher: '#60a5fa',
  helper: '#a78bfa',
};

export default function About() {
  const { teachers } = useData();
  const headTeachers = teachers.filter(t => t.role === 'head_teacher');
  const subjectTeachers = teachers.filter(t => t.role === 'teacher');
  const helpers = teachers.filter(t => t.role === 'helper');

  return (
    <div className="about-page">
      {/* ─── HERO ─── */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <BgBoundary fallback={<div className="bg-fallback" />}>
            <Suspense fallback={<div className="bg-fallback" />}>
              <Balatro color1="#1a1040" color2="#0a0c18" color3="#d4af37" spinSpeed={4} contrast={2} spinAmount={0.15} />
            </Suspense>
          </BgBoundary>
        </div>
        <div className="about-hero-overlay" />
        <div className="about-hero-content container">
          <div className="section-label">Our Institution</div>
          <h1 className="about-hero-title">About 𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊</h1>
          <p className="about-hero-desc">
            A premier educational institution with 28 years of commitment to academic excellence,
            character development, and community service in the heart of Dhaka.
          </p>
        </div>
      </section>

      {/* ─── SCHOOL INFO ─── */}
      <section className="section about-info-section">
        <div className="container">
          <div className="about-info-grid">
            <div className="about-info-text">
              <div className="section-label">Our Story</div>
              <h2 className="section-title" style={{ fontSize: '28px' }}>Founded on a Vision of Excellence</h2>
              <p className="about-para">
                𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊 High School was founded in 1998 by a group of visionary educators who believed that quality
                education should be accessible, holistic, and rooted in values. Starting with just 120 students
                and 4 teachers, we have grown into a thriving institution of over 1,200 students.
              </p>
              <p className="about-para">
                Our school is affiliated with the Dhaka Education Board and follows the national curriculum
                while supplementing it with enrichment programs in science, technology, arts, and sports.
                We have consistently produced top-ranking students in SSC and JSC examinations.
              </p>
              <p className="about-para">
                At 𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊, we believe education extends beyond textbooks. We nurture critical thinking,
                creativity, teamwork, and leadership — qualities that prepare our students not just for exams,
                but for life.
              </p>
            </div>
            <div className="about-info-stats">
              {[
                { icon: Building, label: 'Established', value: '1998' },
                { icon: Users, label: 'Total Students', value: '1,200+' },
                { icon: BookOpen, label: 'Academic Staff', value: '45+' },
                { icon: Award, label: 'National Awards', value: '150+' },
                { icon: Clock, label: 'Classes', value: 'VI – X' },
                { icon: MapPin, label: 'Campus Area', value: '3.2 Acres' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="info-stat-card">
                  <Icon size={18} className="info-stat-icon" />
                  <span className="info-stat-value">{value}</span>
                  <span className="info-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUICK INFO ─── */}
      <section className="about-details-section">
        <div className="container">
          <div className="details-grid">
            {[
              { label: 'School Name', value: '𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊 High School' },
              { label: 'EIIN Number', value: 'BD-1998-1042' },
              { label: 'Type', value: 'Co-educational Secondary School' },
              { label: 'Affiliation', value: 'Dhaka Education Board' },
              { label: 'Classes Offered', value: 'Class VI to Class X (SSC)' },
              { label: 'Shifts', value: 'Morning (7:30am) & Day (12:30pm)' },
              { label: 'Medium', value: 'Bengali & English Medium Available' },
              { label: 'Academic Year', value: 'January – December' },
              { label: 'Location', value: 'Rangpur, Lalmonirhat, Hatibandha, Daikhawa' },
              { label: 'Phone', value: '+880 1700-000000' },
              { label: 'Email', value: 'info@gotamarydnsc.edu.bd' },
              { label: 'Office Hours', value: 'Sunday–Thursday, 7:30am–4:00pm' },
            ].map(({ label, value }) => (
              <div key={label} className="detail-item">
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CURRICULUM ─── */}
      <section className="section curriculum-section" id="curriculum">
        <div className="container">
          <div className="section-header centered">
            <div className="section-label">Academics</div>
            <h2 className="section-title">Curriculum & Subjects</h2>
          </div>
          <div className="curriculum-grid">
            {[
              { class: 'Class VI–VII', subjects: ['Bangla', 'English', 'Mathematics', 'General Science', 'Bangladesh & Global Studies', 'Religion', 'ICT', 'Arts & Crafts', 'Physical Education'] },
              { class: 'Class VIII–IX', subjects: ['Bangla', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'ICT', 'Religion'] },
              { class: 'Class X (SSC)', subjects: ['Bangla', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology / Business Studies', 'History', 'Geography', 'ICT', 'Optional Subject'] },
            ].map(({ class: cls, subjects }) => (
              <div key={cls} className="curriculum-card">
                <h3 className="curriculum-class">{cls}</h3>
                <ul className="curriculum-subjects">
                  {subjects.map(s => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FACILITIES ─── */}
      <section className="section facilities-section" id="facilities">
        <div className="container">
          <div className="section-header centered">
            <div className="section-label">Infrastructure</div>
            <h2 className="section-title">Our Facilities</h2>
          </div>
          <div className="facilities-grid">
            {[
              '🔬 Modern Science Laboratory',
              '💻 Computer Lab with High-Speed Internet',
              '📚 Library with 5,000+ Books',
              '🏃 Sports Ground & Football Field',
              '🎨 Art & Craft Room',
              '🎵 Music & Cultural Room',
              '🏥 First Aid & Medical Room',
              '🚌 School Transport Service',
              '🌐 Smart Classroom with Projectors',
              '🍽️ Clean Cafeteria',
              '♿ Disability-Friendly Access',
              '🔒 24/7 CCTV Security',
            ].map(facility => (
              <div key={facility} className="facility-item">{facility}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEADERSHIP ─── */}
      {headTeachers.length > 0 && (
        <section className="section teachers-section" id="teachers">
          <div className="container">
            <div className="section-header centered">
              <div className="section-label">Leadership</div>
              <h2 className="section-title">School Leadership</h2>
            </div>
            <div className="teachers-grid leadership-grid">
              {headTeachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TEACHERS ─── */}
      {subjectTeachers.length > 0 && (
        <section className="section teachers-section alt-bg">
          <div className="container">
            <div className="section-header centered">
              <div className="section-label">Our Faculty</div>
              <h2 className="section-title">Meet Our Teachers</h2>
              <p className="section-desc">Our dedicated educators bring passion, expertise, and inspiration to every classroom.</p>
            </div>
            <div className="teachers-grid">
              {subjectTeachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── HELPERS ─── */}
      {helpers.length > 0 && (
        <section className="section teachers-section">
          <div className="container">
            <div className="section-header centered">
              <div className="section-label">Support Staff</div>
              <h2 className="section-title">Administrative Team</h2>
            </div>
            <div className="teachers-grid">
              {helpers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function TeacherCard({ teacher }: { teacher: ReturnType<typeof useData>['teachers'][0] }) {
  const color = ROLE_COLORS[teacher.role] || '#9aa5b4';
  return (
    <div className="teacher-card">
      <div className="teacher-avatar" style={{ background: `${color}18`, borderColor: `${color}30` }}>
        <span style={{ color }}>{teacher.name.charAt(0)}</span>
      </div>
      <div className="teacher-info">
        <div className="teacher-role-badge" style={{ color, background: `${color}15` }}>
          {ROLE_LABELS[teacher.role]}
        </div>
        <h3 className="teacher-name">{teacher.name}</h3>
        <div className="teacher-subject">{teacher.subject}</div>
        <p className="teacher-bio">{teacher.bio}</p>
        <div className="teacher-details">
          <div className="teacher-detail"><BookOpen size={12} /><span>{teacher.qualification}</span></div>
          <div className="teacher-detail"><Clock size={12} /><span>{teacher.experience} experience</span></div>
          <div className="teacher-detail"><Mail size={12} /><a href={`mailto:${teacher.email}`}>{teacher.email}</a></div>
          {teacher.phone && <div className="teacher-detail"><Phone size={12} /><span>{teacher.phone}</span></div>}
        </div>
      </div>
    </div>
  );
}
