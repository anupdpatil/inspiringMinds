import { useEffect, useState } from "react";
import "./styles.css";

const SERVICES = [
  "Custom software development",
  "AI & business automation",
  "Web application development",
  "IT consulting",
  "Something else",
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const updateBackTopVisibility = () => {
      setShowBackTop(window.scrollY > 0);
    };

    updateBackTopVisibility();
    window.addEventListener("scroll", updateBackTopVisibility, {
      passive: true,
    });
    return () => window.removeEventListener("scroll", updateBackTopVisibility);
  }, []);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const chooseService = (service) => {
    setForm((current) => ({ ...current, service }));
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/enquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const responseBody = await response.text();
      let result;
      if (responseBody) {
        try {
          result = JSON.parse(responseBody);
        } catch {
          if (response.ok) {
            throw new Error("The server returned an invalid response. Please try again later.");
          }
        }
      }
      if (!response.ok) {
        throw new Error(
          result?.message ||
            (response.status === 404
              ? "The enquiry API was not found. Check the deployed API URL."
              : `Unable to submit your enquiry (HTTP ${response.status}). Please try again later.`),
        );
      }
      if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw new Error("The server returned an empty or invalid response. Please try again later.");
      }
      setStatus({
        type: result.notificationSent === false ? "warning" : "success",
        message: result.notificationSent === false
          ? result.message
          : "Thanks — your enquiry has been submitted. We'll be in touch soon.",
      });
      setForm({ name: "", email: "", service: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-wrap">
          <a className="brand" href="#home" aria-label="Inspiring Minds home">
            <img
              src="/assets/inspiring-minds-logo-full.png"
              alt="inspiring minds — Ideas | Solutions | Growth"
              className="brand-full-logo"
            />
          </a>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav
            className={`nav ${menuOpen ? "open" : ""}`}
            id="primary-nav"
            aria-label="Main navigation"
          >
            <a href="#services" onClick={() => setMenuOpen(false)}>
              Services
            </a>
            <a href="#approach" onClick={() => setMenuOpen(false)}>
              Our approach
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
            <a
              className="nav-cta"
              href="#contact"
              onClick={() => {
                setMenuOpen(false);
                chooseService("Something else");
              }}
            >
              Let's talk <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero section" id="home">
          <div className="hero-glow glow-one"></div>
          <div className="hero-glow glow-two"></div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot"></span> Technology that moves you
                forward
              </div>
              <h1>
                Big ideas deserve{" "}
                <span className="gradient-text">better technology.</span>
              </h1>
              <p className="hero-lead">
                We help businesses and startups turn ambitious ideas into useful
                software, smarter workflows, and digital experiences built for
                growth.
              </p>
              <div className="hero-actions">
                <a
                  className="button button-primary"
                  href="#contact"
                  onClick={() => chooseService("Something else")}
                >
                  Discuss your project <span aria-hidden="true">↗</span>
                </a>
                <a className="button button-secondary" href="#services">
                  Explore our services <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="hero-note">
                <span className="note-check">✓</span> Practical thinking.
                Thoughtful engineering. Long-term value.
              </div>
            </div>
            <div
              className="hero-art"
              aria-label="Abstract illustration of connected technology systems"
            >
              <div className="art-orbit orbit-a"></div>
              <div className="art-orbit orbit-b"></div>
              <div className="art-center">
                <div className="art-mark">
                  IM<span>.</span>
                </div>
                <div className="art-center-label">IDEAS INTO IMPACT</div>
              </div>
              <div className="float-card card-code">
                <span className="mini-icon">{}</span>
                <div>
                  <b>Custom software</b>
                  <small>Built around your needs</small>
                </div>
                <span className="card-status"></span>
              </div>
              <div className="float-card card-ai">
                <span className="mini-icon mini-icon-ai">✳</span>
                <div>
                  <b>AI-powered workflows</b>
                  <small>More time for meaningful work</small>
                </div>
              </div>
              <div className="float-card card-growth">
                <div className="growth-bars">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <div>
                  <b>Ready to grow</b>
                  <small>Designed to scale</small>
                </div>
              </div>
              <div className="art-spark spark-one">✦</div>
              <div className="art-spark spark-two">✧</div>
            </div>
          </div>
          <div className="container hero-bottom">
            <span>IDEAS</span>
            <i></i>
            <span>SOLUTIONS</span>
            <i></i>
            <span>GROWTH</span>
          </div>
        </section>

        <section className="trust-strip" aria-label="Our principles">
          <div className="container trust-grid">
            <div>
              <span className="trust-symbol">◎</span>
              <span>Built around your goals</span>
            </div>
            <div>
              <span className="trust-symbol">↗</span>
              <span>Designed for real-world use</span>
            </div>
            <div>
              <span className="trust-symbol">✳</span>
              <span>Made to evolve with you</span>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  <span className="eyebrow-dot"></span> What we do
                </div>
                <h2>
                  Technology solutions for{" "}
                  <span className="gradient-text">what's next.</span>
                </h2>
              </div>
              <p>
                From the first idea to the next stage of growth, we bring
                clarity and engineering together to solve meaningful problems.
              </p>
            </div>
            <div className="services-grid">
              <article className="service-card">
                <div className="service-heading">
                  <div className="service-icon icon-blue">
                    <span>⌘</span>
                  </div>
                  <h3>Custom software development</h3>
                </div>
                <p>
                  Purpose-built software that fits the way your business
                  works—today and as it grows.
                </p>
                <ul>
                  <li>Business applications</li>
                  <li>Workflow and process tools</li>
                  <li>System integrations</li>
                </ul>
                <a
                  href="#contact"
                  className="text-link"
                  onClick={() => chooseService("Custom software development")}
                >
                  Build something specific <span>↗</span>
                </a>
              </article>
              <article className="service-card featured-card">
                <div className="service-heading">
                  <div className="service-icon icon-violet">
                    <span>✳</span>
                  </div>
                  <h3>AI &amp; business automation</h3>
                </div>
                <p>
                  Reduce repetitive work and help your team focus on decisions,
                  creativity, and customers.
                </p>
                <ul>
                  <li>AI-enabled workflows</li>
                  <li>Task and process automation</li>
                  <li>Practical AI integrations</li>
                </ul>
                <a
                  href="#contact"
                  className="text-link"
                  onClick={() => chooseService("AI & business automation")}
                >
                  Find your next efficiency <span>↗</span>
                </a>
              </article>
              <article className="service-card">
                <div className="service-heading">
                  <div className="service-icon icon-cyan">
                    <span>▣</span>
                  </div>
                  <h3>Web application development</h3>
                </div>
                <p>
                  Fast, intuitive web experiences that make complex tasks feel
                  simple.
                </p>
                <ul>
                  <li>Responsive web apps</li>
                  <li>Portals and dashboards</li>
                  <li>Modernisation and upgrades</li>
                </ul>
                <a
                  href="#contact"
                  className="text-link"
                  onClick={() => chooseService("Web application development")}
                >
                  Create a better experience <span>↗</span>
                </a>
              </article>
              <article className="service-card">
                <div className="service-heading">
                  <div className="service-icon icon-navy">
                    <span>⌁</span>
                  </div>
                  <h3>IT consulting</h3>
                </div>
                <p>
                  Make confident technology decisions with clear priorities and
                  a practical roadmap.
                </p>
                <ul>
                  <li>Solution architecture</li>
                  <li>Technology planning</li>
                  <li>Technical reviews and guidance</li>
                </ul>
                <a
                  href="#contact"
                  className="text-link"
                  onClick={() => chooseService("IT consulting")}
                >
                  Plan your next move <span>↗</span>
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="section approach-section" id="approach">
          <div className="container approach-grid">
            <div className="approach-intro">
              <div className="eyebrow eyebrow-light">
                <span className="eyebrow-dot"></span> How we work
              </div>
              <h2>
                Clear thinking.
                <br />
                <span className="light-gradient">Careful execution.</span>
              </h2>
              <p>
                Good technology starts with understanding the problem—not
                rushing to write code. We keep the process collaborative,
                transparent, and focused on outcomes.
              </p>
              <a
                href="#contact"
                className="button button-white"
                onClick={() => chooseService("Something else")}
              >
                Let's work together <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="process-list">
              <div className="process-step">
                <div className="step-index">01</div>
                <div>
                  <h3>Understand</h3>
                  <p>
                    We listen, ask the right questions, and define what success
                    should look like.
                  </p>
                </div>
                <span className="step-arrow">↘</span>
              </div>
              <div className="process-step">
                <div className="step-index">02</div>
                <div>
                  <h3>Shape the solution</h3>
                  <p>
                    We agree on priorities, map the approach, and choose
                    technology for a reason.
                  </p>
                </div>
                <span className="step-arrow">↘</span>
              </div>
              <div className="process-step">
                <div className="step-index">03</div>
                <div>
                  <h3>Build and refine</h3>
                  <p>
                    We develop in focused steps, share progress, and improve
                    through feedback.
                  </p>
                </div>
                <span className="step-arrow">↘</span>
              </div>
              <div className="process-step">
                <div className="step-index">04</div>
                <div>
                  <h3>Support your growth</h3>
                  <p>
                    We help you launch thoughtfully and identify what to improve
                    next.
                  </p>
                </div>
                <span className="step-arrow">↗</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="container about-grid">
            <div className="about-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot"></span> A little about us
              </div>
              <h2>
                Technology should make progress{" "}
                <span className="gradient-text">possible.</span>
              </h2>
              <p>
                Inspiring Minds is a service-based IT firm focused on helping
                businesses and startups solve problems with well-considered
                technology. We believe the best solutions balance ambition with
                simplicity—and innovation with practical value.
              </p>
              <p>
                Whether you're validating a new idea, improving an existing
                process, or planning your next digital step, we aim to be a
                thoughtful technology partner along the way.
              </p>
              <div className="value-points">
                <div>
                  <span>✓</span>
                  <div>
                    <b>Purpose before complexity</b>
                    <small>Choose what solves the problem.</small>
                  </div>
                </div>
                <div>
                  <span>✓</span>
                  <div>
                    <b>Partnership over hand-offs</b>
                    <small>Work collaboratively and communicate clearly.</small>
                  </div>
                </div>
                <div>
                  <span>✓</span>
                  <div>
                    <b>Progress over buzzwords</b>
                    <small>Focus on useful, maintainable outcomes.</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-visual-top">
                <span className="tiny-label">
                  THE INSPIRING MINDS PRINCIPLE
                </span>
                <span className="about-star">✳</span>
              </div>
              <div className="about-big-type">
                Ideas<span>.</span>
                <br />
                Solutions<span>.</span>
                <br />
                Growth<span>.</span>
              </div>
              <div className="about-visual-bottom">
                <span>Think clearly.</span>
                <span>Build thoughtfully.</span>
                <span>Grow continuously.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container cta-inner">
            <div>
              <div className="eyebrow eyebrow-light">
                <span className="eyebrow-dot"></span> Your idea starts here
              </div>
              <h2>Have a challenge in mind?</h2>
              <p>
                Let's explore what the right technology could make possible.
              </p>
            </div>
            <a
              href="#contact"
              className="button button-white"
              onClick={() => chooseService("Something else")}
            >
              Tell us about it <span aria-hidden="true">↗</span>
            </a>
            <div className="cta-decoration">
              IM<span>.</span>
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <div className="eyebrow">
                <span className="eyebrow-dot"></span> Get in touch
              </div>
              <h2>
                Let's turn your idea into{" "}
                <span className="gradient-text">a plan.</span>
              </h2>
              <p>
                Tell us a little about what you're building or improving. We'll
                use your note to start a useful conversation.
              </p>
              <div className="contact-note">
                <div className="contact-note-icon">✉</div>
                <div>
                  <b>Prefer email?</b>
                  <p>
                    master.inspiringminds@gmail.com
                  </p>
                </div>
              </div>
            </div>
            <form
              className="contact-form"
              id="contact-form"
              onSubmit={submitEnquiry}
            >
              <div className="form-row" style={{ marginBottom: "1rem" }}>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={updateField}
                  required
                />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Work email"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </div>
              <label>
                What can we help with?
                <select
                  name="service"
                  id="service-select"
                  value={form.service}
                  onChange={updateField}
                  required
                >
                  <option value="">Choose a service</option>
                  <option>Custom software development</option>
                  <option>AI &amp; business automation</option>
                  <option>Web application development</option>
                  <option>IT consulting</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>
                Tell us about your project
                <textarea
                  name="message"
                  rows="4"
                  placeholder="A little about the challenge, idea, or goal..."
                  value={form.message}
                  onChange={updateField}
                  required
                ></textarea>
              </label>
              <button
                className="button button-primary submit-button"
                type="submit"
                disabled={sending}
              >
                {sending ? "Submitting…" : "Send enquiry"}{" "}
                <span aria-hidden="true">↗</span>
              </button>
              <div
                className={`form-message ${status.type}`}
                id="form-message"
                role="status"
                aria-live="polite"
              >
                {status.message}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top">
          <a className="brand footer-brand" href="#home" aria-label="Inspiring Minds home">
            <img
              src="/assets/inspiring-minds-logo-full.png"
              alt="inspiring minds — Ideas | Solutions | Growth"
              className="brand-full-logo"
            />
          </a>
          <p>Thoughtful technology for meaningful progress.</p>
          {showBackTop && (
            <a className="back-top" href="#home">
              Back to top ↑
            </a>
          )}
        </div>
        <div className="container footer-bottom">
          <span>
            © 2025 Inspiring Minds. All rights reserved.
          </span>
          <span className="footer-tagline">
            Ideas <i>|</i> Solutions <i>|</i> Growth
          </span>
        </div>
      </footer>
    </>
  );
}
