import React from 'react';
import { GlassWater, Wine, CupSoda, Compass, Clock, MapPin, Sparkles } from 'lucide-react';

const OFFERS = [
  {
    id: 'bar',
    title: 'The Golden Oak Bar',
    subtitle: 'Classic Mixology & Rare Spirits',
    description: 'An intimate, wood-paneled enclave featuring a selection of the world’s finest single malts, reserve cognacs, and custom cocktails hand-crafted by master mixologists.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
    hours: '4:00 PM - 2:00 AM',
    location: 'Lobby Level',
    features: ['Rare Whiskies', 'Sommelier Selection', 'Live Piano (Fri-Sat)', 'Cigar Menu']
  },
  {
    id: 'lounge',
    title: 'Velvet Horizon Lounge',
    subtitle: 'Afternoon High Tea & Evening Jazz',
    description: 'Relax in custom velvet armchairs. Enjoy organic loose-leaf teas, freshly baked pastries, or transition into the evening with champagne flight tastings and live soft jazz.',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800',
    hours: '10:00 AM - 11:00 PM',
    location: 'West Wing, Mezzanine',
    features: ['High Tea Service', 'Champagne Bar', 'Plush Sofa Seating', 'Bespoke Art']
  },
  {
    id: 'snooker',
    title: 'Imperial Snooker Room',
    subtitle: 'Gentlemen’s Club Charm & Recreation',
    description: 'Featuring two full-sized custom mahogany tables, tournament-grade cloth, handmade cues, and dedicated refreshments bar. A refined space for classy competition.',
    image: 'https://images.pexels.com/photos/7404545/pexels-photo-7404545.jpeg?auto=compress&cs=tinysrgb&w=800',
    hours: '12:00 PM - Midnight',
    location: 'Basement Arcade',
    features: ['Bespoke Snooker Tables', 'Private Scoring Display', 'Dedicated Host', 'Single Malt Cart']
  },
  {
    id: 'roof',
    title: 'Vortex Rooftop Lounge',
    subtitle: 'Skyline Cocktails & Panoramic Open Roof',
    description: 'De Lux Crib’s crown jewel. An open-air terrace offering a 360-degree panorama of the skyline. Sip signature cocktails around heated fire pit seating under the night sky.',
    image: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800',
    hours: '5:00 PM - 3:00 AM',
    location: '4th Floor, Rooftop Terrace',
    features: ['Sky Deck Fire Pits', 'Heated Lounge', 'Resident DJ Sets', 'Tapas Menu']
  }
];

export default function WhatWeOffer() {
  return (
    <section id="amenities" className="section-padding" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="section-header reveal">
          <span className="section-subtitle">A World of Indulgence</span>
          <h2 className="section-title">What We Offer</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
            Every space in De Lux Crib is crafted to inspire. Experience culinary craft, vintage recreation, and high-altitude relaxation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
          gap: '3rem',
          marginTop: '1rem'
        }}>
          {OFFERS.map(offer => (
            <div
              key={offer.id}
              className="hover-gold-border reveal"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                transition: 'var(--transition-smooth)',
                position: 'relative'
              }}
            >
              {/* Image Container with Zoom effect */}
              <div style={{
                position: 'relative',
                height: '300px',
                overflow: 'hidden'
              }}>
                <img
                  src={offer.image}
                  alt={offer.title}
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
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(3px)',
                  border: '1px solid var(--color-gold)',
                  color: 'var(--color-gold)',
                  padding: '0.4rem 1rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  {offer.location}
                </div>
              </div>

              {/* Text details */}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                <div>
                  <span className="text-gold" style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>
                    {offer.subtitle}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>
                    {offer.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '300', lineHeight: '1.7' }}>
                    {offer.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  {/* Hours */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    <Clock size={16} className="text-gold" />
                    <span>Open Daily: <strong>{offer.hours}</strong></span>
                  </div>

                  {/* Highlights Grid */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {offer.features.map((feature, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: '500',
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          padding: '0.3rem 0.7rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: '2px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Sparkles size={10} className="text-gold" /> {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
