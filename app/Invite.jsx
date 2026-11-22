"use client";

import { useEffect, useRef, useState } from "react";
import { COUPLE, WEDDING, EVENTS, RECEPTION, STORY, PRELOAD } from "./data";
import Scene from "./Scene";

const rand = (a, b) => a + Math.random() * (b - a);

function spawn(make, count, life) {
  const layer = document.createElement("div");
  layer.className = "fx";
  for (let i = 0; i < count; i++) layer.appendChild(make(i));
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), life);
}

function petalRain(count = 26) {
  spawn(() => {
    const p = document.createElement("img");
    p.src = "/petal.svg";
    p.className = "petal";
    p.style.cssText = `left:${rand(-5, 100)}vw;width:${rand(12, 22)}px;--x:${rand(-25, 25)}vw;--r:${rand(240, 720)}deg;animation-duration:${rand(4.5, 7.5)}s;animation-delay:${rand(0, 1.8)}s`;
    return p;
  }, count, 9800);
}

function burst(el) {
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const colors = ["#d4a94f", "#f0d48a", "#6e1f2f", "#e8798c", "#fff3d6"];
  spawn((i) => {
    const petal = i % 3 === 0;
    const c = document.createElement(petal ? "img" : "span");
    if (petal) c.src = "/petal.svg";
    const a = rand(0, Math.PI * 2);
    const d = rand(90, 220);
    c.className = "confetti";
    c.style.cssText = `left:${cx}px;top:${cy}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + 120}px;--r:${rand(-540, 540)}deg;background:${petal ? "none" : colors[i % colors.length]};width:${petal ? 16 : 7}px;height:${petal ? 20 : 11}px`;
    return c;
  }, 54, 2200);
}

function Typed({ text, start, step = 0.065 }) {
  let n = 0;
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="word" aria-hidden>
          {w > 0 && " "}
          {[...word].map((ch, i) => (
            <span key={i} className="ch" style={{ "--d": `${start + n++ * step}s` }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function Carousel({ items, render, dots, label }) {
  const n = items.length;
  const list = n < 5 ? [...items, ...items] : items;
  const m = list.length;
  const [i, setI] = useState(0);
  const drag = useRef(null);
  const go = (dir) => setI((v) => (v + dir + m) % m);

  return (
    <div className="carwrap">
      <div
        className="car"
        aria-label={label}
        onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
        onPointerMove={(e) => drag.current && Math.abs(e.clientX - drag.current.x) > 8 && (drag.current.moved = true)}
        onPointerUp={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 35) go(dx < 0 ? 1 : -1);
          setTimeout(() => (drag.current = null));
        }}
        onPointerCancel={() => (drag.current = null)}
      >
        {list.map((it, k) => {
          let d = (((k - i) % m) + m) % m;
          if (d > m / 2) d -= m;
          const ad = Math.abs(d);
          return (
            <div
              key={k}
              className={`slide${d === 0 ? " cur" : " side"}`}
              style={{
                transform: `translateX(${d * 66}%) translateZ(${-ad * 150}px) rotateY(${-d * 32}deg)`,
                opacity: ad > 1 ? 0 : 1,
                zIndex: 10 - ad,
                pointerEvents: ad > 1 ? "none" : "auto",
              }}
              onClick={() => !drag.current?.moved && d !== 0 && go(d)}
            >
              {render(it, d === 0)}
            </div>
          );
        })}
      </div>
      {dots && (
        <div className="dots">
          {items.map((_, k) => (
            <button key={k} aria-label={`Photo ${k + 1}`} className={i % n === k ? "on" : ""} onClick={() => setI(k)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <p className="count">&nbsp;</p>;
  const ms = Math.max(0, new Date(WEDDING.iso).getTime() - now);
  if (!ms) return <p className="count">The celebrations have begun ✨</p>;
  const s = Math.floor(ms / 1000);
  const parts = [
    [Math.floor(s / 86400), "days"],
    [Math.floor((s % 86400) / 3600), "hrs"],
    [Math.floor((s % 3600) / 60), "min"],
    [s % 60, "sec"],
  ];
  return (
    <p className="count">
      {parts.map(([v, l], k) => (
        <span key={l}>
          {k > 0 && <i> · </i>}
          <b>{String(v).padStart(2, "0")}</b> {l}
        </span>
      ))}
    </p>
  );
}

function SaveTheDate() {
  const [p, setP] = useState(0);
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const paper = useRef(null);
  const H = 360;

  const finish = () => {
    setDragging(false);
    setP(1);
    if (!open) {
      setOpen(true);
      setTimeout(() => paper.current && burst(paper.current), 650);
    }
  };

  return (
    <section className="std" data-io>
      <h2 className="bi">Save the Date</h2>
      <div className="scroll" style={{ "--p": p }}>
        <div className="rod" />
        <div ref={paper} className={`paper${dragging ? "" : " ease"}`} style={{ height: p * H }}>
          <div className="paperIn" style={{ height: H }}>
            <img src="/rose.svg" alt="" className="rc tl" />
            <img src="/rose.svg" alt="" className="rc tr" />
            <img src="/rose.svg" alt="" className="rc bl" />
            <img src="/rose.svg" alt="" className="rc br" />
            <img src="/ganesh.svg" alt="" className="pg" />
            <p className="small">{WEDDING.day}</p>
            <p className="bigdate">
              26 <span>·</span> 11 <span>·</span> 2026
            </p>
            <p className="small">{WEDDING.time}</p>
            <p className="venueline">{WEDDING.venue}</p>
          </div>
        </div>
        <div className="roll" />
        {!open && (
          <button
            className="tassel"
            aria-label="Pull to reveal the date"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = { y: e.clientY, p, moved: false };
              setDragging(true);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              const dy = e.clientY - drag.current.y;
              if (Math.abs(dy) > 6) drag.current.moved = true;
              setP(Math.min(1, Math.max(0, drag.current.p + dy / H)));
            }}
            onPointerUp={() => {
              const d = drag.current;
              drag.current = null;
              if (!d) return;
              if (!d.moved || p > 0.3) finish();
              else {
                setDragging(false);
                setP(0);
              }
            }}
            onPointerCancel={() => {
              drag.current = null;
              setDragging(false);
              setP(0);
            }}
          >
            <span className="cord" />
            <span className="knot" />
            <span className="fringe" />
            {p === 0 && <span className="finger">👆</span>}
          </button>
        )}
      </div>
      {!open && <p className="hint bi">Pull the tassel</p>}
      <div className={`afterdate${open ? " show" : ""}`}>
        <Countdown />
        <a className="btn" href={WEDDING.calendar} target="_blank" rel="noreferrer">
          Add to calendar
        </a>
      </div>
    </section>
  );
}

function MapCard({ place = WEDDING }) {
  return (
    <a className="mapcard bi" href={place.maps} target="_blank" rel="noreferrer" aria-label={`Open ${place.venue} in Google Maps`}>
      <svg viewBox="0 0 320 200" aria-hidden>
        <rect width="320" height="200" fill="#f5ead9" />
        <path d="M0 150 C80 120 120 180 200 150 S300 110 320 130 V200 H0Z" fill="#cfe2e4" />
        <g stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M-10 60 H330" />
          <path d="M90 -10 V210" />
          <path d="M-10 120 C80 110 200 100 330 70" />
          <path d="M230 -10 L200 210" />
        </g>
        <g fill="#e9dcc4">
          <rect x="20" y="10" width="55" height="38" rx="4" />
          <rect x="105" y="10" width="70" height="38" rx="4" />
          <rect x="240" y="10" width="60" height="45" rx="4" />
          <rect x="105" y="72" width="40" height="30" rx="4" />
          <rect x="20" y="72" width="55" height="35" rx="4" />
        </g>
        <path className="route" d="M30 180 C60 140 60 120 90 118 S150 70 220 64" fill="none" stroke="#6e1f2f" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" />
        <circle cx="30" cy="180" r="6" fill="#d4a94f" />
        <g className="pin">
          <path d="M220 64 c-14 -16 -18 -24 -18 -32 a18 18 0 0 1 36 0 c0 8 -4 16 -18 32z" fill="#6e1f2f" />
          <circle cx="220" cy="32" r="7" fill="#f0d48a" />
        </g>
        <ellipse className="pinshadow" cx="220" cy="66" rx="8" ry="3" fill="#000" opacity=".2" />
      </svg>
      <span className="maptag">
        <b>{place.venue}</b> · tap to open map
      </span>
    </a>
  );
}

export default function Invite() {
  const [loaded, setLoaded] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState("");
  const audio = useRef(null);
  const songUrl = useRef("/song.m4a");
  const total = PRELOAD.length + 2;

  useEffect(() => {
    let done = 0;
    let alive = true;
    const tick = () => alive && setLoaded(++done);
    const images = PRELOAD.map(
      (src) =>
        new Promise((res) => {
          const im = new Image();
          im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(res);
          im.onerror = res;
          im.src = src;
        }).then(tick)
    );
    const song = fetch("/song.m4a")
      .then((r) => r.blob())
      .then((b) => (songUrl.current = URL.createObjectURL(b)))
      .catch(() => {})
      .then(tick);
    const fonts = document.fonts.ready.then(tick);
    const cap = new Promise((res) => setTimeout(res, 15000));
    Promise.race([Promise.all([...images, song, fonts]), cap]).then(() => alive && setPhase((v) => (v === "loading" ? "ready" : v)));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === "open" ? "" : "hidden";
    if (phase !== "open") return;

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          e.target.classList.toggle("off", !e.isIntersecting);
          if (e.isIntersecting) e.target.classList.add("in");
        }),
      { rootMargin: "0px 0px -12% 0px" }
    );
    document.querySelectorAll("[data-io]").forEach((el) => io.observe(el));

    const root = document.documentElement;
    let lastY = window.scrollY;
    let raf = 0;
    let settle = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const v = Math.max(-14, Math.min(14, (y - lastY) * 0.35));
        lastY = y;
        root.style.setProperty("--sy", y.toFixed(0));
        root.style.setProperty("--sv", v.toFixed(2));
        clearTimeout(settle);
        settle = setTimeout(() => root.style.setProperty("--sv", "0"), 120);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onHide = () => document.hidden && audio.current && !audio.current.paused && audio.current.pause();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [phase]);

  const startMusic = () => {
    const a = new Audio(songUrl.current);
    a.loop = true;
    audio.current = a;
    a.onplay = () => setPlaying(true);
    a.onpause = () => setPlaying(false);
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      ctx.createMediaElementSource(a).connect(gain).connect(ctx.destination);
      gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 4);
      a.onplaying = () => ctx.state === "suspended" && ctx.resume();
    } catch {
      a.volume = 0.6;
    }
    a.play().catch(() => {});
  };

  const openBook = () => {
    if (phase !== "ready") return;
    setPhase("opening");
    startMusic();
    setTimeout(() => setPhase("zoom"), 1500);
    setTimeout(() => {
      setPhase("open");
      window.scrollTo(0, 0);
      petalRain();
    }, 2500);
  };

  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    a.paused ? a.play().catch(() => {}) : a.pause();
  };

  const copyAddress = async () => {
    const text = `${WEDDING.address}\n${WEDDING.maps}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setToast("Address copied");
    setTimeout(() => setToast(""), 1800);
  };

  const pct = Math.round((loaded / total) * 100);
  const isOpen = phase === "open";

  return (
    <>
      {!isOpen && (
        <div className={`stage ${phase}`} onClick={openBook}>
          <img src="/rose.svg" alt="" className="srose back b1" />
          <img src="/rose.svg" alt="" className="srose back b2" />
          <img src="/rose.svg" alt="" className="srose back b3" />
          <div className="bookwrap">
            <div className="book">
              <div className="inside">
                <img src="/ganesh.svg" alt="" />
                <span>Shubh Vivah</span>
              </div>
              <div className="cover">
                <div className="coverFace">
                  <img src="/ganesh.svg" alt="Ganesh ji" className="emblem" />
                  <p className="covnames">
                    Sai Dheekshit
                    <br />
                    <span>&amp;</span>
                    <br />
                    tejasvi
                  </p>
                  <p className="covdate">26 · 11 · 2026</p>
                </div>
                <div className="coverBack" />
              </div>
            </div>
          </div>
          <img src="/rose.svg" alt="" className="srose front f1" />
          <img src="/rose.svg" alt="" className="srose front f2" />
          <div className="loader">
            {phase === "loading" ? (
              <>
                <div className="bar">
                  <i style={{ width: `${pct}%` }} />
                </div>
                <p>Preparing your invitation… {pct}%</p>
              </>
            ) : (
              phase === "ready" && <p className="tap">Tap the book to open</p>
            )}
          </div>
        </div>
      )}

      <div className={`decor${isOpen ? " bloom" : ""}`} aria-hidden>
        <div className="cr c1"><img src="/rose.svg" alt="" /></div>
        <div className="cr c2"><img src="/rose.svg" alt="" /></div>
        <div className="cr c3"><img src="/rose.svg" alt="" /></div>
        <div className="cr c4"><img src="/rose.svg" alt="" /></div>
        <div className="cr e1"><img src="/rose.svg" alt="" /></div>
        <div className="cr e2"><img src="/rose.svg" alt="" /></div>
      </div>

      <main className={isOpen ? "live" : "hidden"}>
        <div className="garland" aria-hidden>
          {[0, 1, 2, 3, 4, 5, 6].map((k) => (
            <div key={k} className="mg" style={{ left: `${4 + k * 15}%`, "--len": `${[70, 110, 85, 125, 85, 110, 70][k]}px`, "--k": k }}>
              <img src="/marigold.svg" alt="" />
            </div>
          ))}
        </div>

        <section className={`hero${isOpen ? " in" : ""}`}>
          <div className="arch">
            <img src="/photos/1-blur.jpg" alt="" className="archbg" />
            <div className="archveil" />
            <div className="heroin">
              <img src="/ganesh.svg" alt="Ganesh ji" className="medal bi" style={{ "--d": ".1s" }} />
              <p className="tel bi" style={{ "--d": ".35s" }}>శ్రీ గణేశాయ నమః</p>
              <p className="small bi" style={{ "--d": ".6s" }}>Together with their families</p>
              <h1 className="name">
                <Typed text={COUPLE.groom} start={1.0} />
              </h1>
              <p className="of bi" style={{ "--d": "2.4s" }}>Son of {COUPLE.groomParents}</p>
              <p className="amp bi" style={{ "--d": "2.8s" }}>&amp;</p>
              <h1 className="name">
                <Typed text={COUPLE.bride} start={3.0} />
              </h1>
              <p className="of bi" style={{ "--d": "4.0s" }}>Daughter of {COUPLE.brideParents}</p>
              <p className="inviteline bi" style={{ "--d": "4.5s" }}>
                request the pleasure of your company
                <br />
                as they begin their forever
              </p>
              <div className="arrow bi" style={{ "--d": "5.1s" }} aria-hidden>
                <span />
              </div>
            </div>
          </div>
        </section>

        <SaveTheDate />

        <section data-io>
          <h2 className="bi">Wedding Festivities</h2>
          <p className="sub bi">Swipe to see every celebration</p>
          <div className="bi">
            <Carousel
              label="Wedding festivities"
              items={EVENTS}
              render={(e) => (
                <article className="ecard">
                  <Scene kind={e.key} />
                  <div className="ebody">
                    <span className="eicon">{e.icon}</span>
                    <h3>{e.name}</h3>
                    <p className="eday">
                      {e.day} · {e.date}
                    </p>
                    {e.time && <p className="erow">🕘 {e.time}</p>}
                    {e.place && <p className="erow">📍 {e.place}</p>}
                    {e.dress && (
                      <p className="erow dress">
                        <i style={{ background: e.swatch }} /> Dress code · {e.dress}
                      </p>
                    )}
                  </div>
                </article>
              )}
            />
          </div>
        </section>

        <section data-io>
          <h2 className="bi">Our Story</h2>
          <p className="sub bi">Moments from our engagement</p>
          <div className="bi">
            <Carousel
              label="Our story photos"
              dots
              items={STORY}
              render={(s) => (
                <figure className="photo">
                  <img src={s.src} alt={s.caption} draggable={false} />
                  <figcaption>{s.caption}</figcaption>
                </figure>
              )}
            />
          </div>
        </section>

        <section data-io>
          <div className="reception bi">
            <img src="/rose.svg" alt="" className="bloomflower bf1" />
            <img src="/rose.svg" alt="" className="bloomflower bf2" />
            {Array.from({ length: 14 }, (_, k) => (
              <i key={k} className="spark" style={{ left: `${(k * 37) % 92 + 4}%`, top: `${(k * 53) % 86 + 6}%`, animationDelay: `${(k % 7) * 0.4}s` }} />
            ))}
            <p className="small gold">You are cordially invited to the</p>
            <h2>Grand Reception</h2>
            <p className="rdate">
              {RECEPTION.day}, {RECEPTION.date}
            </p>
            <p className="rtime">{RECEPTION.time} onwards</p>
            <p className="rtime">{RECEPTION.venue}, Mallapur</p>
          </div>
        </section>

        <section data-io>
          <h2 className="bi">Location</h2>
          <h3 className="maptitle bi">Wedding Venue</h3>
          <p className="sub bi">{WEDDING.date} · {WEDDING.venue}</p>
          <MapCard />
          <div className="btns bi">
            <a className="btn" href={WEDDING.directions} target="_blank" rel="noreferrer">
              Get directions
            </a>
            <button className="btn ghost" onClick={copyAddress}>
              Copy address
            </button>
          </div>
          <h3 className="maptitle second bi">Reception Venue</h3>
          <p className="sub bi">{RECEPTION.date} · {RECEPTION.venue}</p>
          <MapCard place={RECEPTION} />
          <div className="btns bi">
            <a className="btn" href={RECEPTION.directions} target="_blank" rel="noreferrer">
              Get directions
            </a>
          </div>
        </section>

        <section className="closing" data-io>
          <img src="/ganesh.svg" alt="Ganesh ji" className="medal bi" />
          <h2 className="bi">We can't wait to celebrate with you</h2>
          <p className="withlove bi">With love</p>
          <p className="fam bi">
            {COUPLE.groomParents}
            <br />
            <span>&amp;</span>
            <br />
            {COUPLE.brideParents}
          </p>
          <p className="couple bi">{COUPLE.short}</p>
          <p className="madeby">Made with ♥ by Bharat</p>
        </section>
      </main>

      {isOpen && (
        <button className="music" onClick={toggleMusic} aria-label={playing ? "Pause music" : "Play music"}>
          {playing ? (
            <span className="eq">
              <i />
              <i />
              <i />
            </span>
          ) : (
            "♪"
          )}
        </button>
      )}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
