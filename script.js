/* --- Global Data Holder --- */
let DATA = { COSTS: [], VIRUS: [], ENEMIES: [], TEXT: {} };

const app = (() => {
    const CONFIG = {
        SAVE_KEY: 's6_spore_v3_safe',
        DATA_KEY: 's6_custom_data_v1',
        MAX_LV: 60,
        PROD_BASE: 720
    };

    let lang = 'ja';
    let activeBuff = 0; 
    let skillActive = false; 
    let currentTab = 'main'; 
    
    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);
    const roman = n => ['','Ⅰ','Ⅱ','Ⅲ','Ⅳ'][n] || n;

    // ★ 修正: data.js の変数からデータを同期的に読み込む
    const init = () => {
        try {
            // 1. data.js で定義された DEFAULT_MASTER_DATA をコピー
            if (typeof DEFAULT_MASTER_DATA === 'undefined') {
                throw new Error("data.js not found or invalid");
            }
            DATA = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));

            // 2. カスタムマスターデータの適用
            loadMasterData();

            // 3. UIのセットアップ
            const maxDataLv = DATA.COSTS.findLastIndex(n => n > 0);
            const subTitle = document.querySelector('.subtitle');
            if(subTitle) subTitle.textContent = `LastWar S6 Spore Calc (Data: Lv.${maxDataLv})`;
            
            lang = localStorage.getItem('s5_lang') || 'ja';
            renderUI();
            
            try { loadData(); } catch(e) { console.warn("Load skipped", e); }
            setLang(lang);
            
            setTimeout(() => {
                if(!($('now-time').value)) setNow();
                calc();
            }, 50);
        } catch(err) {
            console.error("Init Error:", err);
            alert("データの初期化に失敗しました。data.jsが正しく読み込まれているか確認してください。");
        }
    };

    const loadMasterData = () => {
        const raw = localStorage.getItem(CONFIG.DATA_KEY);
        if(raw) {
            try {
                const custom = JSON.parse(raw);
                if(custom.COSTS) DATA.COSTS = custom.COSTS;
                if(custom.VIRUS) DATA.VIRUS = custom.VIRUS;
                if(custom.ENEMIES) DATA.ENEMIES = custom.ENEMIES;
            } catch(e) {}
        }
        while(DATA.COSTS.length <= 60) DATA.COSTS.push(0);
        while(DATA.VIRUS.length <= 60) DATA.VIRUS.push(0);
        while(DATA.ENEMIES.length <= 120) DATA.ENEMIES.push(0);
    };

    const renderUI = () => {
        const fArea = $('factory-area');
        if(fArea) {
            fArea.innerHTML = '';
            for(let i=1; i<=4; i++) {
                const div = document.createElement('div');
                div.innerHTML = `
                    <label><span data-t="f_prefix"></span> ${roman(i)}</label>
                    <select id="f${i}" onchange="app.calc()"></select>
                `;
                fArea.appendChild(div);
                fillSel(`f${i}`, 0, 30);
            }
        }
        fillSel('weekly-lv', 0, 30);
        fillSel('lab-cur', 0, CONFIG.MAX_LV);
        fillSel('lab-tgt', 1, CONFIG.MAX_LV);
    };

    const fillSel = (id, min, max) => {
        const s = $(id); if(!s) return;
        s.innerHTML = '';
        if(min===0) s.add(new Option('-', 0));
        const isLab = id.startsWith('lab-');
        for(let i=Math.max(1, min); i<=max; i++) {
            let label = 'Lv.' + i;
            if(isLab) label += ` [${DATA.VIRUS[i] || 0}]`; 
            else {
                const prod = i * CONFIG.PROD_BASE;
                label += ` [${prod >= 1000 ? (prod/1000).toFixed(2)+'K' : prod}/h]`;
            }
            s.add(new Option(label, i));
        }
    };

    const step = (type, delta) => {
        if(type === 'disc') {
            const el = $('discount'); 
            let val = Math.max(0, Math.min(20, Math.round((parseFloat(el.value || 0) + delta) * 10) / 10));
            el.value = val;
            $('disp-disc').textContent = val.toFixed(1);
            calc(); return;
        }
        if(type === 'enemy') {
            const el = $('enemy-lv');
            let val = Math.max(1, (parseInt(el.value || 1) + delta));
            let realMax = Math.max(1, DATA.ENEMIES.findLastIndex(v => v > 0));
            el.value = Math.min(val, realMax);
            calc(); return;
        }
        const el = $(`lab-${type}`); if(!el) return;
        let val = Math.max(0, Math.min(CONFIG.MAX_LV, parseInt(el.value || 0) + delta));
        el.value = val;
        if(type === 'cur') onCurChange(); else calc();
    };

    const toggleWeekly = () => {
        const isActive = $('weekly-active').checked;
        $('weekly-lv').classList.toggle('disabled-item', !isActive);
        calc(true);
    };

    const toggleBuffBtn = (val) => {
        if (activeBuff === val) activeBuff = 0; else activeBuff = val;
        $('btn-buff-250')?.classList.toggle('active', activeBuff === 250);
        $('btn-buff-500')?.classList.toggle('active', activeBuff === 500);
        calc(true);
    };

    const toggleSkill = () => {
        skillActive = !skillActive;
        $('btn-skill')?.classList.toggle('active', skillActive);
        calc(true);
    };

    const switchTab = (tabName) => {
        currentTab = tabName;
        $('view-main').style.display = (tabName === 'main' ? 'block' : 'none');
        $('view-battle').style.display = (tabName === 'battle' ? 'block' : 'none');
        $('tab-btn-main').classList.toggle('active', tabName === 'main');
        $('tab-btn-battle').classList.toggle('active', tabName === 'battle');
        calc();
    };

    const updateSteppers = () => {
        const cLv = parseInt($('lab-cur').value || 0), tLv = parseInt($('lab-tgt').value || 0);
        if($('disp-cur-lv')) $('disp-cur-lv').textContent = cLv;
        if($('disp-cur-res')) $('disp-cur-res').textContent = (DATA.VIRUS[cLv] || 0).toLocaleString();
        if($('disp-tgt-lv')) $('disp-tgt-lv').textContent = tLv;
        if($('disp-tgt-res')) $('disp-tgt-res').textContent = (DATA.VIRUS[tLv] || 0).toLocaleString();
        if($('disp-disc')) $('disp-disc').textContent = parseFloat($('discount').value || 0).toFixed(1);
        const eLv = parseInt($('enemy-lv').value || 1);
        if($('disp-enemy-lv')) $('disp-enemy-lv').textContent = eLv;
        if($('disp-enemy-req')) $('disp-enemy-req').textContent = (DATA.ENEMIES[eLv] || 0).toLocaleString();
    };

    const onCurChange = () => {
        const cLv = parseInt($('lab-cur')?.value || 0);
        const tEl = $('lab-tgt');
        if(tEl && parseInt(tEl.value) <= cLv) tEl.value = Math.min(cLv + 1, CONFIG.MAX_LV);
        calc(true);
    };

    const calc = (resetTarget = false) => {
        updateSteppers();
        let hourlyProd = 0;
        for(let i=1; i<=4; i++) hourlyProd += ((parseInt($(`f${i}`)?.value) || 0) * CONFIG.PROD_BASE);
        if ($('weekly-active')?.checked) hourlyProd += ((parseInt($('weekly-lv')?.value) || 0) * CONFIG.PROD_BASE);

        if($('total-prod')) $('total-prod').innerHTML = fmtKM(hourlyProd, true) + '/h';
        if($('res-daily')) $('res-daily').innerHTML = fmtKM(hourlyProd * 24, true);

        const cLv = parseInt($('lab-cur')?.value || 0), tLv = parseInt($('lab-tgt')?.value || 0);
        const factor = 1000 - Math.round(parseFloat($('discount')?.value || 0) * 10);
        let realCost = 0; 
        if(cLv < tLv) for(let i = cLv; i < tLv; i++) realCost += Math.ceil(((DATA.COSTS[i+1] || 0) * factor) / 1000);
        if($('res-cost')) $('res-cost').innerHTML = fmt(realCost);

        const totalBonus = (($('weekly-active').checked && parseInt($('weekly-lv').value) >= 1) ? 250 : 0) + activeBuff;
        if($('res-virus')) $('res-virus').textContent = `${fmt((DATA.VIRUS[cLv] || 0) + totalBonus)} → ${fmt((DATA.VIRUS[tLv] || 0) + totalBonus)}`;

        const battleRes = (DATA.VIRUS[cLv] || 0) + totalBonus + (skillActive ? 250 : 0);
        if($('disp-battle-my-res')) $('disp-battle-my-res').textContent = fmt(battleRes);

        let maxWinLv = 0;
        for (let i = 1; i < DATA.ENEMIES.length; i++) {
            if (DATA.ENEMIES[i] === 0 || DATA.ENEMIES[i] > battleRes) break;
            maxWinLv = i;
        }
        if ($('disp-max-win-lv')) $('disp-max-win-lv').textContent = maxWinLv;
        if ($('disp-max-win-res')) $('disp-max-win-res').textContent = fmt(DATA.ENEMIES[maxWinLv] || 0);

        let eLv = parseInt($('enemy-lv').value || 1);
        if (resetTarget || eLv <= maxWinLv) {
            eLv = Math.min(maxWinLv + 1, DATA.ENEMIES.findLastIndex(v => v > 0));
            $('enemy-lv').value = eLv;
        }
        
        const enemyReq = DATA.ENEMIES[eLv] || 0;
        if ($('battle-result') && enemyReq > 0) {
            if (battleRes >= enemyReq) {
                $('battle-detail').innerHTML = `<span style="color:#2E7D32; font-weight:bold;">${DATA.TEXT[lang].res_over}: +${fmt(battleRes - enemyReq)}</span>`;
                $('battle-result').className = "battle-result-box win";
            } else {
                const pena = Math.ceil(((enemyReq - battleRes) / enemyReq) * 100) * 2;
                $('battle-detail').innerHTML = `${DATA.TEXT[lang].res_short}: ${fmt(enemyReq - battleRes)}<br><div style="margin-top:4px; font-weight:bold; color:#C62828;">${DATA.TEXT[lang].res_dmg}: ${Math.max(0, 100-pena)}% (${DATA.TEXT[lang].res_pena}: -${Math.min(99.9, pena)}%)</div>`;
                $('battle-result').className = "battle-result-box lose";
            }
        }

        const shortage = Math.max(0, realCost - parseStock($('stock')?.value || 0));
        if($('res-short')) $('res-short').innerHTML = fmtKM(shortage > 0 ? Math.ceil(shortage/1000)*1000 : 0, true);
        updateStatus(shortage, hourlyProd);
    };

    const updateStatus = (shortage, hourlyProd) => {
        const elTime = $('res-time'), elDate = $('res-date'), elMsg = $('status-msg');
        if(!elTime || !elDate || !elMsg) return;
        if(shortage <= 0) { setMsg(elMsg, elTime, "msg_ok", "OK", "#4E342E"); elDate.textContent = ""; return; }
        if(hourlyProd <= 0) { setMsg(elMsg, elTime, "msg_stop", "---", "#8D6E63"); elDate.textContent = "--/--"; return; }

        const d = new Date();
        const nowVal = $('now-time').value.split(':');
        d.setHours(nowVal[0]||0, nowVal[1]||0, 0, 0);
        d.setMinutes(d.getMinutes() + ((shortage / hourlyProd) * 60));
        setMsg(elMsg, elTime, "msg_wait", `${d.getHours()}:${pz(d.getMinutes())}`, "#BF360C");
        elDate.textContent = `${d.getMonth()+1}/${d.getDate()}`;
    };

    const setMsg = (m, t, k, txt, c) => { m.textContent = DATA.TEXT[lang][k]; m.style.color = (c==="#BF360C"?"#5D4037":c); t.textContent = txt; t.style.color = c; };
    const fmt = n => n.toLocaleString();
    const pz = n => String(n).padStart(2, '0');
    const fmtKM = (n, d=false) => n >= 1000000 ? (n/1000000).toFixed(2)+'M' : n >= 1000 ? (n/1000).toFixed(2)+'K' : fmt(n);
    const parseStock = v => {
        if(!v) return 0;
        let s = v.toString().toLowerCase().replace(/,/g,''), m = 1;
        if(s.endsWith('k')) { m=1000; s=s.slice(0,-1); }
        else if(s.endsWith('m')) { m=1000000; s=s.slice(0,-1); }
        return Math.floor((parseFloat(s)||0) * m); 
    };
    
    const setNow = () => {
        const d = new Date();
        if($('now-time')) $('now-time').value = `${pz(d.getHours())}:${pz(d.getMinutes())}`;
        if($('now-date')) $('now-date').textContent = `${d.getMonth()+1}/${d.getDate()}`;
        calc();
    };

    const save = () => {
        const data = {
            fs: [1,2,3,4].map(i => $(`f${i}`)?.value || 0),
            wk: $('weekly-lv').value, wa: $('weekly-active').checked,
            lc: $('lab-cur').value, lt: $('lab-tgt').value,
            st: $('stock').value, ds: $('discount').value,
            bf: activeBuff, elv: $('enemy-lv').value, sa: skillActive
        };
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
        alert(lang === 'ja' ? '保存しました' : 'Saved');
    };

    const loadData = () => {
        const raw = localStorage.getItem(CONFIG.SAVE_KEY); if(!raw) return;
        const d = JSON.parse(raw);
        if(d.fs) d.fs.forEach((v,i) => { if($(`f${i+1}`)) $(`f${i+1}`).value = v; });
        if(d.wk) $('weekly-lv').value = d.wk;
        if(d.wa !== undefined) $('weekly-active').checked = d.wa;
        toggleWeekly();
        if(d.lc) $('lab-cur').value = d.lc;
        if(d.lt) $('lab-tgt').value = d.lt;
        if(d.st) $('stock').value = d.st;
        if(d.ds) { $('discount').value = d.ds; $('disp-disc').textContent = parseFloat(d.ds).toFixed(1); }
        if(d.bf) {
            activeBuff = parseInt(d.bf);
            $('btn-buff-250')?.classList.toggle('active', activeBuff === 250);
            $('btn-buff-500')?.classList.toggle('active', activeBuff === 500);
        }
        if(d.elv) $('enemy-lv').value = d.elv;
        if(d.sa !== undefined) {
            skillActive = d.sa;
            $('btn-skill')?.classList.toggle('active', skillActive);
        }
    };

    const setLang = (l) => {
        lang = l; localStorage.setItem('s5_lang', l);
        $$('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if(DATA.TEXT[l][key]) el.textContent = DATA.TEXT[l][key];
        });
        $$('.flag-icon').forEach(e => e.classList.toggle('active', e.getAttribute('onclick').includes(l)));
        calc();
    };

    const toggleAdmin = () => {
        const p = $('admin-panel'); if(!p) return;
        p.style.display = (p.style.display === 'none' ? 'block' : 'none');
        if(p.style.display === 'block') {
            $('admin-costs').value = DATA.COSTS.join(', ');
            $('admin-virus').value = DATA.VIRUS.join(', ');
            $('admin-enemies').value = DATA.ENEMIES.join(', ');
        }
    };

    const saveAdmin = () => {
        try {
            const customData = {
                COSTS: $('admin-costs').value.split(',').map(s => parseInt(s.trim()) || 0),
                VIRUS: $('admin-virus').value.split(',').map(s => parseInt(s.trim()) || 0),
                ENEMIES: $('admin-enemies').value.split(',').map(s => parseInt(s.trim()) || 0)
            };
            localStorage.setItem(CONFIG.DATA_KEY, JSON.stringify(customData));
            location.reload();
        } catch(e) { alert('Error'); }
    };
    
    window.app = { 
        init, calc, save, reset: () => { if(confirm('Reset?')) { localStorage.removeItem(CONFIG.SAVE_KEY); location.reload(); } }, 
        setLang, setNow, onCurChange, toggleAdmin, saveAdmin, 
        resetAdmin: () => { if(confirm('Reset Master?')){localStorage.removeItem(CONFIG.DATA_KEY); location.reload();} }, 
        toggleBuffBtn, step, toggleWeekly, switchTab, toggleSkill, 
        addUnit: (u) => { $('stock').value = ($('stock').value || "") + u; calc(); $('stock').focus(); },
        backspace: () => { $('stock').value = ($('stock').value || "").slice(0, -1); calc(); $('stock').focus(); }
    };
    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);