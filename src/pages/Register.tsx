import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { CheckCircle, Upload, User, Users, Home, BookOpen, FileText } from 'lucide-react';
import './Register.css';

const CLASSES = ['Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];

export default function Register() {
  const { addApplication } = useData();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    address: '',
    previousSchool: '',
    classApplying: '',
    documents: '',
  });

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addApplication({ ...form, status: 'pending' });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="register-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon"><CheckCircle size={48} /></div>
            <h2 className="success-title">Application Submitted!</h2>
            <p className="success-desc">
              Thank you for applying to Noor Academy. Your application has been received and is
              currently under review. Our admissions team will contact you within 3–5 working days.
            </p>
            <div className="success-info">
              <strong>Applicant:</strong> {form.studentName}<br />
              <strong>Class:</strong> {form.classApplying}<br />
              <strong>Guardian Email:</strong> {form.guardianEmail}
            </div>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => { setSubmitted(false); setStep(1); setForm({ studentName: '', dateOfBirth: '', gender: '', guardianName: '', guardianPhone: '', guardianEmail: '', address: '', previousSchool: '', classApplying: '', documents: '' }); }}>
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      {/* Header */}
      <section className="register-header">
        <div className="container">
          <div className="section-label">Admissions 2026–27</div>
          <h1 className="register-title">Student Registration</h1>
          <p className="register-desc">
            Complete the form below to apply for admission to Noor Academy.
            All fields marked with * are required.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Progress Steps */}
        <div className="steps-bar">
          {[
            { n: 1, icon: User, label: 'Student Info' },
            { n: 2, icon: Users, label: 'Guardian Info' },
            { n: 3, icon: Home, label: 'Address' },
            { n: 4, icon: BookOpen, label: 'Academic' },
            { n: 5, icon: FileText, label: 'Review' },
          ].map(({ n, icon: Icon, label }) => (
            <div key={n} className={`step-item ${step === n ? 'active' : step > n ? 'done' : ''}`}>
              <div className="step-circle">
                {step > n ? <CheckCircle size={16} /> : <Icon size={16} />}
              </div>
              <span className="step-label">{label}</span>
              {n < 5 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Step 1 */}
          {step === 1 && (
            <div className="form-section">
              <h2 className="form-section-title"><User size={18} /> Student Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" type="text" placeholder="Student's full name" value={form.studentName} onChange={e => update('studentName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input className="form-input" type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select className="form-input form-select" value={form.gender} onChange={e => update('gender', e.target.value)} required>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Class Applying For *</label>
                  <select className="form-input form-select" value={form.classApplying} onChange={e => update('classApplying', e.target.value)} required>
                    <option value="">Select class</option>
                    {CLASSES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-nav">
                <div />
                <button type="button" className="btn-next" onClick={() => setStep(2)} disabled={!form.studentName || !form.dateOfBirth || !form.gender || !form.classApplying}>
                  Next: Guardian Info →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="form-section">
              <h2 className="form-section-title"><Users size={18} /> Guardian Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Guardian's Full Name *</label>
                  <input className="form-input" type="text" placeholder="Father/Mother/Guardian" value={form.guardianName} onChange={e => update('guardianName', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input className="form-input" type="tel" placeholder="+880 1XXX-XXXXXX" value={form.guardianPhone} onChange={e => update('guardianPhone', e.target.value)} required />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" type="email" placeholder="guardian@email.com" value={form.guardianEmail} onChange={e => update('guardianEmail', e.target.value)} required />
                </div>
              </div>
              <div className="form-nav">
                <button type="button" className="btn-back" onClick={() => setStep(1)}>← Back</button>
                <button type="button" className="btn-next" onClick={() => setStep(3)} disabled={!form.guardianName || !form.guardianPhone || !form.guardianEmail}>
                  Next: Address →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="form-section">
              <h2 className="form-section-title"><Home size={18} /> Address Details</h2>
              <div className="form-group">
                <label className="form-label">Full Address *</label>
                <textarea className="form-input form-textarea" placeholder="House/Flat No., Road No., Area, District, Division" value={form.address} onChange={e => update('address', e.target.value)} required rows={4} />
              </div>
              <div className="form-nav">
                <button type="button" className="btn-back" onClick={() => setStep(2)}>← Back</button>
                <button type="button" className="btn-next" onClick={() => setStep(4)} disabled={!form.address}>
                  Next: Academic Info →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="form-section">
              <h2 className="form-section-title"><BookOpen size={18} /> Academic Background</h2>
              <div className="form-group">
                <label className="form-label">Previous School (if any)</label>
                <input className="form-input" type="text" placeholder="Name of previous school" value={form.previousSchool} onChange={e => update('previousSchool', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Supporting Documents / Notes</label>
                <textarea className="form-input form-textarea" placeholder="List any documents you will bring (birth certificate, previous marksheet, etc.)" value={form.documents} onChange={e => update('documents', e.target.value)} rows={4} />
              </div>
              <div className="form-nav">
                <button type="button" className="btn-back" onClick={() => setStep(3)}>← Back</button>
                <button type="button" className="btn-next" onClick={() => setStep(5)}>
                  Review Application →
                </button>
              </div>
            </div>
          )}

          {/* Step 5 — Review */}
          {step === 5 && (
            <div className="form-section">
              <h2 className="form-section-title"><FileText size={18} /> Review & Submit</h2>
              <div className="review-grid">
                {[
                  { label: 'Student Name', value: form.studentName },
                  { label: 'Date of Birth', value: form.dateOfBirth },
                  { label: 'Gender', value: form.gender },
                  { label: 'Class Applying', value: form.classApplying },
                  { label: 'Guardian Name', value: form.guardianName },
                  { label: 'Guardian Phone', value: form.guardianPhone },
                  { label: 'Guardian Email', value: form.guardianEmail },
                  { label: 'Address', value: form.address },
                  { label: 'Previous School', value: form.previousSchool || '—' },
                  { label: 'Documents', value: form.documents || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="review-item">
                    <span className="review-label">{label}</span>
                    <span className="review-value">{value}</span>
                  </div>
                ))}
              </div>
              <p className="review-notice">
                By submitting, you confirm that all information provided is accurate. Our admissions
                team will review your application and contact you within 3–5 working days.
              </p>
              <div className="form-nav">
                <button type="button" className="btn-back" onClick={() => setStep(4)}>← Edit</button>
                <button type="submit" className="btn-submit">
                  Submit Application ✓
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Requirements */}
        <div className="requirements-box">
          <h3>Admission Requirements</h3>
          <ul>
            <li>Birth certificate (original + photocopy)</li>
            <li>Previous school's final mark sheet</li>
            <li>2 recent passport-sized photographs</li>
            <li>Guardian's NID photocopy</li>
            <li>Transfer certificate (if applicable)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
