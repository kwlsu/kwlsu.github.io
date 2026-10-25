/*!
 * floating-top5.js — Papan TOP 5 mengambang (pojok kanan atas) untuk Ular Kadut
 *
 * Pakai di index.html (satu baris saja, taruh sebelum </body>):
 *     <script src="floating-top5.js" defer></script>
 *
 * Opsional — atur dulu sebelum script dipanggil:
 *     <script>
 *       window.TOP5_CONFIG = {
 *         endAt: '2026-10-26T15:00:00+07:00',   // paksa jam berakhir (kosongkan = otomatis 24 jam sejak pertama kali dibuka)
 *         top: '12px', right: '8px', width: '150px'
 *       };
 *     </script>
 *
 * Cara kerja:
 *  - Data diambil dari leaderboard Firebase yang sama dengan game (ular_arena/leaderboard).
 *  - Selama 24 jam: tampil 5 besar, 3 besar dapat mahkota, ada hitung mundur.
 *  - Setelah 24 jam: papan mengecil jadi 3 besar (dibekukan) + ucapan selamat VIP
 *    lengkap dengan jam, tanggal, bulan, dan tahun.
 *  - Waktu mulai & pemenang disimpan di Firebase (ular_arena/vipContest) supaya
 *    semua pengunjung melihat hitung mundur dan pemenang yang SAMA.
 *    Mau mulai ulang kontes? Hapus node "vipContest" di Firebase console.
 */
(function () {
  'use strict';
  if (window.__kwTop5Loaded) return;
  window.__kwTop5Loaded = true;

  var CFG = Object.assign({
    fbBase: 'https://pucuk-9d1d6-default-rtdb.asia-southeast1.firebasedatabase.app',
    room: 'ular_arena',
    refreshMs: 5000,
    durationMs: 24 * 60 * 60 * 1000,
    endAt: null,                 // ISO string / ms. null = otomatis (lihat atas)
    finalWinners: null,          // opsional: [{name, score}] untuk memaksa pemenang manual
    timeZone: 'Asia/Jakarta',
    tzLabel: 'WIB',
    prize: 'SCRIPT VIP',
    top: '12px',
    right: '8px',
    width: '150px'
  }, window.TOP5_CONFIG || {});

  var BASE = CFG.fbBase.replace(/\/$/, '') + '/' + CFG.room;
  var LS_START = 'kwTop5.start';
  var LS_WIN = 'kwTop5.winners';
  var RANK_COLORS = ['#ffd54a', '#dfe6ee', '#e08a4a', '#6fd8ff', '#8ea3ff'];

  var state = { entries: [], lbOk: false, endAt: null, winners: null, collapsed: false };

  /* ---------- util ---------- */
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  function req(path, opts) {
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
    var init = Object.assign({ cache: 'no-store' }, opts || {});
    if (ctl) init.signal = ctl.signal;
    return fetch(BASE + '/' + path + '.json', init)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) { return { ok: true, data: data }; })
      .catch(function () { return { ok: false, data: null }; })
      .then(function (res) { clearTimeout(timer); return res; });
  }

  function formatScore(v) {
    v = Number(v) || 0;
    if (v >= 1000) {
      var rounded = Math.round((v / 1000) * 10) / 10;
      return (Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)) + 'km';
    }
    return v + 'm';
  }

  function parseLeaderboard(raw) {
    var list = [];
    if (Array.isArray(raw)) {
      list = raw.filter(Boolean);
    } else if (raw && typeof raw === 'object') {
      list = Object.keys(raw).map(function (k) { return raw[k]; }).filter(Boolean);
    }
    return list
      .map(function (e) {
        return {
          name: String(e.name || 'Ular'),
          score: Number(e.score) || 0,
          color: (e.color && e.color.hex) || e.color || ''
        };
      })
      .filter(function (e) { return e.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
  }

  function normalizeWinners(w) {
    if (!w) return null;
    var arr = Array.isArray(w) ? w : Object.keys(w).map(function (k) { return w[k]; });
    arr = arr.filter(Boolean).map(function (e) {
      return { name: String(e.name || 'Ular'), score: Number(e.score) || 0, color: e.color || '' };
    });
    return arr.length ? arr.slice(0, 3) : null;
  }

  function toMs(v) {
    if (typeof v === 'number') return v;
    var t = Date.parse(v);
    return isNaN(t) ? null : t;
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function fmtCountdown(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    return pad(Math.floor(s / 3600)) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
  }

  // "15.00 WIB, 26 Oktober 2026"  (jam, tanggal, bulan, tahun)
  function fmtEndStamp(ms) {
    try {
      var parts = new Intl.DateTimeFormat('id-ID', {
        timeZone: CFG.timeZone, day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date(ms));
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return o.hour + '.' + o.minute + ' ' + CFG.tzLabel + ', ' + o.day + ' ' + o.month + ' ' + o.year;
    } catch (e) {
      var d = new Date(ms);
      return pad(d.getHours()) + '.' + pad(d.getMinutes()) + ', ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    }
  }

  /* ---------- DOM ---------- */
  var style = document.createElement('style');
  style.textContent =
    '#kwTop5{position:fixed;top:calc(env(safe-area-inset-top,0px) + ' + CFG.top + ');right:' + CFG.right + ';width:' + CFG.width + ';' +
    'z-index:2147483000;font-family:"Space Grotesk",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#eef6ff;' +
    'background:linear-gradient(160deg,rgba(16,26,41,.92),rgba(5,8,14,.92));border:1px solid rgba(111,216,255,.55);' +
    'border-radius:12px;box-shadow:0 0 16px rgba(90,205,255,.28),0 6px 18px rgba(0,0,0,.45);' +
    'padding:7px 8px 8px;box-sizing:border-box;-webkit-user-select:none;user-select:none;' +
    'animation:kwTop5In .45s ease-out both}' +
    '@keyframes kwTop5In{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}' +
    '#kwTop5 .hd{display:flex;align-items:center;justify-content:space-between;gap:6px;cursor:pointer;' +
    'font-size:10px;font-weight:700;letter-spacing:.8px;color:#6fd8ff}' +
    '#kwTop5 .hd .tg{opacity:.7;font-size:11px;line-height:1}' +
    '#kwTop5 .cd{margin:4px 0 5px;text-align:center;font-family:"JetBrains Mono",ui-monospace,monospace;' +
    'font-size:13px;font-weight:700;color:#ffce6b;letter-spacing:.5px}' +
    '#kwTop5 .cd small{display:block;font-family:inherit;font-size:8.5px;font-weight:600;color:#9aa8ff;letter-spacing:.6px}' +
    '#kwTop5 .row{display:flex;align-items:center;gap:5px;padding:3px 5px;margin-top:3px;border-radius:7px;' +
    'background:rgba(111,216,255,.07);border-left:3px solid #47548f;font-size:11px;line-height:1.2}' +
    '#kwTop5 .row .rk{width:16px;flex:none;text-align:center;font-weight:700;font-size:11px}' +
    '#kwTop5 .row .rk.crown{font-size:13px;line-height:1;filter:drop-shadow(0 0 3px currentColor)}' +
    '#kwTop5 .row .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}' +
    '#kwTop5 .row .sc{flex:none;font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10px;font-weight:700;color:#ffce6b}' +
    '#kwTop5 .empty{margin-top:4px;font-size:10px;text-align:center;color:#8ea3ff}' +
    '#kwTop5 .win{margin-top:7px;padding:6px 6px;border-radius:8px;text-align:center;font-size:10.5px;line-height:1.35;' +
    'background:rgba(255,206,107,.13);border:1px solid #ffce6b;color:#ffe9b0}' +
    '#kwTop5 .win b{display:block;color:#ffce6b;font-size:11.5px;margin-bottom:2px}' +
    '#kwTop5 .win em{display:block;margin-top:3px;font-style:normal;font-family:"JetBrains Mono",ui-monospace,monospace;' +
    'font-size:9.5px;color:#fff}' +
    '#kwTop5.min .cd,#kwTop5.min .rows,#kwTop5.min .win{display:none}';
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'kwTop5';
  var hd = document.createElement('div');
  hd.className = 'hd';
  var hdTitle = document.createElement('span');
  var hdToggle = document.createElement('span');
  hdToggle.className = 'tg';
  hdToggle.textContent = '▾';
  hd.appendChild(hdTitle);
  hd.appendChild(hdToggle);
  var cd = document.createElement('div');
  cd.className = 'cd';
  var rowsEl = document.createElement('div');
  rowsEl.className = 'rows';
  var winEl = document.createElement('div');
  winEl.className = 'win';
  winEl.style.display = 'none';
  root.appendChild(hd);
  root.appendChild(cd);
  root.appendChild(rowsEl);
  root.appendChild(winEl);

  hd.addEventListener('click', function () {
    state.collapsed = !state.collapsed;
    root.classList.toggle('min', state.collapsed);
    hdToggle.textContent = state.collapsed ? '▸' : '▾';
  });

  function mount() { if (!root.parentNode) document.body.appendChild(root); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  /* ---------- render ---------- */
  function isEnded() { return state.endAt !== null && Date.now() >= state.endAt; }

  function makeRow(rank, e) {
    var row = document.createElement('div');
    row.className = 'row';
    var color = RANK_COLORS[rank] || '#8ea3ff';
    row.style.borderLeftColor = color;
    var rk = document.createElement('span');
    rk.className = 'rk';
    if (rank < 3) {
      rk.classList.add('crown');
      rk.style.color = color;
      rk.textContent = '👑';
    } else {
      rk.style.color = color;
      rk.textContent = String(rank + 1);
    }
    var nm = document.createElement('span');
    nm.className = 'nm';
    nm.textContent = e.name;
    if (rank < 3) nm.style.color = color;
    var sc = document.createElement('span');
    sc.className = 'sc';
    sc.textContent = formatScore(e.score);
    row.appendChild(rk);
    row.appendChild(nm);
    row.appendChild(sc);
    return row;
  }

  function renderRows() {
    var ended = isEnded();
    var list = ended ? (state.winners || state.entries.slice(0, 3)) : state.entries.slice(0, 5);
    while (rowsEl.firstChild) rowsEl.removeChild(rowsEl.firstChild);

    if (!list.length) {
      var em = document.createElement('div');
      em.className = 'empty';
      em.textContent = state.lbOk ? 'belum ada juara' : 'memuat…';
      rowsEl.appendChild(em);
    } else {
      list.forEach(function (e, i) { rowsEl.appendChild(makeRow(i, e)); });
    }

    hdTitle.textContent = ended ? '🏆 TOP 3 JUARA' : '🏆 TOP 5 ULAR KADUT';

    if (ended) {
      winEl.style.display = '';
      while (winEl.firstChild) winEl.removeChild(winEl.firstChild);
      var b = document.createElement('b');
      b.textContent = '🎉 Selamat!';
      winEl.appendChild(b);
      winEl.appendChild(document.createTextNode('Top 3 mendapat ' + CFG.prize + ' GRATIS'));
      var em2 = document.createElement('em');
      em2.textContent = fmtEndStamp(state.endAt);
      winEl.appendChild(em2);
    } else {
      winEl.style.display = 'none';
    }
    renderTimer();
  }

  var lastEnded = null;
  function renderTimer() {
    var ended = isEnded();
    if (lastEnded !== null && ended !== lastEnded) {
      lastEnded = ended;
      poll();          // fase berganti → ambil data terbaru & bekukan pemenang
      renderRows();
      return;
    }
    lastEnded = ended;
    if (state.endAt === null) {
      cd.style.display = '';
      cd.textContent = '--:--:--';
      return;
    }
    if (ended) {
      cd.style.display = 'none';
    } else {
      cd.style.display = '';
      cd.innerHTML = '';
      cd.appendChild(document.createTextNode(fmtCountdown(state.endAt - Date.now())));
      var sm = document.createElement('small');
      sm.textContent = 'MENUJU PENGUMUMAN ' + CFG.prize;
      cd.appendChild(sm);
    }
  }

  /* ---------- data ---------- */
  function localStart() {
    var s = Number(lsGet(LS_START));
    if (!s) { s = Date.now(); lsSet(LS_START, String(s)); }
    return s;
  }

  var polling = false;
  function poll() {
    if (polling) return Promise.resolve();
    polling = true;
    return Promise.all([req('leaderboard'), req('vipContest')]).then(function (res) {
      var lb = res[0], vc = res[1];
      if (lb.ok) { state.entries = parseLeaderboard(lb.data); state.lbOk = true; }
      var contest = vc.ok ? vc.data : undefined;   // undefined = gagal baca

      var chain = Promise.resolve();

      // 1) tentukan jam berakhir
      if (CFG.endAt) {
        state.endAt = toMs(CFG.endAt);
      } else if (contest && contest.startedAt) {
        state.endAt = Number(contest.startedAt) + Number(contest.durationMs || CFG.durationMs);
      } else if (vc.ok && !contest) {
        // belum ada kontes → mulai sekarang (jam server), lalu baca ulang supaya semua orang sama
        chain = chain.then(function () {
          return req('vipContest', {
            method: 'PUT',
            body: JSON.stringify({ startedAt: { '.sv': 'timestamp' }, durationMs: CFG.durationMs })
          });
        }).then(function () { return req('vipContest'); }).then(function (again) {
          if (again.ok && again.data && again.data.startedAt) {
            contest = again.data;
            state.endAt = Number(contest.startedAt) + Number(contest.durationMs || CFG.durationMs);
          }
        });
      }

      return chain.then(function () {
        if (state.endAt === null) state.endAt = localStart() + CFG.durationMs;   // cadangan per-perangkat

        // 2) pemenang beku
        var frozen = contest && normalizeWinners(contest.winners);
        if (CFG.finalWinners && CFG.finalWinners.length) frozen = normalizeWinners(CFG.finalWinners);
        if (frozen) {
          state.winners = frozen;
          lsSet(LS_WIN, JSON.stringify(frozen));
        } else if (!state.winners && isEnded() && state.lbOk && state.entries.length) {
          var win = normalizeWinners(state.entries.slice(0, 3));
          if (win) {
            state.winners = win;
            lsSet(LS_WIN, JSON.stringify(win));
            return req('vipContest/winners', { method: 'PUT', body: JSON.stringify(win) });
          }
        } else if (!state.winners && isEnded()) {
          var cached = lsGet(LS_WIN);
          if (cached) { try { state.winners = normalizeWinners(JSON.parse(cached)); } catch (e) {} }
        }
      });
    }).then(function () {
      polling = false;
      renderRows();
    }, function () {
      polling = false;
    });
  }

  renderRows();
  poll();
  setInterval(poll, CFG.refreshMs);
  setInterval(renderTimer, 1000);
})();
