"use client";
import { useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
};

type FormErrors = Partial<Record<keyof ContactForm, string>>;

const CATEGORIES = [
  "General enquiry",
  "Bug report / technical issue",
  "Data accuracy concern",
  "Research collaboration",
  "Press / media",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) {
      e.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.category) e.category = "Please select a category.";
    if (!form.message.trim()) {
      e.message = "Please enter your message.";
    } else if (form.message.trim().length < 20) {
      e.message = "Message must be at least 20 characters.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulated submission — real email/API in Phase 2
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  }

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="section-container">
        <header style={{ marginBottom: "2.5rem" }}>
          <span className="badge badge-neutral" style={{ marginBottom: "0.75rem" }}>
            Get in Touch
          </span>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "var(--color-neutral-900)",
              letterSpacing: "-0.025em",
              marginBottom: "0.625rem",
            }}
          >
            Contact Us
          </h1>
          <p style={{ color: "var(--color-neutral-600)", fontSize: "1.0625rem", lineHeight: 1.65, maxWidth: "560px" }}>
            Questions about data accuracy, methodology, or collaboration? Fill
            in the form below. We aim to respond within 2 working days.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Form */}
          <div>
            {sent ? (
              <div
                className="card"
                style={{ textAlign: "center", padding: "3rem 2rem" }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--color-green-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                    color: "var(--color-primary)",
                  }}
                >
                  <CheckCircle size={26} />
                </div>
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "var(--color-neutral-900)",
                    marginBottom: "0.625rem",
                  }}
                >
                  Message Received
                </h2>
                <p
                  style={{
                    color: "var(--color-neutral-600)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    maxWidth: "420px",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  Thank you, <strong>{form.name}</strong>. We will reply to{" "}
                  <strong>{form.email}</strong> within 2 working days.
                </p>
                <p className="form-hint" style={{ marginBottom: "1.5rem" }}>
                  Note: In Phase 1, this form does not connect to a mail server.
                  Real email delivery will be wired in Phase 2.
                </p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", category: "", message: "" });
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
                className="card"
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="form-label">
                    Full Name <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={`form-input${errors.name ? " error" : ""}`}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Ravi Kumar"
                    aria-required="true"
                    aria-describedby={errors.name ? "name-err" : undefined}
                  />
                  {errors.name && (
                    <p id="name-err" className="form-error" role="alert">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="form-label">
                    Email Address <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`form-input${errors.email ? " error" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    aria-required="true"
                    aria-describedby={errors.email ? "email-err" : undefined}
                  />
                  {errors.email && (
                    <p id="email-err" className="form-error" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="contact-category" className="form-label">
                    Category <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    id="contact-category"
                    name="category"
                    className={`form-select${errors.category ? " error" : ""}`}
                    value={form.category}
                    onChange={handleChange}
                    aria-required="true"
                    aria-describedby={errors.category ? "cat-err" : undefined}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p id="cat-err" className="form-error" role="alert">{errors.category}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="contact-subject" className="form-label">
                    Subject — optional
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    className="form-input"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your message"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="form-label">
                    Message <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className={`form-textarea${errors.message ? " error" : ""}`}
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Please describe your question or concern in detail."
                    aria-required="true"
                    aria-describedby={errors.message ? "msg-err" : "msg-hint"}
                    style={{ resize: "vertical" }}
                  />
                  {errors.message ? (
                    <p id="msg-err" className="form-error" role="alert">{errors.message}</p>
                  ) : (
                    <p id="msg-hint" className="form-hint">
                      Minimum 20 characters. Be as specific as possible.
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    aria-busy={loading}
                    style={{ minWidth: 160 }}
                  >
                    {loading ? (
                      <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Sending…</>
                    ) : (
                      <>Send Message <Send size={15} /></>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setForm({ name: "", email: "", subject: "", category: "", message: "" });
                      setErrors({});
                    }}
                    disabled={loading}
                  >
                    Clear
                  </button>
                </div>

                <p style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}>
                  <span aria-hidden="true" style={{ color: "#dc2626" }}>*</span> Required fields.
                  Your email will only be used to reply to your message.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside aria-label="Contact information">
            <div className="card" style={{ marginBottom: "1rem" }}>
              <h2 style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-neutral-500)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
                Contact Details
              </h2>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <Mail size={16} style={{ flexShrink: 0, marginTop: "2px", color: "var(--color-primary)" }} aria-hidden="true" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-neutral-800)" }}>Email</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)" }}>research@krishimitra.in</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>(Placeholder — Phase 2)</p>
                  </div>
                </li>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <Clock size={16} style={{ flexShrink: 0, marginTop: "2px", color: "var(--color-primary)" }} aria-hidden="true" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-neutral-800)" }}>Response Time</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)" }}>Within 2 working days</p>
                  </div>
                </li>
                <li style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: "2px", color: "var(--color-primary)" }} aria-hidden="true" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-neutral-800)" }}>Project Type</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)" }}>Internship Research Project</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-600)" }}>India</p>
                  </div>
                </li>
              </ul>
            </div>

            <div
              style={{
                background: "var(--color-green-50)",
                border: "1px solid var(--color-green-200)",
                borderRadius: 10,
                padding: "1.25rem",
              }}
            >
              <h2 style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--color-green-800)", marginBottom: "0.5rem" }}>
                Data Concerns
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--color-green-700)", lineHeight: 1.6 }}>
                If you believe a yield estimate or risk score is factually
                incorrect, please select <em>Data accuracy concern</em> in the
                category field and cite the specific dataset and district. We
                take data quality seriously.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Responsive sidebar fallback */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
