/*!
 * KBFab Widget — floating action button + menu (with submenu support)
 * Standalone, dependency-free. Bisa dipasang di web mana aja:
 *
 *   <script src="kbfab-widget.js"></script>
 *   <script>
 *     KBFab.init({
 *       icon: "⚡",                     // emoji atau URL gambar
 *       eyebrow: "KB · LOKAL",
 *       title: "Menu Utama",
 *       subtitle: "Tier <b>KIWOLASU LOCAL VERSION</b> · v3.2",
 *       footer: "CONTOH SCRIPT",
 *       items: [
 *         {
 *           icon: "⚡", label: "Quick Inject", hint: "Slot belum diatur", quick: true,
 *           submenu: [
 *             { icon: "🟢", label: "Warior (+20)", onClick: () => alert("Warior") },
 *             { icon: "🔵", label: "Elit-Master (normal)", onClick: () => alert("Elit") },
 *             { icon: "🟣", label: "GM++ (-20)", onClick: () => alert("GM++") }
 *           ]
 *         },
 *         { icon: "🌀", label: "Inject Hero", onClick: () => alert("Inject Hero") },
 *         { icon: "🛠️", label: "Setting", submenu: [
 *             { icon: "🔔", label: "Notifikasi" },
 *             { icon: "🌐", label: "Bahasa" }
 *         ]}
 *       ]
 *     });
 *   </script>
 *
 * Setiap item boleh punya salah satu dari:
 *   - onClick: function()           -> item biasa, jalanin fungsi lalu nutup panel
 *   - submenu: [ {icon,label,onClick|submenu}, ... ]  -> buka sub-panel (bisa nested)
 * Item tanpa onClick & submenu cuma tampil (placeholder/label).
 */
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.KBFab = factory();
    }
})(typeof window !== "undefined" ? window : this, function () {
    "use strict";

    var STYLE_ID = "kbfab-widget-style";
    var injected = false;

    var CSS = "" +
    ":root{--kbfab-bg-rgb:20,35,52;--kbfab-bg-alpha:0.3;}" +
    ".kbfab-wrap{position:fixed;left:8vw;top:14vh;z-index:2147483000;touch-action:none;font-family:Arial,sans-serif;}" +
    ".kbfab-wrap.kbfab-dragging{transition:none !important;}" +
    ".kbfab-ring{position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(80,195,255,.45);animation:kbfab-pulse 2.6s ease-out infinite;pointer-events:none;}" +
    "@keyframes kbfab-pulse{0%{transform:scale(.85);opacity:.9;}70%{transform:scale(1.35);opacity:0;}100%{opacity:0;}}" +
    ".kbfab-btn{position:relative;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(var(--kbfab-bg-rgb),var(--kbfab-bg-alpha));border:1px solid rgba(80,195,255,.55);box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 12px rgba(50,180,255,.2);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;font-size:24px;color:#8de8ff;user-select:none;}" +
    ".kbfab-btn:active{transform:scale(.92);}" +
    ".kbfab-btn.kbfab-open{border-color:rgba(130,230,255,.9);box-shadow:0 10px 26px rgba(0,0,0,.55),0 0 18px rgba(70,205,255,.5);}" +
    ".kbfab-wrap.kbfab-dragging .kbfab-btn{transform:scale(1.06);}" +
    ".kbfab-btn img{width:36px;height:36px;object-fit:contain;pointer-events:none;transition:transform .25s ease;}" +
    ".kbfab-btn.kbfab-open img{transform:rotate(135deg);}" +
    ".kbfab-dim{position:fixed;inset:0;background:rgba(2,5,9,0);backdrop-filter:blur(0px);transition:background .25s ease,backdrop-filter .25s ease;pointer-events:none;z-index:2147482998;}" +
    ".kbfab-dim.kbfab-show{background:rgba(2,5,9,.55);backdrop-filter:blur(2px);pointer-events:auto;}" +
    ".kbfab-panel{position:fixed;right:16px;bottom:100px;width:min(272px,calc(100vw - 32px));z-index:2147482999;background:rgba(var(--kbfab-bg-rgb),var(--kbfab-bg-alpha));border:1px solid rgba(80,195,255,.35);border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 15px rgba(60,180,255,.1);overflow:hidden;transform-origin:bottom right;transform:scale(.85) translateY(14px);opacity:0;pointer-events:none;transition:transform .22s cubic-bezier(.2,.9,.3,1.2),opacity .18s ease,background .2s ease;color:white;backdrop-filter:blur(6px);}" +
    ".kbfab-panel.kbfab-show{transform:scale(1) translateY(0);opacity:1;pointer-events:auto;}" +
    ".kbfab-panel-head{padding:14px 16px 12px;border-bottom:1px solid rgba(80,195,255,.2);background:radial-gradient(120% 100% at 0% 0%,rgba(80,195,255,.09),transparent 60%);position:relative;}" +
    ".kbfab-eyebrow{font-size:9.5px;letter-spacing:.14em;color:#8de8ff;text-transform:uppercase;display:flex;align-items:center;gap:6px;}" +
    ".kbfab-eyebrow .kbfab-dot{width:6px;height:6px;border-radius:50%;background:#8de8ff;box-shadow:0 0 8px #8de8ff;}" +
    ".kbfab-title{font-size:15px;font-weight:700;margin-top:4px;letter-spacing:.02em;}" +
    ".kbfab-sub{font-size:11px;color:rgba(255,255,255,.55);margin-top:2px;}" +
    ".kbfab-sub b{color:#ffb347;font-weight:600;}" +
    ".kbfab-back{display:none;align-items:center;gap:6px;font-size:11.5px;color:#8de8ff;cursor:pointer;margin-bottom:6px;-webkit-user-select:none;user-select:none;}" +
    ".kbfab-back.kbfab-show-back{display:flex;}" +
    ".kbfab-list-wrap{position:relative;overflow:hidden;}" +
    ".kbfab-list{list-style:none;margin:0;padding:8px;display:flex;flex-direction:column;gap:2px;max-height:52vh;overflow-y:auto;transition:transform .22s ease,opacity .18s ease;}" +
    ".kbfab-list.kbfab-slide-out{transform:translateX(-12px);opacity:0;}" +
    ".kbfab-item{display:flex;align-items:center;gap:11px;padding:10px;border-radius:10px;cursor:pointer;transition:background .15s ease;}" +
    ".kbfab-item:hover,.kbfab-item:focus-visible{background:rgba(80,195,255,.1);outline:none;}" +
    ".kbfab-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;background:rgba(80,195,255,.08);border:1px solid rgba(80,195,255,.25);flex-shrink:0;}" +
    ".kbfab-text{display:flex;flex-direction:column;min-width:0;}" +
    ".kbfab-label{font-size:13.5px;font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
    ".kbfab-hint{font-size:10.5px;color:rgba(255,255,255,.45);margin-top:1px;}" +
    ".kbfab-item.kbfab-quick .kbfab-icon{background:rgba(255,179,71,.12);border-color:rgba(255,179,71,.3);}" +
    ".kbfab-item.kbfab-quick .kbfab-label{color:#ffb347;}" +
    ".kbfab-chev{margin-left:auto;color:rgba(255,255,255,.4);font-size:12px;flex-shrink:0;}" +
    ".kbfab-divider{height:1px;background:rgba(80,195,255,.15);margin:6px 10px;}" +
    ".kbfab-item.kbfab-exit .kbfab-icon{background:rgba(255,107,107,.1);border-color:rgba(255,107,107,.28);}" +
    ".kbfab-item.kbfab-exit .kbfab-label{color:#ff6b6b;}" +
    ".kbfab-item.kbfab-disabled{opacity:.42;cursor:default;}" +
    ".kbfab-item.kbfab-disabled:hover{background:transparent;}" +
    ".kbfab-foot{padding:9px 16px 12px;font-size:9.5px;color:rgba(255,255,255,.4);letter-spacing:.04em;text-align:center;border-top:1px solid rgba(80,195,255,.15);}" +
    ".kbfab-filemgr-path{display:none;align-items:center;gap:6px;padding:7px 14px;font-size:9.5px;color:rgba(255,255,255,.45);letter-spacing:.03em;border-bottom:1px solid rgba(80,195,255,.15);background:rgba(80,195,255,.04);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
    ".kbfab-filemgr-path.kbfab-show{display:flex;}" +
    ".kbfab-filemgr-path b{color:#8de8ff;font-weight:700;}" +
    ".kbfab-list.kbfab-filemgr{padding:6px;gap:0;}" +
    ".kbfab-item.kbfab-file{position:relative;padding:9px 10px 9px 14px;border-radius:6px;border:1px solid transparent;}" +
    ".kbfab-item.kbfab-file:nth-child(odd){background:rgba(255,255,255,.025);}" +
    ".kbfab-item.kbfab-file::before{content:'';position:absolute;left:2px;top:7px;bottom:7px;width:3px;border-radius:3px;background:transparent;transition:background .15s ease;}" +
    ".kbfab-item.kbfab-file:hover{background:rgba(80,195,255,.1);border-color:rgba(80,195,255,.22);}" +
    ".kbfab-item.kbfab-file:hover::before{background:#8de8ff;}" +
    ".kbfab-item.kbfab-file .kbfab-icon{width:32px;height:32px;border-radius:7px;font-size:15px;background:linear-gradient(155deg,rgba(80,195,255,.2),rgba(80,195,255,.04));border:1px solid rgba(80,195,255,.3);}" +
    ".kbfab-item.kbfab-file .kbfab-label{font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;font-size:12.5px;font-weight:600;}" +
    ".kbfab-item.kbfab-file .kbfab-hint{font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;font-size:9.5px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;}" +
    ".kbfab-file-ext{margin-left:auto;font-size:8px;font-weight:700;letter-spacing:.05em;color:#8de8ff;background:rgba(80,195,255,.14);border:1px solid rgba(80,195,255,.32);border-radius:4px;padding:2px 5px;flex-shrink:0;}" +
    ".kbfab-item.kbfab-file.kbfab-disabled .kbfab-file-ext{color:rgba(255,255,255,.35);background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.14);}" +
    ".kbfab-item.kbfab-file.kbfab-disabled::before{background:transparent !important;}" +
    ".kbfab-item.kbfab-filesys{cursor:default;justify-content:center;padding:16px 10px;opacity:.55;}" +
    "@media (orientation:landscape){" +
    ".kbfab-panel{left:50% !important;top:50% !important;right:auto !important;bottom:auto !important;width:min(320px,84vw) !important;height:auto !important;max-height:86vh !important;border-radius:18px !important;display:flex !important;flex-direction:column !important;transform-origin:center center !important;transform:translate(-50%,-50%) scale(.9) !important;}" +
    ".kbfab-panel.kbfab-show{transform:translate(-50%,-50%) scale(1) !important;}" +
    ".kbfab-list-wrap{flex:1 1 auto !important;min-height:0 !important;overflow-y:auto !important;-webkit-overflow-scrolling:touch !important;}" +
    ".kbfab-list{max-height:none !important;overflow-y:visible !important;}" +
    ".kbfab-filemgr-path{position:sticky !important;top:0 !important;z-index:1 !important;}" +
    ".kbfab-panel-head,.kbfab-foot{flex-shrink:0 !important;}" +
    "}" +
    "@media (prefers-reduced-motion:reduce){.kbfab-ring{animation:none;}.kbfab-panel,.kbfab-dim{transition:none;}}";

    var CHAT_STYLE_ID = "kbfab-chat-style";
    var chatInjected = false;

    var CHAT_CSS = "" +
    ".kbchat-dim{position:fixed;inset:0;background:rgba(2,5,9,0);backdrop-filter:blur(0px);transition:background .25s ease,backdrop-filter .25s ease;pointer-events:none;z-index:2147483001;}" +
    ".kbchat-dim.kbchat-show{background:rgba(2,5,9,.6);backdrop-filter:blur(2px);pointer-events:auto;}" +
    ".kbchat-panel{position:fixed;left:50%;bottom:0;width:min(360px,92vw);height:min(480px,70vh);transform:translate(-50%,20px);opacity:0;pointer-events:none;display:flex;flex-direction:column;border-radius:18px 18px 0 0;background:rgba(var(--kbfab-bg-rgb),var(--kbfab-bg-alpha));border:1px solid rgba(80,195,255,.35);border-bottom:none;box-shadow:0 -10px 30px rgba(0,0,0,.5),0 0 15px rgba(60,180,255,.12);transition:transform .3s ease,opacity .3s ease,background .2s ease;z-index:2147483002;font-family:Arial,sans-serif;backdrop-filter:blur(6px);}" +
    ".kbchat-panel.kbchat-show{transform:translate(-50%,0);opacity:1;pointer-events:auto;}" +
    ".kbchat-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(80,195,255,.2);}" +
    ".kbchat-title{font-size:15px;font-weight:bold;color:#8de8ff;letter-spacing:.5px;}" +
    ".kbchat-close{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:white;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}" +
    ".kbchat-messages{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px;scrollbar-width:none;}" +
    ".kbchat-messages::-webkit-scrollbar{display:none;}" +
    ".kbchat-msg{max-width:80%;padding:8px 12px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:13px;line-height:1.45;color:rgba(255,255,255,.9);word-break:break-word;}" +
    ".kbchat-msg.kbchat-me{align-self:flex-end;background:linear-gradient(135deg,rgba(30,65,90,.85),rgba(10,20,30,.95));border-color:rgba(90,205,255,.4);}" +
    ".kbchat-msg-name{font-size:11px;font-weight:bold;color:#8de8ff;margin-bottom:2px;}" +
    ".kbchat-msg.kbchat-me .kbchat-msg-name{color:#ffb347;}" +
    ".kbchat-msg-time{font-size:10px;color:rgba(255,255,255,.35);margin-top:3px;text-align:right;}" +
    ".kbchat-form{display:flex;gap:8px;padding:12px 14px;border-top:1px solid rgba(80,195,255,.2);}" +
    ".kbchat-input{flex:1;min-width:0;padding:10px 14px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:white;font-size:13px;outline:none;}" +
    ".kbchat-input::placeholder{color:rgba(255,255,255,.35);}" +
    ".kbchat-send{width:40px;height:40px;flex-shrink:0;border-radius:50%;border:1px solid rgba(90,205,255,.4);background:linear-gradient(135deg,rgba(30,65,90,.85),rgba(10,20,30,.95));color:#8de8ff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;}" +
    ".kbchat-send:active{transform:scale(.92);}" +
    ".kbchat-mic{width:40px;height:40px;flex-shrink:0;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;touch-action:none;user-select:none;transition:transform .15s ease,background .15s ease,border-color .15s ease;}" +
    ".kbchat-mic.kbchat-recording{background:rgba(255,80,80,.18);border-color:rgba(255,90,90,.6);color:#ff8a8a;transform:scale(1.12);}" +
    ".kbchat-rec-indicator{display:none;align-items:center;gap:8px;padding:0 14px 10px;font-size:11px;color:rgba(255,255,255,.6);}" +
    ".kbchat-rec-indicator.kbchat-show{display:flex;}" +
    ".kbchat-rec-dot{width:8px;height:8px;border-radius:50%;background:#ff5a5a;animation:kbchat-rec-pulse 1s ease-in-out infinite;flex-shrink:0;}" +
    "@keyframes kbchat-rec-pulse{0%,100%{opacity:1;}50%{opacity:.3;}}" +
    ".kbchat-audio-msg{display:flex;align-items:center;gap:8px;}" +
    ".kbchat-audio-msg audio{height:32px;max-width:200px;}";

    var SETTINGS_STYLE_ID = "kbfab-settings-style";
    var settingsInjected = false;

    var FILEDETAIL_STYLE_ID = "kbfab-filedetail-style";
    var fileDetailInjected = false;
    var FILEDETAIL_CSS = "" +
    ".kbfd-dim{position:fixed;inset:0;background:rgba(2,5,9,0);backdrop-filter:blur(0px);transition:background .25s ease,backdrop-filter .25s ease;pointer-events:none;z-index:2147483005;}" +
    ".kbfd-dim.kbfd-show{background:rgba(2,5,9,.6);backdrop-filter:blur(2px);pointer-events:auto;}" +
    ".kbfd-panel{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.9);opacity:0;pointer-events:none;width:min(300px,88vw);border-radius:18px;background:rgba(20,35,52,.98);border:1px solid rgba(80,195,255,.35);box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 15px rgba(60,180,255,.1);z-index:2147483006;font-family:Arial,sans-serif;color:white;transition:transform .22s cubic-bezier(.2,.9,.3,1.2),opacity .18s ease;}" +
    ".kbfd-panel.kbfd-show{transform:translate(-50%,-50%) scale(1);opacity:1;pointer-events:auto;}" +
    ".kbfd-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;border-bottom:1px solid rgba(80,195,255,.2);}" +
    ".kbfd-title{display:flex;align-items:center;gap:9px;min-width:0;}" +
    ".kbfd-title-icon{font-size:17px;flex-shrink:0;}" +
    ".kbfd-title-text{font-size:14px;font-weight:bold;color:#8de8ff;letter-spacing:.3px;font-family:'Segoe UI',-apple-system,BlinkMacSystemFont,Roboto,Arial,sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}" +
    ".kbfd-close{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:white;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}" +
    ".kbfd-body{padding:16px;display:flex;flex-direction:column;gap:14px;}" +
    ".kbfd-desc{font-size:12px;line-height:1.55;color:rgba(255,255,255,.65);white-space:pre-wrap;word-break:break-word;}" +
    ".kbfd-desc.kbfd-empty{color:rgba(255,255,255,.32);font-style:italic;}" +
    ".kbfd-dl{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:12px;background:rgba(15,32,48,.75);color:white;font-weight:700;font-size:13px;cursor:pointer;border:1px solid rgba(80,195,255,.4);box-shadow:none;transition:transform .15s ease,box-shadow .15s ease,background .15s ease,border-color .15s ease;}" +
    ".kbfd-dl:active{transform:scale(.97);background:rgba(25,48,68,.9);border-color:rgba(120,215,255,.75);box-shadow:0 0 16px rgba(70,200,255,.4);}" +
    ".kbfd-dl.kbfd-disabled{opacity:.4;cursor:default;box-shadow:none;background:rgba(255,255,255,.08);pointer-events:none;}";

    var SETTINGS_CSS = "" +
    ".kbset-dim{position:fixed;inset:0;background:rgba(2,5,9,0);backdrop-filter:blur(0px);transition:background .25s ease,backdrop-filter .25s ease;pointer-events:none;z-index:2147483003;}" +
    ".kbset-dim.kbset-show{background:rgba(2,5,9,.6);backdrop-filter:blur(2px);pointer-events:auto;}" +
    ".kbset-panel{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.9);opacity:0;pointer-events:none;width:min(300px,88vw);border-radius:18px;background:rgba(20,35,52,.98);border:1px solid rgba(80,195,255,.35);box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 15px rgba(60,180,255,.1);z-index:2147483004;font-family:Arial,sans-serif;color:white;transition:transform .22s cubic-bezier(.2,.9,.3,1.2),opacity .18s ease;}" +
    ".kbset-panel.kbset-show{transform:translate(-50%,-50%) scale(1);opacity:1;pointer-events:auto;}" +
    ".kbset-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(80,195,255,.2);}" +
    ".kbset-title{font-size:15px;font-weight:bold;color:#8de8ff;letter-spacing:.5px;}" +
    ".kbset-close{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:white;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;}" +
    ".kbset-body{padding:16px;display:flex;flex-direction:column;gap:16px;}" +
    ".kbset-row{display:flex;flex-direction:column;gap:8px;}" +
    ".kbset-row label{font-size:11.5px;color:rgba(255,255,255,.6);letter-spacing:.03em;display:flex;justify-content:space-between;}" +
    ".kbset-swatches{display:flex;gap:8px;flex-wrap:wrap;}" +
    ".kbset-swatch{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid rgba(255,255,255,.15);transition:transform .15s ease,border-color .15s ease;flex-shrink:0;}" +
    ".kbset-swatch:hover{transform:scale(1.1);}" +
    ".kbset-swatch.kbset-active{border-color:#8de8ff;box-shadow:0 0 8px rgba(80,195,255,.6);}" +
    ".kbset-color-custom{width:32px;height:28px;border-radius:8px;border:2px solid rgba(255,255,255,.15);background:none;cursor:pointer;padding:0;flex-shrink:0;}" +
    ".kbset-range{width:100%;accent-color:#8de8ff;}" +
    ".kbset-reset{margin-top:2px;padding:8px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:rgba(255,255,255,.7);font-size:12px;cursor:pointer;}";

    function injectStyle() {
        if (injected || document.getElementById(STYLE_ID)) return;
        var style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = CSS;
        document.head.appendChild(style);
        injected = true;
    }

    function injectChatStyle() {
        if (chatInjected || document.getElementById(CHAT_STYLE_ID)) return;
        var style = document.createElement("style");
        style.id = CHAT_STYLE_ID;
        style.textContent = CHAT_CSS;
        document.head.appendChild(style);
        chatInjected = true;
    }

    function injectSettingsStyle() {
        if (settingsInjected || document.getElementById(SETTINGS_STYLE_ID)) return;
        var style = document.createElement("style");
        style.id = SETTINGS_STYLE_ID;
        style.textContent = SETTINGS_CSS;
        document.head.appendChild(style);
        settingsInjected = true;
    }

    function injectFileDetailStyle() {
        if (fileDetailInjected || document.getElementById(FILEDETAIL_STYLE_ID)) return;
        var style = document.createElement("style");
        style.id = FILEDETAIL_STYLE_ID;
        style.textContent = FILEDETAIL_CSS;
        document.head.appendChild(style);
        fileDetailInjected = true;
    }

    function el(tag, className, html) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (html !== undefined) e.innerHTML = html;
        return e;
    }

    function KBFabInstance(opts) {
        opts = opts || {};
        var items = opts.items || [];
        var self = this;

        injectStyle();

        // ---- build DOM ----
        var wrap = el("div", "kbfab-wrap");
        var ring = el("div", "kbfab-ring");
        var btn = el("div", "kbfab-btn");
        btn.setAttribute("role", "button");
        btn.setAttribute("aria-label", opts.ariaLabel || "Buka menu");
        btn.setAttribute("aria-expanded", "false");
        if (opts.icon && /^(https?:)?\/\/|^data:image/.test(opts.icon)) {
            var img = el("img");
            img.src = opts.icon;
            img.alt = "Menu";
            img.draggable = false;
            btn.appendChild(img);
        } else {
            btn.textContent = opts.icon || "☰";
        }
        wrap.appendChild(ring);
        wrap.appendChild(btn);

        var dim = el("div", "kbfab-dim");

        var panel = el("div", "kbfab-panel");
        panel.setAttribute("role", "menu");
        panel.setAttribute("aria-hidden", "true");

        var head = el("div", "kbfab-panel-head");
        var back = el("div", "kbfab-back", "‹ <span>Kembali</span>");
        var eyebrowHtml = '<span class="kbfab-dot"></span> ' + (opts.eyebrow || "");
        var eyebrow = el("div", "kbfab-eyebrow", eyebrowHtml);
        var title = el("div", "kbfab-title", opts.title || "Menu");
        head.appendChild(back);
        head.appendChild(eyebrow);
        head.appendChild(title);
        if (opts.subtitle) {
            head.appendChild(el("div", "kbfab-sub", opts.subtitle));
        }

        var listWrap = el("div", "kbfab-list-wrap");
        var filemgrBar = el("div", "kbfab-filemgr-path");
        var list = el("ul", "kbfab-list");
        listWrap.appendChild(filemgrBar);
        listWrap.appendChild(list);

        panel.appendChild(head);
        panel.appendChild(listWrap);

        if (opts.footer) {
            panel.appendChild(el("div", "kbfab-foot", opts.footer));
        }

        document.body.appendChild(wrap);
        document.body.appendChild(dim);
        document.body.appendChild(panel);

        // ---- navigation stack (untuk submenu) ----
        var stack = []; // stack of {items, label}

        var currentMode = "normal";

        function renderList(itemArr, levelTitle, mode) {
            mode = mode || "normal";
            currentMode = mode;
            list.classList.toggle("kbfab-filemgr", mode === "filemgr");
            if (mode === "filemgr") {
                filemgrBar.innerHTML = itemArr.filter(function (it) { return !it.sys; }).length + " item";
                filemgrBar.classList.add("kbfab-show");
            } else {
                filemgrBar.classList.remove("kbfab-show");
            }
            list.innerHTML = "";
            itemArr.forEach(function (item) {
                if (item.divider) {
                    list.appendChild(el("div", "kbfab-divider"));
                    return;
                }
                var isFileRow = mode === "filemgr" && !item.sys;
                var li = el("li", "kbfab-item" + (item.quick ? " kbfab-quick" : "") + (item.exit ? " kbfab-exit" : "") + (item.disabled ? " kbfab-disabled" : "") + (isFileRow ? " kbfab-file" : "") + (item.sys ? " kbfab-filesys" : ""));
                li.tabIndex = 0;
                li.setAttribute("role", "menuitem");
                var iconHtml = item.icon || "•";
                li.appendChild(el("div", "kbfab-icon", iconHtml));
                var textWrap = el("div", "kbfab-text");
                textWrap.appendChild(el("div", "kbfab-label", item.label || ""));
                if (item.hint && !isFileRow) textWrap.appendChild(el("div", "kbfab-hint", item.hint));
                li.appendChild(textWrap);
                if ((item.submenu && item.submenu.length) || item.quickInject === true || item.dynamicSubmenu === true) {
                    li.appendChild(el("div", "kbfab-chev", "›"));
                } else if (isFileRow) {
                    li.appendChild(el("div", "kbfab-file-ext", item.disabled ? "—" : "LNK"));
                }
                var activate = function () {
                    if (isFileRow) {
                        if (fileDetailApi) fileDetailApi.open(item);
                        return;
                    }
                    if (item.disabled) return;
                    if (item.quickInject === true && quickInjectApi) {
                        stack.push({ items: itemArr, title: title.textContent, mode: currentMode });
                        title.textContent = item.label || "Menu";
                        back.classList.add("kbfab-show-back");
                        renderQuickInjectList();
                        repositionIfOpen();
                        return;
                    }
                    if (item.dynamicSubmenu === true && dynamicSubmenuApi) {
                        stack.push({ items: itemArr, title: title.textContent, mode: currentMode });
                        title.textContent = item.label || "Menu";
                        back.classList.add("kbfab-show-back");
                        renderDynamicSubmenuList(item);
                        repositionIfOpen();
                        return;
                    }
                    if (item.submenu && item.submenu.length) {
                        stack.push({ items: itemArr, title: title.textContent, mode: currentMode });
                        title.textContent = item.label || "Menu";
                        back.classList.add("kbfab-show-back");
                        renderList(item.submenu);
                        repositionIfOpen();
                        return;
                    }
                    if (item.chat === true) {
                        if (chatApi) chatApi.open();
                    } else if (item.settings === true) {
                        settingsApi.open();
                    } else if (typeof item.onClick === "function") {
                        if (fileDetailApi) {
                            fileDetailApi.open(item);
                            return;
                        }
                        item.onClick();
                    }
                    if (item.keepOpen !== true) setOpen(false);
                };
                li.addEventListener("click", activate);
                li.addEventListener("keydown", function (e) {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        activate();
                    }
                });
                list.appendChild(li);
            });
            if (levelTitle) title.textContent = levelTitle;
        }

        function renderQuickInjectList() {
            renderList([{ icon: "⏳", label: "Memuat...", disabled: true, sys: true }]);
            quickInjectApi.load().then(function (dynItems) {
                if (!dynItems.length) {
                    dynItems = [{ icon: "ℹ️", label: "Belum ada data", disabled: true, sys: true }];
                }
                renderList(dynItems);
                repositionIfOpen();
            });
        }

        function renderDynamicSubmenuList(item) {
            var titleNow = title.textContent;
            renderList([{ icon: "⏳", label: "Memuat...", disabled: true, sys: true }], titleNow);
            dynamicSubmenuApi.loadFor(item.id).then(function (dynItems) {
                if (!dynItems.length) {
                    dynItems = [{ icon: "📭", label: "Belum ada file", disabled: true, sys: true }];
                }
                renderList(dynItems, titleNow);
                repositionIfOpen();
            });
        }

        back.addEventListener("click", function () {
            var prev = stack.pop();
            if (!prev) return;
            title.textContent = prev.title;
            if (!stack.length) back.classList.remove("kbfab-show-back");
            renderList(prev.items, undefined, prev.mode);
            repositionIfOpen();
        });

        renderList(items);

        // ---- open / close ----
        var isOpen = false;

        function positionPanel() {
            var isLandscape = window.matchMedia("(orientation: landscape)").matches;
            if (isLandscape) {
                panel.style.right = "";
                panel.style.left = "";
                panel.style.top = "";
                panel.style.bottom = "";
                return;
            }
            var r = wrap.getBoundingClientRect();
            var margin = 12;
            var panelW = panel.offsetWidth || 272;
            var panelMaxH = window.innerHeight * 0.52 + 90;
            var right = window.innerWidth - r.right;
            right = Math.min(Math.max(right, margin), window.innerWidth - panelW - margin);
            panel.style.right = right + "px";
            panel.style.left = "auto";
            var spaceAbove = r.top;
            if (spaceAbove > panelMaxH + margin) {
                panel.style.bottom = (window.innerHeight - r.top + 10) + "px";
                panel.style.top = "auto";
            } else {
                panel.style.top = (r.bottom + 10) + "px";
                panel.style.bottom = "auto";
            }
        }

        function repositionIfOpen() {
            if (isOpen) positionPanel();
        }

        function setOpen(v) {
            isOpen = v;
            btn.classList.toggle("kbfab-open", isOpen);
            btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
            if (isOpen) positionPanel();
            else {
                // reset ke root menu tiap ditutup
                stack = [];
                back.classList.remove("kbfab-show-back");
                title.textContent = opts.title || "Menu";
                renderList(items);
            }
            panel.classList.toggle("kbfab-show", isOpen);
            panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
            dim.classList.toggle("kbfab-show", isOpen);
        }

        dim.addEventListener("click", function () { setOpen(false); });
        window.addEventListener("resize", function () { if (isOpen) positionPanel(); });

        // ---- drag + tap-to-open ----
        var dragging = false, moved = false;
        var startX = 0, startY = 0, originLeft = 0, originTop = 0;
        var THRESHOLD = 6;
        function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

        function onPointerDown(e) {
            dragging = true;
            moved = false;
            startX = e.clientX;
            startY = e.clientY;
            if (!isOpen) {
                var r = wrap.getBoundingClientRect();
                originLeft = r.left;
                originTop = r.top;
                wrap.classList.add("kbfab-dragging");
            }
            try { btn.setPointerCapture(e.pointerId); } catch (_) {}
        }
        function onPointerMove(e) {
            if (!dragging || isOpen) return;
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            if (Math.abs(dx) > THRESHOLD || Math.abs(dy) > THRESHOLD) moved = true;
            if (!moved) return;
            var w = wrap.offsetWidth, h = wrap.offsetHeight;
            var newLeft = clamp(originLeft + dx, 4, window.innerWidth - w - 4);
            var newTop = clamp(originTop + dy, 4, window.innerHeight - h - 4);
            wrap.style.left = newLeft + "px";
            wrap.style.top = newTop + "px";
        }
        function onPointerUp(e) {
            if (!dragging) return;
            dragging = false;
            wrap.classList.remove("kbfab-dragging");
            if (!moved) setOpen(!isOpen);
            moved = false;
            try { btn.releasePointerCapture(e.pointerId); } catch (_) {}
        }
        btn.addEventListener("pointerdown", onPointerDown);
        btn.addEventListener("pointermove", onPointerMove);
        btn.addEventListener("pointerup", onPointerUp);
        btn.addEventListener("pointercancel", onPointerUp);

        if (opts.position) {
            if (opts.position.left) wrap.style.left = opts.position.left;
            if (opts.position.top) wrap.style.top = opts.position.top;
            if (opts.position.right) { wrap.style.left = "auto"; wrap.style.right = opts.position.right; }
            if (opts.position.bottom) { wrap.style.top = "auto"; wrap.style.bottom = opts.position.bottom; }
        }

        // ---- settings module (ubah warna & transparansi background) ----
        var settingsApi = buildSettings(opts.theme);

        // ---- file detail module (modal alert: nama, keterangan, tombol download) ----
        var fileDetailApi = buildFileDetail();

        function hexToRgb(hex) {
            hex = hex.replace("#", "");
            if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
            var num = parseInt(hex, 16);
            return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
        }
        function rgbToHex(rgbStr) {
            var parts = rgbStr.split(",").map(function (n) { return parseInt(n.trim(), 10); });
            return "#" + parts.map(function (n) { return n.toString(16).padStart(2, "0"); }).join("");
        }

        function buildFileDetail() {
            injectFileDetailStyle();

            var defaultDlLabel = "⬇ Download";

            var dim = el("div", "kbfd-dim");
            var panel = el("div", "kbfd-panel");
            panel.setAttribute("role", "dialog");
            panel.setAttribute("aria-hidden", "true");

            var head = el("div", "kbfd-head");
            var titleWrap = el("div", "kbfd-title");
            var titleIcon = el("span", "kbfd-title-icon", "📄");
            var titleText = el("span", "kbfd-title-text", "");
            titleWrap.appendChild(titleIcon);
            titleWrap.appendChild(titleText);
            var close = el("button", "kbfd-close", "✕");
            close.type = "button";
            close.setAttribute("aria-label", "Tutup");
            head.appendChild(titleWrap);
            head.appendChild(close);

            var body = el("div", "kbfd-body");
            var descEl = el("div", "kbfd-desc", "");
            var dlBtn = el("button", "kbfd-dl", defaultDlLabel);
            dlBtn.type = "button";
            body.appendChild(descEl);
            body.appendChild(dlBtn);

            panel.appendChild(head);
            panel.appendChild(body);
            document.body.appendChild(dim);
            document.body.appendChild(panel);

            var fdOpen = false;
            var currentOnClick = null;

            function setFdOpen(v) {
                fdOpen = v;
                panel.classList.toggle("kbfd-show", fdOpen);
                panel.setAttribute("aria-hidden", fdOpen ? "false" : "true");
                dim.classList.toggle("kbfd-show", fdOpen);
            }

            close.addEventListener("click", function () { setFdOpen(false); });
            dim.addEventListener("click", function () { setFdOpen(false); });

            dlBtn.addEventListener("click", function () {
                if (typeof currentOnClick === "function") currentOnClick();
                setFdOpen(false);
            });

            return {
                setDefaultLabel: function (text) {
                    if (text && String(text).trim()) defaultDlLabel = String(text).trim();
                },
                open: function (item) {
                    titleIcon.textContent = item.icon || "📄";
                    titleText.textContent = item.label || "File";
                    var hasHint = !!(item.hint && String(item.hint).trim());
                    descEl.textContent = hasHint ? item.hint : "Tidak ada keterangan.";
                    descEl.classList.toggle("kbfd-empty", !hasHint);
                    currentOnClick = item.onClick;
                    dlBtn.classList.toggle("kbfd-disabled", !!item.disabled);
                    dlBtn.textContent = item.disabled ? "⛔ Belum tersedia" : (item.dlLabel || defaultDlLabel);
                    setFdOpen(true);
                },
                close: function () { setFdOpen(false); }
            };
        }

        function buildSettings(themeOpts) {
            injectSettingsStyle();

            var STORAGE_KEY = (themeOpts && themeOpts.storageKey) || "kbfab_theme";
            var SWATCHES = (themeOpts && themeOpts.swatches) || [
                "20,35,52", "8,8,8", "40,15,55", "10,45,35", "55,20,20", "15,35,60"
            ];

            var root = document.documentElement;

            function applyTheme(rgb, alpha) {
                root.style.setProperty("--kbfab-bg-rgb", rgb);
                root.style.setProperty("--kbfab-bg-alpha", alpha);
            }

            function saveTheme(rgb, alpha) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rgb: rgb, alpha: alpha }));
                } catch (_) {}
            }

            function loadTheme() {
                try {
                    var raw = localStorage.getItem(STORAGE_KEY);
                    if (raw) return JSON.parse(raw);
                } catch (_) {}
                return null;
            }

            // ---- terapkan tema tersimpan (kalau ada) begitu widget dimuat ----
            var initialRgb = (themeOpts && themeOpts.rgb) || "20,35,52";
            var initialAlpha = (themeOpts && themeOpts.alpha != null) ? themeOpts.alpha : 0.3;
            var saved = loadTheme();
            if (saved && saved.rgb) { initialRgb = saved.rgb; initialAlpha = saved.alpha; }
            applyTheme(initialRgb, initialAlpha);

            var dim = el("div", "kbset-dim");
            var panel = el("div", "kbset-panel");
            panel.setAttribute("role", "dialog");
            panel.setAttribute("aria-hidden", "true");

            var head = el("div", "kbset-head");
            head.appendChild(el("div", "kbset-title", "🎨 TAMPILAN"));
            var close = el("button", "kbset-close", "✕");
            close.type = "button";
            close.setAttribute("aria-label", "Tutup pengaturan");
            head.appendChild(close);

            var body = el("div", "kbset-body");

            var colorRow = el("div", "kbset-row");
            colorRow.appendChild(el("label", "", "Warna latar"));
            var swatchWrap = el("div", "kbset-swatches");
            var swatchEls = [];
            function refreshSwatchActive(rgb) {
                swatchEls.forEach(function (s) {
                    s.el.classList.toggle("kbset-active", s.rgb === rgb);
                });
            }
            SWATCHES.forEach(function (rgb) {
                var sw = el("div", "kbset-swatch");
                sw.style.background = "rgb(" + rgb + ")";
                sw.addEventListener("click", function () {
                    currentRgb = rgb;
                    applyTheme(currentRgb, currentAlpha);
                    saveTheme(currentRgb, currentAlpha);
                    refreshSwatchActive(currentRgb);
                    customColor.value = rgbToHex(currentRgb);
                });
                swatchWrap.appendChild(sw);
                swatchEls.push({ el: sw, rgb: rgb });
            });
            var customColor = document.createElement("input");
            customColor.type = "color";
            customColor.className = "kbset-color-custom";
            customColor.title = "Warna custom";
            customColor.addEventListener("input", function () {
                currentRgb = hexToRgb(customColor.value).join(",");
                applyTheme(currentRgb, currentAlpha);
                saveTheme(currentRgb, currentAlpha);
                refreshSwatchActive(currentRgb);
            });
            swatchWrap.appendChild(customColor);
            colorRow.appendChild(swatchWrap);

            var alphaRow = el("div", "kbset-row");
            var alphaLabel = el("label", "", "Transparansi");
            var alphaValueEl = el("span", "", "");
            alphaLabel.appendChild(alphaValueEl);
            var alphaRange = document.createElement("input");
            alphaRange.type = "range";
            alphaRange.className = "kbset-range";
            alphaRange.min = "0";
            alphaRange.max = "100";
            alphaRow.appendChild(alphaLabel);
            alphaRow.appendChild(alphaRange);

            var resetBtn = el("button", "kbset-reset", "Kembalikan default");
            resetBtn.type = "button";

            body.appendChild(colorRow);
            body.appendChild(alphaRow);
            body.appendChild(resetBtn);

            panel.appendChild(head);
            panel.appendChild(body);
            document.body.appendChild(dim);
            document.body.appendChild(panel);

            var currentRgb = initialRgb;
            var currentAlpha = initialAlpha;

            function syncControls() {
                refreshSwatchActive(currentRgb);
                customColor.value = rgbToHex(currentRgb);
                var pct = Math.round(currentAlpha * 100);
                alphaRange.value = String(pct);
                alphaValueEl.textContent = pct + "%";
            }
            syncControls();

            alphaRange.addEventListener("input", function () {
                currentAlpha = parseInt(alphaRange.value, 10) / 100;
                alphaValueEl.textContent = alphaRange.value + "%";
                applyTheme(currentRgb, currentAlpha);
                saveTheme(currentRgb, currentAlpha);
            });

            resetBtn.addEventListener("click", function () {
                currentRgb = (themeOpts && themeOpts.rgb) || "20,35,52";
                currentAlpha = (themeOpts && themeOpts.alpha != null) ? themeOpts.alpha : 0.3;
                applyTheme(currentRgb, currentAlpha);
                saveTheme(currentRgb, currentAlpha);
                syncControls();
            });

            var settingsOpen = false;
            function setSettingsOpen(v) {
                settingsOpen = v;
                panel.classList.toggle("kbset-show", settingsOpen);
                panel.setAttribute("aria-hidden", settingsOpen ? "false" : "true");
                dim.classList.toggle("kbset-show", settingsOpen);
                if (settingsOpen) syncControls();
            }
            close.addEventListener("click", function () { setSettingsOpen(false); });
            dim.addEventListener("click", function () { setSettingsOpen(false); });

            return {
                open: function () { setSettingsOpen(true); },
                close: function () { setSettingsOpen(false); }
            };
        }

        // ---- quick inject module (built-in, aktif kalau opts.quickInject diisi) ----
        var quickInjectApi = null;
        if (opts.quickInject && opts.quickInject.baseUrl) {
            quickInjectApi = buildQuickInject(opts.quickInject);
        }

        function buildQuickInject(qiOpts) {
            var QI_BASE_URL = qiOpts.baseUrl;
            var MENU_KEYS = qiOpts.menuKeys || ["menu1", "menu2", "menu3", "menu4"];

            async function load() {
                try {
                    var res = await fetch(QI_BASE_URL + ".json?t=" + Date.now());
                    if (!res.ok) return [];
                    var data = await res.json();
                    if (!data) return [];
                    var result = [];
                    MENU_KEYS.forEach(function (key) {
                        var entry = data[key];
                        if (!entry) return;
                        var hasUrl = !!(entry.url && String(entry.url).trim());
                        result.push({
                            icon: "🔗",
                            label: entry.title || "(belum diisi)",
                            hint: entry.description || "",
                            disabled: !hasUrl,
                            onClick: hasUrl ? function () {
                                window.open(entry.url, "_blank", "noopener");
                            } : undefined
                        });
                    });
                    return result;
                } catch (_) {
                    return [];
                }
            }

            return { load: load };
        }

        // ---- dynamic submenu module (isi submenu dari admin, aktif kalau opts.dynamicSubmenu diisi) ----
        var dynamicSubmenuApi = null;
        if (opts.dynamicSubmenu && opts.dynamicSubmenu.baseUrl) {
            dynamicSubmenuApi = buildDynamicSubmenu(opts.dynamicSubmenu);
        }

        function buildDynamicSubmenu(dsOpts) {
            var DS_BASE_URL = dsOpts.baseUrl;
            var SLOT_KEYS = dsOpts.slotKeys || ["sub1", "sub2", "sub3", "sub4"];

            async function loadFor(id) {
                try {
                    var res = await fetch(DS_BASE_URL + "/" + id + ".json?t=" + Date.now());
                    if (!res.ok) return [];
                    var data = await res.json();
                    if (!data) return [];
                    var result = [];
                    SLOT_KEYS.forEach(function (key) {
                        var entry = data[key];
                        if (!entry) return;
                        var hasUrl = !!(entry.url && String(entry.url).trim());
                        if (!hasUrl) return; // belum ada isi -> jangan ditampilkan sama sekali
                        result.push({
                            icon: "🔗",
                            label: entry.title || "(tanpa nama)",
                            hint: entry.description || "",
                            dlLabel: entry.buttonText || "",
                            onClick: function () {
                                window.open(entry.url, "_blank", "noopener");
                            }
                        });
                    });
                    return result;
                } catch (_) {
                    return [];
                }
            }

            return { loadFor: loadFor };
        }

        // ---- menu config module (ubah icon/nama/hide dari admin, aktif kalau opts.menuConfig diisi) ----
        if (opts.menuConfig && opts.menuConfig.baseUrl) {
            fetch(opts.menuConfig.baseUrl + ".json?t=" + Date.now())
                .then(function (res) { return res.ok ? res.json() : null; })
                .then(function (cfg) {
                    if (!cfg) return;
                    var merged = applyMenuConfig(opts.items || items, cfg);
                    self.setItems(merged);
                })
                .catch(function () {});
        }

        // ---- chat module (built-in, aktif kalau opts.chat diisi) ----
        var chatApi = null;
        if (opts.chat && opts.chat.baseUrl) {
            chatApi = buildChat(opts.chat);
        }

        function buildChat(chatOpts) {
            injectChatStyle();

            var CHAT_BASE_URL = chatOpts.baseUrl;
            var CHAT_MAX_MESSAGES = chatOpts.maxMessages || 15;
            var NAME_STORAGE_KEY = chatOpts.nameStorageKey || "kbchat_name";

            var chatDim = el("div", "kbchat-dim");
            var chatPanel = el("div", "kbchat-panel");
            chatPanel.setAttribute("role", "dialog");
            chatPanel.setAttribute("aria-hidden", "true");

            var chatHead = el("div", "kbchat-head");
            chatHead.appendChild(el("div", "kbchat-title", chatOpts.title || "💬 CHAT"));
            var chatClose = el("button", "kbchat-close", "✕");
            chatClose.type = "button";
            chatClose.setAttribute("aria-label", "Tutup chat");
            chatHead.appendChild(chatClose);

            var chatMessages = el("div", "kbchat-messages");

            var chatForm = el("form", "kbchat-form");
            var chatInput = el("input", "kbchat-input");
            chatInput.type = "text";
            chatInput.placeholder = chatOpts.placeholder || "Tulis pesan...";
            chatInput.maxLength = 300;
            chatInput.autocomplete = "off";
            var chatMic = el("button", "kbchat-mic", "🎤");
            chatMic.type = "button";
            chatMic.setAttribute("aria-label", "Tahan untuk rekam suara");
            var chatSend = el("button", "kbchat-send", "➤");
            chatSend.type = "submit";
            chatSend.setAttribute("aria-label", "Kirim");
            chatForm.appendChild(chatInput);
            if (chatOpts.voice !== false) chatForm.appendChild(chatMic);
            chatForm.appendChild(chatSend);

            var recIndicator = el("div", "kbchat-rec-indicator");
            var recDot = el("span", "kbchat-rec-dot");
            var recTimeEl = el("span", "", "0:00");
            recIndicator.appendChild(recDot);
            recIndicator.appendChild(document.createTextNode(" "));
            recIndicator.appendChild(recTimeEl);
            recIndicator.appendChild(document.createTextNode(" — lepas untuk kirim, geser ke atas untuk batal"));

            chatPanel.appendChild(chatHead);
            chatPanel.appendChild(chatMessages);
            chatPanel.appendChild(chatForm);
            chatPanel.appendChild(recIndicator);

            document.body.appendChild(chatDim);
            document.body.appendChild(chatPanel);

            var myName = null;
            try { myName = localStorage.getItem(NAME_STORAGE_KEY); } catch (_) {}
            if (!myName) {
                myName = "Tamu" + Math.floor(1000 + Math.random() * 9000);
                try { localStorage.setItem(NAME_STORAGE_KEY, myName); } catch (_) {}
            }

            var renderedKeys = new Map();

            function formatTime(ts) {
                if (!ts) return "";
                var d = new Date(ts);
                var hh = String(d.getHours()).padStart(2, "0");
                var mm = String(d.getMinutes()).padStart(2, "0");
                return hh + ":" + mm;
            }

            function appendMessage(key, data) {
                if (!data || renderedKeys.has(key)) return;
                var bubble = el("div", "kbchat-msg" + (data.name === myName ? " kbchat-me" : ""));
                var nameEl = el("div", "kbchat-msg-name", data.name || "");
                bubble.appendChild(nameEl);
                if (data.type === "audio" && data.audio) {
                    var audioWrap = el("div", "kbchat-audio-msg");
                    var audioEl = document.createElement("audio");
                    audioEl.controls = true;
                    audioEl.src = data.audio;
                    audioWrap.appendChild(audioEl);
                    bubble.appendChild(audioWrap);
                } else {
                    var textEl = el("div", "", "");
                    textEl.textContent = data.text || "";
                    bubble.appendChild(textEl);
                }
                var timeEl = el("div", "kbchat-msg-time", formatTime(data.ts));
                bubble.appendChild(timeEl);
                renderedKeys.set(key, bubble);
                chatMessages.appendChild(bubble);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            function removeMessage(key) {
                var bubble = renderedKeys.get(key);
                if (bubble && bubble.parentNode) bubble.parentNode.removeChild(bubble);
                renderedKeys.delete(key);
            }

            async function loadHistory() {
                try {
                    var res = await fetch(CHAT_BASE_URL + ".json?orderBy=%22ts%22&limitToLast=" + CHAT_MAX_MESSAGES + "&t=" + Date.now());
                    if (!res.ok) return;
                    var data = await res.json();
                    if (!data) return;
                    Object.keys(data)
                        .sort(function (a, b) { return (data[a].ts || 0) - (data[b].ts || 0); })
                        .forEach(function (key) { appendMessage(key, data[key]); });
                } catch (_) {}
            }

            var chatStream = null;
            function startStream() {
                if (chatStream || typeof EventSource === "undefined") return;
                try {
                    chatStream = new EventSource(CHAT_BASE_URL + ".json");
                    chatStream.addEventListener("put", function (e) {
                        try {
                            var payload = JSON.parse(e.data);
                            if (!payload || payload.path === undefined) return;
                            if (payload.path === "/") {
                                if (payload.data) {
                                    Object.keys(payload.data)
                                        .sort(function (a, b) { return (payload.data[a].ts || 0) - (payload.data[b].ts || 0); })
                                        .forEach(function (key) { appendMessage(key, payload.data[key]); });
                                }
                            } else {
                                var key = payload.path.replace("/", "");
                                if (payload.data === null) removeMessage(key);
                                else appendMessage(key, payload.data);
                            }
                        } catch (_) {}
                    });
                    chatStream.onerror = function () {
                        if (chatStream) { chatStream.close(); chatStream = null; }
                        setTimeout(startStream, 4000);
                    };
                } catch (_) {}
            }

            async function trimHistory() {
                try {
                    var res = await fetch(CHAT_BASE_URL + ".json?orderBy=%22ts%22&t=" + Date.now());
                    if (!res.ok) return;
                    var data = await res.json();
                    if (!data) return;
                    var keys = Object.keys(data).sort(function (a, b) { return (data[a].ts || 0) - (data[b].ts || 0); });
                    var excess = keys.length - CHAT_MAX_MESSAGES;
                    if (excess <= 0) return;
                    var toDelete = keys.slice(0, excess);
                    await Promise.all(toDelete.map(function (key) {
                        return fetch(CHAT_BASE_URL + "/" + key + ".json", { method: "DELETE" }).catch(function () {});
                    }));
                } catch (_) {}
            }

            async function sendPayload(payload) {
                try {
                    await fetch(CHAT_BASE_URL + ".json", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });
                    trimHistory();
                } catch (_) {}
            }

            async function sendMessage(text) {
                text = text.trim();
                if (!text) return;
                sendPayload({ name: myName, text: text, ts: Date.now() });
            }

            chatForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var val = chatInput.value;
                chatInput.value = "";
                sendMessage(val);
            });

            var REC_MAX_MS = 30000;
            var REC_CANCEL_OFFSET_PX = 60;
            var mediaRecorder = null, recChunks = [], recStream = null;
            var recStartY = 0, recCancelled = false, recStartTime = 0;
            var recTimerInterval = null, recMaxTimeout = null;

            function formatRecTime(ms) {
                var totalSec = Math.floor(ms / 1000);
                var mm = Math.floor(totalSec / 60);
                var ss = String(totalSec % 60).padStart(2, "0");
                return mm + ":" + ss;
            }

            function pickMimeType() {
                var candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
                for (var i = 0; i < candidates.length; i++) {
                    if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(candidates[i])) {
                        return candidates[i];
                    }
                }
                return "";
            }

            async function startRecording() {
                if (mediaRecorder) return;
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
                    alert("Perangkat/browser ini tidak mendukung rekam suara.");
                    return;
                }
                try {
                    recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                } catch (_) {
                    alert("Izin mikrofon ditolak atau tidak tersedia.");
                    return;
                }
                recChunks = [];
                recCancelled = false;
                var mimeType = pickMimeType();
                try {
                    mediaRecorder = mimeType ? new MediaRecorder(recStream, { mimeType: mimeType }) : new MediaRecorder(recStream);
                } catch (_) {
                    mediaRecorder = new MediaRecorder(recStream);
                }
                mediaRecorder.addEventListener("dataavailable", function (e) {
                    if (e.data && e.data.size > 0) recChunks.push(e.data);
                });
                mediaRecorder.addEventListener("stop", function () {
                    recStream.getTracks().forEach(function (t) { t.stop(); });
                    recStream = null;
                    clearInterval(recTimerInterval);
                    clearTimeout(recMaxTimeout);
                    recTimerInterval = null;
                    recMaxTimeout = null;
                    recIndicator.classList.remove("kbchat-show");
                    chatMic.classList.remove("kbchat-recording");
                    if (recCancelled || recChunks.length === 0) { mediaRecorder = null; return; }
                    var blobType = mediaRecorder.mimeType || "audio/webm";
                    var blob = new Blob(recChunks, { type: blobType });
                    var durationMs = Date.now() - recStartTime;
                    mediaRecorder = null;
                    var reader = new FileReader();
                    reader.onload = function () {
                        sendPayload({
                            name: myName,
                            type: "audio",
                            audio: reader.result,
                            duration: Math.round(durationMs / 1000),
                            ts: Date.now()
                        });
                    };
                    reader.readAsDataURL(blob);
                });
                mediaRecorder.start();
                recStartTime = Date.now();
                chatMic.classList.add("kbchat-recording");
                recIndicator.classList.add("kbchat-show");
                recTimeEl.textContent = "0:00";
                recTimerInterval = setInterval(function () {
                    recTimeEl.textContent = formatRecTime(Date.now() - recStartTime);
                }, 250);
                recMaxTimeout = setTimeout(function () { stopRecording(false); }, REC_MAX_MS);
            }

            function stopRecording(cancel) {
                if (!mediaRecorder || mediaRecorder.state === "inactive") return;
                recCancelled = !!cancel;
                mediaRecorder.stop();
            }

            chatMic.addEventListener("pointerdown", function (e) {
                e.preventDefault();
                recStartY = e.clientY;
                try { chatMic.setPointerCapture(e.pointerId); } catch (_) {}
                startRecording();
            });
            chatMic.addEventListener("pointermove", function (e) {
                if (!mediaRecorder) return;
                var dy = recStartY - e.clientY;
                if (dy > REC_CANCEL_OFFSET_PX) {
                    chatMic.classList.add("kbchat-recording");
                    recIndicator.textContent = "";
                    var d = el("span", "kbchat-rec-dot");
                    recIndicator.appendChild(d);
                    recIndicator.appendChild(document.createTextNode(" Lepas untuk batal"));
                } else {
                    recIndicator.textContent = "";
                    var d2 = el("span", "kbchat-rec-dot");
                    recIndicator.appendChild(d2);
                    var t2 = el("span", "", formatRecTime(Date.now() - recStartTime));
                    recIndicator.appendChild(t2);
                    recIndicator.appendChild(document.createTextNode(" — lepas untuk kirim, geser ke atas untuk batal"));
                }
            });
            chatMic.addEventListener("pointerup", function (e) {
                var dy = recStartY - e.clientY;
                stopRecording(dy > REC_CANCEL_OFFSET_PX);
                try { chatMic.releasePointerCapture(e.pointerId); } catch (_) {}
            });
            chatMic.addEventListener("pointercancel", function () { stopRecording(true); });

            var chatOpen = false;
            function setChatOpen(v) {
                chatOpen = v;
                chatPanel.classList.toggle("kbchat-show", chatOpen);
                chatPanel.setAttribute("aria-hidden", chatOpen ? "false" : "true");
                chatDim.classList.toggle("kbchat-show", chatOpen);
                if (chatOpen) { loadHistory(); startStream(); }
            }

            chatClose.addEventListener("click", function () { setChatOpen(false); });
            chatDim.addEventListener("click", function () { setChatOpen(false); });

            return {
                open: function () { setChatOpen(true); },
                close: function () { setChatOpen(false); },
                el: { dim: chatDim, panel: chatPanel }
            };
        }

        // ---- public API ----
        this.open = function () { setOpen(true); };
        this.close = function () { setOpen(false); };
        this.toggle = function () { setOpen(!isOpen); };
        this.openChat = function () { if (chatApi) chatApi.open(); };
        this.closeChat = function () { if (chatApi) chatApi.close(); };
        this.openSettings = function () { settingsApi.open(); };
        this.closeSettings = function () { settingsApi.close(); };
        this.setItems = function (newItems) {
            items = newItems;
            stack = [];
            back.classList.remove("kbfab-show-back");
            title.textContent = opts.title || "Menu";
            renderList(items);
        };
        this.destroy = function () {
            wrap.remove();
            dim.remove();
            panel.remove();
        };
        this.el = { wrap: wrap, btn: btn, panel: panel, dim: dim };
    }

    var DEFAULT_ICON = "data:image/png;base64,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";

    var DEFAULT_CONFIG = {
        icon: DEFAULT_ICON,
        ariaLabel: "Buka menu KB-LOKAL",
        eyebrow: "KB · LOKAL",
        title: "Menu Utama",
        subtitle: "Tier <b>KIWOLASU LOCAL VERSION</b> &nbsp;·&nbsp; v3.2",
        footer: "KIWOLASU",
        items: [
            { id: "injectHero", icon: "🌀", label: "Inject Hero", dynamicSubmenu: true },
            { id: "skipTime", icon: "⏱️", label: "Skip Time", dynamicSubmenu: true },
            { id: "kda", icon: "🏪", label: "KDA", dynamicSubmenu: true },
            { id: "drone", icon: "📡", label: "Drone", dynamicSubmenu: true },
            { id: "view3d", icon: "🔬", label: "View 3D", dynamicSubmenu: true },
            { id: "chat", icon: "💬", label: "Chat", chat: true },
            { id: "setting", icon: "🛠️", label: "Setting", settings: true },
            { id: "about", icon: "ℹ️", label: "About" },
            { divider: true },
            { id: "exit", icon: "❌", label: "Exit", exit: true }
        ],
        chat: {
            baseUrl: "https://pucuk-9d1d6-default-rtdb.asia-southeast1.firebasedatabase.app/chat",
            maxMessages: 15
        },
        quickInject: {
            baseUrl: "https://pucuk-9d1d6-default-rtdb.asia-southeast1.firebasedatabase.app/links"
        },
        menuConfig: {
            baseUrl: "https://pucuk-9d1d6-default-rtdb.asia-southeast1.firebasedatabase.app/menu_config"
        },
        dynamicSubmenu: {
            baseUrl: "https://pucuk-9d1d6-default-rtdb.asia-southeast1.firebasedatabase.app/submenus"
        }
    };

    function applyMenuConfig(baseItems, cfg) {
        var out = [];
        baseItems.forEach(function (item) {
            if (item.divider) { out.push(item); return; }
            var override = item.id && cfg[item.id];
            if (override && override.hidden === true) return;
            if (!override) { out.push(item); return; }
            var merged = {};
            var k;
            for (k in item) if (item.hasOwnProperty(k)) merged[k] = item[k];
            if (override.icon) merged.icon = override.icon;
            if (override.label) merged.label = override.label;
            out.push(merged);
        });
        return out;
    }

    function mergeConfig(base, override) {
        var out = {};
        var key;
        for (key in base) if (base.hasOwnProperty(key)) out[key] = base[key];
        if (override) {
            for (key in override) if (override.hasOwnProperty(key)) out[key] = override[key];
        }
        return out;
    }

    var KBFabAPI = {
        init: function (opts) {
            return new KBFabInstance(opts);
        },
        defaults: DEFAULT_CONFIG
    };

    // ---- auto-init ----
    // index.html manapun cukup <script src="kbfab-widget.js"></script> —
    // widget langsung jalan pakai DEFAULT_CONFIG di atas.
    // Untuk override sebagian/semua config, definisikan sebelum tag <script>:
    //   <script>window.KBFAB_CONFIG = { title: "Menu Lain", chat: { baseUrl: "..." } };</script>
    //   <script src="kbfab-widget.js"></script>
    // Untuk mematikan auto-init sepenuhnya dan panggil KBFab.init() manual:
    //   <script>window.KBFAB_NO_AUTO_INIT = true;</script>
    if (typeof window !== "undefined" && !window.KBFAB_NO_AUTO_INIT) {
        var start = function () {
            if (window.__kbfabInstance) return; // cegah double-init
            var cfg = mergeConfig(DEFAULT_CONFIG, window.KBFAB_CONFIG);
            window.__kbfabInstance = KBFabAPI.init(cfg);
        };
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", start);
        } else {
            start();
        }
    }

    return KBFabAPI;
});