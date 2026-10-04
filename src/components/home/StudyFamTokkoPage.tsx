"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/sections/Footer";

export function StudyFamTokkoPage() {
  const { user, profile, loading, signInWithGoogle, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // MFT Links mapping directly to the authentic StudyFAM CBT test player
  const MFT_LINKS: Record<number, string> = {
    1: "/exam/player?id=MFT-1.pdf",
    2: "/exam/player?id=MFT-2.pdf",
    3: "/exam/player?id=MFT-3.pdf",
    4: "/exam/player?id=MFT-4.pdf",
    5: "/exam/player?id=MFT-5.pdf",
    6: "/exam/player?id=MFT-6.pdf",
    7: "/exam/player?id=MFT-7.pdf",
    8: "/exam/player?id=MFT-8.pdf",
    9: "/exam/player?id=MFT-9.pdf",
    10: "/exam/player?id=MFT-10.pdf",
  };

  const SCHOLARSHIP_LINK = "/all-india-mock";

  // Interactive CBT Demo State
  const [selectedDemoOpt, setSelectedDemoOpt] = useState<string>("B");
  const [demoTime, setDemoTime] = useState("02:59:59");

  useEffect(() => {
    let t = 179 * 60 + 59;
    const interval = setInterval(() => {
      t = t > 0 ? t - 1 : 179 * 60 + 59;
      const h = String(Math.floor(t / 3600)).padStart(2, "0");
      const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
      const s = String(t % 60).padStart(2, "0");
      setDemoTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Countdown to 27 Dec 2026, 09:00 IST (Exam Date)
  const examTarget = new Date("2026-12-27T09:00:00+05:30").getTime();
  const [examCountdown, setExamCountdown] = useState({ d: "85", h: "10", m: "33", s: "02" });

  useEffect(() => {
    const tickExam = () => {
      const diff = examTarget - Date.now();
      if (diff > 0) {
        const d = String(Math.floor(diff / 864e5));
        const h = String(Math.floor((diff / 36e5) % 24)).padStart(2, "0");
        const m = String(Math.floor((diff / 6e4) % 60)).padStart(2, "0");
        const s = String(Math.floor((diff / 1e3) % 60)).padStart(2, "0");
        setExamCountdown({ d, h, m, s });
      } else {
        setExamCountdown({ d: "00", h: "00", m: "00", s: "00" });
      }
    };
    tickExam();
    const interval = setInterval(tickExam, 1000);
    return () => clearInterval(interval);
  }, [examTarget]);

  // Countdown to 20 Oct 2026, 00:00 IST (Registration Date)
  const regTarget = new Date("2026-10-20T00:00:00+05:30").getTime();
  const [regClock, setRegClock] = useState({ text: "Registrations open in", time: "--", live: false });

  useEffect(() => {
    const tickReg = () => {
      const now = Date.now();
      const diff = regTarget - now;
      if (diff <= 0) {
        setRegClock({ text: "Registrations are OPEN", time: "● LIVE", live: true });
      } else {
        const d = Math.floor(diff / 864e5);
        const h = String(Math.floor((diff / 36e5) % 24)).padStart(2, "0");
        const m = String(Math.floor((diff / 6e4) % 60)).padStart(2, "0");
        const s = String(Math.floor((diff / 1e3) % 60)).padStart(2, "0");
        setRegClock({ text: "Registrations open in", time: `${d}d : ${h}h : ${m}m : ${s}s`, live: false });
      }
    };
    tickReg();
    const interval = setInterval(tickReg, 1000);
    return () => clearInterval(interval);
  }, [regTarget]);

  // Scroll Nav Shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Number animation on scroll
  const statsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const numbers = document.querySelectorAll(".num[data-to]");
    const animate = (el: Element) => {
      const to = parseFloat(el.getAttribute("data-to") || "0");
      const pre = el.getAttribute("data-pre") || "";
      let t0: number | null = null;
      const step = (ts: number) => {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / 1300, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(to * e).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      numbers.forEach((num) => observer.observe(num));
      return () => observer.disconnect();
    } else {
      numbers.forEach((num) => {
        const to = num.getAttribute("data-to") || "0";
        const pre = num.getAttribute("data-pre") || "";
        num.textContent = pre + Number(to).toLocaleString("en-IN");
      });
    }
  }, []);

  // Pre-Registration Form State
  const [regForm, setRegForm] = useState({ name: "", phone: "", stream: "" });
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone) return;
    try {
      localStorage.setItem("sf_tokko_waitlist", JSON.stringify(regForm));
    } catch {}
    setRegSuccess(true);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root{--bg:#fafafa;--card:#fff;--ink:#1a1a1a;--mut:#555;--mut2:#888;--line:rgba(26,26,26,.1);--b0:#0a1c96;--b1:#1a5fe0;--b2:#2f8fff;--lav:#d6aef2;--lavbg:#f3e9fd;--tint:#e9f1fd;--grn:#16a34a;--grnbg:#dcfce7;--gold:#f59e0b;--r-s:16px;--r-m:24px;--r-l:32px;--r-xl:100px}
        body{font-family:Geist,Inter,system-ui,sans-serif;background:var(--bg);color:var(--ink);font-size:18px;line-height:1.25;font-weight:500;letter-spacing:-.02em;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        h1,h2,h3{font-weight:600;letter-spacing:-.04em;line-height:.96;text-wrap:balance}
        a{color:inherit;text-decoration:none}
        img{max-width:100%}
        ::selection{background:var(--b1);color:#fff}
        :focus-visible{outline:2px solid var(--b1);outline-offset:3px}
        .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
        .wrap{max-width:1200px;margin:0 auto;padding:0 24px}
        section[id]{scroll-margin-top:80px}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;border-radius:var(--r-xl);padding:16px 34px;font-size:17px;border:1.5px solid transparent;cursor:pointer;transition:transform .18s,box-shadow .2s,background .2s;font-family:inherit;letter-spacing:-.02em;white-space:nowrap}
        .btn:active{transform:scale(.97)}
        .btn-dark{background:var(--b1);color:#fff}
        .btn-dark:hover{background:var(--b0);transform:translateY(-2px);box-shadow:0 18px 34px -16px rgba(26,95,224,.55)}
        .btn-blue{background:linear-gradient(135deg,#0a1c96,#1f6ff2);color:#fff;box-shadow:0 18px 36px -16px rgba(26,95,224,.6)}
        .btn-blue:hover{transform:translateY(-2px)}
        .btn-ghost{background:#fff;border-color:var(--line);color:var(--ink)}
        .btn-ghost:hover{border-color:var(--b1)}
        .btn-sm{padding:12px 26px;font-size:15px}
        .ann{background:linear-gradient(100deg,#0a1c96,#1a5fe0 60%,#1f6ff2);color:#fff;font-size:14px;text-align:center;padding:10px 16px;font-weight:500}
        .ann .tag{background:var(--lav);color:#1a1a1a;font-size:12px;font-weight:600;padding:3px 12px;border-radius:var(--r-xl);margin-right:10px}
        .ann b{color:var(--lav)}
        nav{position:sticky;top:0;z-index:50;background:rgba(250,250,250,.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--line);transition:box-shadow .25s}
        nav.scrolled{box-shadow:0 14px 30px -20px rgba(0,0,0,.25)}
        .nav-in{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 24px;max-width:1200px;margin:0 auto}
        .logo{display:inline-flex;align-items:center;flex-shrink:0;min-width:max-content}
        .logo-img{height:32px;width:auto;max-height:32px;display:block;flex-shrink:0;object-fit:contain}
        .nav-links{display:flex;gap:30px;font-size:16px;font-weight:500}
        .nav-links a{opacity:.75;transition:opacity .2s}
        .nav-links a:hover{opacity:1}
        .menu-btn{display:none}
        .mnav{display:none}
        .hero{padding:72px 0 60px;position:relative;overflow:hidden}
        .hero::before{content:"";position:absolute;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(214,174,242,.4),transparent 65%);top:-220px;right:-180px;pointer-events:none}
        .hero::after{content:"";position:absolute;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(47,143,255,.25),transparent 65%);bottom:-260px;left:-180px;pointer-events:none}
        .hero-grid{display:grid;grid-template-columns:1.02fr .98fr;gap:56px;align-items:center;position:relative;z-index:1}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:var(--r-xl);padding:8px 18px;font-size:14px;font-weight:600}
        .hero-badge i{width:8px;height:8px;border-radius:50%;background:var(--b1);font-style:normal}
        .hero h1{font-size:clamp(44px,7vw,96px);margin:22px 0 20px}
        .hero h1 .hl{color:var(--b1)}
        .hero h1 .u{position:relative;white-space:nowrap}
        .hero h1 .u svg{position:absolute;left:0;right:0;bottom:-.12em;width:100%;height:.28em}
        .sub{font-size:20px;color:var(--mut);max-width:560px;line-height:1.35}
        .sub strong{color:var(--ink)}
        .cta-row{display:flex;gap:12px;flex-wrap:wrap;margin:30px 0 14px}
        .cta-note{font-size:14px;color:var(--mut2)}
        .hero-stats{display:grid;grid-template-columns:repeat(4,auto);gap:8px 36px;margin-top:34px;justify-content:start}
        .hero-stats div b{font-size:34px;font-weight:600;display:block;font-variant-numeric:tabular-nums;letter-spacing:-.04em}
        .hero-stats div span{font-size:14px;color:var(--mut2)}
        .visual{position:relative}
        .dash{background:#fff;border:1px solid var(--line);border-radius:var(--r-l);box-shadow:0 40px 80px -40px rgba(10,28,150,.35);overflow:hidden;position:relative;z-index:1}
        .dash-top{display:flex;align-items:center;gap:12px;padding:15px 20px;border-bottom:1px solid var(--line);background:#fff}
        .dash-top b{font-size:14px;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}
        .tdots{display:flex;gap:6px}
        .tdots i{width:10px;height:10px;border-radius:50%;font-style:normal}
        .live-timer{background:var(--b0);color:#fff;font-weight:600;font-size:13px;padding:6px 14px;border-radius:var(--r-xl);font-variant-numeric:tabular-nums;white-space:nowrap}
        .dash-body{padding:22px}
        .qline{font-size:15px;background:var(--bg);border:1px solid var(--line);border-radius:var(--r-s);padding:15px 17px}
        .opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}
        .opt{border:1.5px solid var(--line);border-radius:12px;padding:11px 14px;font-size:14px;font-weight:500;color:var(--mut);background:#fff;cursor:pointer;transition:all .18s}
        .opt.sel{border-color:var(--b1);background:var(--tint);color:var(--b1);font-weight:600}
        .pal{display:flex;gap:7px;flex-wrap:wrap}
        .pal span{font-size:12px;font-weight:600;padding:6px 12px;border-radius:var(--r-xl);border:1px solid var(--line);background:#fff;color:var(--mut);display:flex;align-items:center;gap:6px}
        .pal i{width:10px;height:10px;border-radius:4px;display:inline-block}
        .float-card{position:absolute;background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:0 30px 60px -25px rgba(0,0,0,.3);padding:15px 20px;font-size:13px;z-index:2}
        .float-card b{font-size:22px;display:block;letter-spacing:-.03em}
        .fc1{right:-12px;top:-28px;animation:floaty 6s ease-in-out infinite}
        .fc2{left:-16px;bottom:-28px;animation:floaty 7.5s ease-in-out 1.2s infinite}
        @keyframes floaty{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-10px) rotate(1deg)}}
        .love{padding:34px 0 8px;text-align:center}
        .love p{font-size:15px;color:var(--mut2);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
        .love-chips{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:16px}
        .love-chips span{font-size:14px;font-weight:600;padding:9px 20px;border-radius:var(--r-xl);background:#fff;border:1px solid var(--line)}
        section{padding:88px 0}
        .kick{display:inline-block;font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--b1);background:var(--tint);padding:8px 20px;border-radius:var(--r-xl);margin-bottom:18px}
        .sec-title{font-size:clamp(34px,5vw,72px);max-width:800px}
        .sec-sub{font-size:19px;color:var(--mut);max-width:640px;margin-top:14px;line-height:1.4}
        .center{text-align:center}
        .center .sec-title,.center .sec-sub{margin-left:auto;margin-right:auto}
        .alt-row{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;margin-top:64px}
        .alt-row.flip>div:first-child{order:2}
        .alt-num{font-size:15px;font-weight:600;color:var(--mut2);letter-spacing:.1em}
        .alt-row h3{font-size:clamp(28px,3.6vw,48px);margin:12px 0}
        .alt-row p{font-size:18px;color:var(--mut);line-height:1.45}
        .alt-points{margin-top:18px;display:grid;gap:12px}
        .alt-points div{display:flex;gap:12px;align-items:flex-start;font-size:16px}
        .alt-points b{color:var(--grn)}
        .alt-visual{background:linear-gradient(140deg,#0a1c96,#1f6ff2);color:#fff;border-radius:var(--r-l);padding:40px;position:relative;overflow:hidden;min-height:300px;display:flex;flex-direction:column;justify-content:center}
        .alt-visual::before{content:"";position:absolute;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(214,174,242,.35),transparent 65%);top:-140px;right:-120px}
        .alt-visual .big{font-size:clamp(48px,6vw,84px);font-weight:600;letter-spacing:-.04em;position:relative}
        .alt-visual small{color:rgba(255,255,255,.65);font-size:15px;position:relative}
        .mq{background:linear-gradient(100deg,#0a1c96,#123aC8 60%,#1a5fe0);color:#fff;overflow:hidden;padding:20px 0;transform:rotate(-1deg) scale(1.02);margin:20px 0}
        .mq-track{display:flex;width:max-content;animation:mq 24s linear infinite}
        .mq-g{display:flex;align-items:center;gap:40px;padding-right:40px}
        .mq-g span{font-size:21px;font-weight:600;letter-spacing:-.02em;white-space:nowrap}
        .mq-g i{color:var(--lav);font-style:normal;font-size:18px}
        @keyframes mq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .routine{background:#fff;border:1px solid var(--line);border-radius:var(--r-l);margin-top:44px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden}
        .routine-left{padding:48px}
        .routine-left .who{display:flex;align-items:center;gap:14px;margin-bottom:20px}
        .avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#0a1c96,#2f8fff);color:#fff;display:grid;place-items:center;font-size:22px;font-weight:600}
        .routine-left h3{font-size:clamp(26px,3vw,40px);margin-bottom:10px}
        .routine-left p{color:var(--mut);font-size:17px;line-height:1.5}
        .routine-steps{margin-top:22px;display:grid;gap:10px}
        .routine-steps div{background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:13px 17px;font-size:15.5px}
        .routine-steps b{color:var(--b1)}
        .routine-right{background:linear-gradient(140deg,#0a1c96,#1f6ff2);color:#fff;padding:48px;display:flex;flex-direction:column;justify-content:center;gap:22px;position:relative;overflow:hidden}
        .routine-right::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.3) 1.1px,transparent 1.7px);background-size:16px 16px;opacity:.5}
        .routine-right div{position:relative}
        .routine-right b{font-size:clamp(34px,4vw,54px);display:block;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
        .routine-right span{color:#bcd3ff;font-size:15px}
        .schol{background:linear-gradient(115deg,#081680 0%,#123aC8 48%,#1f6ff2 78%,#2f8fff 100%);color:#fff;border-radius:36px;padding:clamp(30px,5vw,64px);position:relative;overflow:hidden;margin-top:8px}
        .schol::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(214,174,242,.35) 1.2px,transparent 1.8px);background-size:18px 18px;-webkit-mask-image:radial-gradient(700px 380px at 15% 10%,#000 15%,transparent 75%);mask-image:radial-gradient(700px 380px at 15% 10%,#000 15%,transparent 75%)}
        .schol-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center;position:relative;z-index:1}
        .schol .kick{background:rgba(214,174,242,.16);color:var(--lav)}
        .schol h2{font-size:clamp(30px,4.4vw,56px)}
        .schol .lede{color:rgba(255,255,255,.7);font-size:18px;margin-top:12px;max-width:520px}
        .exam-facts{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:24px 0}
        .fact{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:12px 14px}
        .fact small{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--lav);font-weight:600}
        .fact b{font-size:15.5px}
        .count{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0;background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:14px}
        .count div{text-align:center;background:rgba(255,255,255,.07);border-radius:12px;padding:10px 4px}
        .count b{font-size:28px;display:block;font-variant-numeric:tabular-nums}
        .count span{font-size:11px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.06em;font-weight:600}
        .reg-open{display:flex;align-items:center;gap:10px;background:rgba(214,174,242,.14);border:1px solid rgba(214,174,242,.45);border-radius:14px;padding:11px 16px;font-size:14px;font-weight:600;color:#fff;margin:0 0 16px;position:relative;z-index:1}
        .reg-open .ro-dot{width:9px;height:9px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 4px rgba(245,158,11,.25);flex-shrink:0;animation:blink 1.6s infinite}
        @keyframes blink{50%{opacity:.4}}
        .reg-open b{margin-left:auto;font-variant-numeric:tabular-nums;white-space:nowrap}
        .reg-open.live{background:rgba(34,197,94,.18);border-color:rgba(134,239,172,.5);color:#d1fae5}
        .reg-open.live .ro-dot{background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.25);animation:none}
        .ticket{background:#fff;color:var(--ink);border-radius:20px;overflow:hidden;transform:rotate(1.5deg);box-shadow:0 30px 60px -20px rgba(0,0,0,.5)}
        .ticket-head{background:var(--b0);color:#fff;padding:13px 20px;display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;letter-spacing:.04em}
        .ticket-head span:last-child{background:var(--b1);border-radius:8px;padding:3px 10px;font-size:11px}
        .ticket-body{padding:20px;display:grid;grid-template-columns:1fr 92px;gap:16px}
        .ticket-body dl{display:grid;grid-template-columns:auto 1fr;gap:5px 14px;font-size:13.5px}
        .ticket-body dt{color:var(--mut2);font-weight:500}
        .ticket-body dd{font-weight:600;margin:0}
        .photo{width:92px;height:108px;border-radius:12px;background:linear-gradient(135deg,#e9f1fd,#cfe3ff);border:1.5px dashed #93b4e8;display:grid;place-items:center;font-size:32px}
        .barcode{height:50px;margin:0 20px 6px;background:repeating-linear-gradient(90deg,#1a1a1a 0 2px,transparent 2px 5px,#1a1a1a 5px 6px,transparent 6px 10px)}
        .ticket-foot{padding:0 20px 18px;font-size:12px;color:var(--mut2);display:flex;justify-content:space-between}
        .tracks{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;position:relative;z-index:1}
        .track{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:18px;font-size:14.5px;color:rgba(255,255,255,.85)}
        .track b{display:block;color:#fff;font-size:16px;margin-bottom:4px}
        .testi{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px}
        .t-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-m);padding:28px;transition:transform .2s,box-shadow .2s}
        .t-card:hover{transform:translateY(-4px);box-shadow:0 30px 60px -30px rgba(0,0,0,.25)}
        .t-card .stars{color:var(--gold);letter-spacing:2px}
        .t-card p{font-size:17px;margin:12px 0;line-height:1.45}
        .t-card small{color:var(--mut2);font-weight:600}
        .in-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:40px}
        .in-cell{background:#fff;border:1px solid var(--line);border-radius:20px;padding:24px;transition:transform .2s,box-shadow .2s}
        .in-cell:hover{transform:translateY(-3px);box-shadow:0 24px 48px -28px rgba(0,0,0,.25)}
        .in-cell .ic{font-size:26px}
        .in-cell b{display:block;font-size:16.5px;margin:10px 0 4px}
        .in-cell p{font-size:14px;color:var(--mut);line-height:1.45}
        .bonus{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:40px}
        .bonus .in-cell{background:linear-gradient(150deg,#0a1c96,#1440c7);color:#fff;border-color:rgba(255,255,255,.14)}
        .bonus .in-cell p{color:rgba(255,255,255,.65)}
        .bonus .in-cell .flag{display:inline-block;font-size:12px;font-weight:600;background:var(--lav);color:#1a1a1a;padding:4px 12px;border-radius:var(--r-xl);margin-bottom:12px}
        .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:44px;align-items:stretch}
        .price{background:#fff;border:1.5px solid var(--line);border-radius:28px;padding:36px;display:flex;flex-direction:column;position:relative;transition:transform .2s,box-shadow .2s}
        .price:hover{transform:translateY(-4px);box-shadow:0 30px 60px -30px rgba(0,0,0,.25)}
        .price.pop{background:linear-gradient(160deg,#0a1c96,#123aC8 70%,#1a5fe0);color:#fff;border-color:transparent;box-shadow:0 40px 80px -35px rgba(10,28,150,.55)}
        .price .pop-tag{position:absolute;top:-16px;left:50%;transform:translateX(-50%);background:var(--lav);color:#1a1a1a;font-size:13px;font-weight:600;padding:6px 20px;border-radius:var(--r-xl);white-space:nowrap}
        .price small{font-size:14px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--mut2)}
        .price.pop small{color:var(--lav)}
        .price .amount{font-size:60px;font-weight:600;letter-spacing:-.04em;margin:8px 0 2px}
        .price .amount span{font-size:18px;color:var(--mut2);letter-spacing:0}
        .price.pop .amount span{color:rgba(255,255,255,.6)}
        .price ul{list-style:none;margin:20px 0 28px;display:grid;gap:11px;font-size:15.5px}
        .price ul li{display:flex;gap:10px}
        .price ul li::before{content:"✓";color:var(--grn);font-weight:700}
        .price .btn{margin-top:auto;width:100%}
        .guar{text-align:center;margin-top:22px;font-size:15px;color:var(--mut)}
        .guar b{color:var(--ink)}
        .faq{margin:40px auto 0;display:grid;gap:12px;max-width:860px}
        .faq details{background:#fff;border:1px solid var(--line);border-radius:20px;overflow:hidden;transition:border-color .2s}
        .faq details[open]{border-color:var(--b1)}
        .faq summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:14px;font-weight:600;cursor:pointer;font-size:18px;padding:22px 26px}
        .faq summary::-webkit-details-marker{display:none}
        .faq summary::after{content:"+";flex-shrink:0;width:34px;height:34px;border-radius:50%;background:var(--b1);color:#fff;display:grid;place-items:center;font-size:20px;transition:transform .25s}
        .faq details[open] summary::after{transform:rotate(45deg);background:var(--b1)}
        .faq details p{color:var(--mut);font-size:16.5px;margin:0;padding:0 26px 24px;line-height:1.5}
        .final{background:linear-gradient(135deg,#0a1c96,#123aC8 55%,#1f6ff2);color:#fff;border-radius:36px;padding:clamp(48px,7vw,96px) clamp(24px,5vw,64px);text-align:center;position:relative;overflow:hidden;margin-top:8px}
        .final::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(214,174,242,.4) 1.3px,transparent 1.9px);background-size:20px 20px;-webkit-mask-image:radial-gradient(640px 340px at 50% 100%,#000 10%,transparent 78%);mask-image:radial-gradient(640px 340px at 50% 100%,#000 10%,transparent 78%)}
        .final h2{font-size:clamp(38px,6vw,84px);position:relative}
        .final h2 em{font-style:normal;color:var(--lav)}
        .final p{color:rgba(255,255,255,.65);font-size:19px;margin:16px auto 32px;max-width:560px;position:relative}
        .final .row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative}
        .btn-lav{background:var(--lav);color:#1a1a1a}
        .btn-lav:hover{transform:translateY(-2px);box-shadow:0 18px 36px -16px rgba(214,174,242,.6)}
        .btn-line{background:transparent;color:#fff;border-color:rgba(255,255,255,.3)}
        .btn-line:hover{border-color:#fff}
        footer{background:linear-gradient(180deg,#0a1c96,#060d4d);color:#fff;margin-top:88px;border-radius:36px 36px 0 0}
        .foot-grid{max-width:1200px;margin:0 auto;padding:64px 24px 28px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:32px}
        .foot-grid h4{font-size:13px;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.5);margin-bottom:16px;font-weight:600}
        .foot-grid a{display:block;font-size:15.5px;color:rgba(255,255,255,.8);margin:10px 0}
        .foot-grid a:hover{color:#fff}
        .foot-brand p{font-size:15.5px;color:rgba(255,255,255,.65);margin:16px 0;max-width:300px;line-height:1.5}
        .news{display:flex;gap:8px;margin-top:6px}
        .news input{flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:var(--r-xl);padding:13px 20px;color:#fff;font-size:15px;font-family:inherit;min-width:0}
        .news input::placeholder{color:rgba(255,255,255,.45)}
        .news input:focus{outline:none;border-color:var(--lav)}
        .news button{background:var(--lav);border:none;border-radius:var(--r-xl);padding:0 24px;font-weight:600;font-size:15px;cursor:pointer;color:#1a1a1a;font-family:inherit}
        .bottom{border-top:1px solid rgba(255,255,255,.12);padding:20px 24px;max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13.5px;color:rgba(255,255,255,.5)}
        .bottom a{color:rgba(255,255,255,.7);margin-left:18px}
        .sticky-cta{position:fixed;bottom:14px;left:14px;right:14px;z-index:60;display:none;gap:10px}
        .sticky-cta .btn{flex:1;box-shadow:0 14px 30px -10px rgba(0,0,0,.45)}
        .mft-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px}
        .mft{background:#fff;border:1px solid var(--line);border-radius:24px;padding:26px;position:relative;overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,box-shadow .2s}
        .mft:hover{transform:translateY(-4px);box-shadow:0 30px 60px -30px rgba(10,28,150,.35)}
        .mft .ghost{position:absolute;top:0;right:12px;font-weight:700;font-size:58px;color:#f1ebfd;line-height:1;user-select:none;letter-spacing:-.04em}
        .mft-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;position:relative}
        .mft-num{font-weight:700;font-size:15px;background:#0a1c96;color:#fff;padding:6px 14px;border-radius:100px;letter-spacing:0}
        .free-pill{font-size:11.5px;font-weight:700;color:#1a5fe0;background:#e9f1fd;padding:5px 12px;border-radius:100px}
        .mft h3{font-size:19px;position:relative}
        .mft p{font-size:14.5px;color:var(--mut);margin:6px 0 12px;position:relative}
        .mft-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;position:relative}
        .mft-meta span{font-size:12px;font-weight:600;background:var(--bg);border:1px solid var(--line);padding:5px 12px;border-radius:100px;color:var(--mut)}
        .mft .btn{margin-top:auto;width:100%;position:relative}
        .mft.grand{background:linear-gradient(135deg,#0a1c96,#1f6ff2);color:#fff;border:none}
        .mft.grand .ghost{color:rgba(255,255,255,.16)}
        .mft.grand p{color:#dbe7ff}
        .mft.grand .mft-meta span{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.2);color:#fff}
        @media(max-width:960px){
          .hero-grid{grid-template-columns:1fr;gap:40px}
          .hero{padding:52px 0 46px}
          section{padding:64px 0}
          .nav-in{padding:12px 20px;gap:12px}
          .nav-links{display:none}
          .menu-btn{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:#fff;font-size:18px;cursor:pointer;color:var(--ink);flex-shrink:0;font-family:inherit}
          .mnav{display:none;border-top:1px solid var(--line);background:var(--bg);padding:6px 24px 16px}
          .mnav.open{display:grid}
          .mnav a, .mnav button{font-weight:600;font-size:17px;padding:12px 4px;border-bottom:1px solid var(--line);text-align:left;background:none;border-left:none;border-right:none;border-top:none;cursor:pointer;font-family:inherit}
          .mnav a:last-child, .mnav button:last-child{border-bottom:none}
          .alt-row{grid-template-columns:1fr;gap:28px}
          .alt-row.flip>div:first-child{order:0}
          .schol-grid{grid-template-columns:1fr}
          .routine{grid-template-columns:1fr}
          .testi{grid-template-columns:1fr}
          .mft-grid{grid-template-columns:1fr 1fr}
          .in-grid{grid-template-columns:1fr 1fr}
          .bonus{grid-template-columns:1fr 1fr}
          .price-grid{grid-template-columns:1fr;max-width:520px;margin-left:auto;margin-right:auto}
          .hero-stats{grid-template-columns:repeat(2,1fr);gap:22px}
          .foot-grid{grid-template-columns:1fr 1fr}
          .tracks{grid-template-columns:1fr}
        }
        @media(max-width:600px){
          .nav-in{padding:10px 14px;gap:8px}
          .logo{flex-shrink:0;min-width:max-content}
          .logo-img{height:28px;width:auto;max-height:28px}
          .nav-cta-secondary{display:none !important}
          .btn-sm{padding:9px 18px;font-size:14.5px}
          .menu-btn{width:38px;height:38px;font-size:17px}
          .hero h1{font-size:46px}
          .cta-row .btn{flex:1 1 100%}
          .exam-facts{grid-template-columns:1fr 1fr}
          .float-card{position:static;margin-top:12px;animation:none}
          .in-grid,.bonus{grid-template-columns:1fr}
          .mft-grid{grid-template-columns:1fr}
          .reg-open{flex-wrap:wrap;row-gap:4px}
          .reg-open b{margin-left:0}
          .ticket-head,.ticket-foot{flex-wrap:wrap;gap:6px}
          .routine-left,.routine-right{padding:32px}
          .foot-grid{grid-template-columns:1fr}
          footer{padding-bottom:78px}
          section{padding:56px 0}
          .dash-top{flex-wrap:wrap;gap:8px}
          .sub{font-size:17px}
          .sec-sub{font-size:17px}
          .alt-visual{padding:30px 26px;min-height:0}
          .t-card{padding:22px}
          .faq summary{padding:18px;font-size:16.5px}
          .regbox{padding:24px !important}
          .news{flex-direction:column}
          .news button{padding:14px}
          .ticket-body{padding:16px}
        }
        @media(max-width:720px){.sticky-cta{display:flex}}
        @media(max-width:400px){
          .hero h1{font-size:40px}
          .fact b{font-size:13.5px}
          .count b{font-size:22px}
          .ticket-body{grid-template-columns:1fr 80px}
          .photo{width:80px;height:96px}
        }
      `}} />

      {/* 1. Single Top Announcement Bar */}
      <div className="ann">
        <span className="tag">NEW</span>All-India Scholarship Mock · <b>27 Dec 2026, 9 AM IST</b> · Entry ₹27 · Registration opens 20 Oct 2026
      </div>

      {/* 2. Sticky Navbar with Google Login */}
      <nav id="topnav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-in">
          <Link className="logo" href="/" aria-label="StudyFAM home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-blue.png" alt="StudyFAM" className="logo-img" />
          </Link>

          <div className="nav-links">
            <Link href="/exam">10 MFTs</Link>
            <Link href="/all-india-mock">National Mock (27 Dec)</Link>
            <Link href="/percentile-analyzer">Percentile Analyzer</Link>
            <a href="#faq">FAQ</a>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
            <a className="btn btn-ghost btn-sm nav-cta-secondary" href="#mfts">
              View mocks
            </a>

            {/* Seamless Google Login Integration matching exact pill design */}
            {user ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                <Link href="/dashboard" className="btn btn-dark btn-sm">
                  <span>Dashboard →</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="btn btn-ghost btn-sm nav-cta-secondary"
                  title="Sign out"
                  style={{ padding: "12px 18px", fontSize: "14px" }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle("/dashboard")}
                className="btn btn-dark btn-sm"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", flexShrink: 0 }}
                aria-label="Sign in with Google"
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in</span>
              </button>
            )}

            <button
              className="menu-btn"
              aria-label="Open menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <div className={`mnav ${mobileOpen ? "open" : ""}`} id="mnav">
          <Link href="/exam" onClick={() => setMobileOpen(false)}>10 MFTs</Link>
          <Link href="/all-india-mock" onClick={() => setMobileOpen(false)}>National Mock (27 Dec)</Link>
          <Link href="/percentile-analyzer" onClick={() => setMobileOpen(false)}>Percentile Analyzer</Link>
          <a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>My Dashboard →</Link>
              <button onClick={() => { signOut(); setMobileOpen(false); }}>Sign out ({profile?.fullName || "Student"})</button>
            </>
          ) : (
            <button
              onClick={() => { signInWithGoogle("/dashboard"); setMobileOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--b1)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </nav>

      {/* 3. Hero Section */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="hero-badge"><i></i> JEE Main 2027 · 100% free · NTA pattern</span>
            <h1>
              Take the JEE Main <span className="hl">before</span> the{" "}
              <span className="u">
                JEE Main.
                <svg viewBox="0 0 300 20" preserveAspectRatio="none">
                  <path d="M4 14 C 80 4, 220 4, 296 12" stroke="#d6aef2" strokeWidth="7" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            <p className="sub">
              <strong>10 full-length CBT mocks (MFT-01 → MFT-10)</strong> — 75 questions · 300 marks · 180 minutes · +4/−1 — plus a <strong>₹27 All-India Scholarship Exam</strong> that refunds your full NTA fee.
            </p>
            <div className="cta-row">
              <a className="btn btn-blue" href="/exam/player?id=MFT-1.pdf">Start Free →</a>
              <Link className="btn btn-ghost" href="/exam">View All MFTs</Link>
              <a className="btn btn-ghost" href="#scholarship">₹27 Scholarship</a>
            </div>
            <p className="cta-note">Free forever · No credit card · 24/7 access</p>
            <div className="hero-stats" ref={statsContainerRef}>
              <div><b><span className="num" data-to="10">10</span></b><span>Full mocks, free</span></div>
              <div><b><span className="num" data-to="750">750</span></b><span>Curated questions</span></div>
              <div><b><span className="num" data-to="300">300</span></b><span>Marks per paper</span></div>
              <div><b><span className="num" data-to="27" data-pre="₹">₹27</span></b><span>Scholarship entry</span></div>
            </div>
          </div>

          {/* Interactive CBT Preview Visual */}
          <div className="visual">
            <div className="dash" role="img" aria-label="Preview of the StudyFAM computer-based test interface">
              <div className="dash-top">
                <span className="tdots" aria-hidden="true">
                  <i style={{ background: "#f87171" }}></i>
                  <i style={{ background: "#fbbf24" }}></i>
                  <i style={{ background: "#34d399" }}></i>
                </span>
                <b>StudyFAM CBT · MFT-01 · Paper 1</b>
                <span className="live-timer" id="demo-t">{demoTime}</span>
              </div>
              <div className="dash-body">
                <div className="qline">
                  <b>Q.12 — Physics (Section A · +4/−1)</b><br />
                  <span style={{ color: "var(--mut)" }}>A projectile launched at 45° with speed 20 m/s. Range? (g = 10 m/s²)</span>
                </div>
                <div className="opts">
                  <div
                    className={`opt ${selectedDemoOpt === "A" ? "sel" : ""}`}
                    onClick={() => setSelectedDemoOpt("A")}
                  >
                    (A) 20 m
                  </div>
                  <div
                    className={`opt ${selectedDemoOpt === "B" ? "sel" : ""}`}
                    onClick={() => setSelectedDemoOpt("B")}
                  >
                    (B) 40 m · Saved
                  </div>
                  <div
                    className={`opt ${selectedDemoOpt === "C" ? "sel" : ""}`}
                    onClick={() => setSelectedDemoOpt("C")}
                  >
                    (C) 60 m
                  </div>
                  <div
                    className={`opt ${selectedDemoOpt === "D" ? "sel" : ""}`}
                    onClick={() => setSelectedDemoOpt("D")}
                  >
                    (D) 80 m
                  </div>
                </div>
                <div className="pal">
                  <span><i style={{ background: "#16a34a" }}></i>Answered</span>
                  <span><i style={{ background: "#ef4444" }}></i>Not Answered</span>
                  <span><i style={{ background: "#a855f7" }}></i>Marked</span>
                  <span><i style={{ background: "#9ca3af" }}></i>Not Visited</span>
                  <span><i style={{ background: "linear-gradient(135deg,#a855f7 50%,#16a34a 50%)" }}></i>Answered &amp; Marked</span>
                </div>
              </div>
            </div>
            <div className="float-card fc1">
              <span style={{ fontSize: "12px", color: "var(--mut2)", fontWeight: 600 }}>PREDICTED PERCENTILE</span>
              <b>98.42 %ile</b>
              <span style={{ color: "var(--grn)", fontWeight: 600 }}>▲ +2.1 vs last mock</span>
            </div>
            <div className="float-card fc2">
              <span style={{ fontSize: "12px", color: "var(--mut2)", fontWeight: 600 }}>INSTANT SCORECARD</span>
              <b>212 / 300</b>
              <span style={{ color: "var(--mut)" }}>P 68 · C 74 · M 70</span>
            </div>
          </div>
        </div>
      </header>

      {/* 4. Love Strip */}
      <div className="love">
        <div className="wrap">
          <p>You&apos;ll love this prep</p>
          <div className="love-chips">
            <span>✓ NTA-style CBT</span>
            <span>✓ +4 / −1 marking</span>
            <span>✓ Instant percentile</span>
            <span>✓ 75 step-by-step solutions</span>
            <span>✓ 24/7 on-demand</span>
          </div>
        </div>
      </div>

      <main>
        {/* 5. Continuous Spec Marquee */}
        <div className="mq" aria-hidden="true">
          <div className="mq-track">
            <div className="mq-g">
              <span>Full Syllabus</span><i>✦</i><span>No Guesswork</span><i>✦</i><span>NTA Pattern</span><i>✦</i><span>Instant Percentile</span><i>✦</i><span>100% Free Mocks</span><i>✦</i><span>₹27 Scholarship</span><i>✦</i>
            </div>
            <div className="mq-g">
              <span>Full Syllabus</span><i>✦</i><span>No Guesswork</span><i>✦</i><span>NTA Pattern</span><i>✦</i><span>Instant Percentile</span><i>✦</i><span>100% Free Mocks</span><i>✦</i><span>₹27 Scholarship</span><i>✦</i>
            </div>
          </div>
        </div>

        {/* 6. Routine Section */}
        <section id="routine">
          <div className="wrap">
            <div className="center">
              <span className="kick">Built for aspirants</span>
              <h2 className="sec-title">How toppers use StudyFAM.</h2>
              <p className="sec-sub center">Not motivation — a weekly operating system. One full paper, reviewed ruthlessly, repeated ten times.</p>
            </div>
            <div className="routine">
              <div className="routine-left">
                <div className="who">
                  <span className="avatar">T</span>
                  <div>
                    <b style={{ fontSize: "18px" }}>The 10-mock routine</b><br />
                    <span style={{ color: "var(--mut2)", fontSize: "14.5px" }}>Followed by serious JEE 2027 aspirants</span>
                  </div>
                </div>
                <h3>Sit. Solve. Study the gap. Repeat.</h3>
                <p>Each week: attempt one MFT in a single 3-hour sitting — phone away, timer on. Then spend twice as long on the 75 solutions as you did on the paper.</p>
                <div className="routine-steps">
                  <div><b>Mon–Sat</b> — Revise weak units flagged by your last scorecard</div>
                  <div><b>Sunday 9 AM</b> — Full MFT in one 180-minute exam-hall sitting</div>
                  <div><b>Sunday PM</b> — Review all 75 solutions, log silly errors</div>
                </div>
              </div>
              <div className="routine-right">
                <div><b><span className="num" data-to="10">10</span> weeks</b><span>One mock per week → full syllabus × 10</span></div>
                <div><b><span className="num" data-to="750">750</span> questions</b><span>75 per paper · every solution studied</span></div>
                <div><b><span className="num" data-to="180">180</span> mins</b><span>Real exam temperament, built by reps</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. 10 Free Full Mocks (MFT-01 to MFT-10) */}
        <section id="mfts">
          <div className="wrap">
            <div className="center">
              <span className="kick">Mock Tests · 100% Free</span>
              <h2 className="sec-title">Ten papers. Zero gaps.</h2>
              <p className="sec-sub center">Every MFT is a complete full-syllabus JEE Main paper — 75 questions · 300 marks · 180 minutes · +4/−1. Pick any order, attempt all ten.</p>
            </div>

            <div className="mft-grid" id="mftGrid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                const code = n < 10 ? `0${n}` : String(n);
                return (
                  <div key={n} className="mft">
                    <span className="ghost" aria-hidden="true">{code}</span>
                    <div className="mft-top">
                      <span className="mft-num">MFT-{code}</span>
                      <span className="free-pill">● FREE</span>
                    </div>
                    <h3>Full-Length Mock {code}</h3>
                    <p>Complete JEE Main paper · full PCM syllabus · instant percentile + 75 solutions.</p>
                    <div className="mft-meta">
                      <span>75 Qs</span>
                      <span>300 marks</span>
                      <span>180 min</span>
                      <span>+4/−1</span>
                    </div>
                    <Link className="btn btn-dark btn-sm" href={MFT_LINKS[n]}>
                      Open MFT-{code} →
                    </Link>
                  </div>
                );
              })}

              {/* MFT-10 Grand Finale */}
              <div className="mft grand">
                <span className="ghost" aria-hidden="true">10</span>
                <div className="mft-top">
                  <span className="mft-num" style={{ background: "#fff", color: "#0a1c96" }}>MFT-10 🏆</span>
                  <span className="free-pill">● FREE</span>
                </div>
                <h3>Grand Finale Mock</h3>
                <p>Your final full-syllabus rehearsal before the scholarship exam — same paper, peak pressure.</p>
                <div className="mft-meta">
                  <span>75 Qs</span>
                  <span>300 marks</span>
                  <span>180 min</span>
                  <span>+4/−1</span>
                </div>
                <Link className="btn btn-blue btn-sm" href={MFT_LINKS[10]}>
                  Open MFT-10 →
                </Link>
              </div>
            </div>

            <div className="center" style={{ marginTop: "26px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-blue" href={MFT_LINKS[1]}>
                Open MFT-01 →
              </Link>
              <a className="btn btn-ghost" href="#scholarship">
                Skip to scholarship
              </a>
            </div>
          </div>
        </section>

        {/* 8. 27 Dec All-India Scholarship Mock */}
        <section id="scholarship" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="schol">
              <div className={`reg-open ${regClock.live ? "live" : ""}`}>
                <span className="ro-dot"></span>
                <span className="ro-text">{regClock.text}</span>
                <b className="ro-time">{regClock.time}</b>
              </div>

              <div className="schol-grid">
                <div>
                  <span className="kick">Scholarship · 27 Dec 2026</span>
                  <h2>One paper. One slot. Full fee back.</h2>
                  <p className="lede">
                    The All-India JEE Main 2027 Aptitude Mock — 75 Qs · 300 marks · 180 min · +4/−1. Winners get 100% of their official NTA exam fee refunded.
                  </p>

                  <div className="exam-facts">
                    <div className="fact"><small>📅 Date</small><b>27 Dec 2026</b></div>
                    <div className="fact"><small>🕘 Time</small><b>9 AM – 12 PM</b></div>
                    <div className="fact"><small>🚪 Reporting</small><b>8:00 AM</b></div>
                    <div className="fact"><small>🔒 Gate closes</small><b>8:30 AM</b></div>
                  </div>

                  <div className="count">
                    <div><b>{examCountdown.d}</b><span>Days</span></div>
                    <div><b>{examCountdown.h}</b><span>Hours</span></div>
                    <div><b>{examCountdown.m}</b><span>Mins</span></div>
                    <div><b>{examCountdown.s}</b><span>Secs</span></div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                    <Link className="btn btn-lav" href={SCHOLARSHIP_LINK} style={{ background: "var(--lav)", color: "#1a1a1a" }}>
                      Register for ₹27 →
                    </Link>
                    <a className="btn btn-line" href="#pricing">See plans</a>
                  </div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.55)", marginTop: "12px" }}>
                    Registration opens 20 Oct 2026 · 50% merit + 50% need tracks · Equal opportunity 50:50 · Ranks in 48 hrs · UPI payout in 7 days
                  </p>
                </div>

                <div>
                  <div className="ticket">
                    <div className="ticket-head">
                      <span>🎫 STUDYFAM E-ADMIT CARD</span>
                      <span>SPECIMEN</span>
                    </div>
                    <div className="ticket-body">
                      <dl>
                        <dt>Exam</dt><dd>Scholarship Mock · JEE 2027</dd>
                        <dt>Roll No.</dt><dd>SF-2026-042517</dd>
                        <dt>Date</dt><dd>27 Dec 2026 · 9:00 AM</dd>
                        <dt>Mode</dt><dd>Online CBT · 180 min</dd>
                        <dt>Reporting</dt><dd>8:00 AM IST</dd>
                      </dl>
                      <div className="photo">👨‍🎓</div>
                    </div>
                    <div className="barcode"></div>
                    <div className="ticket-foot">
                      <span>Full-screen proctored · Tab-lock</span>
                      <span>studyfam.in</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tracks">
                <div className="track">
                  <b>🏅 Pure Merit · 50%</b>
                  Top percentile wins. Zero financial scrutiny — rank is everything.
                </div>
                <div className="track">
                  <b>🤝 Need-Based · 50%</b>
                  Family income ≤ ₹8 Lakh (verified). Same prize, same honour.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Real Stories */}
        <section id="stories" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="center">
              <span className="kick">Wall of love</span>
              <h2 className="sec-title">Real stories from aspirants.</h2>
            </div>
            <div className="testi">
              <div className="t-card">
                <span className="stars">★★★★★</span>
                <p>&ldquo;Feels exactly like the NTA screen. My silly-error rate dropped after 4 mocks.&rdquo;</p>
                <small>— Class 12 aspirant, JEE 2027</small>
              </div>
              <div className="t-card">
                <span className="stars">★★★★★</span>
                <p>&ldquo;Percentile + full solutions instantly. Best free mock series I&apos;ve used.&rdquo;</p>
                <small>— Dropper batch aspirant</small>
              </div>
              <div className="t-card">
                <span className="stars">★★★★★</span>
                <p>&ldquo;The Sunday 9 AM routine changed everything. Exam day felt like mock #11.&rdquo;</p>
                <small>— Class 11 starter, JEE 2028</small>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Included Features */}
        <section id="included" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="center">
              <span className="kick">Included</span>
              <h2 className="sec-title">Everything free. Actually free.</h2>
              <p className="sec-sub center">Every MFT ships with the full exam-hall stack — no tier gates, no locked solutions.</p>
            </div>
            <div className="in-grid">
              <div className="in-cell"><span className="ic">📝</span><b>10 full papers</b><p>75 Qs · 300 marks · 180 min, NTA +4/−1, full PCM syllabus each.</p></div>
              <div className="in-cell"><span className="ic">📊</span><b>Instant scorecard</b><p>Subject marks, accuracy and time analysis the second you submit.</p></div>
              <div className="in-cell"><span className="ic">🎯</span><b>Predicted percentile</b><p>Your 300-mark score converted to an All-India percentile.</p></div>
              <div className="in-cell"><span className="ic">📖</span><b>75 solutions</b><p>Step-by-step textbook solutions for every question, every mock.</p></div>
              <div className="in-cell"><span className="ic">🎛️</span><b>CBT palette</b><p>All 5 official states: answered, marked, review &amp; more.</p></div>
              <div className="in-cell"><span className="ic">⏱️</span><b>Live timer</b><p>180-minute countdown with auto-submit, like the real hall.</p></div>
              <div className="in-cell"><span className="ic">🎫</span><b>E-admit card</b><p>Scholarship roll number, barcode and exam advisory.</p></div>
              <div className="in-cell"><span className="ic">⚡</span><b>48-hr ranks</b><p>National merit lists fast; payouts within 7 days.</p></div>
            </div>
          </div>
        </section>

        {/* 11. Extras */}
        <section id="extras" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="center">
              <span className="kick">Get more</span>
              <h2 className="sec-title">The ₹27 unlocks more than a paper.</h2>
            </div>
            <div className="bonus">
              <div className="in-cell"><span className="flag">SCHOLARSHIP</span><b>National rank</b><p>One synchronized slot — your true All-India standing.</p></div>
              <div className="in-cell"><span className="flag">FAIRNESS</span><b>Dual tracks</b><p>50% pure merit, 50% need-based. Opt-outs roll over.</p></div>
              <div className="in-cell"><span className="flag">EQUALITY</span><b>Equal slots</b><p>50:50 boys–girls representation across every tier.</p></div>
              <div className="in-cell"><span className="flag">PAYOUT</span><b>Fee refund</b><p>100% NTA fee back via UPI/bank within 7 days.</p></div>
            </div>
          </div>
        </section>

        {/* 12. Pricing Grid */}
        <section id="pricing" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="center">
              <span className="kick">Pricing</span>
              <h2 className="sec-title">Invest once. Practise forever.</h2>
              <p className="sec-sub center">Mocks cost nothing, ever. The scholarship costs less than a samosa plate.</p>
            </div>
            <div className="price-grid">
              <div className="price">
                <small>Practice</small>
                <div className="amount">₹0</div>
                <span style={{ color: "var(--mut2)" }}>free forever · no card</span>
                <ul>
                  <li>All 10 full-length MFT mocks</li>
                  <li>Instant scorecard + percentile</li>
                  <li>75 step-by-step solutions each</li>
                  <li>24/7 on-demand access</li>
                </ul>
                <Link className="btn btn-ghost" href={MFT_LINKS[1]}>Start Free →</Link>
              </div>

              <div className="price pop">
                <span className="pop-tag">MOST POPULAR</span>
                <small>Scholarship</small>
                <div className="amount">₹27 <span>one-time</span></div>
                <span style={{ color: "rgba(255,255,255,.6)" }}>entry · 27 Dec 2026</span>
                <ul>
                  <li>All-India synchronized mock</li>
                  <li>100% NTA fee refund scholarship</li>
                  <li>Merit + need tracks, 50:50 slots</li>
                  <li>E-admit card + 48-hr ranks</li>
                </ul>
                <Link className="btn btn-lav" href={SCHOLARSHIP_LINK} style={{ background: "var(--lav)", color: "#1a1a1a" }}>
                  Register ₹27 →
                </Link>
              </div>

              <div className="price">
                <small>Promise</small>
                <div className="amount" style={{ fontSize: "44px" }}>Fair &amp; open</div>
                <span style={{ color: "var(--mut2)" }}>our guarantee</span>
                <ul>
                  <li>₹18 of ₹27 pooled to scholarships</li>
                  <li>More students = more winners</li>
                  <li>Opt-outs roll to next ranker</li>
                  <li>Full refund policy published</li>
                </ul>
                <Link className="btn btn-ghost" href="/refund-policy">Read policy →</Link>
              </div>
            </div>
            <p className="guar">Free mocks forever · <b>Transparent ₹18 scholarship pool + ₹9 ops split</b> · Payouts in 7 days</p>
          </div>
        </section>

        {/* 13. FAQ */}
        <section id="faq" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="center">
              <span className="kick">FAQ</span>
              <h2 className="sec-title">Let&apos;s clear a few things up.</h2>
            </div>
            <div className="faq">
              <details open>
                <summary>Are all 10 mocks really free?</summary>
                <p>Yes — MFT-01 to MFT-10 cost ₹0, no card required. Each is a full-syllabus paper: 75 questions, 300 marks, 180 minutes, +4/−1 marking across overall Class 11 + 12 PCM.</p>
              </details>
              <details>
                <summary>What is the exact pattern?</summary>
                <p>Physics 25 + Chemistry 25 + Maths 25 per test. Each subject: Section A (20 compulsory MCQs) + Section B (5 numerical-value questions). +4 correct, −1 wrong, 0 unattempted. 180-minute live timer.</p>
              </details>
              <details>
                <summary>When is the Scholarship Mock?</summary>
                <p>27 Dec 2026, 9:00 AM–12:00 PM IST (report 8:00 AM, gate closes 8:30 AM). Entry ₹27 — ₹18 to the scholarship pool, ₹9 to platform &amp; proctoring. Registration opens 20 Oct 2026.</p>
              </details>
              <details>
                <summary>Who wins the scholarship?</summary>
                <p>50% pure merit (top percentile) + 50% need-based (family income ≤ ₹8 lakh), with 50:50 boy–girl slots in every tier. Every winner gets a 100% refund of the official NTA exam fee. Scales from Top 20 to Top 1,000.</p>
              </details>
              <details>
                <summary>How do I open a mock?</summary>
                <p>Tap any MFT card — each links to its test. After submitting you get an instant scorecard, predicted percentile and all 75 step-by-step solutions.</p>
              </details>
            </div>
          </div>
        </section>

        {/* 14. Seat Alert / Pre-Registration Form */}
        <section id="register" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="center">
              <span className="kick">Seat alert</span>
              <h2 className="sec-title">Don&apos;t miss 20 Oct.</h2>
              <p className="sec-sub center">Drop your details — we&apos;ll ping you the moment registration opens.</p>
            </div>
            <div className="regbox" style={{ maxWidth: "560px", margin: "32px auto 0", background: "#fff", border: "1px solid var(--line)", borderRadius: "28px", padding: "34px", boxShadow: "0 30px 60px -35px rgba(0,0,0,.3)" }}>
              <div className={`reg-open ${regClock.live ? "live" : ""}`} style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}>
                <span className="ro-dot"></span>
                <span className="ro-text">{regClock.text}</span>
                <b className="ro-time">{regClock.time}</b>
              </div>

              {regSuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: "10px" }}>🎉</div>
                  <h3 style={{ fontSize: "22px", color: "var(--b0)", marginBottom: "6px" }}>You&apos;re on the Priority List!</h3>
                  <p style={{ color: "var(--mut)", fontSize: "15px", marginBottom: "18px" }}>
                    Thank you, <strong>{regForm.name}</strong>. We will WhatsApp / SMS you directly at <strong>{regForm.phone}</strong> when registrations go live on 20 Oct 2026.
                  </p>
                  <Link href="/exam/player?id=MFT-1.pdf" className="btn btn-blue btn-sm">
                    Start Practicing Free Mock (MFT-01) →
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleRegSubmit}>
                  <label className="sr" htmlFor="nm">Full name</label>
                  <input
                    id="nm"
                    required
                    placeholder="Full name (as per school ID)"
                    autoComplete="name"
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--r-xl)", border: "1.5px solid var(--line)", margin: "6px 0", fontSize: "16px", fontFamily: "inherit" }}
                  />
                  <label className="sr" htmlFor="ph">Mobile number</label>
                  <input
                    id="ph"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    inputMode="numeric"
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--r-xl)", border: "1.5px solid var(--line)", margin: "6px 0", fontSize: "16px", fontFamily: "inherit" }}
                  />
                  <label className="sr" htmlFor="cls">Appearing for</label>
                  <select
                    id="cls"
                    required
                    value={regForm.stream}
                    onChange={(e) => setRegForm({ ...regForm, stream: e.target.value })}
                    style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--r-xl)", border: "1.5px solid var(--line)", margin: "6px 0", fontSize: "16px", fontFamily: "inherit", background: "#fff" }}
                  >
                    <option value="">Appearing for…</option>
                    <option value="class-12">JEE Main 2027 (Class 12)</option>
                    <option value="dropper">JEE Main 2027 (Dropper)</option>
                    <option value="class-11">Class 11 (JEE 2028)</option>
                  </select>
                  <button className="btn btn-dark" style={{ width: "100%", marginTop: "10px" }} type="submit">
                    Notify me →
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 15. Final CTA */}
        <section style={{ paddingBottom: 0 }}>
          <div className="wrap">
            <div className="final">
              <h2>Take control. <em>Outrank yesterday.</em></h2>
              <p>Stop guessing where you stand. Start building rank with direction — ten free papers, one national stage.</p>
              <div className="row">
                <Link className="btn btn-lav" href={MFT_LINKS[1]}>Start Free →</Link>
                <Link className="btn btn-line" href={SCHOLARSHIP_LINK}>Join ₹27 Scholarship</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 16. Canonical Tokko Footer */}
      <Footer />

      {/* 17. Sticky CTA on Mobile */}
      <div className="sticky-cta">
        <a className="btn btn-dark" href="#mfts">Free mocks</a>
        <Link className="btn btn-blue" href={SCHOLARSHIP_LINK}>₹27 Scholarship</Link>
      </div>
    </>
  );
}
