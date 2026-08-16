"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const WHATSAPP_NUMBER = "917982364289";
const DEFAULT_MESSAGE = "Hello! I'm interested in your jewellery collection and would like more details about your products.";

function Widget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const handleSend = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
  };

  return (
    <>
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '24px', zIndex: 999999,
          width: '340px', borderRadius: '16px',
          boxShadow: '0 12px 48px rgba(0,0,0,0.22)', overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>

          {/* Header with WhatsApp branding */}
          <div style={{
            background: 'linear-gradient(135deg, #075E54 0%, #128C7E 100%)',
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            {/* Avatar with online dot */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18
              }}>💎</div>
              <div style={{
                position: 'absolute', bottom: 1, right: 1,
                width: 11, height: 11, borderRadius: '50%',
                background: '#4ADE80', border: '2px solid #075E54'
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0, lineHeight: 1.2 }}>TALEO</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: '2px 0 0' }}>● Online now</p>
            </div>
            {/* WhatsApp logo + close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg viewBox="0 0 32 32" fill="white" width="22" height="22" opacity="0.9">
                <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.7.7 5.3 2 7.6L.4 31.6l8.2-2c2.2 1.2 4.7 1.8 7.4 1.8 8.6 0 15.6-7 15.6-15.6C31.6 7.4 24.6.4 16 .4zm0 28.6c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.9 1.2 1.3-4.7-.3-.5C3.7 20.8 3 18.5 3 16 3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 13-13 13zm7.1-9.7c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .4-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.4.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5z"/>
              </svg>
              <button onClick={() => setIsOpen(false)} style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                width: 28, height: 28, color: 'white', fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>✕</button>
            </div>
          </div>

          {/* WhatsApp label bar */}
          <div style={{
            background: '#ECE5DD',
            padding: '6px 12px',
            display: 'flex', alignItems: 'center', gap: 6,
            borderBottom: '1px solid #d4cdc6'
          }}>
            <svg viewBox="0 0 32 32" fill="#25D366" width="14" height="14">
              <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.7.7 5.3 2 7.6L.4 31.6l8.2-2c2.2 1.2 4.7 1.8 7.4 1.8 8.6 0 15.6-7 15.6-15.6C31.6 7.4 24.6.4 16 .4zm0 28.6c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.9 1.2 1.3-4.7-.3-.5C3.7 20.8 3 18.5 3 16 3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 13-13 13zm7.1-9.7c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .4-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.4.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5z"/>
            </svg>
            <span style={{ fontSize: 11, color: '#667781', fontWeight: 500 }}>Chat with us on WhatsApp</span>
          </div>

          {/* Chat background */}
          <div style={{
            background: '#ECE5DD',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8bdb3' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            padding: '16px 12px', minHeight: 100
          }}>
            {/* Time stamp */}
            <div style={{ textAlign: 'center', marginBottom: 10 }}>
              <span style={{
                background: 'rgba(11,20,26,0.12)', color: '#667781',
                fontSize: 11, borderRadius: 8, padding: '3px 8px'
              }}>Today</span>
            </div>
            {/* Message bubble */}
            <div style={{
              background: 'white', borderRadius: '0 10px 10px 10px',
              padding: '8px 12px', maxWidth: '88%',
              boxShadow: '0 1px 2px rgba(0,0,0,0.12)', position: 'relative'
            }}>
              {/* Triangle */}
              <div style={{
                position: 'absolute', top: 0, left: -8,
                width: 0, height: 0,
                borderTop: '8px solid white',
                borderLeft: '8px solid transparent'
              }} />
              <p style={{ margin: 0, fontSize: 14, color: '#111B21', lineHeight: 1.5 }}>
                👋 Hi! Welcome to TALEO. How can we help with your jewellery search today?
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#667781', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <svg viewBox="0 0 16 11" width="16" height="11" fill="#53BDEB">
                  <path d="M11.071.653a.75.75 0 0 1 1.061 1.061L5.95 8.714 3.47 6.233a.75.75 0 1 0-1.061 1.061l2.95 2.95a.75.75 0 0 0 1.061 0l6.651-6.53z"/>
                  <path d="M15.071.653a.75.75 0 0 1 1.061 1.061l-7.18 7.182a.75.75 0 0 1-1.061 0L5.44 6.453a.75.75 0 1 0-1.061 1.061l2.95 2.95a.75.75 0 0 0 1.061 0L15.07.653z" opacity=".5"/>
                </svg>
              </p>
            </div>
          </div>

          {/* Input area */}
          <div style={{
            background: '#F0F2F5', padding: '10px 12px',
            display: 'flex', alignItems: 'flex-end', gap: 8,
            borderTop: '1px solid #d4cdc6'
          }}>
            <div style={{
              flex: 1, background: 'white', borderRadius: 24,
              display: 'flex', alignItems: 'flex-end',
              padding: '8px 14px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
            }}>
              <textarea
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  flex: 1, resize: 'none', border: 'none', outline: 'none',
                  fontSize: 14, color: '#111B21', fontFamily: 'inherit',
                  background: 'transparent', maxHeight: 80, lineHeight: 1.5
                }}
                placeholder="Type a message"
              />
            </div>
            <button onClick={handleSend} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#25D366', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 2px 8px rgba(37,211,102,0.4)'
            }}>
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB with WhatsApp icon + pulse */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999999 }}>
        {!isOpen && (
          <div style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            background: 'rgba(37,211,102,0.3)',
            animation: 'whatsapp-pulse 2s infinite'
          }} />
        )}
        <style>{`
          @keyframes whatsapp-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            70% { transform: scale(1.4); opacity: 0; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        `}</style>
        <button
          onClick={() => setIsOpen(p => !p)}
          style={{
            position: 'relative', width: 56, height: 56, borderRadius: '50%',
            background: '#25D366', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(37,211,102,0.5)'
          }}
          aria-label="Chat on WhatsApp"
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 32 32" fill="white" width="28" height="28">
              <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.7.7 5.3 2 7.6L.4 31.6l8.2-2c2.2 1.2 4.7 1.8 7.4 1.8 8.6 0 15.6-7 15.6-15.6C31.6 7.4 24.6.4 16 .4zm0 28.6c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.9 1.2 1.3-4.7-.3-.5C3.7 20.8 3 18.5 3 16 3 8.8 8.8 3 16 3s13 5.8 13 13-5.8 13-13 13zm7.1-9.7c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.4-1 1.2-1.2 1.5-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.7c-.3 0-.7.1-1 .4-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4 6.4 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.4.1.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5z"/>
            </svg>
          )}
        </button>
      </div>
    </>
  );
}

export default function WhatsAppWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(<Widget />, document.body);
}