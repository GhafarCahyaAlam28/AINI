import { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  X,
  QrCode as QrIcon,
  Sparkles,
  FileCode,
  Info,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { getStandaloneHtml } from '../standaloneHtml';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
}

export default function ShareModal({ isOpen, onClose, currentUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedStandalone, setCopiedStandalone] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'link' | 'html' | 'help'>('link');

  // If the URL has ais-dev, provide the shared URL alternative if known
  const isDevUrl = currentUrl.includes('ais-dev-');
  const sharedUrlCandidate = isDevUrl
    ? currentUrl.replace('ais-dev-', 'ais-pre-')
    : currentUrl;

  const [targetUrl, setTargetUrl] = useState(sharedUrlCandidate);

  useEffect(() => {
    setTargetUrl(sharedUrlCandidate);
  }, [sharedUrlCandidate]);

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(
      targetUrl,
      {
        width: 480,
        margin: 2,
        color: {
          dark: '#08111f',
          light: '#f4f1e8',
        },
        errorCorrectionLevel: 'H',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, type: 'url' | 'html') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'url') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2600);
      } else {
        setCopiedStandalone(true);
        setTimeout(() => setCopiedStandalone(false), 2600);
      }
    } catch {
      const input = document.createElement('textarea');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      if (type === 'url') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2600);
      } else {
        setCopiedStandalone(true);
        setTimeout(() => setCopiedStandalone(false), 2600);
      }
    }
  };

  const handleDownloadHtml = () => {
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

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;

    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 640;
    cardCanvas.height = 800;
    const ctx = cardCanvas.getContext('2d');
    if (!ctx) return;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 800);
    bgGrad.addColorStop(0, '#08111f');
    bgGrad.addColorStop(1, '#0f1d33');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 640, 800);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, 592, 752);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 3;
    const cornerSize = 16;
    ctx.beginPath();
    ctx.moveTo(20, 20 + cornerSize); ctx.lineTo(20, 20); ctx.lineTo(20 + cornerSize, 20); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(620 - cornerSize, 20); ctx.lineTo(620, 20); ctx.lineTo(620, 20 + cornerSize); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 780 - cornerSize); ctx.lineTo(20, 780); ctx.lineTo(20 + cornerSize, 780); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(620 - cornerSize, 780); ctx.lineTo(620, 780); ctx.lineTo(620, 780 - cornerSize); ctx.stroke();

    ctx.fillStyle = '#c8cfda';
    ctx.font = '500 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('LIGHT OF POLARIS', 320, 80);

    ctx.fillStyle = '#f4f1e8';
    ctx.font = '600 36px serif';
    ctx.fillText('For Aini', 320, 130);

    ctx.fillStyle = '#aeb8c7';
    ctx.font = 'italic 16px serif';
    ctx.fillText('“Ada beberapa hal yang lebih mudah kutulis daripada kuucapkan.”', 320, 175);

    const qrImg = new Image();
    qrImg.onload = () => {
      const qrBoxSize = 340;
      const qrBoxX = (640 - qrBoxSize) / 2;
      const qrBoxY = 220;

      ctx.fillStyle = '#f4f1e8';
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
      ctx.fill();

      ctx.drawImage(qrImg, qrBoxX + 20, qrBoxY + 20, qrBoxSize - 40, qrBoxSize - 40);

      ctx.fillStyle = '#08111f';
      ctx.beginPath();
      ctx.arc(320, qrBoxY + qrBoxSize / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f4f1e8';
      ctx.beginPath();
      ctx.arc(320, qrBoxY + qrBoxSize / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f4f1e8';
      ctx.font = '500 15px sans-serif';
      ctx.fillText('Scan dengan kamera ponsel untuk membaca surat', 320, 610);

      ctx.fillStyle = '#7c8ba1';
      ctx.font = '12px sans-serif';
      ctx.fillText('AELMAR SOL · 2026', 320, 720);

      const link = document.createElement('a');
      link.download = 'QR-For-Aini-Polaris.png';
      link.href = cardCanvas.toDataURL('image/png');
      link.click();
    };
    qrImg.src = qrDataUrl;
  };

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="share-modal-card"
        className="w-full max-w-xl bg-[#0e192c] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#f4f1e8] relative overflow-hidden font-sans-ui my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wider text-slate-300 uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            Akses & Bagikan Surat
          </div>
          <h2 className="text-2xl font-serif font-medium tracking-wide text-white">
            For Aini — Light of Polaris
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilih cara termudah agar Aini bisa langsung membaca tanpa ribet login
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'link'
                ? 'border-amber-300 text-amber-200 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrIcon className="w-3.5 h-3.5" />
            Link Web & QR Code
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'html'
                ? 'border-amber-300 text-amber-200 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            File HTML Mandiri (100% Bebas Login)
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1 ${
              activeTab === 'help'
                ? 'border-amber-300 text-amber-200 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Kenapa Login Google?
          </button>
        </div>

        {/* Tab 1: Link & QR */}
        {activeTab === 'link' && (
          <div className="space-y-5">
            {/* Explanatory banner */}
            {isDevUrl && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-amber-300 mt-0.5" />
                <div>
                  <strong className="text-amber-200 font-semibold block mb-0.5">
                    Catatan Penting URL:
                  </strong>
                  URL yang berawalan <code className="font-mono bg-black/30 px-1 py-0.5 rounded">ais-dev-</code> adalah editor pribadi Anda (perlu login Google). Gunakan link <code className="font-mono bg-black/30 px-1 py-0.5 rounded">ais-pre-</code> di bawah ini atau buka tombol <strong>Share</strong> di AI Studio agar Aini bisa langsung buka tanpa login!
                </div>
              </div>
            )}

            {/* QR Code Graphic */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-3 bg-[#f4f1e8] rounded-2xl shadow-xl relative group">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code For Aini"
                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain block"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-700 text-xs">
                    Membuat QR...
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-[#08111f] border-2 border-[#f4f1e8] flex items-center justify-center shadow-md">
                    <span className="text-amber-200 text-xs">✦</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Scan QR ini menggunakan kamera ponsel untuk langsung menampilkan surat
              </p>
            </div>

            {/* Link field */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Tautan yang akan diubah ke QR / dikirim:
              </label>
              <div className="flex items-center gap-2 bg-[#08111f] border border-white/15 rounded-xl p-2 pl-3">
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="bg-transparent text-xs text-slate-200 font-mono flex-1 outline-none truncate"
                  placeholder="https://..."
                />
                <button
                  id="btn-copy-target-url"
                  onClick={() => handleCopy(targetUrl, 'url')}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg transition shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Link
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                id="btn-download-qr-card-png"
                onClick={handleDownloadQR}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-sky-500/20 border border-white/25 hover:border-white/40 text-xs sm:text-sm font-medium text-white transition hover:bg-white/10"
              >
                <Download className="w-4 h-4 text-amber-200" />
                Unduh Kartu QR (PNG)
              </button>

              <button
                id="btn-download-html-from-link-tab"
                onClick={handleDownloadHtml}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs sm:text-sm font-medium text-white transition"
              >
                <FileCode className="w-4 h-4 text-emerald-300" />
                Unduh File HTML (.html)
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Standalone HTML (Zero login guaranteed) */}
        {activeTab === 'html' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
              <div className="flex items-center gap-2 font-semibold text-emerald-300 mb-1.5 text-sm">
                <ShieldCheck className="w-4 h-4" />
                Paling Mudah & 100% Tanpa Login Akun Apapun!
              </div>
              File HTML mandiri ini berisi seluruh isi surat, desain malam berbintang, dan bintang Polaris dalam satu file tunggal. 
              Aini tinggal mengklik file ini langsung dari WhatsApp, Telegram, Google Drive, atau browser — <strong>langsung terbuka seketika tanpa login sama sekali</strong>.
            </div>

            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Cara Menggunakannya:
              </h3>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 pl-1">
                <li>Klik tombol <strong>"Unduh File Surat (.html)"</strong> di bawah.</li>
                <li>Kirim file <code className="bg-black/30 px-1 py-0.5 rounded text-amber-200">For-Aini-Light-of-Polaris.html</code> ke Aini via WhatsApp / email / Drive.</li>
                <li>Atau upload file ini ke hosting gratis seperti <em>Netlify Drop</em> / <em>Vercel</em> / <em>GitHub Pages</em> untuk mendapatkan link permanen publik gratis selamanya.</li>
              </ol>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                id="btn-download-standalone-html"
                onClick={handleDownloadHtml}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-sm transition shadow-lg"
              >
                <Download className="w-4 h-4" />
                Unduh File Surat (.html)
              </button>

              <button
                id="btn-copy-standalone-html-code"
                onClick={() => handleCopy(getStandaloneHtml(), 'html')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs sm:text-sm font-medium text-white transition"
              >
                {copiedStandalone ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    Kode HTML Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Salin Semua Kode HTML
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Explanation */}
        {activeTab === 'help' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-300" />
                Siapa yang bisa membaca ini?
              </h3>
              <p>
                Surat ini dibuat khusus untuk <strong>Aini</strong> dari <strong>Alam</strong>. Siapapun yang memiliki tautan publik atau file surat ini dapat membacanya langsung di browser HP maupun komputer.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-300" />
                Kenapa tadi muncul perintah login Google?
              </h3>
              <p>
                Karena Anda sedang membuka link <strong>Development</strong> (<code className="font-mono bg-black/40 text-amber-200 px-1 rounded">ais-dev-...</code>). URL tersebut adalah ruang kerja editor AI Studio Anda pribadi yang diproteksi Google agar orang lain tidak bisa mengubah kode Anda.
              </p>
              <p className="text-slate-400">
                Untuk Aini, cukup gunakan link <strong>Shared App URL</strong> (<code className="font-mono bg-black/40 text-sky-200 px-1 rounded">ais-pre-...</code>) melalui tombol <strong>Share</strong> di kanan atas AI Studio, atau kirimkan <strong>File HTML Mandiri</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
