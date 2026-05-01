/* --- Static Data --- */
const DEFAULT_DATA = {
    COSTS: [0, 700, 11200, 22400, 44800, 89600, 125440, 163073, 195686, 234824, 281788, 338146, 405776, 486931, 584317, 701180, 771299, 848428, 933270, 1026598, 1129258, 1242183, 1366401, 1503041, 1653346, 1818680, 2000549, 2200602, 2310634, 2426164, 2547472],
    VIRUS: [0, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12750, 13500, 14250, 15000],
    ENEMIES: [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500],
    
    TEXT: {
        ja: { 
            title: "胞子生産計算機", 
            tab_main: "生産計算", 
            tab_battle: "討伐シミュレータ",
            h_prod: "生産設定", 
            weekly: "週間配達", 
            time: "基準時刻", 
            h_status: "目標設定（真菌研究所）",
            h_buff: "コーヒーバフ (ウイルス耐性)", 
            h_battle: "討伐シミュレーション", 
            cur_lv: "現在ステータス",
            tgt_lv: "目標ステータス",
            lbl_lv: "Lv:",
            lbl_res: "耐性:",
            lbl_cur_buffed: "現在のステータス (バフ込)",
            lbl_next_target: "次の目標 (NEXT TARGET)",
            lbl_req_res: "必要耐性",
            lbl_skill: "戦術スキル: 悪魔狩・怪物殺し +250",
            lbl_max_win: "討伐可能ライン (最大)",
            lbl_bonus: "強化設定 (Buff & Skill)",
            lbl_indiv_check: "終末精鋭Lv & 必要耐性 (個別判定)",
            lbl_kino: "キノキノ守れ +250",
            lbl_guardian: "守護者集結 +250",
            res_over: "超過",
            res_short: "不足",
            res_dmg: "ダメージ",
            res_pena: "与ダメージ",
            stock: "保有量", 
            disc: "消費減少率(%)", 
            h_res: "計算結果", 
            r_daily: "最大生産時間(24h)", 
            r_cost: "必要量", 
            r_virus: "合計ウイルス耐性", 
            r_short: "不足 (切上げ)", 
            btn_save: "データ保存", 
            btn_reset: "リセット", 
            btn_now: "現在", 
            msg_ok: "達成済み", 
            msg_wait: "必要量達成時刻", 
            msg_stop: "生産量 0", 
            f_prefix: "胞子工場",
            h_breakdown: "段階別コスト内訳" 
        },
        en: { 
            title: "Coffee Calc", 
            tab_main: "Main Calc", 
            tab_battle: "Battle Sim",
            h_prod: "Production", 
            weekly: "Weekly", 
            time: "Base Time", 
            h_status: "Goal Setting (Caffeine Inst.)",
            h_buff: "Coffee Buff (Virus Res.)",
            h_battle: "Battle Sim ",
            cur_lv: "Current Status",
            tgt_lv: "Target Status",
            lbl_lv: "Lv:",
            lbl_res: "Res:",
            lbl_cur_buffed: "Current Status (Buffed)",
            lbl_enemy_lv: "Doom Elite Lv",
            lbl_req_res: "Req Res",
            lbl_skill: "Tactical Skill: Monster Slayer +250",
            lbl_max_win: "Max Defeatable Limit",
            lbl_bonus: "Bonus Settings (Buff & Skill)",
            lbl_indiv_check: "Enemy Lv & Req Res (Individual)",
            lbl_kino: "Kino Kino Protect +250",
            lbl_guardian: "Guardian Gathering +250",
            res_over: "Surplus",
            res_short: "Shortage",
            res_dmg: "Damage",
            res_pena: "Penalty",
            stock: "Stock", 
            disc: "Resource Reduction(%)", 
            h_res: "Result", 
            r_daily: "Max Production Time(24h)", 
            r_cost: "Required Amount", 
            r_virus: "Total Virus Resistance", 
            r_short: "Shortage (Rounded Up)", 
            btn_save: "Data Save", 
            btn_reset: "Reset", 
            btn_now: "Now", 
            msg_ok: "Completed", 
            msg_wait: "Prediction of required amount", 
            msg_stop: "No Prod", 
            f_prefix: "Coffee Factory",
            h_breakdown: "Step-by-Step Breakdown" 
        }
    }
};

let DATA = { COSTS: [...DEFAULT_DATA.COSTS], VIRUS: [...DEFAULT_DATA.VIRUS], ENEMIES: [...DEFAULT_DATA.ENEMIES], TEXT: DEFAULT_DATA.TEXT };

/* --- App Logic --- */
const app = (() => {
    const CONFIG = {
        SAVE_KEY: 's6_spore_v3_safe',
        DATA_KEY: 's6_custom_data_v1',
        MAX_LV: 30,
        PROD_BASE: 720
    };

    const PENALTY_TABLE = [
        { maxDiff: 0,    dmg: 100 }, { maxDiff: 250,  dmg:  80 }, { maxDiff: 500,  dmg:  50 }, 
        { maxDiff: 750,  dmg:  20 }, { maxDiff: 1000, dmg:  10 }, { maxDiff: 1250, dmg:   7 }, 
        { maxDiff: 1500, dmg:   5 }, { maxDiff: 1750, dmg:   3 }, { maxDiff: 2000, dmg:   2 }, 
        { maxDiff: 2250, dmg:   1 }, { maxDiff: 2500, dmg: 0.8 }, { maxDiff: 2750, dmg: 0.6 }, 
        { maxDiff: 3000, dmg: 0.4 }, { maxDiff: 3250, dmg: 0.2 }, { maxDiff: 99999, dmg: 0.1 } 
    ];

    let lang = 'ja';
    let activeBuff = 0; 
    let skillActive = false; 
    let kinoActive = false;     // 追加
    let guardianActive = false; // 追加
    let currentTab = 'main'; 
    
    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);
    const roman = n => ['','Ⅰ','Ⅱ','Ⅲ','Ⅳ'][n] || n;
    
    const init = () => {
        try {
            loadMasterData();
            lang = localStorage.getItem('s6_lang') || 'ja';
            renderUI();
            loadData();
            setLang(lang);
            setTimeout(() => { if(!($('now-time').value)) setNow(); calc(); }, 50);
        } catch(err) { console.error("Init Error:", err); }
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
                div.innerHTML = `<label><span data-t="f_prefix"></span> ${roman(i)}</label><select id="f${i}" onchange="app.calc()"></select>`;
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
        s.innerHTML = ''; if(min===0) s.add(new Option('-', 0));
        const isLab = id.startsWith('lab-');
        for(let i=Math.max(1, min); i<=max; i++) {
            let label = 'Lv.' + i;
            if(isLab) { label += ` [${DATA.VIRUS[i] || 0}]`; } 
            else { const prod = i * CONFIG.PROD_BASE; label += ` [${prod >= 1000 ? (prod/1000).toFixed(2)+'K' : prod}/h]`; }
            s.add(new Option(label, i));
        }
    };

    const step = (type, delta) => {
        if(type === 'disc') {
            const el = $('discount'); let val = parseFloat(el.value || 0) + delta;
            val = Math.max(0, Math.min(20, Math.round(val * 10) / 10));
            el.value = val; $('disp-disc').textContent = val.toFixed(1);
            calc(); return;
        }
        if(type === 'enemy') {
            const el = $('enemy-lv'); let val = parseInt(el.value || 1) + delta;
            let realMax = DATA.ENEMIES.findLastIndex(v => v > 0);
            val = Math.max(1, Math.min(realMax === -1 ? 60 : realMax, val));
            el.value = val; calc(); return;
        }
        const el = $(`lab-${type}`); if(!el) return;
        let val = parseInt(el.value || 0) + delta;
        val = Math.max(0, Math.min(CONFIG.MAX_LV, val));
        if(type === 'tgt') { const cLv = parseInt($('lab-cur')?.value || 0); if(val <= cLv) val = Math.min(cLv + 1, CONFIG.MAX_LV); }
        el.value = val;
        if(type === 'cur') onCurChange(); else calc();
    };

    const toggleWeekly = () => { calc(true); };

    const toggleBuffBtn = (val) => {
        activeBuff = (activeBuff === val) ? 0 : val;
        $('btn-buff-250')?.classList.toggle('active', activeBuff === 250);
        $('btn-buff-500')?.classList.toggle('active', activeBuff === 500);
        calc(true);
    };

    const toggleSkill = () => {
        skillActive = !skillActive;
        $('btn-skill')?.classList.toggle('active', skillActive);
        calc(true);
    };

    // --- 新規追加: キノキノ守れ ---
    const toggleKino = () => {
        kinoActive = !kinoActive;
        $('btn-kino')?.classList.toggle('active', kinoActive);
        calc(true);
    };

    // --- 新規追加: 守護者集結 ---
    const toggleGuardian = () => {
        guardianActive = !guardianActive;
        $('btn-guardian')?.classList.toggle('active', guardianActive);
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
        const curLv = parseInt($('lab-cur').value || 0);
        if($('disp-cur-lv')) $('disp-cur-lv').textContent = curLv;
        if($('disp-cur-res')) $('disp-cur-res').textContent = (DATA.VIRUS[curLv] || 0).toLocaleString();
        const tgtLv = parseInt($('lab-tgt').value || 0);
        if($('disp-tgt-lv')) $('disp-tgt-lv').textContent = tgtLv;
        if($('disp-tgt-res')) $('disp-tgt-res').textContent = (DATA.VIRUS[tgtLv] || 0).toLocaleString();
        if($('disp-disc')) $('disp-disc').textContent = parseFloat($('discount').value || 0).toFixed(1);
        const enemyLv = parseInt($('enemy-lv').value || 1);
        if($('disp-enemy-lv')) $('disp-enemy-lv').textContent = enemyLv;
        if($('disp-enemy-req')) $('disp-enemy-req').textContent = (DATA.ENEMIES[enemyLv] || 0).toLocaleString();
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
        for(let i=1; i<=4; i++) hourlyProd += (parseInt($(`f${i}`)?.value || 0) * CONFIG.PROD_BASE);
        const weeklyActive = $('weekly-active')?.checked;
        if (weeklyActive) hourlyProd += (parseInt($('weekly-lv')?.value || 0) * CONFIG.PROD_BASE);
        if($('total-prod')) $('total-prod').innerHTML = fmtKM(hourlyProd, true) + '/h';
        if($('res-daily')) $('res-daily').innerHTML = fmtKM(hourlyProd * 24, true);

        const cLv = parseInt($('lab-cur')?.value || 0), tLv = parseInt($('lab-tgt')?.value || 0);
        const factor = 1000 - Math.round(parseFloat($('discount')?.value || 0) * 10);
        let realCost = 0;
        const breakdownRows = [];
        for(let i = cLv; i < tLv; i++) {
            const discounted = Math.ceil(((DATA.COSTS[i+1] || 0) * factor) / 1000);
            realCost += discounted;
            breakdownRows.push({ fromLv: i, toLv: i+1, cost: discounted, cumulative: realCost });
        }
        if($('res-cost')) $('res-cost').innerHTML = fmtKM(realCost, true);
        renderBreakdown(breakdownRows, realCost, hourlyProd);

        // --- ウイルス耐性計算 ---
        const wBonus = (weeklyActive && parseInt($('weekly-lv').value) >= 1) ? 250 : 0;
        const kinoBonus = kinoActive ? 250 : 0;         // 加算
        const guardianBonus = guardianActive ? 250 : 0; // 加算
        const skillBonus = skillActive ? 250 : 0;

        // 全バフ合計（メイン画面用）
        const totalBonus = wBonus + activeBuff + kinoBonus + guardianBonus;
        const curVirusTotal = (DATA.VIRUS[cLv] || 0) + totalBonus;
        const tgtVirusTotal = (DATA.VIRUS[tLv] || 0) + totalBonus;
        if($('res-virus')) $('res-virus').textContent = `${fmt(curVirusTotal)} → ${fmt(tgtVirusTotal)}`;

        // バトル用合計（戦術スキル込）
        const battleVirusTotal = curVirusTotal + skillBonus;
        if($('disp-battle-my-lv')) $('disp-battle-my-lv').textContent = cLv;
        if($('disp-battle-my-res')) $('disp-battle-my-res').textContent = fmt(battleVirusTotal);

        let maxWinLv = 0, maxWinReq = 0;
        for (let i = 1; i < DATA.ENEMIES.length; i++) {
            if (DATA.ENEMIES[i] === 0 || DATA.ENEMIES[i] > battleVirusTotal) break;
            maxWinLv = i; maxWinReq = DATA.ENEMIES[i];
        }
        if ($('disp-max-win-lv')) $('disp-max-win-lv').textContent = maxWinLv;
        if ($('disp-max-win-res')) $('disp-max-win-res').textContent = fmt(maxWinReq);

        let enemyLv = parseInt($('enemy-lv').value || 1);
        if (resetTarget || enemyLv <= maxWinLv) {
            let realMax = DATA.ENEMIES.findLastIndex(v => v > 0);
            enemyLv = Math.min(maxWinLv + 1, realMax);
            $('enemy-lv').value = enemyLv;
        }
        const enemyReq = DATA.ENEMIES[enemyLv] || 0;
        updateBattleResult(battleVirusTotal, enemyReq);

        const stock = parseStock($('stock')?.value || 0);
        let shortage = Math.max(0, realCost - stock);
        let safeShortage = shortage > 0 ? Math.ceil(shortage / 1000) * 1000 : 0;
        if($('res-short')) $('res-short').innerHTML = fmtKM(safeShortage, true);
        updateStatus(safeShortage, hourlyProd);
        renderAllLvTable(battleVirusTotal);
    };

    const updateBattleResult = (total, req) => {
        const box = $('battle-result'), detail = $('battle-detail'), status = $('battle-status');
        if(!box || !detail) return;
        box.style.backgroundColor = ''; box.style.borderColor = '';
        if (req === 0) { detail.textContent = ""; box.className = "battle-result-box"; return; }
        
        if (total >= req) {
            detail.innerHTML = `<span style="color:#2E7D32; font-weight:bold;">${DATA.TEXT[lang].res_over}: +${fmt(total - req)}</span>`;
            box.className = "battle-result-box win";
        } else {
            const diff = req - total;
            let dmg = 0.1;
            for (const row of PENALTY_TABLE) { if (diff <= row.maxDiff) { dmg = row.dmg; break; } }
            let color = dmg >= 80 ? "#F57F17" : dmg >= 50 ? "#E65100" : dmg >= 20 ? "#D32F2F" : "#B71C1C";
            let bg = dmg >= 80 ? "#FFF9C4" : dmg >= 50 ? "#FFE0B2" : dmg >= 20 ? "#FFEBEE" : "#FFCDD2";
            box.style.backgroundColor = bg; box.style.borderColor = color;
            detail.innerHTML = `<span style="color:#333;">${DATA.TEXT[lang].res_short}: ${fmt(diff)}</span><br>
                <div style="margin-top:4px; font-weight:bold; color:${color};">${DATA.TEXT[lang].res_dmg}: ${dmg}% (${DATA.TEXT[lang].res_pena}: -${(100-dmg).toFixed(1)}%)</div>`;
            box.className = "battle-result-box lose";
        }
    };

    const renderAllLvTable = (battleVirusTotal) => {
        const tbody = $('all-lv-tbody'); if (!tbody) return;
        let totalPow = 0; for (let i = 1; i <= 5; i++) totalPow += parseFloat($(`alv-pow-${i}`)?.value || 0);
        let html = '', prevDmg = null, visibleCount = 0;
        for (let lv = 1; lv <= 60; lv++) {
            const tRes = DATA.ENEMIES[lv]; if (!tRes || tRes <= battleVirusTotal) { prevDmg = 100; continue; }
            let dmg = 0.1; const diff = tRes - battleVirusTotal;
            for (const row of PENALTY_TABLE) { if (diff <= row.maxDiff) { dmg = row.dmg; break; } }
            const effPow = totalPow * (dmg / 100);
            const divider = (prevDmg !== null && prevDmg !== 100 && dmg !== prevDmg) ? ' class="alv-divider"' : '';
            prevDmg = dmg;
            const bg = effPow >= 40 ? 'background:#e8f5e9' : dmg >= 50 ? 'background:#fff8e1' : dmg >= 20 ? 'background:#fff3e0' : 'background:#ffebee';
            const dmgColor = dmg >= 80 ? '#2e7d32' : dmg >= 50 ? '#e65100' : dmg >= 20 ? '#d32f2f' : '#b71c1c';
            html += `<tr${divider} style="${bg}"><td style="text-align:center;font-weight:600">${lv}</td><td style="text-align:right">${tRes.toLocaleString()}</td><td style="text-align:right;color:#c62828">-${fmt(diff)}</td><td style="text-align:center;color:${dmgColor};font-weight:700">${dmg}%</td><td style="text-align:right;color:${effPow>=40?'#2e7d32':'#c62828'}">${effPow.toFixed(1)}M</td><td style="text-align:center;font-weight:700;color:${effPow>=40?'#2e7d32':'#c62828'}">${effPow>=40?(lang==='ja'?'✅ 可':'✅ OK'):(lang==='ja'?'❌ 否':'❌ NG')}</td></tr>`;
            visibleCount++;
        }
        tbody.innerHTML = visibleCount ? html : `<tr><td colspan="6" style="text-align:center;padding:16px;color:#2e7d32;font-weight:600;">🎉 ${lang==='ja'?'すべてのLvで耐性十分です':'All levels sufficient'}</td></tr>`;
        if($('alv-my-res-disp')) $('alv-my-res-disp').textContent = fmt(battleVirusTotal);
        if($('alv-total-pow-disp')) $('alv-total-pow-disp').textContent = totalPow.toFixed(1) + 'M';
    };

    const renderBreakdown = (rows, totalCost, hourlyProd) => {
        const card = $('breakdown-card'), table = $('breakdown-table');
        if(!card || !table) return; if(rows.length <= 1) { card.style.display = 'none'; return; }
        card.style.display = 'block';
        const stock = parseStock($('stock')?.value || 0), nowRaw = $('now-time')?.value || '0:00';
        const nowVal = nowRaw.split(':'), baseDate = new Date();
        baseDate.setHours(parseInt(nowVal[0])||0, parseInt(nowVal[1])||0, 0, 0);
        let html = `<table class="breakdown-tbl"><thead><tr><th>Lv</th><th>${DATA.TEXT[lang].r_cost}</th><th>累計</th><th>ETA</th></tr></thead><tbody>`;
        rows.forEach(r => {
            const short = Math.max(0, r.cumulative - stock);
            let eta = short <= 0 ? (lang==='ja'?'達成済':'Done') : (hourlyProd <= 0 ? '---' : '');
            if(!eta) {
                const d = new Date(baseDate.getTime() + Math.ceil((short/hourlyProd)*60) * 60000);
                eta = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${pz(d.getMinutes())}`;
            }
            html += `<tr${short <= 0 ? ' class="row-done"' : ''}><td class="bd-lv">${r.fromLv}→${r.toLv}</td><td class="bd-cost">${fmtKM(r.cost)}</td><td class="bd-cumu">${fmtKM(r.cumulative)}</td><td class="bd-eta">${eta}</td></tr>`;
        });
        table.innerHTML = html + '</tbody></table>';
    };

    let breakdownOpen = false;
    const toggleBreakdown = () => { breakdownOpen = !breakdownOpen; $('breakdown-body').style.display = breakdownOpen ? 'block' : 'none'; $('breakdown-toggle-icon').textContent = breakdownOpen ? '▼' : '▶'; };

    const updateStatus = (shortage, hourlyProd) => {
        const elTime = $('res-time'), elDate = $('res-date'), elMsg = $('status-msg'), elRem = $('res-remaining');
        if(shortage <= 0) { setMsg(elMsg, elTime, "msg_ok", "OK", "#4E342E"); elDate.textContent = ""; if(elRem) elRem.textContent = ""; return; }
        if(hourlyProd <= 0) { setMsg(elMsg, elTime, "msg_stop", "---", "#8D6E63"); elDate.textContent = "--/--"; if(elRem) elRem.textContent = ""; return; }
        const mins = Math.ceil((shortage / hourlyProd) * 60), nowRaw = $('now-time')?.value || '0:00', nowVal = nowRaw.split(':');
        const d = new Date(); d.setHours(parseInt(nowVal[0])||0, parseInt(nowVal[1])||0, 0, 0); d.setMinutes(d.getMinutes() + mins);
        setMsg(elMsg, elTime, "msg_wait", `${d.getHours()}:${pz(d.getMinutes())}`, "#BF360C");
        elDate.textContent = `${d.getMonth()+1}/${d.getDate()}`;
        if(elRem) {
            const dd = Math.floor(mins/1440), hh = Math.floor((mins%1440)/60), mm = mins%60;
            let p = []; if(dd>0) p.push(lang==='ja'?`${dd}日`:`${dd}d`); if(hh>0) p.push(lang==='ja'?`${hh}時間`:`${hh}h`); if(mm>0||p.length===0) p.push(lang==='ja'?`${mm}分`:`${mm}m`);
            elRem.textContent = `${lang==='ja'?'あと':'in'} ${p.join(' ')}`;
        }
    };

    const setMsg = (m, t, k, txt, c) => { if(DATA.TEXT[lang][k]) m.textContent = DATA.TEXT[lang][k]; m.style.color = (c==="#BF360C"?"#5D4037":c); t.textContent = txt; t.style.color = c; };
    const fmt = n => n.toLocaleString();
    const pz = n => String(n).padStart(2, '0');
    const fmtKM = (n, det=false) => {
        const b = fmt(n);
        if(n >= 1000000) { const s = (n/1000000).toFixed(2) + '<span class="unit">M</span>'; return det ? `${b} (${s})` : s; }
        if(n >= 1000) { const s = (n/1000).toFixed(2) + '<span class="unit">K</span>'; return det ? `${b} (${s})` : s; }
        return b;
    };

    const parseStock = v => {
        if(!v) return 0; let s = v.toString().toLowerCase().replace(/,/g,'').trim();
        let m = 1; if(s.endsWith('k')) { m=1000; s=s.slice(0,-1); } else if(s.endsWith('m')) { m=1000000; s=s.slice(0,-1); }
        const p = parseFloat(s); return (isNaN(p) || p < 0) ? 0 : p * m;
    };

    const setNow = () => {
        const d = new Date(); if($('now-time')) $('now-time').value = `${pz(d.getHours())}:${pz(d.getMinutes())}`;
        if($('now-date')) $('now-date').textContent = `${d.getMonth()+1}/${d.getDate()}`;
        calc();
    };

    const save = () => {
        const data = {
            fs: [1,2,3,4].map(i => $(`f${i}`)?.value || 0),
            wk: $('weekly-lv').value, wa: $('weekly-active').checked,
            lc: $('lab-cur').value, lt: $('lab-tgt').value,
            st: $('stock').dataset.raw || $('stock').value,
            ds: $('discount').value, bf: activeBuff,
            elv: $('enemy-lv').value, sa: skillActive,
            ka: kinoActive, ga: guardianActive // 追加
        };
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
        alert(lang === 'ja' ? '保存しました' : 'Saved');
    };

    const loadData = () => {
        const raw = localStorage.getItem(CONFIG.SAVE_KEY); if(!raw) return;
        let d; try { d = JSON.parse(raw); } catch(e) { return; }
        if(d.fs) d.fs.forEach((v,i) => { if($(`f${i+1}`)) $(`f${i+1}`).value = v; });
        if(d.wk) $('weekly-lv').value = d.wk;
        if(d.wa !== undefined) $('weekly-active').checked = d.wa;
        if(d.lc) $('lab-cur').value = d.lc;
        if(d.lt) $('lab-tgt').value = d.lt;
        if(d.st) { $('stock').value = d.st; if(app.formatStockDisplay) app.formatStockDisplay($('stock')); }
        if(d.ds) { $('discount').value = d.ds; }
        if(d.bf) { activeBuff = parseInt(d.bf); $('btn-buff-250')?.classList.toggle('active', activeBuff === 250); $('btn-buff-500')?.classList.toggle('active', activeBuff === 500); }
        if(d.elv) $('enemy-lv').value = d.elv;
        if(d.sa !== undefined) { skillActive = d.sa; $('btn-skill')?.classList.toggle('active', skillActive); }
        if(d.ka !== undefined) { kinoActive = d.ka; $('btn-kino')?.classList.toggle('active', kinoActive); } // 追加
        if(d.ga !== undefined) { guardianActive = d.ga; $('btn-guardian')?.classList.toggle('active', guardianActive); } // 追加
    };

    const setLang = (l) => {
        lang = l; localStorage.setItem('s6_lang', l);
        $$('[data-t]').forEach(el => { const k = el.getAttribute('data-t'); if(DATA.TEXT[l][k]) el.textContent = DATA.TEXT[l][k]; });
        calc();
    };

    window.app = { 
        init, calc, save, reset: () => { if(confirm('Reset?')) { localStorage.removeItem(CONFIG.SAVE_KEY); location.reload(); } }, 
        setLang, setNow, onCurChange, toggleBuffBtn, step, toggleWeekly, switchTab, toggleSkill, 
        toggleKino, toggleGuardian, // 追加
        addUnit: (u) => { const el=$('stock'); el.value=(el.value||'')+u.toUpperCase(); calc(); el.focus(); },
        backspace: () => { const el=$('stock'); el.value=el.value.slice(0,-1); calc(); el.focus(); },
        toggleBreakdown,
        formatStockDisplay: (el) => { const n = parseStock(el.value); if(n>0) el.dataset.raw = n; }
    };
    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);