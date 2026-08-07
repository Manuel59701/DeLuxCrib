import React, { useEffect } from 'react';
import { Star, Award, Compass, ArrowRight } from 'lucide-react';
import WhatWeOffer from '../components/WhatWeOffer';

const FLOORS = [
  {
    label: 'Floor 01',
    title: 'Deluxe Sanctuary',
    price: '$150/Night',
    image: 'https://images.unsplash.com/photo-1611891487122-2075b96244e1?auto=format&fit=crop&q=80&w=800',
    description: 'Designed for quiet comfort and effortless relaxation. Features custom king bedding, serene courtyard views, premium workspace, and modern bath amenities.',
    highlights: ['King & Twin beds', 'Smart TV', 'Courtyard View', 'Walk-in Shower']
  },
  {
    label: 'Floor 02',
    title: 'Executive Suites',
    price: '$280/Night',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    description: 'Generously proportioned layouts tailored for business and leisure. Indulge in a dedicated parlor lounge, double balconies, and luxury rain showers.',
    highlights: ['Lounge Area', 'Double Balconies', 'Nespresso Machine', 'Soaking Tub']
  },
  {
    label: 'Floor 03',
    title: 'Premium Presidential',
    price: '$490/Night',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    description: 'The height of elite boutique lodging. Features a wrap-around sunset terrace, private dining parlor, custom cocktail bar, and exclusive butler service.',
    highlights: ['Butler Service', 'Rooftop Terrace', 'Private Bar', 'Jacuzzi Bath']
  }
];

export default function Home() {
  useEffect(() => {
    const scrollToTarget = () => {
      const id = window.location.hash.replace('#', '');
      if (id && id !== 'home') {
        // Small delay to ensure DOM is fully rendered before scrolling
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
        return;
      }
      window.scrollTo({ top: 0 });
    };
    scrollToTarget();
    window.addEventListener('hashchange', scrollToTarget);
    return () => window.removeEventListener('hashchange', scrollToTarget);
  }, []);

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section id="hero" style={{
        position: 'relative',
        height: '90vh',
        background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.55)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1600") no-repeat center center',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container" style={{ width: '100%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span style={{
              display: 'block',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--color-gold)',
              marginBottom: '1rem'
            }}>
              Uncompromising Grandeur
            </span>
            <h1 style={{
              fontSize: '4.5rem',
              fontFamily: 'var(--font-serif)',
              fontWeight: 500,
              lineHeight: '1.1',
              marginBottom: '1.5rem',
              textShadow: '2px 2px 10px rgba(0,0,0,0.3)'
            }}>
              Where Luxury Meets Heritage
            </h1>
            <p style={{
              fontSize: '1.1rem',
              fontWeight: 300,
              letterSpacing: '0.05em',
              marginBottom: '2.5rem',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              De Lux Crib boutique chambers offer refined comfort, curated recreation spaces, and executive lounges. Elevate your lodging standards.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              <a href="#booking" className="btn-gold" style={{ border: '1px solid var(--color-gold)' }}>
                Secure A Chamber
              </a>
              <a href="#rent-space" className="btn-outline" style={{ borderColor: '#ffffff', color: '#ffffff' }}
                 onMouseEnter={(e) => {
                   e.target.style.backgroundColor = '#ffffff';
                   e.target.style.color = '#000000';
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.backgroundColor = 'transparent';
                   e.target.style.color = '#ffffff';
                 }}
              >
                Inquire For Events
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '1.5rem 0',
          display: 'none' // Hidden on smaller sizes, but let's show via flex
        }} className="flex-center">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-around', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>CHAMBERS</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>20 Elegant Suites</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>AMENITIES</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>4 Recreation Spaces</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RATING</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>5-Star Quality</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SERVICE</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>24/7 Royal Concierge</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT / HERITAGE SECTION ================= */}
      <section id="about" className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left Image grid */}
            <div style={{ position: 'relative' }}>
              <div style={{ border: '2px solid var(--color-gold)', padding: '1rem', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
                  alt="De Lux Crib Mansion"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-2rem',
                right: '-2rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--color-gold)',
                padding: '1.5rem',
                maxWidth: '220px',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>
                  <Star size={16} fill="var(--color-gold)" />
                  <Star size={16} fill="var(--color-gold)" />
                  <Star size={16} fill="var(--color-gold)" />
                  <Star size={16} fill="var(--color-gold)" />
                  <Star size={16} fill="var(--color-gold)" />
                </div>
                <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>Best Boutique Hotel</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Heritage Hospitality Award 2026</span>
              </div>
            </div>

            {/* Right text */}
            <div style={{ textAlign: 'left' }}>
              <span className="text-gold" style={{ fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Premium Standard
              </span>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                A Sophisticated Oasis In The Heart of The City
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                For those who expect more from travel. De Lux Crib blends royal classical hospitality with contemporary design accents. Built for royalty and business executives alike, our boutique rooms ensure quiet relaxation, private entries, and luxury linen.
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.8' }}>
                Whether you seek to lounge in our velvet room, play snooker under classic chandeliers, sip single malts at the oak bar, or toast skyline sunsets on our rooftop garden terrace, we guarantee a flawless stay.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <Award size={24} className="text-gold" />
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>Verified 5-Star</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Exceptional luxury standard</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <Compass size={24} className="text-gold" />
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block' }}>Prime Location</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Close to cultural cores</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= AMENITIES SECTION ================= */}
      <WhatWeOffer />

      {/* ================= SUITES PREVIEW SECTION ================= */}
      <section id="suites-preview" className="section-padding" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Prestigious Living</span>
            <h2 className="section-title">Our Suites By Floor</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
              Explore our boutique chambers across floors 1 to 3, designed with meticulous precision and tailored luxury.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginTop: '1rem'
          }}>
            {FLOORS.map((floor, index) => (
              <div
                key={index}
                className="hover-gold-border"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  transition: 'var(--transition-smooth)',
                  overflow: 'hidden'
                }}
              >
                {/* Image Container with Zoom effect */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img
                    src={floor.image}
                    alt={floor.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.8s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(3px)',
                    border: '1px solid var(--color-gold)',
                    color: 'var(--color-gold)',
                    padding: '0.4rem 1rem',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}>
                    {floor.label}
                  </div>
                </div>

                {/* Card Details */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.8rem' }}>
                      <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
                        {floor.title}
                      </h3>
                      <span className="text-gold" style={{ fontSize: '1.1rem', fontWeight: '600', fontFamily: 'var(--font-serif)' }}>
                        {floor.price}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: '1.6', fontWeight: 300 }}>
                      {floor.description}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {floor.highlights.map((hl, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            padding: '0.25rem 0.6rem',
                            border: '1px solid var(--border-color)',
                            display: 'inline-block'
                          }}
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <a href="#booking" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', fontSize: '0.9rem' }}>
              Book a Room <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS & TESTIMONIALS SECTION ================= */}
      <section id="testimonials" className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Exemplary Feedback</span>
            <h2 className="section-title">Royal Testimonials</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {/* Card 1 */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '2.5rem',
              border: '1px solid var(--border-color)',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
              </div>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
                lineHeight: '1.6'
              }}>
                "The penthouse booking process was flawless. The rooftop space holds spectacular 360 views that our event guests will talk about for months. Absolute grandeur."
              </p>
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>Victoria Sterling</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Founder, Sterling Ventures &bull; Penthouse Guest</span>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '2.5rem',
              border: '1px solid var(--border-color)',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
              </div>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
                lineHeight: '1.6'
              }}>
                "If you enjoy the finer things in life, the Oak Bar and Snooker room are a must. Classic gentlemen's charm combined with incredible mixology."
              </p>
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>Sir Alistair Thorne</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Member, London Royal Club &bull; Executive Suite Guest</span>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '2.5rem',
              border: '1px solid var(--border-color)',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
                <Star size={16} fill="var(--color-gold)" />
              </div>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
                color: 'var(--text-primary)',
                lineHeight: '1.6'
              }}>
                "From check-in to check-out, the boutique vibe felt incredibly personalized. The dark mode toggle on their site shows the level of detail they appreciate."
              </p>
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>Marcus Peterson</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Creative Director &bull; Deluxe Chamber Guest</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
