import React, { useEffect, useRef, useState } from 'react';
import './index.css';

const useReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const moveMouse = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animateCursor = () => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.left = `${mousePos.current.x}px`;
        cursorRef.current.style.top = `${mousePos.current.y}px`;

        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;

        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', moveMouse);
    const animationId = requestAnimationFrame(animateCursor);

    const handleEnter = () => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.width = '20px';
        cursorRef.current.style.height = '20px';
        ringRef.current.style.width = '54px';
        ringRef.current.style.height = '54px';
        ringRef.current.style.opacity = '0.9';
      }
    };

    const handleLeave = () => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.width = '12px';
        cursorRef.current.style.height = '12px';
        ringRef.current.style.width = '36px';
        ringRef.current.style.height = '36px';
        ringRef.current.style.opacity = '0.5';
      }
    };

    const interactiveSelectors = 'a, button, .soft-card, .timeline-item, .project-card';
    const elements = document.querySelectorAll(interactiveSelectors);
    elements.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      cancelAnimationFrame(animationId);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor"></div>
      <div ref={ringRef} className="cursor-ring"></div>
    </>
  );
};

const ProjectCard = ({ title, tech, image, github, live }) => {
  return (
    <div className="project-card reveal">
      <div className="project-image-wrapper">
        <img src={image} alt={title} className="project-image" />
        <div className="project-overlay">
          <div className="project-links">
            <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}>GitHub ↗</a>
            <a href={live} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.65rem' }}>Live ↗</a>
          </div>
        </div>
      </div>
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <div className="project-tech">
          {tech.map((t, i) => (
            <span key={i} className="tech-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  useReveal();

  const projects = [
    { title: 'DevFlow', tech: ['MERN', 'Redux', 'JWT'], image: '/assets/devflow.png', github: 'https://github.com/ksingla1885', live: '#' },
    { title: 'Pulse Chat', tech: ['Next.js', 'Socket.io', 'Node.js'], image: '/assets/pulse.png', github: 'https://github.com/ksingla1885', live: '#' },
    { title: 'EcoTrack', tech: ['React', 'MongoDB', 'Chart.js'], image: '/assets/ecotrack.png', github: 'https://github.com/ksingla1885', live: '#' },
    { title: 'Nexus Hub', tech: ['MySQL', 'Express', 'Auth0'], image: '/assets/nexus.png', github: 'https://github.com/ksingla1885', live: '#' },
    { title: 'Visionary', tech: ['MERN', 'Cloudinary', 'OpenAI'], image: '/assets/visionary.png', github: 'https://github.com/ksingla1885', live: '#' },
    { title: 'SwiftShop', tech: ['Next.js', 'Stripe', 'Tailwind'], image: '/assets/swiftshop.png', github: 'https://github.com/ksingla1885', live: '#' },
  ];

  return (
    <div className="portfolio">
      <CustomCursor />

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg-number">01</div>
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="eyebrow-line"></div>
            <span className="eyebrow-text">Full-Stack Developer · Pre-Final Year</span>
          </div>
          <h1 className="hero-name">
            <span className="filled">Aryan</span>
            <span>Mittal</span>
          </h1>
          <p className="hero-tagline">
            Building scalable web experiences with <strong>MERN Stack</strong> —
            where clean code meets purposeful design.
          </p>
          <div className="hero-cta">
            <a href="https://www.linkedin.com/in/heyaryanmittal" target="_blank" className="btn btn-primary">LinkedIn ↗</a>
            <a href="mailto:heyaryanmittal@gmail.com" className="btn btn-secondary">Get in touch</a>
          </div>
        </div>
        <div className="hero-card reveal">
          <div className="card-header">
            <div className="card-dot dot-red"></div>
            <div className="card-dot dot-yellow"></div>
            <div className="card-dot dot-green"></div>
            <span className="card-label">heyaryanmittal ~ %</span>
          </div>
          <div className="stat-grid">
            <div className="stat-item">
              <div className="stat-num">2+</div>
              <div className="stat-label">YEARS CODING</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">10+</div>
              <div className="stat-label">TECH TOOLS</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">5+</div>
              <div className="stat-label">DATABASES</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">∞</div>
              <div className="stat-label">CURIOSITY</div>
            </div>
          </div>
          <div className="skill-tags">
            {['React.js', 'Node.js', 'MongoDB', 'Express.js', 'MySQL', 'REST API', 'JAVA'].map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECH MARQUEE ═══ */}
      <section className="tech-section" style={{ padding: 0 }}>
        <div className="tech-marquee">
          <div className="marquee-track">
            {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'Neo4j', 'Tailwind CSS', 'JWT · REST APIs', 'Git · GitHub', 'JAVA'].map((item, i) => (
              <div key={i} className="marquee-item"><span className="dot"></span>{item}</div>
            ))}
            {/* repeat for loop */}
            {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'PostgreSQL', 'Neo4j', 'Tailwind CSS', 'JWT · REST APIs', 'Git · GitHub', 'JAVA'].map((item, i) => (
              <div key={`dup-${i}`} className="marquee-item"><span className="dot"></span>{item}</div>
            ))}
          </div>
        </div>
        <div className="tech-marquee">
          <div className="marquee-track reverse">
            {['HTML5 · CSS3', 'JavaScript', 'Postman', 'VS Code', 'EJS Templates', 'RDBMS', 'Prompt Engineering', 'CSE · Chitkara University'].map((item, i) => (
              <div key={i} className="marquee-item"><span className="dot"></span>{item}</div>
            ))}
            {/* repeat for loop */}
            {['HTML5 · CSS3', 'JavaScript', 'Postman', 'VS Code', 'EJS Templates', 'RDBMS', 'Prompt Engineering', 'CSE · Chitkara University'].map((item, i) => (
              <div key={`dup-${i}`} className="marquee-item"><span className="dot"></span>{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT + SKILLS ═══ */}
      <section id="about">
        <div className="section-label reveal">
          <span className="section-num">// 02</span>
          <h2 className="section-title">About Me</h2>
          <div className="section-divider"></div>
        </div>
        <div className="about-grid">
          <div className="reveal">
            <blockquote className="about-quote">
              Good design is invisible, great architecture is resilient.
            </blockquote>
            <p className="about-body">
              I am a pre-final-year Computer Science student at <strong style={{ color: 'var(--text)' }}>Chitkara University, Himachal Pradesh</strong>, focused on the art of full-stack engineering. I don't just write code; I build digital systems that are scalable, maintainable, and user-centric.
            </p>
            <p className="about-body">
              Currently, I'm deep-diving into <strong style={{ color: 'var(--accent2)' }}>Relational Database Design</strong> and <strong style={{ color: 'var(--accent2)' }}>Advanced JavaScript Patterns</strong>. I believe that a developer's strongest tool isn't their language of choice, but their ability to architect solutions to complex problems.
            </p>
            <p className="about-body">
              I am actively seeking <strong style={{ color: 'var(--accent)' }}>Software Engineering Internships</strong> where I can contribute to high-impact projects and learn from industry veterans.
            </p>
          </div>
          <div className="skill-bars reveal" style={{ transitionDelay: '0.2s' }}>
            {[
              { name: 'FRONTEND ARCHITECTURE', pct: 90, delay: '0.3s' },
              { name: 'BACKEND SYSTEMS (Node/Express)', pct: 85, delay: '0.5s' },
              { name: 'DATABASE SCHEMA DESIGN', pct: 78, delay: '0.7s' },
              { name: 'RESTFUL API ENGINEERING', pct: 88, delay: '0.9s' },
              { name: 'JAVA CORE & ALGORITHMS', pct: 80, delay: '1.1s' },
            ].map((skill, i) => (
              <div key={i} className="skill-bar-item" style={{ marginBottom: '1.4rem' }}>
                <div className="skill-bar-header">
                  <span className="skill-bar-name">{skill.name}</span>
                  <span className="skill-bar-pct">{skill.pct}%</span>
                </div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: `${skill.pct}%`, animationDelay: skill.delay }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS (NEW) ═══ */}
      <section id="projects">
        <div className="section-label reveal">
          <span className="section-num">// 03</span>
          <h2 className="section-title">Projects</h2>
          <div className="section-divider"></div>
        </div>
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <ProjectCard key={i} {...proj} />
          ))}
        </div>
      </section>

      {/* ═══ EDUCATION ═══ */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-label reveal">
          <span className="section-num">// 04</span>
          <h2 className="section-title">Education</h2>
          <div className="section-divider"></div>
        </div>
        <div className="timeline">
          <div className="timeline-item reveal">
            <div className="timeline-date">2023 — 2027</div>
            <div className="timeline-title">B.E. in Computer Science Engineering</div>
            <div className="timeline-sub">Chitkara University, Himachal Pradesh</div>
            <div className="timeline-desc">
              Building a strong foundation in core CS subjects: Data Structures, Algorithms, Operating Systems, and DBMS. Actively involved in building production-ready web applications using modern frameworks.
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ENGINEERING MINDSET (REDESIGNED SOFT SKILLS) ═══ */}
      <section>
        <div className="section-label reveal">
          <span className="section-num">// 05</span>
          <h2 className="section-title">Engineering Mindset</h2>
          <div className="section-divider"></div>
        </div>
        <div className="philosophy-grid">
          {[
            { tag: 'Logic', icon: '🧠', title: 'Problem Logic', desc: 'Decoding complex requirements into simple, functional blocks of code.', delay: '0.0s' },
            { tag: 'Flow', icon: '👥', title: 'Agile Sync', desc: 'Thriving in collaborative environments and maintaining clear documentation.', delay: '0.1s' },
            { tag: 'Build', icon: '🛠️', title: 'System Growth', desc: 'Always thinking about how a feature will scale from 1 to 100,000 users.', delay: '0.2s' },
            { tag: 'Vision', icon: '💡', title: 'Innovation', desc: 'Staying ahead of the curve by experimenting with new patterns and tools.', delay: '0.3s' },
          ].map((philo, i) => (
            <div key={i} className="philosophy-item reveal" style={{ transitionDelay: philo.delay }}>
              <span className="philo-tag">{philo.tag}</span>
              <div className="philo-head">
                <div className="philo-icon">{philo.icon}</div>
                <h3 className="philo-title">{philo.title}</h3>
              </div>
              <p className="philo-desc">{philo.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ LIFESTYLE.EXE (REDESIGNED BEYOND CODE) ═══ */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-label reveal">
          <span className="section-num">// 06</span>
          <h2 className="section-title">Outside the IDE</h2>
          <div className="section-divider"></div>
        </div>
        <div className="lifestyle-grid">
          {[
            { cat: 'Exploring', text: 'Architecting AI Workflows & Prompt Engineering', status: 'ACTIVE', delay: '0s' },
            { cat: 'Watching', text: 'Futuristic Sci-Fi & Psychological Thrillers', status: 'ON BREAK', delay: '0.1s' },
            { cat: 'Capturing', text: 'Street Photography & Raw Urban Frames', status: 'WEEKLY', delay: '0.2s' },
            { cat: 'Vibing', text: 'Lofi Beats & Timeless Old Hindi Classics', status: '24/7', delay: '0.3s' },
          ].map((item, i) => (
            <div key={i} className="lifestyle-item reveal" style={{ transitionDelay: item.delay }}>
              <div className="life-cat">{item.cat}</div>
              <div className="life-text">{item.text}</div>
              <div className="life-status">{item.status}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section className="contact-section">
        <div className="contact-inner">
          <div className="reveal">
            <h2 className="contact-headline">
              Let's<br />
              <span className="outline">Build</span><br />
              Together.
            </h2>
            <p className="contact-sub">
              Open to internships, collaborative projects, and anything ambitious. If you have an idea or an opportunity, let's talk.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <a href="https://github.com/heyaryanmittal" target="_blank" className="btn btn-primary">GitHub ↗</a>
            </div>
          </div>
          <div className="contact-links reveal" style={{ transitionDelay: '0.2s' }}>
            {[
              { icon: '💼', label: 'LINKEDIN', value: 'heyaryanmittal', link: 'https://www.linkedin.com/in/heyaryanmittal' },
              { icon: '✉️', label: 'EMAIL', value: 'heyaryanmittal@gmail.com', link: 'mailto:heyaryanmittal@gmail.com' },
              { icon: '✉️', label: 'EMAIL (ALT)', value: 'aryanmittal25496@gmail.com', link: 'mailto:aryanmittal25496@gmail.com' },
              { icon: '🐙', label: 'GITHUB', value: 'heyaryanmittal', link: 'https://github.com/heyaryanmittal' },
            ].map((link, i) => (
              <a key={i} href={link.link} target="_blank" className="contact-link">
                <span className="link-icon">{link.icon}</span>
                <span>
                  <span className="link-label">{link.label}</span>
                  <span className="link-value">{link.value}</span>
                </span>
                <span className="link-arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-left">© 2025 Aryan Mittal · All rights reserved</div>
        <div className="footer-right">Built with <span>♥</span> · Chitkara University, Himachal Pradesh</div>
      </footer>
    </div>
  );
};

export default App;
