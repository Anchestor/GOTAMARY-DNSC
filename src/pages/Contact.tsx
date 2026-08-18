import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="contact-page">
      <section className="contact-header">
        <div className="container">
          <div className="section-label">Get in Touch</div>
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-desc">Have a question or want to know more about Noor Academy? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <h2 className="contact-info-title">School Information</h2>
              <div className="contact-items">
                {[
                  { icon: MapPin, label: 'Address', value: '123 Education Road, Mirpur-10, Dhaka-1216, Bangladesh' },
                  { icon: Phone, label: 'Phone', value: '+880 1700-000000\n+880 2-1234567 (Office)' },
                  { icon: Mail, label: 'Email', value: 'info@nooracademy.edu.bd\nadmissions@nooracademy.edu.bd' },
                  { icon: Clock, label: 'Office Hours', value: 'Sunday – Thursday\n7:30 AM – 4:00 PM' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="contact-item">
                    <div className="contact-item-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="contact-item-label">{label}</div>
                      <div className="contact-item-value">{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="map-placeholder">
                <MapPin size={32} />
                <span>123 Education Road, Dhaka</span>
                <p>Visit us at our campus Monday through Friday</p>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-card">
              {sent ? (
                <div className="contact-success">
                  <CheckCircle size={48} />
                  <h3>Message Sent!</h3>
                  <p>Thank you for contacting us. We'll get back to you within 1-2 business days.</p>
                  <button className="btn-primary" onClick={() => setSent(false)}>Send Another</button>
                </div>
              ) : (
                <>
                  <h2 className="form-section-title" style={{ marginBottom: 24 }}>Send a Message</h2>
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label className="form-label">Your Name *</label>
                        <input className="form-input" type="text" placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <input className="form-input" type="text" placeholder="What is this regarding?" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message *</label>
                      <textarea className="form-input form-textarea" placeholder="Write your message here..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required rows={5} />
                    </div>
                    <button type="submit" className="btn-send">
                      <Send size={16} /> Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
