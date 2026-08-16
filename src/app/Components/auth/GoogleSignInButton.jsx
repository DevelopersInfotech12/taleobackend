"use client";
import { useEffect, useRef } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onCredential, text = "continue_with" }) {
  const divRef = useRef(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const renderButton = () => {
      if (!window.google || !divRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      });
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text,
        shape: "pill",
      });
    };

    if (window.google?.accounts?.id) {
      renderButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [onCredential, text]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: 12,
          color: "#8a7560",
          textAlign: "center",
          border: "1.5px solid #e8ddd0",
          borderRadius: 999,
          padding: "12px 16px",
        }}
      >
        Google Sign-In is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.
      </div>
    );
  }

  return <div ref={divRef} className="flex justify-center" />;
}
