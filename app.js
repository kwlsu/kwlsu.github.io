(function(){var s=document.createElement('style');s.textContent="*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}html,body{width:100%;height:100%}body{overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient( circle at center,#101a29 0%,#05080e 55%,#000 100% );font-family:Arial,sans-serif;color:white;touch-action:none}.app{position:relative;width:360px;height:650px;max-width:100vw;max-height:100vh;overflow:hidden}.content{position:absolute;left:15px;right:15px;top:20px;min-height:220px;max-height:calc(100% - 40px);padding:25px;border-radius:20px;background:linear-gradient( 145deg,rgba(20,35,52,.97),rgba(7,13,21,.97) );border:1px solid rgba(80,195,255,.35);box-shadow:0 0 15px rgba(60,180,255,.12),inset 0 0 20px rgba(60,180,255,.03);opacity:0;transform:translateY(-20px) scale(.97);pointer-events:none;transition:opacity .35s ease,transform .35s ease;overflow:auto;scrollbar-width:none}.content::-webkit-scrollbar{display:none}.content.show{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}.content h2{font-size:22px;margin-bottom:8px;color:#8de8ff;letter-spacing:1px}.content p{font-size:14px;line-height:1.6;color:rgba(255,255,255,.65);margin-bottom:18px}.close{position:absolute;right:14px;top:14px;width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:20px;z-index:5}.link-button{width:100%;min-height:48px;margin-top:8px;border-radius:12px;border:1px solid rgba(90,205,255,.4);background:linear-gradient( 135deg,rgba(30,65,90,.75),rgba(10,20,30,.9) );color:white;text-decoration:none;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;letter-spacing:.5px;box-shadow:0 0 8px rgba(60,190,255,.12);transition:transform .2s ease,box-shadow .2s ease}.link-button:active{transform:scale(.97);box-shadow:0 0 18px rgba(60,200,255,.35)}.video-container{width:100%;aspect-ratio:16 / 9;margin-top:10px;overflow:hidden;border-radius:12px;display:none;background:#000;border:1px solid rgba(80,195,255,.25);box-shadow:0 0 12px rgba(50,180,255,.12)}.video-container iframe{width:100%;height:100%;border:0;display:block}.radial{position:absolute;left:50%;bottom:15px;width:360px;height:360px;transform:translateX(-50%);user-select:none;touch-action:none}.rotate-layer{position:absolute;inset:0;transform:translate3d(0,0,0) rotate(0deg);transform-origin:center;will-change:transform;transition:transform .5s cubic-bezier(.2,.85,.3,1.15)}.line{position:absolute;left:50%;top:50%;width:135px;height:1px;transform-origin:left center;background:linear-gradient( 90deg,rgba(80,205,255,.65),rgba(80,205,255,.05) );opacity:0;transition:opacity .25s ease;pointer-events:none}.line.top{transform:rotate(-90deg)}.line.right{transform:rotate(0deg)}.line.bottom{transform:rotate(90deg)}.line.left{transform:rotate(180deg)}.radial.open .line{opacity:1}.menu{position:absolute;left:50%;top:50%;width:68px;height:68px;margin-left:-34px;margin-top:-34px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;text-decoration:none;font-size:10px;font-weight:bold;text-align:center;background:radial-gradient( circle,#172537,#0b121c 75% );border:1px solid rgba(80,195,255,.55);box-shadow:0 0 8px rgba(50,180,255,.2);opacity:0;transform:translate(var(--x),var(--y)) scale(.25);transition:transform .48s cubic-bezier(.2,.9,.3,1.15),opacity .22s ease;will-change:transform;pointer-events:none}.menu.top{--x:0px;--y:-135px}.menu.right{--x:135px;--y:0px}.menu.bottom{--x:0px;--y:135px}.menu.left{--x:-135px;--y:0px}.radial.open .menu{opacity:1;transform:translate(var(--x),var(--y)) scale(1);pointer-events:auto}.menu.active{border-color:rgba(130,230,255,.95);box-shadow:0 0 12px rgba(70,205,255,.6),0 0 28px rgba(70,180,255,.25)}.menu span{display:flex;align-items:center;justify-content:center;width:100%;height:100%;transform:rotate( calc( -1 * var(--rotation,0deg) ) );pointer-events:none;white-space:nowrap}.center{position:absolute;left:50%;top:50%;width:122px;height:122px;transform:translate3d(-50%,-50%,0);display:flex;align-items:center;justify-content:center;border-radius:50%;background:radial-gradient( circle,#172537,#0b121c 70% );border:2px solid rgba(90,205,255,.65);color:white;font-size:20px;font-weight:bold;letter-spacing:2px;cursor:pointer;z-index:20;box-shadow:0 0 12px rgba(60,190,255,.35),0 0 30px rgba(60,190,255,.08);touch-action:manipulation}.center::after{content:\"\";position:absolute;width:6px;height:6px;border-radius:50%;background:#83ddff;box-shadow:0 0 8px rgba(80,210,255,.8)}.center:active{transform:translate3d(-50%,-50%,0) scale(.96)}.radial.dragging .rotate-layer{transition:none}.radial.dragging .menu{transition:none}@media (orientation:portrait){.app{width:min(360px,100vw);height:min(650px,100vh)}.radial{width:360px;height:360px;bottom:15px}}@media (orientation:landscape){.app{width:100vw;height:100vh;max-width:none;max-height:none}.content{left:20px;right:auto;top:50%;width:min(52vw,560px);max-height:90vh;transform:translateY(-50%) translateX(-25px) scale(.97)}.content.show{transform:translateY(-50%) translateX(0) scale(1)}.radial{left:auto;right:5vw;bottom:50%;width:300px;height:300px;transform:translateY(50%)}.line{width:110px}.menu.top{--x:0px;--y:-110px}.menu.right{--x:110px;--y:0px}.menu.bottom{--x:0px;--y:110px}.menu.left{--x:-110px;--y:0px}.center{width:105px;height:105px;font-size:17px;letter-spacing:1.5px}}@media (orientation:landscape) and (max-height:420px){.content{width:48vw;padding:18px;min-height:180px}.content h2{font-size:19px}.content p{font-size:12px;margin-bottom:10px}.link-button{min-height:40px;font-size:12px}.radial{right:3vw;width:250px;height:250px}.menu{width:58px;height:58px;margin-left:-29px;margin-top:-29px}.menu.top{--x:0px;--y:-90px}.menu.right{--x:90px;--y:0px}.menu.bottom{--x:0px;--y:90px}.menu.left{--x:-90px;--y:0px}.line{width:90px}.center{width:88px;height:88px;font-size:14px}}@media (orientation:landscape) and (min-width:1000px){.app{width:100vw;height:100vh}.content{left:6vw;top:50%;width:min(520px,42vw);min-height:240px;padding:30px;border-radius:24px}.content h2{font-size:25px}.content p{font-size:15px}.radial{right:9vw;bottom:50%;width:400px;height:400px;transform:translateY(50%)}.line{width:150px}.menu{width:76px;height:76px;margin-left:-38px;margin-top:-38px;font-size:11px}.menu.top{--x:0px;--y:-150px}.menu.right{--x:150px;--y:0px}.menu.bottom{--x:0px;--y:150px}.menu.left{--x:-150px;--y:0px}.center{width:130px;height:130px;font-size:21px;letter-spacing:2px}}@media (orientation:landscape) and (min-width:1400px){.content{left:8vw;width:min(600px,40vw)}.radial{right:12vw}}@media (orientation:landscape){.kbfab-panel{left:50% !important;top:50% !important;right:auto !important;bottom:auto !important;width:min(320px,84vw) !important;height:auto !important;max-height:86vh !important;border-radius:18px !important;display:flex !important;flex-direction:column !important;transform-origin:center center !important;transform:translate(-50%,-50%) scale(.9) !important}.kbfab-panel.kbfab-show{transform:translate(-50%,-50%) scale(1) !important}.kbfab-list{flex:1 1 auto !important;max-height:none !important;overflow-y:auto !important}.kbfab-panel-head,.kbfab-foot{flex-shrink:0 !important}}.kbfab-wrap{position:fixed;left:8vw;top:14vh;z-index:50;touch-action:none}.kbfab-wrap.kbfab-dragging{transition:none !important}.kbfab-ring{position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(80,195,255,.45);animation:kbfab-pulse 2.6s ease-out infinite}@keyframes kbfab-pulse{0%{transform:scale(.85);opacity:.9}70%{transform:scale(1.35);opacity:0}100%{opacity:0}}.kbfab-btn{position:relative;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 32% 28%,#172537 0%,#0b121c 75%);border:1px solid rgba(80,195,255,.55);box-shadow:0 10px 26px rgba(0,0,0,.5),0 0 12px rgba(50,180,255,.2);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}.kbfab-btn:active{transform:scale(.92)}.kbfab-btn.kbfab-open{border-color:rgba(130,230,255,.9);box-shadow:0 10px 26px rgba(0,0,0,.55),0 0 18px rgba(70,205,255,.5)}.kbfab-wrap.kbfab-dragging .kbfab-btn{transform:scale(1.06)}.kbfab-btn img{width:36px;height:36px;object-fit:contain;pointer-events:none;transition:transform .25s ease}.kbfab-btn.kbfab-open img{transform:rotate(135deg)}.kbfab-dim{position:fixed;inset:0;background:rgba(2,5,9,0);backdrop-filter:blur(0px);transition:background .25s ease,backdrop-filter .25s ease;pointer-events:none;z-index:48}.kbfab-dim.kbfab-show{background:rgba(2,5,9,.55);backdrop-filter:blur(2px);pointer-events:auto}.kbfab-panel{position:fixed;right:16px;bottom:100px;width:min(272px,calc(100vw - 32px));z-index:52;background:linear-gradient(180deg,rgba(20,35,52,.98),rgba(7,13,21,.98));border:1px solid rgba(80,195,255,.35);border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 15px rgba(60,180,255,.1);overflow:hidden;transform-origin:bottom right;transform:scale(.85) translateY(14px);opacity:0;pointer-events:none;transition:transform .22s cubic-bezier(.2,.9,.3,1.2),opacity .18s ease;font-family:Arial,sans-serif;color:white}.kbfab-panel.kbfab-show{transform:scale(1) translateY(0);opacity:1;pointer-events:auto}.kbfab-panel-head{padding:14px 16px 12px;border-bottom:1px solid rgba(80,195,255,.2);background:radial-gradient(120% 100% at 0% 0%,rgba(80,195,255,.09),transparent 60%)}.kbfab-eyebrow{font-size:9.5px;letter-spacing:.14em;color:#8de8ff;text-transform:uppercase;display:flex;align-items:center;gap:6px}.kbfab-eyebrow .kbfab-dot{width:6px;height:6px;border-radius:50%;background:#8de8ff;box-shadow:0 0 8px #8de8ff}.kbfab-title{font-size:15px;font-weight:700;margin-top:4px;letter-spacing:.02em}.kbfab-sub{font-size:11px;color:rgba(255,255,255,.55);margin-top:2px}.kbfab-sub b{color:#ffb347;font-weight:600}.kbfab-list{list-style:none;margin:0;padding:8px;display:flex;flex-direction:column;gap:2px;max-height:52vh;overflow-y:auto}.kbfab-item{display:flex;align-items:center;gap:11px;padding:10px;border-radius:10px;cursor:pointer;transition:background .15s ease}.kbfab-item:hover,.kbfab-item:focus-visible{background:rgba(80,195,255,.1);outline:none}.kbfab-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;background:rgba(80,195,255,.08);border:1px solid rgba(80,195,255,.25);flex-shrink:0}.kbfab-text{display:flex;flex-direction:column;min-width:0}.kbfab-label{font-size:13.5px;font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kbfab-hint{font-size:10.5px;color:rgba(255,255,255,.45);margin-top:1px}.kbfab-item.kbfab-quick .kbfab-icon{background:rgba(255,179,71,.12);border-color:rgba(255,179,71,.3)}.kbfab-item.kbfab-quick .kbfab-label{color:#ffb347}.kbfab-chev{margin-left:auto;color:rgba(255,255,255,.4);font-size:12px;flex-shrink:0}.kbfab-divider{height:1px;background:rgba(80,195,255,.15);margin:6px 10px}.kbfab-item.kbfab-exit .kbfab-icon{background:rgba(255,107,107,.1);border-color:rgba(255,107,107,.28)}.kbfab-item.kbfab-exit .kbfab-label{color:#ff6b6b}.kbfab-foot{padding:9px 16px 12px;font-size:9.5px;color:rgba(255,255,255,.4);letter-spacing:.04em;text-align:center;border-top:1px solid rgba(80,195,255,.15)}@media (prefers-reduced-motion:reduce){.kbfab-ring{animation:none}.kbfab-panel,.kbfab-dim,.kbfab-btn svg{transition:none}}.kbchat-dim{position:fixed;inset:0;background:rgba(2,5,9,0);backdrop-filter:blur(0px);transition:background .25s ease,backdrop-filter .25s ease;pointer-events:none;z-index:58}.kbchat-dim.kbchat-show{background:rgba(2,5,9,.6);backdrop-filter:blur(2px);pointer-events:auto}.kbchat-panel{position:fixed;left:50%;bottom:0;width:min(360px,92vw);height:min(480px,70vh);transform:translate(-50%,20px);opacity:0;pointer-events:none;display:flex;flex-direction:column;border-radius:18px 18px 0 0;background:linear-gradient(145deg,rgba(20,35,52,.98),rgba(7,13,21,.98));border:1px solid rgba(80,195,255,.35);border-bottom:none;box-shadow:0 -10px 30px rgba(0,0,0,.5),0 0 15px rgba(60,180,255,.12);transition:transform .3s ease,opacity .3s ease;z-index:59}.kbchat-panel.kbchat-show{transform:translate(-50%,0);opacity:1;pointer-events:auto}.kbchat-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(80,195,255,.2)}.kbchat-title{font-size:15px;font-weight:bold;color:#8de8ff;letter-spacing:.5px}.kbchat-close{width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:white;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}.kbchat-messages{flex:1;overflow-y:auto;padding:12px 14px;display:flex;flex-direction:column;gap:8px;scrollbar-width:none}.kbchat-messages::-webkit-scrollbar{display:none}.kbchat-msg{max-width:80%;padding:8px 12px;border-radius:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:13px;line-height:1.45;color:rgba(255,255,255,.9);word-break:break-word}.kbchat-msg.kbchat-me{align-self:flex-end;background:linear-gradient(135deg,rgba(30,65,90,.85),rgba(10,20,30,.95));border-color:rgba(90,205,255,.4)}.kbchat-msg-name{font-size:11px;font-weight:bold;color:#8de8ff;margin-bottom:2px}.kbchat-msg.kbchat-me .kbchat-msg-name{color:#ffb347}.kbchat-msg-time{font-size:10px;color:rgba(255,255,255,.35);margin-top:3px;text-align:right}.kbchat-form{display:flex;gap:8px;padding:12px 14px;border-top:1px solid rgba(80,195,255,.2)}.kbchat-input{flex:1;min-width:0;padding:10px 14px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:white;font-size:13px;outline:none}.kbchat-input::placeholder{color:rgba(255,255,255,.35)}.kbchat-send{width:40px;height:40px;flex-shrink:0;border-radius:50%;border:1px solid rgba(90,205,255,.4);background:linear-gradient(135deg,rgba(30,65,90,.85),rgba(10,20,30,.95));color:#8de8ff;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}.kbchat-send:active{transform:scale(.92)}.kbchat-mic{width:40px;height:40px;flex-shrink:0;border-radius:50%;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:rgba(255,255,255,.8);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;touch-action:none;user-select:none;transition:transform .15s ease,background .15s ease,border-color .15s ease}.kbchat-mic.kbchat-recording{background:rgba(255,80,80,.18);border-color:rgba(255,90,90,.6);color:#ff8a8a;transform:scale(1.12)}.kbchat-rec-indicator{display:none;align-items:center;gap:8px;padding:0 14px 10px;font-size:11px;color:rgba(255,255,255,.6)}.kbchat-rec-indicator.kbchat-show{display:flex}.kbchat-rec-dot{width:8px;height:8px;border-radius:50%;background:#ff5a5a;animation:kbchat-rec-pulse 1s ease-in-out infinite;flex-shrink:0}@keyframes kbchat-rec-pulse{0%,100%{opacity:1}50%{opacity:.3}}.kbchat-audio-msg{display:flex;align-items:center;gap:8px}.kbchat-audio-msg audio{height:32px;max-width:200px}";document.head.appendChild(s);document.body.innerHTML="<div class=\"app\">\n<div\nclass=\"content\"\nid=\"content\"\n>\n<button\nclass=\"close\"\nid=\"close\"\n>\n\u00d7\n</button>\n<h2 id=\"contentTitle\">\nKIWOLASU\n</h2>\n<p id=\"contentText\">\nPilih salah satu menu.\n</p>\n<div id=\"buttons\"></div>\n<div\nclass=\"video-container\"\nid=\"videoContainer\"\n></div>\n</div>\n<div\nclass=\"radial\"\nid=\"radial\"\n>\n<div\nclass=\"rotate-layer\"\nid=\"rotateLayer\"\n>\n<div class=\"line top\"></div>\n<div class=\"line right\"></div>\n<div class=\"line bottom\"></div>\n<div class=\"line left\"></div>\n<a\nhref=\"#\"\nclass=\"menu top\"\ndata-index=\"0\"\n>\n<span>WHATSAPP</span>\n</a>\n<a\nhref=\"#\"\nclass=\"menu right\"\ndata-index=\"1\"\n>\n<span>TELEGRAM</span>\n</a>\n<a\nhref=\"#\"\nclass=\"menu bottom\"\ndata-index=\"2\"\n>\n<span>DOWNLOAD</span>\n</a>\n<a\nhref=\"#\"\nclass=\"menu left\"\ndata-index=\"3\"\n>\n<span>TUTORIAL</span>\n</a>\n</div>\n<div\nclass=\"center\"\nid=\"center\"\n>\nKIWOLASU\n</div>\n</div>\n</div>\n<div class=\"kbfab-dim\" id=\"kbfabDim\"></div>\n<div class=\"kbfab-panel\" id=\"kbfabPanel\" role=\"menu\" aria-hidden=\"true\">\n<div class=\"kbfab-panel-head\">\n<div class=\"kbfab-eyebrow\"><span class=\"kbfab-dot\"></span> KB \u00b7 LOKAL</div>\n<div class=\"kbfab-title\">Menu Utama</div>\n<div class=\"kbfab-sub\">Tier <b>KIWOLASU LOCAL VERSION</b> &nbsp;\u00b7&nbsp; v3.2</div>\n</div>\n<ul class=\"kbfab-list\">\n<li class=\"kbfab-item kbfab-quick\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\u26a1</div>\n<div class=\"kbfab-text\">\n<div class=\"kbfab-label\">Quick Inject</div>\n<div class=\"kbfab-hint\">Slot belum diatur</div>\n</div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<div class=\"kbfab-divider\"></div>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\ud83c\udf00</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">Inject Hero</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\u23f1\ufe0f</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">Skip Time</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\ud83c\udfea</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">KDA</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\ud83d\udce1</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">Drone</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\ud83d\udd2c</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">View 3D</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\" id=\"kbfabChatItem\">\n<div class=\"kbfab-icon\">\ud83d\udcac</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">Chat</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\ud83d\udee0\ufe0f</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">Setting</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<li class=\"kbfab-item\" tabindex=\"0\" role=\"menuitem\">\n<div class=\"kbfab-icon\">\u2139\ufe0f</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">About</div></div>\n<div class=\"kbfab-chev\">\u203a</div>\n</li>\n<div class=\"kbfab-divider\"></div>\n<li class=\"kbfab-item kbfab-exit\" tabindex=\"0\" role=\"menuitem\" id=\"kbfabCloseItem\">\n<div class=\"kbfab-icon\">\u274c</div>\n<div class=\"kbfab-text\"><div class=\"kbfab-label\">Exit</div></div>\n</li>\n</ul>\n<div class=\"kbfab-foot\">CONTOH SCRIPT \u00b7 TANPA FUNGSI</div>\n</div>\n<div class=\"kbfab-wrap\" id=\"kbfabWrap\">\n<div class=\"kbfab-ring\"></div>\n<div class=\"kbfab-btn\" id=\"kbfabBtn\" role=\"button\" aria-label=\"Buka menu KB-LOKAL\" aria-expanded=\"false\">\n<img src=\"data:image/png;base64,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\" alt=\"Menu\" draggable=\"false\">\n</div>\n</div>\n<div class=\"kbchat-dim\" id=\"kbchatDim\"></div>\n<div class=\"kbchat-panel\" id=\"kbchatPanel\" role=\"dialog\" aria-hidden=\"true\">\n<div class=\"kbchat-head\">\n<div class=\"kbchat-title\">\ud83d\udcac CHAT</div>\n<button type=\"button\" class=\"kbchat-close\" id=\"kbchatClose\" aria-label=\"Tutup chat\">\u2715</button>\n</div>\n<div class=\"kbchat-messages\" id=\"kbchatMessages\"></div>\n<form class=\"kbchat-form\" id=\"kbchatForm\">\n<input type=\"text\" id=\"kbchatInput\" class=\"kbchat-input\" placeholder=\"Tulis pesan...\" maxlength=\"300\" autocomplete=\"off\">\n<button type=\"button\" class=\"kbchat-mic\" id=\"kbchatMic\" aria-label=\"Tahan untuk rekam suara\">\ud83c\udfa4</button>\n<button type=\"submit\" class=\"kbchat-send\" aria-label=\"Kirim\">\u27a4</button>\n</form>\n<div class=\"kbchat-rec-indicator\" id=\"kbchatRecIndicator\">\n<span class=\"kbchat-rec-dot\"></span>\n<span id=\"kbchatRecTime\">0:00</span> \u2014 lepas untuk kirim, geser ke atas untuk batal\n</div>\n</div>";})();
const FIREBASE_URL =
"https://pucuk-9d1d6-default-rtdb.asia-southeast1.firebasedatabase.app/links.json";
let menuData = {
menu1:{
title:"WHATSAPP",
description:
"Hubungi kami melalui WhatsApp.",
url:"#"
},
menu2:{
title:"TELEGRAM",
description:
"Bergabung melalui Telegram.",
url:"#"
},
menu3:{
title:"DOWNLOAD",
description:
"Download file yang tersedia.",
url:"#"
},
menu4:{
title:"TUTORIAL",
description:
"Panduan penggunaan KIWOLASU.",
url:
"https://youtu.be/iAAzIHx9esQ"
}
};
const radial =
document.getElementById("radial");
const center =
document.getElementById("center");
const layer =
document.getElementById("rotateLayer");
const content =
document.getElementById("content");
const title =
document.getElementById("contentTitle");
const text =
document.getElementById("contentText");
const buttons =
document.getElementById("buttons");
const videoContainer =
document.getElementById("videoContainer");
const close =
document.getElementById("close");
const menus =
document.querySelectorAll(".menu");
async function loadFirebase(){
try{
const response =
await fetch(
FIREBASE_URL +
"?t=" +
Date.now()
);
if(!response.ok){
throw new Error(
"Firebase HTTP " +
response.status
);
}
const data =
await response.json();
if(data){
menuData = {
menu1:{
...menuData.menu1,
...(data.menu1 || {})
},
menu2:{
...menuData.menu2,
...(data.menu2 || {})
},
menu3:{
...menuData.menu3,
...(data.menu3 || {})
},
menu4:{
...menuData.menu4,
...(data.menu4 || {})
}
};
updateMenuNames();
}
}catch(error){
console.log(
"Firebase gagal:",
error
);
}
}
function updateMenuNames(){
menus.forEach(
menu=>{
const index =
Number(
menu.dataset.index
);
const key =
"menu" +
(index + 1);
const span =
menu.querySelector(
"span"
);
if(menuData[key]){
span.textContent =
menuData[key].title ||
(
"MENU " +
(index + 1)
);
}
}
);
}
function getYoutubeEmbed(url){
if(!url)
return null;
try{
const parsed =
new URL(url);
let videoId = null;
if(
parsed.hostname.includes(
"youtu.be"
)
){
videoId =
parsed.pathname.substring(1);
}
if(
parsed.hostname.includes(
"youtube.com"
)
){
videoId =
parsed.searchParams.get(
"v"
);
if(
!videoId &&
parsed.pathname.startsWith(
"/embed/"
)
){
videoId =
parsed.pathname
.split("/embed/")[1];
}
}
if(!videoId)
return null;
return (
"https://www.youtube.com/embed/" +
videoId +
"?autoplay=1" +
"&mute=0" +
"&playsinline=1" +
"&rel=0"
);
}catch(_){
return null;
}
}
let opened = false;
let dragging = false;
let moved = false;
let startAngle = 0;
let currentRotation = 0;
let startRotation = 0;
function getAngle(x,y){
const rect =
radial.getBoundingClientRect();
const cx =
rect.left +
rect.width / 2;
const cy =
rect.top +
rect.height / 2;
return Math.atan2(
y - cy,
x - cx
) * 180 / Math.PI;
}
function setRotation(angle){
currentRotation =
angle;
layer.style.transform =
`translate3d(0,0,0) rotate(${angle}deg)`;
layer.style.setProperty(
"--rotation",
`${angle}deg`
);
}
function getTargetRotation(index){
const targets = [
0,
-90,
-180,
-270
];
const baseTarget =
targets[index];
const turns =
Math.round(
(
currentRotation -
baseTarget
) / 360
);
return (
baseTarget +
turns * 360
);
}
center.addEventListener(
"click",
function(){
if(moved){
moved = false;
return;
}
opened =
!opened;
radial.classList.toggle(
"open",
opened
);
}
);
radial.addEventListener(
"pointerdown",
function(e){
if(!opened)
return;
if(e.target === center)
return;
if(e.target.closest(".menu"))
return;
dragging = true;
moved = false;
startAngle =
getAngle(
e.clientX,
e.clientY
);
startRotation =
currentRotation;
radial.classList.add(
"dragging"
);
radial.setPointerCapture(
e.pointerId
);
}
);
radial.addEventListener(
"pointermove",
function(e){
if(!dragging)
return;
const angle =
getAngle(
e.clientX,
e.clientY
);
let delta =
angle -
startAngle;
if(delta > 180)
delta -= 360;
if(delta < -180)
delta += 360;
if(
Math.abs(delta) > 5
){
moved = true;
}
setRotation(
startRotation +
delta
);
}
);
function finishDrag(e){
if(!dragging)
return;
dragging = false;
radial.classList.remove(
"dragging"
);
const snapped =
Math.round(
currentRotation / 90
) * 90;
layer.style.transition =
"transform .5s cubic-bezier(.2,.85,.3,1.15)";
setRotation(
snapped
);
try{
radial.releasePointerCapture(
e.pointerId
);
}catch(_){}
}
radial.addEventListener(
"pointerup",
finishDrag
);
radial.addEventListener(
"pointercancel",
finishDrag
);
function createButton(
label,
url
){
const button =
document.createElement(
"a"
);
button.className =
"link-button";
button.textContent =
label;
button.href =
url || "#";
button.target =
"_blank";
button.rel =
"noopener noreferrer";
return button;
}
function showMenu(index){
const key =
"menu" +
(index + 1);
const data =
menuData[key];
if(!data)
return;
menus.forEach(
menu =>
menu.classList.remove(
"active"
)
);
menus[index].classList.add(
"active"
);
const target =
getTargetRotation(
index
);
layer.style.transition =
"transform .6s cubic-bezier(.2,.85,.3,1.15)";
setRotation(
target
);
title.textContent =
data.title ||
"KIWOLASU";
text.textContent =
data.description ||
"";
buttons.innerHTML =
"";
videoContainer.innerHTML =
"";
videoContainer.style.display =
"none";
if(index < 3){
buttons.appendChild(
createButton(
data.title ||
"BUKA",
data.url
)
);
}
if(index === 3){
const embed =
getYoutubeEmbed(
data.url
);
if(embed){
const iframe =
document.createElement(
"iframe"
);
iframe.src =
embed;
iframe.title =
data.title ||
"Tutorial";
iframe.allow =
"autoplay; encrypted-media; fullscreen; picture-in-picture";
iframe.allowFullscreen =
true;
videoContainer.appendChild(
iframe
);
videoContainer.style.display =
"block";
}else{
text.textContent =
"Link video YouTube tidak valid.";
}
}
content.classList.remove(
"show"
);
void content.offsetWidth;
content.classList.add(
"show"
);
}
menus.forEach(
menu=>{
menu.addEventListener(
"click",
function(e){
e.preventDefault();
if(moved){
moved = false;
return;
}
const index =
Number(
menu.dataset.index
);
showMenu(index);
}
);
}
);
close.addEventListener(
"click",
function(){
content.classList.remove(
"show"
);
buttons.innerHTML =
"";
videoContainer.innerHTML =
"";
videoContainer.style.display =
"none";
}
);
loadFirebase();
(function(){
const kbFab = document.getElementById("kbfabBtn");
const kbWrap = document.getElementById("kbfabWrap");
const kbPanel = document.getElementById("kbfabPanel");
const kbDim = document.getElementById("kbfabDim");
const kbCloseItem = document.getElementById("kbfabCloseItem");
let kbOpen = false;
function kbPositionPanel(){
const isLandscape =
window.matchMedia("(orientation: landscape)").matches;
if(isLandscape){
kbPanel.style.right = "";
kbPanel.style.left = "";
kbPanel.style.top = "";
kbPanel.style.bottom = "";
return;
}
const r = kbWrap.getBoundingClientRect();
const margin = 12;
const panelW = kbPanel.offsetWidth || 272;
const panelMaxH = window.innerHeight * 0.52 + 90;
let right = window.innerWidth - r.right;
right = Math.min(Math.max(right, margin), window.innerWidth - panelW - margin);
kbPanel.style.right = right + "px";
kbPanel.style.left = "auto";
const spaceAbove = r.top;
if(spaceAbove > panelMaxH + margin){
kbPanel.style.bottom = (window.innerHeight - r.top + 10) + "px";
kbPanel.style.top = "auto";
}else{
kbPanel.style.top = (r.bottom + 10) + "px";
kbPanel.style.bottom = "auto";
}
}
function kbSetOpen(v){
kbOpen = v;
kbFab.classList.toggle("kbfab-open", kbOpen);
kbFab.setAttribute("aria-expanded", kbOpen ? "true" : "false");
if(kbOpen) kbPositionPanel();
kbPanel.classList.toggle("kbfab-show", kbOpen);
kbPanel.setAttribute("aria-hidden", kbOpen ? "false" : "true");
kbDim.classList.toggle("kbfab-show", kbOpen);
}
kbDim.addEventListener("click", () => kbSetOpen(false));
kbCloseItem.addEventListener("click", () => kbSetOpen(false));
document.querySelectorAll(".kbfab-item").forEach(item=>{
item.addEventListener("keydown", e=>{
if(e.key === "Enter" || e.key === " "){
e.preventDefault();
item.click();
}
});
});
window.addEventListener("resize", () => { if(kbOpen) kbPositionPanel(); });
let kbDragging = false;
let kbMoved = false;
let kbStartX = 0, kbStartY = 0;
let kbOriginLeft = 0, kbOriginTop = 0;
const KB_DRAG_THRESHOLD = 6;
function kbClamp(val, min, max){ return Math.min(Math.max(val, min), max); }
function kbPointerDown(e){
kbDragging = true;
kbMoved = false;
kbStartX = e.clientX;
kbStartY = e.clientY;
if(!kbOpen){
const r = kbWrap.getBoundingClientRect();
kbOriginLeft = r.left;
kbOriginTop = r.top;
kbWrap.classList.add("kbfab-dragging");
}
try{ kbFab.setPointerCapture(e.pointerId); }catch(_){}
}
function kbPointerMove(e){
if(!kbDragging || kbOpen) return;
const dx = e.clientX - kbStartX;
const dy = e.clientY - kbStartY;
if(Math.abs(dx) > KB_DRAG_THRESHOLD || Math.abs(dy) > KB_DRAG_THRESHOLD) kbMoved = true;
if(!kbMoved) return;
const w = kbWrap.offsetWidth;
const h = kbWrap.offsetHeight;
const newLeft = kbClamp(kbOriginLeft + dx, 4, window.innerWidth - w - 4);
const newTop = kbClamp(kbOriginTop + dy, 4, window.innerHeight - h - 4);
kbWrap.style.left = newLeft + "px";
kbWrap.style.top = newTop + "px";
}
function kbPointerUp(e){
if(!kbDragging) return;
kbDragging = false;
kbWrap.classList.remove("kbfab-dragging");
if(!kbMoved){
kbSetOpen(!kbOpen);
}
kbMoved = false;
try{ kbFab.releasePointerCapture(e.pointerId); }catch(_){}
}
kbFab.addEventListener("pointerdown", kbPointerDown);
kbFab.addEventListener("pointermove", kbPointerMove);
kbFab.addEventListener("pointerup", kbPointerUp);
kbFab.addEventListener("pointercancel", kbPointerUp);
})();
(function(){
const CHAT_BASE_URL =
"https://pucuk-9d1d6-default-rtdb.asia-southeast1.firebasedatabase.app/chat";
const chatItem = document.getElementById("kbfabChatItem");
const chatDim = document.getElementById("kbchatDim");
const chatPanel = document.getElementById("kbchatPanel");
const chatClose = document.getElementById("kbchatClose");
const chatMessages = document.getElementById("kbchatMessages");
const chatForm = document.getElementById("kbchatForm");
const chatInput = document.getElementById("kbchatInput");
const chatMic = document.getElementById("kbchatMic");
const recIndicator = document.getElementById("kbchatRecIndicator");
const recTimeEl = document.getElementById("kbchatRecTime");
if(!chatItem || !chatPanel) return;
let myName = localStorage.getItem("kbchat_name");
if(!myName){
myName = "Tamu" + Math.floor(1000 + Math.random() * 9000);
localStorage.setItem("kbchat_name", myName);
}
const renderedKeys = new Map();
function formatTime(ts){
if(!ts) return "";
const d = new Date(ts);
const hh = String(d.getHours()).padStart(2, "0");
const mm = String(d.getMinutes()).padStart(2, "0");
return hh + ":" + mm;
}
function appendMessage(key, data){
if(!data || renderedKeys.has(key)) return;
const bubble = document.createElement("div");
bubble.className = "kbchat-msg" + (data.name === myName ? " kbchat-me" : "");
const nameEl = document.createElement("div");
nameEl.className = "kbchat-msg-name";
nameEl.textContent = data.name || "Tamu";
bubble.appendChild(nameEl);
if(data.type === "audio" && data.audio){
const audioWrap = document.createElement("div");
audioWrap.className = "kbchat-audio-msg";
const audioEl = document.createElement("audio");
audioEl.controls = true;
audioEl.src = data.audio;
audioWrap.appendChild(audioEl);
bubble.appendChild(audioWrap);
}else{
const textEl = document.createElement("div");
textEl.textContent = data.text || "";
bubble.appendChild(textEl);
}
const timeEl = document.createElement("div");
timeEl.className = "kbchat-msg-time";
timeEl.textContent = formatTime(data.ts);
bubble.appendChild(timeEl);
renderedKeys.set(key, bubble);
chatMessages.appendChild(bubble);
chatMessages.scrollTop = chatMessages.scrollHeight;
}
function removeMessage(key){
const bubble = renderedKeys.get(key);
if(bubble && bubble.parentNode){
bubble.parentNode.removeChild(bubble);
}
renderedKeys.delete(key);
}
async function loadHistory(){
try{
const res = await fetch(
CHAT_BASE_URL + ".json?orderBy=%22ts%22&limitToLast=15&t=" + Date.now()
);
if(!res.ok) return;
const data = await res.json();
if(!data) return;
Object.keys(data)
.sort((a, b) => (data[a].ts || 0) - (data[b].ts || 0))
.forEach(key => appendMessage(key, data[key]));
}catch(_){}
}
let chatStream = null;
function startStream(){
if(chatStream || typeof EventSource === "undefined") return;
try{
chatStream = new EventSource(CHAT_BASE_URL + ".json");
chatStream.addEventListener("put", function(e){
try{
const payload = JSON.parse(e.data);
if(!payload || payload.path === undefined) return;
if(payload.path === "/"){
if(payload.data){
Object.keys(payload.data)
.sort((a, b) => (payload.data[a].ts || 0) - (payload.data[b].ts || 0))
.forEach(key => appendMessage(key, payload.data[key]));
}
}else{
const key = payload.path.replace("/", "");
if(payload.data === null){
removeMessage(key);
}else{
appendMessage(key, payload.data);
}
}
}catch(_){}
});
chatStream.onerror = function(){
if(chatStream){
chatStream.close();
chatStream = null;
}
setTimeout(startStream, 4000);
};
}catch(_){}
}
const CHAT_MAX_MESSAGES = 15;
async function trimHistory(){
try{
const res = await fetch(
CHAT_BASE_URL + ".json?orderBy=%22ts%22&t=" + Date.now()
);
if(!res.ok) return;
const data = await res.json();
if(!data) return;
const keys = Object.keys(data)
.sort((a, b) => (data[a].ts || 0) - (data[b].ts || 0));
const excess = keys.length - CHAT_MAX_MESSAGES;
if(excess <= 0) return;
const toDelete = keys.slice(0, excess);
await Promise.all(
toDelete.map(key =>
fetch(CHAT_BASE_URL + "/" + key + ".json", { method: "DELETE" }).catch(() => {})
)
);
}catch(_){}
}
async function sendPayload(payload){
try{
await fetch(CHAT_BASE_URL + ".json", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload)
});
trimHistory();
}catch(_){}
}
async function sendMessage(text){
text = text.trim();
if(!text) return;
sendPayload({
name: myName,
text: text,
ts: Date.now()
});
}
chatForm.addEventListener("submit", function(e){
e.preventDefault();
const val = chatInput.value;
chatInput.value = "";
sendMessage(val);
});
const REC_MAX_MS = 30000;
const REC_CANCEL_OFFSET_PX = 60;
let mediaRecorder = null;
let recChunks = [];
let recStream = null;
let recStartY = 0;
let recCancelled = false;
let recStartTime = 0;
let recTimerInterval = null;
let recMaxTimeout = null;
function formatRecTime(ms){
const totalSec = Math.floor(ms / 1000);
const mm = Math.floor(totalSec / 60);
const ss = String(totalSec % 60).padStart(2, "0");
return mm + ":" + ss;
}
function pickMimeType(){
const candidates = [
"audio/webm;codecs=opus",
"audio/webm",
"audio/mp4",
"audio/ogg;codecs=opus"
];
for(const type of candidates){
if(window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(type)){
return type;
}
}
return "";
}
async function startRecording(){
if(mediaRecorder) return;
if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder){
alert("Perangkat/browser ini tidak mendukung rekam suara.");
return;
}
try{
recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
}catch(_){
alert("Izin mikrofon ditolak atau tidak tersedia.");
return;
}
recChunks = [];
recCancelled = false;
const mimeType = pickMimeType();
try{
mediaRecorder = mimeType
? new MediaRecorder(recStream, { mimeType })
: new MediaRecorder(recStream);
}catch(_){
mediaRecorder = new MediaRecorder(recStream);
}
mediaRecorder.addEventListener("dataavailable", function(e){
if(e.data && e.data.size > 0) recChunks.push(e.data);
});
mediaRecorder.addEventListener("stop", function(){
recStream.getTracks().forEach(t => t.stop());
recStream = null;
clearInterval(recTimerInterval);
clearTimeout(recMaxTimeout);
recTimerInterval = null;
recMaxTimeout = null;
recIndicator.classList.remove("kbchat-show");
chatMic.classList.remove("kbchat-recording");
if(recCancelled || recChunks.length === 0){
mediaRecorder = null;
return;
}
const blobType = mediaRecorder.mimeType || "audio/webm";
const blob = new Blob(recChunks, { type: blobType });
const durationMs = Date.now() - recStartTime;
mediaRecorder = null;
const reader = new FileReader();
reader.onload = function(){
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
recTimerInterval = setInterval(function(){
recTimeEl.textContent = formatRecTime(Date.now() - recStartTime);
}, 250);
recMaxTimeout = setTimeout(function(){
stopRecording(false);
}, REC_MAX_MS);
}
function stopRecording(cancel){
if(!mediaRecorder || mediaRecorder.state === "inactive") return;
recCancelled = !!cancel;
mediaRecorder.stop();
}
chatMic.addEventListener("pointerdown", function(e){
e.preventDefault();
recStartY = e.clientY;
try{ chatMic.setPointerCapture(e.pointerId); }catch(_){}
startRecording();
});
chatMic.addEventListener("pointermove", function(e){
if(!mediaRecorder) return;
const dy = recStartY - e.clientY;
if(dy > REC_CANCEL_OFFSET_PX){
chatMic.classList.add("kbchat-recording");
recIndicator.textContent = "";
recIndicator.innerHTML = '<span class="kbchat-rec-dot"></span> Lepas untuk batal';
}else{
recIndicator.innerHTML = '<span class="kbchat-rec-dot"></span><span id="kbchatRecTime">' +
formatRecTime(Date.now() - recStartTime) + '</span> — lepas untuk kirim, geser ke atas untuk batal';
}
});
chatMic.addEventListener("pointerup", function(e){
const dy = recStartY - e.clientY;
stopRecording(dy > REC_CANCEL_OFFSET_PX);
try{ chatMic.releasePointerCapture(e.pointerId); }catch(_){}
});
chatMic.addEventListener("pointercancel", function(){
stopRecording(true);
});
let chatOpen = false;
function setChatOpen(v){
chatOpen = v;
chatPanel.classList.toggle("kbchat-show", chatOpen);
chatPanel.setAttribute("aria-hidden", chatOpen ? "false" : "true");
chatDim.classList.toggle("kbchat-show", chatOpen);
if(chatOpen){
loadHistory();
startStream();
}
}
function openChat(){
setChatOpen(true);
}
chatItem.addEventListener("click", openChat);
chatItem.addEventListener("keydown", function(e){
if(e.key === "Enter" || e.key === " "){
e.preventDefault();
openChat();
}
});
chatClose.addEventListener("click", () => setChatOpen(false));
chatDim.addEventListener("click", () => setChatOpen(false));
})();
