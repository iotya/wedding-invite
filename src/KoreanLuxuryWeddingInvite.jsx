import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CalendarDays, MapPin, Clock3, Mail, ChevronDown, Volume2, VolumeX } from "lucide-react";
import romanticPiano from "@assets/Romantic-Piano.mp3";

const localGalleryModules = import.meta.glob("@assets/IMG/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const galleryImages = Object.keys(localGalleryModules)
  .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
  .map((path) => localGalleryModules[path]);

const WEDDING = {
  groom: "嘉謙",
  bride: "譽繻",
  date: "2026-11-08T12:00:00+08:00",
  dateDisplay: "2026 年 11 月 08 日 星期日",
  timeDisplay: "中午 12:00",
  venue: "晶宴會館 峇里斯莊園(新莊館)",
  address: "242新北市新莊區思源路40號",
  mapsUrl: "https://maps.app.goo.gl/ikkRye8mTHwbputQ6",
  rsvpUrl: "https://docs.google.com/forms/d/1AqViFn5_ZRE0FdDQkILRo5m8C3pxuxQpMh4234PppWU",
  shareUrl: "https://iotya.github.io/wedding-invite",
  heroImage:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
  story1:
    "從相遇、相知，到決定攜手走向未來，",
  story2:
    "這一天對我們而言，是愛情最溫柔也最堅定的模樣。",
  story3:
    "誠摯邀請您，一同見證我們的重要時刻。",
  quote: "With joy in our hearts, we invite you to celebrate our wedding day.",
};

function formatRemaining(targetDate) {
  const diff = Math.max(0, targetDate.getTime() - new Date().getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.45em] text-stone-400">{eyebrow}</p>
      <h2 className="text-3xl font-light tracking-[0.12em] text-stone-800 md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-5 text-sm leading-7 text-stone-500 md:text-base">{subtitle}</p>}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full border border-stone-200 p-3 text-stone-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{label}</p>
      <p className="mt-3 text-base leading-7 text-stone-700">{value}</p>
    </div>
  );
}

function VenueCard({ label, venue, address, mapsUrl }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="mb-4 flex justify-center">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="查看地圖"
          className="rounded-full border border-stone-200 p-3 text-stone-600 transition hover:bg-stone-100"
        >
          <MapPin className="h-5 w-5" />
        </a>
      </div>
      <p className="text-xs uppercase tracking-[0.3em] text-stone-400">{label}</p>
      <p className="mt-3 text-base leading-7 text-stone-700">{venue}</p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block text-base leading-7 text-stone-700 underline decoration-stone-400 underline-offset-2 hover:text-stone-900"
      >
        {address}
      </a>
    </div>
  );
}

export default function KoreanLuxuryWeddingInvite() {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(() => formatRemaining(new Date(WEDDING.date)));
  const bgmRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining(formatRemaining(new Date(WEDDING.date)));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    audio.muted = muted;
    if (!opened) {
      return;
    }

    if (!muted) {
      const playPromise = audio.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [muted, opened]);

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);

    const audio = bgmRef.current;
    if (!audio || !opened) return;

    audio.muted = nextMuted;
    if (nextMuted) {
      audio.pause();
      return;
    }

    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  };

  const handleCopyInvite = async () => {
    const shareLink = WEDDING.shareUrl;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareLink;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // optional fallback if copy fails, ignore to avoid UI interruption
    }
  };

  const names = useMemo(() => `${WEDDING.groom}  &  ${WEDDING.bride}`, []);

  return (
    <div className="min-h-screen bg-[#f7f2ed] text-stone-800">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.88),rgba(247,242,237,0.95)_45%,rgba(239,231,223,1))]" />

      <AnimatePresence>
        {!opened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-50"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${WEDDING.heroImage})` }}
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.55))]" />

            <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="mb-5 text-xs uppercase tracking-[0.5em] text-white/80"
              >
                Wedding Invitation
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.9 }}
                className="text-4xl font-light tracking-[0.18em] md:text-6xl"
              >
                {names}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.9 }}
                className="mt-6 max-w-xl text-sm leading-7 text-white/85 md:text-base"
              >
                {WEDDING.quote}
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9 }}
                onClick={() => {
                  setOpened(true);
                  const audio = bgmRef.current;
                  if (audio && !muted) {
                    const playPromise = audio.play();
                    if (playPromise?.catch) {
                      playPromise.catch(() => {});
                    }
                  }
                }}
                className="mt-12 rounded-full border border-white/70 bg-white/10 px-8 py-3 text-sm tracking-[0.28em] text-white backdrop-blur transition hover:bg-white/20"
              >
                OPEN INVITATION
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={WEDDING.heroImage} alt="wedding cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,18,17,0.18),rgba(20,18,17,0.58))]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-8 md:px-10">
          <audio
            ref={bgmRef}
            src={romanticPiano}
            loop
            preload="auto"
            muted={muted}
            playsInline
          />
          <div className="flex items-center justify-between">
            <div className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs tracking-[0.35em] text-white backdrop-blur">
              INVITATION
            </div>
            <button
              onClick={handleToggleMute}
              className="rounded-full border border-white/30 bg-white/10 p-3 text-white backdrop-blur"
              aria-label="toggle music"
              title="可替換成背景音樂控制"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl text-center text-white"
            >
              <p className="mb-4 text-xs uppercase tracking-[0.55em] text-white/80">Save the Date</p>
              <h1 className="text-4xl font-light leading-tight tracking-[0.18em] md:text-7xl">{names}</h1>
              <div className="mx-auto mt-8 h-px w-24 bg-white/60" />
              <p className="mt-8 text-sm leading-8 text-white/85 md:text-lg">{WEDDING.story1}</p>
              <p className="mt-8 text-sm leading-8 text-white/85 md:text-lg">{WEDDING.story2}</p>
              <p className="mt-8 text-sm leading-8 text-white/85 md:text-lg">{WEDDING.story3}</p>
              <p className="mt-8 text-sm tracking-[0.3em] text-white/90 md:text-base">{WEDDING.dateDisplay}</p>
              <a
                href={WEDDING.rsvpUrl}
                target="_blank"
                rel="noreferrer"
                className="mx-auto mt-8 inline-block rounded-full border border-white/30 bg-white/70 px-8 py-4 text-sm tracking-[0.24em] text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white/85"
              >
                回覆出席
              </a>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <ChevronDown className="h-8 w-8 animate-bounce text-white/80" />
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <SectionTitle eyebrow="Our Day" title="誠摯邀請您蒞臨" subtitle="願我們生命中重要的這一頁，也有您的笑容與祝福，一起見證這份溫柔而堅定的承諾。" />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <InfoCard icon={CalendarDays} label="Date" value={WEDDING.dateDisplay} />
            <InfoCard icon={Clock3} label="Time" value={WEDDING.timeDisplay} />
            <VenueCard label="Venue" venue={WEDDING.venue} address={WEDDING.address} mapsUrl={WEDDING.mapsUrl} />
          </div>

        </section>

        <section className="px-6 py-10 md:px-10">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/70 bg-white/60 p-8 shadow-[0_15px_60px_rgba(0,0,0,0.06)] backdrop-blur md:p-12">
            <SectionTitle eyebrow="Countdown" title="婚禮倒數" subtitle="期待與您共享這個值得珍藏的日子。" />
            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
              {[
                [remaining.days, "Days"],
                [remaining.hours, "Hours"],
                [remaining.minutes, "Minutes"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-stone-200/80 bg-[#fcfaf8] px-4 py-8 text-center">
                  <div className="text-3xl font-light tracking-[0.12em] text-stone-800 md:text-5xl">{String(value).padStart(2, "0")}</div>
                  <div className="mt-3 text-xs uppercase tracking-[0.35em] text-stone-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
          <SectionTitle eyebrow="Gallery" title="欣賞相簿" subtitle="謝謝您陪我們走到這一天 ❤️" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {galleryImages.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
                className="overflow-hidden rounded-[2rem] border border-white/70 bg-white p-3 shadow-[0_15px_50px_rgba(0,0,0,0.06)]"
              >
                <img src={src} alt={`gallery-${index + 1}`} className="h-[430px] w-full rounded-[1.5rem] object-cover" />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-24 md:px-10">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-stone-200 bg-[linear-gradient(180deg,#fffdfb_0%,#f8f2ec_100%)] px-8 py-14 text-center shadow-[0_15px_60px_rgba(0,0,0,0.05)] md:px-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-stone-300 text-stone-600">
              <Heart className="h-5 w-5" />
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.45em] text-stone-400">Blessing</p>
            <h3 className="mt-4 text-2xl font-light tracking-[0.12em] text-stone-800 md:text-4xl">期待與您相見</h3>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-stone-600 md:text-base">
              您的蒞臨與祝福，將成為我們婚禮最珍貴的光。若您願意，歡迎點擊下方按鈕回覆出席，讓我們能更妥善地安排當日席次與接待。
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
              <a
                href={WEDDING.rsvpUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-stone-900 px-8 py-4 text-sm tracking-[0.24em] text-white transition hover:-translate-y-0.5"
              >
                立即回覆出席
              </a>
              <button
                onClick={handleCopyInvite}
                className="rounded-full border border-stone-300 bg-white px-8 py-4 text-sm tracking-[0.24em] text-stone-800 transition hover:-translate-y-0.5"
                type="button"
              >
                {copied ? "已複製連結" : "複製分享連結"}
              </button>
            </div>

            <div className="mt-10 text-sm leading-8 text-stone-500">
              <p>{WEDDING.groom} & {WEDDING.bride}</p>
              <p>{WEDDING.dateDisplay}</p>
              <p className="mt-3 inline-flex items-center gap-2"><Mail className="h-4 w-4" /> ---</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
