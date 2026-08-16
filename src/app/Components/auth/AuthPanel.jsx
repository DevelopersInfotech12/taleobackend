"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "./GoogleSignInButton";
import { useAuth } from "../../lib/AuthContext";

/* ─── Palette (Taleo tokens) ─────────────────────────────── */
const C = {
  dark: "#1a0c06",
  brown: "#3d1f10",
  gold: "#b08850",
  goldLt: "#c9a96e",
  cream: "#f5efe8",
  border: "#e8ddd0",
  muted: "#8a7560",
  text: "#2a1a0e",
  white: "#ffffff",
};

/* ─── Shared form bits ───────────────────────────────────── */
function Field({ label, name, type = "text", value, onChange, required, autoComplete }) {
  return (
    <div>
      <label
        htmlFor={`tl-${name}`}
        className="block text-[11px] font-semibold uppercase tracking-wider mb-1"
        style={{ fontFamily: "var(--font-jost)", color: C.muted }}
      >
        {label}{required && <span style={{ color: C.gold }}> *</span>}
      </label>
      <input
        id={`tl-${name}`}
        className="tl-auth__input"
        type={type} name={name} value={value} onChange={onChange}
        required={required} autoComplete={autoComplete}
        style={{
          fontFamily: "var(--font-jost)", color: C.text,
          background: C.white, border: `1.5px solid ${C.border}`,
          width: "100%", outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.gold}33`; }}
        onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px" style={{ background: C.border }} />
      <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>OR</span>
      <div className="flex-1 h-px" style={{ background: C.border }} />
    </div>
  );
}

const submitBtnStyle = (busy) => ({
  background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`,
  boxShadow: "0 4px 20px rgba(26,12,6,0.25)",
  opacity: busy ? 0.55 : 1,
  cursor: busy ? "not-allowed" : "pointer",
  minHeight: 44,
});

/* ─── Sign in ────────────────────────────────────────────── */
function SignInForm({ onSwitch }) {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle(credential);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full" style={{ maxWidth: 380 }}>
      <h2
        className="mb-3.5 text-center"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.35rem,2.4vw,1.7rem)", fontWeight: 600, color: C.text }}
      >
        Sign In to Your Account
      </h2>

      <div className="flex justify-center">
        <GoogleSignInButton onCredential={handleGoogle} />
      </div>
      <Divider />

      {error && (
        <p role="alert" style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#c0392b", marginBottom: 16 }}>
          {error}
        </p>
      )}

      <form onSubmit={submit} className="flex flex-col gap-2.5">
        <Field label="Email" name="email" type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
        <Field label="Password" name="password" type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
        <button type="submit" disabled={busy}
          className="w-full rounded-full py-3 text-[12.5px] font-bold uppercase tracking-[0.15em] transition-opacity mt-1 text-white font-poppins"
          style={submitBtnStyle(busy)}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>

      {/* Only on mobile — desktop uses the sliding panel button */}
      <p className="tl-auth__switch-inline"
        style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted, marginTop: 18, textAlign: "center" }}>
        New here?{" "}
        <button type="button" onClick={onSwitch} style={{ color: C.gold, fontWeight: 600, textDecoration: "underline" }}>
          Create an account
        </button>
      </p>
    </div>
  );
}

/* ─── Register ───────────────────────────────────────────── */
function SignUpForm({ onSwitch }) {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle(credential);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full" style={{ maxWidth: 380 }}>
      <h2
        className="mb-3.5 text-center"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.25rem,2.2vw,1.5rem)", fontWeight: 600, color: C.text }}
      >
        Register Your Account
      </h2>

      <div className="flex justify-center">
        <GoogleSignInButton onCredential={handleGoogle} text="signup_with" />
      </div>
      <Divider />

      {error && (
        <p role="alert" style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#c0392b", marginBottom: 16 }}>
          {error}
        </p>
      )}

      <form onSubmit={submit} className="flex flex-col gap-2.5">
        <Field label="Full Name" name="name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
        <Field label="Email" name="reg-email" type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
        <Field label="Password" name="reg-password" type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" />
        <button type="submit" disabled={busy}
          className="w-full rounded-full py-3 text-[12.5px] font-bold uppercase tracking-[0.15em] transition-opacity mt-1 text-white font-poppins"
          style={submitBtnStyle(busy)}>
          {busy ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="tl-auth__switch-inline"
        style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted, marginTop: 18, textAlign: "center" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} style={{ color: C.gold, fontWeight: 600, textDecoration: "underline" }}>
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ─── Ghost button used inside the sliding panel ─────────── */
function GhostButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tl-auth__ghost"
      style={{
        fontFamily: "var(--font-jost)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: C.cream,
        background: "transparent",
        border: `1.5px solid ${C.goldLt}`,
        borderRadius: 999,
        padding: "12px 34px",
        minHeight: 44,
        cursor: "pointer",
        transition: "background-color 200ms ease, color 200ms ease, transform 200ms ease",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Main panel ─────────────────────────────────────────── */
export default function AuthPanel() {
  const [mode, setMode] = useState("login"); // "login" | "register"

  return (
    <>
      <style>{CSS}</style>

      <div className="tl-auth" data-mode={mode}>

        {/* Sign in — sits left, slides right when registering */}
        <div className="tl-auth__pane tl-auth__pane--signin">
          <SignInForm onSwitch={() => setMode("register")} />
        </div>

        {/* Sign up — stacked underneath, slides in from the left */}
        <div className="tl-auth__pane tl-auth__pane--signup">
          <SignUpForm onSwitch={() => setMode("login")} />
        </div>

        {/* The sliding brown panel */}
        <div className="tl-auth__overlay-box" aria-hidden="true">
          <div className="tl-auth__overlay">

            {/* Shown while registering — invites back to sign in */}
            <div className="tl-auth__overlay-pane tl-auth__overlay-pane--left">
              <h3 className="tl-auth__overlay-title">Welcome Back</h3>
              <span className="tl-auth__rule" />
              <p className="tl-auth__overlay-copy">
                Sign in to track your orders, revisit your wishlist and pick up right where you left off.
              </p>
              <GhostButton onClick={() => setMode("login")}>Sign In</GhostButton>
            </div>

            {/* Shown while signing in — invites to register */}
            <div className="tl-auth__overlay-pane tl-auth__overlay-pane--right">
              <h3 className="tl-auth__overlay-title">New to Taleo</h3>
              <span className="tl-auth__rule" />
              <p className="tl-auth__overlay-copy">
                Create an account to save your favourite pieces, follow every order and check out faster next time.
              </p>
              <GhostButton onClick={() => setMode("register")}>Create Account</GhostButton>
            </div>

          </div>
        </div>
      </div>

      {/* Announce the switch for screen readers, since the visual cue is motion */}
      <p className="tl-auth__sr" aria-live="polite">
        {mode === "login" ? "Sign in form shown" : "Create account form shown"}
      </p>
    </>
  );
}

/* ─── Styles ─────────────────────────────────────────────────
   Panel sweep is 500ms — the upper bound for a complex transition.
   Only transform / opacity animate, except the panel's corner radius,
   which is intrinsic to the effect.
------------------------------------------------------------- */
const CSS = `
.tl-auth {
  --tl-brown:  ${C.brown};
  --tl-dark:   ${C.dark};
  --tl-gold:   ${C.gold};
  --tl-goldlt: ${C.goldLt};
  --tl-cream:  ${C.cream};
  --tl-border: ${C.border};
  --tl-white:  ${C.white};
  --tl-ease:   500ms cubic-bezier(0.65, 0, 0.35, 1);

  /* Contains the z-index:100 overlay so it can't paint over the
     fixed navbar (z-50) or the offer strip above it. */
  isolation: isolate;

  position: relative;
  width: 100%;
  max-width: 960px;
  min-height: 520px;
  margin: 0 auto;
  overflow: hidden;
  background: var(--tl-white);
  border: 1.5px solid var(--tl-border);
  border-radius: 24px;
  box-shadow: 0 18px 60px rgba(26,12,6,0.10);
}

/* ── Inputs ──
   14px on desktop for a compact form; bumped to 16px on touch because
   iOS auto-zooms the viewport on focus for anything smaller. */
.tl-auth__input {
  font-size: 14px;
  min-height: 40px;
  padding: 9px 14px;
  border-radius: 10px;
}
@media (max-width: 767px) {
  .tl-auth__input { font-size: 16px; min-height: 44px; padding: 11px 14px; }
}

/* ── Form panes ── */
.tl-auth__pane {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26px 40px;
  overflow-y: auto;
  scrollbar-width: thin;
  background: var(--tl-white);
  transition: transform var(--tl-ease), opacity var(--tl-ease), visibility 0s;
}
.tl-auth__pane--signin { z-index: 2; }
.tl-auth__pane--signup {
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  transition: transform var(--tl-ease), opacity var(--tl-ease), visibility 0s linear 500ms;
}

.tl-auth[data-mode="register"] .tl-auth__pane--signin {
  transform: translateX(100%);
  opacity: 0;
  visibility: hidden;
  transition: transform var(--tl-ease), opacity var(--tl-ease), visibility 0s linear 500ms;
}
.tl-auth[data-mode="register"] .tl-auth__pane--signup {
  transform: translateX(100%);
  opacity: 1;
  visibility: visible;
  z-index: 5;
  transition: transform var(--tl-ease), opacity var(--tl-ease), visibility 0s;
}

/* ── Sliding brown panel ── */
.tl-auth__overlay-box {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  z-index: 100;
  overflow: hidden;
  border-radius: 140px 0 0 140px;
  transition: transform var(--tl-ease), border-radius var(--tl-ease);
}
.tl-auth[data-mode="register"] .tl-auth__overlay-box {
  transform: translateX(-100%);
  border-radius: 0 140px 140px 0;
}

.tl-auth__overlay {
  position: relative;
  left: -100%;
  width: 200%;
  height: 100%;
  transform: translateX(0);
  transition: transform var(--tl-ease);
  background: linear-gradient(135deg, var(--tl-brown) 0%, var(--tl-dark) 100%);
  color: var(--tl-cream);
}
.tl-auth[data-mode="register"] .tl-auth__overlay { transform: translateX(50%); }

.tl-auth__overlay-pane {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 48px;
  transition: transform var(--tl-ease);
}
.tl-auth__overlay-pane--left  { transform: translateX(-20%); }
.tl-auth__overlay-pane--right { right: 0; transform: translateX(0); }
.tl-auth[data-mode="register"] .tl-auth__overlay-pane--left  { transform: translateX(0); }
.tl-auth[data-mode="register"] .tl-auth__overlay-pane--right { transform: translateX(20%); }

.tl-auth__overlay-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.7rem, 2.8vw, 2.25rem);
  font-weight: 600;
  line-height: 1.1;
  color: var(--tl-cream);
  margin: 0;
}
.tl-auth__rule {
  display: block;
  width: 46px;
  height: 1px;
  margin: 14px 0 12px;
  background: linear-gradient(90deg, var(--tl-goldlt), transparent);
}
.tl-auth__overlay-copy {
  font-family: var(--font-jost);
  font-size: 14px;
  line-height: 1.7;
  color: rgba(245,239,232,0.82);
  margin: 0 0 24px;
  max-width: 300px;
}

.tl-auth__ghost:hover {
  background: var(--tl-goldlt) !important;
  color: var(--tl-dark) !important;
}
.tl-auth__ghost:active { transform: scale(0.97); }
.tl-auth__ghost:focus-visible,
.tl-auth button:focus-visible,
.tl-auth input:focus-visible {
  outline: 3px solid var(--tl-goldlt);
  outline-offset: 2px;
}

/* Desktop uses the panel button, so hide the inline text switch */
@media (min-width: 768px) {
  .tl-auth__switch-inline { display: none; }
}

/* ── Mobile: no room to slide — stack and swap ── */
@media (max-width: 767px) {
  .tl-auth {
    min-height: 0;
    border-radius: 20px;
  }
  .tl-auth__overlay-box { display: none; }
  .tl-auth__pane {
    position: relative;
    width: 100%;
    height: auto;
    padding: 26px 20px 30px;
    transform: none !important;
    opacity: 1 !important;
    visibility: visible !important;
    transition: none;
  }
  .tl-auth[data-mode="login"]    .tl-auth__pane--signup { display: none; }
  .tl-auth[data-mode="register"] .tl-auth__pane--signin { display: none; }
}

/* ── Respect reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .tl-auth,
  .tl-auth * {
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
  }
}

/* Visually hidden, still announced */
.tl-auth__sr {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
`;