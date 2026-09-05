import { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  QrCode as QrIcon,
  Copy,
  Check,
  Download,
  Share2,
  Compass,
  FileCode
} from 'lucide-react';
import StarSky from './components/StarSky';
import ShareModal from './components/ShareModal';
import { celestialAudio } from './audio';
import { getStandaloneHtml } from './standaloneHtml';

export default function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Current URL (prefer shared URL if currently in ais-dev)
    const current = window.location.href;
    const publicUrl = current.includes('ais-dev-')
      ? current.replace('ais-dev-', 'ais-pre-')
      : current;
    setShareUrl(publicUrl);
  }, []);

  const toggleMusic = () => {
    const playing = celestialAudio.toggle();
    setIsMusicPlaying(playing);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2400);
    } catch {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2400);
    }
  };

  const handleDownloadStandaloneHtml = () => {
    const htmlContent = getStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'For-Aini-Light-of-Polaris.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-amber-200 selection:text-slate-900 flex flex-col justify-between">
      {/* Background Star Canvas */}
      <StarSky />

      {/* Layered CSS Star Drift */}
      <div className="stars-layer-1 fixed inset-0 pointer-events-none z-0 opacity-40" />
      <div className="stars-layer-2 fixed inset-0 pointer-events-none z-0 opacity-30" />

      {/* Radial Atmospheric Night Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_15%,rgba(180,210,255,0.08),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(140,170,230,0.05),transparent_45%)]" />

      {/* Subtle top floating bar */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between px-4 sm:px-8 py-3 bg-[#08111f]/60 backdrop-blur-md border-b border-white/10 font-sans-ui text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Compass className="w-4 h-4 text-amber-200/80 animate-spin-slow" />
          <span className="tracking-widest uppercase text-[11px] font-medium text-slate-300">
            For Aini · Light of Polaris
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Music Toggle */}
          <button
            id="btn-toggle-music"
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition text-xs ${
              isMusicPlaying
                ? 'bg-amber-400/20 border-amber-300/40 text-amber-200'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title={isMusicPlaying ? 'Matikan Suara Ambien' : 'Putar Musik Langit Malam'}
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                <span className="hidden sm:inline">Ambien Aktif</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Suara Ambien</span>
              </>
            )}
          </button>

          {/* QR Code & Share Button */}
          <button
            id="btn-open-qr-modal"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-white/20 hover:border-white/40 text-white font-medium transition shadow-sm"
            title="Lihat Link & Buat QR Code"
          >
            <QrIcon className="w-3.5 h-3.5 text-amber-200" />
            <span>QR & Link</span>
          </button>
        </div>
      </header>

      {/* Main Letter Content: Immediately displayed upon opening */}
      <main className="relative z-10 w-full max-w-[740px] mx-auto px-4 sm:px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <section
          id="letter-card"
          className="relative rounded-3xl sm:rounded-[28px] border border-white/12 p-7 sm:p-12 md:p-14 backdrop-blur-md shadow-[0_20px_70px_rgba(0,0,0,0.45)] bg-gradient-to-b from-white/[0.045] to-white/[0.025]"
        >
          {/* Eyebrow */}
          <div
            id="letter-eyebrow"
            className="text-center text-[0.72rem] tracking-[0.28em] uppercase text-[#c8cfda] mb-3 font-sans-ui select-none"
          >
            Light of Polaris
          </div>

          {/* Title */}
          <h1
            id="letter-title"
            className="text-center text-4xl sm:text-5xl md:text-6xl font-serif font-medium tracking-[0.02em] text-[#f4f1e8] m-0"
          >
            For Aini
          </h1>

          {/* Polaris Star Emblem */}
          <div
            id="polaris-star"
            className="w-4 h-4 mx-auto my-6 relative flex items-center justify-center animate-pulse-glow"
            aria-hidden="true"
          >
            <div className="absolute w-[2px] h-7 bg-white shadow-[0_0_12px_#ffffff]" />
            <div className="absolute h-[2px] w-7 bg-white shadow-[0_0_12px_#ffffff]" />
            <div className="w-1.5 h-1.5 bg-white rotate-45" />
          </div>

          {/* Intro Quote */}
          <p
            id="letter-intro"
            className="text-center text-[#c8cfda] italic text-base sm:text-lg leading-relaxed mx-auto mb-8 max-w-[540px]"
          >
            “Ada beberapa hal yang lebih mudah kutulis daripada kuucapkan.”
          </p>

          {/* Letter Body */}
          <article
            id="letter-content"
            className="border-t border-white/12 pt-8 text-[#f4f1e8] text-[1.08rem] sm:text-[1.14rem] leading-[1.95] sm:leading-[2.05] space-y-6"
          >
            <p>
              <strong className="text-white font-semibold text-lg">Untuk Aini,</strong>
            </p>

            <p>
              Aku sempat berpikir cukup lama tentang apa yang harus kutulis di sini.
              Ternyata tetap saja aku tidak pandai merangkai kata kalau orang yang kutuju adalah kamu.
            </p>

            <p>
              Jadi, anggap saja ini bukan sekadar kado.
              Ini sedikit bagian dariku yang ingin kutinggalkan bersamamu.
            </p>

            <p>
              Terima kasih sudah hadir di bagian hidupku yang awalnya kukira akan berjalan biasa saja.
              Terima kasih untuk obrolan-obrolan kecil, waktu yang kamu luangkan, dan semua hal sederhana
              yang mungkin tidak pernah kamu sadari ternyata kusimpan baik-baik.
            </p>

            <p>
              Aku tidak tahu setelah ini hidup akan membawa kita sejauh apa.
              Aku juga tidak tahu apakah suatu hari kita akan berada di tempat yang sama,
              atau justru melihat langit dari kota yang berbeda.
            </p>

            <p>
              Tapi kalau suatu malam kamu melihat ke atas dan menemukan satu cahaya yang tetap ada di sana,
              aku harap kamu ingat bahwa pernah ada seseorang yang sangat bersyukur karena sempat mengenalmu.
            </p>

            <p>
              Tidak perlu menjanjikan apa-apa kepadaku.
              Tetaplah menjadi Aini yang kukenal.
            </p>

            <p>Jaga dirimu baik-baik.</p>

            <p
              id="letter-signature"
              className="mt-8 text-right italic font-serif text-lg text-[#f4f1e8]/95"
            >
              — Alam
            </p>
          </article>

          {/* Footer */}
          <div
            id="letter-footer"
            className="text-center mt-12 pt-6 border-t border-white/5 text-[#aeb8c7] text-xs tracking-[0.15em] font-sans-ui select-none flex items-center justify-center gap-2"
          >
            <span>AELMAR SOL</span>
            <span>·</span>
            <span>2026</span>
          </div>
        </section>

        {/* Quick sender options */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-sans-ui text-slate-400">
          <button
            id="btn-footer-open-qr"
            onClick={() => setIsShareModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
          >
            <QrIcon className="w-3.5 h-3.5 text-amber-200" />
            Ubah ke QR Code
          </button>

          <button
            id="btn-footer-download-html"
            onClick={handleDownloadStandaloneHtml}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
            title="Unduh 1 file HTML surat yang bisa dibuka siapapun tanpa login"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-300" />
            Unduh File Surat (.html)
          </button>

          <button
            id="btn-footer-copy-link"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
          >
            <Copy className="w-3.5 h-3.5 text-slate-300" />
            {isCopied ? 'Link Publik Tersalin!' : 'Salin Link'}
          </button>
        </div>
      </main>

      {/* Share & QR Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentUrl={shareUrl}
      />
    </div>
  );
}
