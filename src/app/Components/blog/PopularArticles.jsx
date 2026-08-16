"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal, RevealScale, Stagger, StaggerItem } from "../motion/Reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function DynamicCard({ article }) {
  return (
    <Link href={`/blog/${article.slug}`} style={{ textDecoration: 'none', flexShrink: 0, width: 220 }}>
      <RevealScale
        className="card-hover"
        style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative', height: 260, border: '1px solid var(--border-color)', transition: 'border-color 0.3s, box-shadow 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#B8942A'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(184,148,42,0.14)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* image */}
        <div className="card-img" style={{ position: 'absolute', inset: 0, backgroundImage: `url(${article.img || article.heroImg || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        {/* gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,10,3,0.94) 0%, rgba(15,10,3,0.50) 45%, rgba(15,10,3,0.08) 100%)' }} />
        {/* tag */}
        <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 1 }}>
          {article.tag && <span style={{ fontSize: '9px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C9A84C', fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.50)', padding: '3px 8px', display: 'inline-block', backdropFilter: 'blur(4px)' }}>{article.tag}</span>}
        </div>
        {/* title */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1, padding: '0 16px 18px' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '17px', fontWeight: 600, color: '#F5E6C8', margin: '0 0 6px', lineHeight: 1.3 }}>{article.title}</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {article.date && <span style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Inter, sans-serif' }}>{article.date}</span>}
            {article.readTime && <><span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#666', display: 'inline-block' }} /><span style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Inter, sans-serif' }}>{article.readTime}</span></>}
          </div>
        </div>
      </RevealScale>
    </Link>
  );
}

export default function PopularArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/blogs/published`)
      .then(r => r.json())
      .then(d => setArticles(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section style={{ backgroundColor: 'var(--cream)', padding: '40px 24px 0' }}>
      {/* Header */}
      <Reveal style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8942A', fontWeight: 600, margin: '0 0 6px' }}>From the Archive</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '32px', fontWeight: 600, color: 'var(--text)', margin: 0, lineHeight: 1.1 }}>Stories Worth Keeping</h2>
      </Reveal>

      {loading ? (
        <div style={{ display: 'flex', gap: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flexShrink: 0, width: 220, height: 260, backgroundColor: 'var(--cream-dk)', animation: 'pulse 1.5s ease infinite' }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
      ) : (
        /* horizontal scroll row */
        <Stagger style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
          {articles.map(a => <StaggerItem key={a._id}><DynamicCard article={a} /></StaggerItem>)}
        </Stagger>
      )}
    </section>
  );
}