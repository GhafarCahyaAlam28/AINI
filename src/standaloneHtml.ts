/**
 * Template for standalone, zero-login, pure HTML letter.
 * Anyone opening this file will see the text directly without any Google account login.
 */
export function getStandaloneHtml(): string {
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>For Aini — Light of Polaris</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #08111f;
      --bg2: #0f1d33;
      --text: #f4f1e8;
      --muted: #c8cfda;
      --line: rgba(255, 255, 255, 0.12);
      --glow: rgba(255, 255, 255, 0.5);
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background:
        radial-gradient(circle at 50% 15%, rgba(180, 210, 255, 0.09), transparent 45%),
        radial-gradient(circle at 80% 80%, rgba(140, 170, 230, 0.05), transparent 45%),
        linear-gradient(180deg, var(--bg), var(--bg2));
      color: var(--text);
      font-family: 'Cormorant Garamond', Georgia, serif;
      min-height: 100%;
    }
    body { overflow-x: hidden; }
    .stars, .stars:before, .stars:after {
      position: fixed;
      inset: 0;
      content: "";
      pointer-events: none;
      background-image:
        radial-gradient(circle, rgba(255, 255, 255, 0.85) 0 1px, transparent 1.2px),
        radial-gradient(circle, rgba(220, 235, 255, 0.45) 0 1px, transparent 1.2px);
      background-size: 130px 130px, 210px 210px;
      background-position: 15px 40px, 80px 20px;
      opacity: 0.4;
      animation: drift 35s linear infinite;
    }
    .stars:before { transform: scale(1.3); opacity: 0.2; animation-duration: 50s; }
    .stars:after { transform: scale(0.8); opacity: 0.3; animation-duration: 65s; }
    @keyframes drift {
      from { background-position: 15px 40px, 80px 20px; }
      to { background-position: 145px 170px, 290px 230px; }
    }
    .wrap {
      width: min(760px, 92%);
      margin: 0 auto;
      padding: 56px 0 64px;
      position: relative;
      z-index: 2;
    }
    .card {
      backdrop-filter: blur(10px);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.025));
      border: 1px solid var(--line);
      border-radius: 28px;
      padding: 48px 36px 42px;
      box-shadow: 0 20px 70px rgba(0, 0, 0, 0.45);
    }
    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.28em;
      font-size: 0.72rem;
      color: var(--muted);
      text-align: center;
      margin-bottom: 18px;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    h1 {
      text-align: center;
      font-size: clamp(2.6rem, 7vw, 4.4rem);
      margin: 0;
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    .polaris {
      width: 14px;
      height: 14px;
      margin: 22px auto 26px;
      position: relative;
      filter: drop-shadow(0 0 10px var(--glow));
    }
    .polaris:before, .polaris:after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      background: white;
      transform: translate(-50%, -50%);
    }
    .polaris:before { width: 2px; height: 30px; }
    .polaris:after { width: 30px; height: 2px; }
    .intro {
      text-align: center;
      color: var(--muted);
      font-style: italic;
      font-size: 1.15rem;
      line-height: 1.7;
      margin: 0 auto 36px;
      max-width: 520px;
    }
    .letter {
      border-top: 1px solid var(--line);
      padding-top: 32px;
      font-size: 1.15rem;
      line-height: 2.05;
    }
    .letter p { margin: 0 0 1.4em; }
    .letter strong { font-size: 1.25rem; font-weight: 600; color: #fff; }
    .sign {
      margin-top: 32px;
      text-align: right;
      font-style: italic;
      font-size: 1.2rem;
    }
    .footer {
      text-align: center;
      margin-top: 36px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      color: #aeb8c7;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    @media (max-width: 540px) {
      .wrap { padding: 24px 0 40px; }
      .card { padding: 32px 20px 30px; border-radius: 20px; }
      .letter { font-size: 1.05rem; line-height: 1.9; }
    }
  </style>
</head>
<body>
  <div class="stars"></div>
  <main class="wrap">
    <section class="card">
      <div class="eyebrow">Light of Polaris</div>
      <h1>For Aini</h1>
      <div class="polaris" aria-hidden="true"></div>
      <p class="intro">“Ada beberapa hal yang lebih mudah kutulis daripada kuucapkan.”</p>

      <article class="letter">
        <p><strong>Untuk Aini,</strong></p>

        <p>Aku sempat berpikir cukup lama tentang apa yang harus kutulis di sini.
        Ternyata tetap saja aku tidak pandai merangkai kata kalau orang yang kutuju adalah kamu.</p>

        <p>Jadi, anggap saja ini bukan sekadar kado.
        Ini sedikit bagian dariku yang ingin kutinggalkan bersamamu.</p>

        <p>Terima kasih sudah hadir di bagian hidupku yang awalnya kukira akan berjalan biasa saja.
        Terima kasih untuk obrolan-obrolan kecil, waktu yang kamu luangkan, dan semua hal sederhana
        yang mungkin tidak pernah kamu sadari ternyata kusimpan baik-baik.</p>

        <p>Aku tidak tahu setelah ini hidup akan membawa kita sejauh apa.
        Aku juga tidak tahu apakah suatu hari kita akan berada di tempat yang sama,
        atau justru melihat langit dari kota yang berbeda.</p>

        <p>Tapi kalau suatu malam kamu melihat ke atas dan menemukan satu cahaya yang tetap ada di sana,
        aku harap kamu ingat bahwa pernah ada seseorang yang sangat bersyukur karena sempat mengenalmu.</p>

        <p>Tidak perlu menjanjikan apa-apa kepadaku.
        Tetaplah menjadi Aini yang kukenal.</p>

        <p>Jaga dirimu baik-baik.</p>

        <p class="sign">— Alam</p>
      </article>

      <div class="footer">AELMAR SOL · 2026</div>
    </section>
  </main>
</body>
</html>`;
}
