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
// 配列の安全確保
while(DATA.COSTS.length <= 30) DATA.COSTS.push(0);
while(DATA.VIRUS.length <= 30) DATA.VIRUS.push(0);
while(DATA.ENEMIES.length <= 60) DATA.ENEMIES.push(0);

/* --- App Logic --- */
const app = (() => {
    const CONFIG = {
        SAVE_KEY: 's6_spore_v3_safe',
        DATA_KEY: 's6_custom_data_v1',
        MAX_LV: 30,
        PROD_BASE: 720
    };

    const PENALTY_TABLE = [
        { maxDiff: 0,    dmg: 100 }, 
        { maxDiff: 250,  dmg:  80 }, 
        { maxDiff: 500,  dmg:  50 }, 
        { maxDiff: 750,  dmg:  20 }, 
        { maxDiff: 1000, dmg:  10 }, 
        { maxDiff: 1250, dmg:   7 }, 
        { maxDiff: 1500, dmg:   5 }, 
        { maxDiff: 1750, dmg:   3 }, 
        { maxDiff: 2000, dmg:   2 }, 
        { maxDiff: 2250, dmg:   1 }, 
        { maxDiff: 2500, dmg: 0.8 }, 
        { maxDiff: 2750, dmg: 0.6 }, 
        { maxDiff: 3000, dmg: 0.4 }, 
        { maxDiff: 3250, dmg: 0.2 }, 
        { maxDiff: 99999, dmg: 0.1 } 
    ];

    let lang = 'ja';
    let activeBuff = 0; 
    let skillActive = false; 
    let currentTab = 'main'; 
    
    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);
    const roman = n => ['','Ⅰ','Ⅱ','Ⅲ','Ⅳ'][n] || n;
    
    const init = () => {
        try {
            loadMasterData();
            const maxDataLv = DATA.COSTS.findLastIndex(n => n > 0);
            const subTitle = document.querySelector('.subtitle');
            if(subTitle) subTitle.textContent = `LastWar S6 Spore Calc (Data: Lv.${maxDataLv})`;
            
            lang = localStorage.getItem('s6_lang') || 'ja';
            renderUI();
            try { loadData(); } catch(e) { console.warn("Load skipped", e); }
            setLang(lang);
            
            setTimeout(() => {
                if(!($('now-time').value)) setNow();
                calc();
            }, 50);
        } catch(err) {
            console.error("Init Error:", err);
            alert("初期化エラーが発生しました。");
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
        const s = $(id);
        if(!s) return;
        s.innerHTML = '';
        if(min===0) s.add(new Option('-', 0));
        const isLab = id.startsWith('lab-');

        for(let i=Math.max(1, min); i<=max; i++) {
            let label = 'Lv.' + i;
            if(isLab) {
                const v = DATA.VIRUS[i] || 0;
                label += ` [${v}]`; 
            } else {
                const prod = i * CONFIG.PROD_BASE;
                const prodStr = prod >= 1000 ? (prod/1000).toFixed(2)+'K' : prod;
                label += ` [${prodStr}/h]`;
            }
            s.add(new Option(label, i));
        }
    };

    const step = (type, delta) => {
        if(type === 'disc') {
            const el = $('discount'); 
            let val = parseFloat(el.value || 0);
            val += delta;
            if(val < 0) val = 0;
            if(val > 20) val = 20;
            val = Math.round(val * 10) / 10;
            el.value = val;
            $('disp-disc').textContent = val.toFixed(1);
            calc();
            return;
        }

        if(type === 'enemy') {
            const el = $('enemy-lv');
            let val = parseInt(el.value || 1);
            val += delta;
            if(val < 1) val = 1;
            let realMax = DATA.ENEMIES.findLastIndex(v => v > 0);
            if (realMax === -1) realMax = DATA.ENEMIES.length - 1;
            if(val > realMax) val = realMax;
            el.value = val;
            calc(); 
            return;
        }

        const id = `lab-${type}`;
        const el = $(id);
        if(!el) return;
        let val = parseInt(el.value || 0);
        val += delta;
        if(val < 0) val = 0;
        if(val > CONFIG.MAX_LV) val = CONFIG.MAX_LV;

        if(type === 'tgt') {
            const cLv = parseInt(document.getElementById('lab-cur')?.value || 0);
            if(val <= cLv) val = cLv + 1;
            if(val > CONFIG.MAX_LV) val = CONFIG.MAX_LV;
        }

        el.value = val;
        if(type === 'cur') onCurChange();
        else calc();
    };

    const toggleWeekly = () => {
        const isActive = $('weekly-active').checked;
        const sel = $('weekly-lv');
        if (isActive) sel.classList.remove('disabled-item');
        else sel.classList.add('disabled-item');
        calc(true);
    };

    const toggleBuffBtn = (val) => {
        const btn250 = $('btn-buff-250');
        const btn500 = $('btn-buff-500');
        if (activeBuff === val) {
            activeBuff = 0;
            if(btn250) btn250.classList.remove('active');
            if(btn500) btn500.classList.remove('active');
        } else {
            activeBuff = val;
            if(val === 250) {
                if(btn250) btn250.classList.add('active');
                if(btn500) btn500.classList.remove('active');
            } else {
                if(btn500) btn500.classList.add('active');
                if(btn250) btn250.classList.remove('active');
            }
        }
        calc(true);
    };

    const toggleSkill = () => {
        skillActive = !skillActive;
        const btn = $('btn-skill');
        if(btn) {
            if (skillActive) btn.classList.add('active');
            else btn.classList.remove('active');
        }
        calc(true);
    };

    const switchTab = (tabName) => {
        currentTab = tabName;
        const viewMain = $('view-main');
        const viewBattle = $('view-battle');
        const btnMain = $('tab-btn-main');
        const btnBattle = $('tab-btn-battle');

        if(tabName === 'main') {
            if(viewMain) viewMain.style.display = 'block';
            if(viewBattle) viewBattle.style.display = 'none';
            if(btnMain) btnMain.classList.add('active');
            if(btnBattle) btnBattle.classList.remove('active');
        } else {
            if(viewMain) viewMain.style.display = 'none';
            if(viewBattle) viewBattle.style.display = 'block';
            if(btnMain) btnMain.classList.remove('active');
            if(btnBattle) btnBattle.classList.add('active');
        }
        calc();
    };

    const updateSteppers = () => {
        const curLv = parseInt($('lab-cur').value || 0);
        const curBase = DATA.VIRUS[curLv] || 0;
        if($('disp-cur-lv')) $('disp-cur-lv').textContent = curLv;
        if($('disp-cur-res')) $('disp-cur-res').textContent = curBase.toLocaleString();

        const tgtLv = parseInt($('lab-tgt').value || 0);
        const tgtBase = DATA.VIRUS[tgtLv] || 0;
        if($('disp-tgt-lv')) $('disp-tgt-lv').textContent = tgtLv;
        if($('disp-tgt-res')) $('disp-tgt-res').textContent = tgtBase.toLocaleString();
        
        const discVal = parseFloat($('discount').value || 0);
        if($('disp-disc')) $('disp-disc').textContent = discVal.toFixed(1);

        const enemyLv = parseInt($('enemy-lv').value || 1);
        const enemyReq = DATA.ENEMIES[enemyLv] || 0;
        if($('disp-enemy-lv')) $('disp-enemy-lv').textContent = enemyLv;
        if($('disp-enemy-req')) $('disp-enemy-req').textContent = enemyReq.toLocaleString();
    };

    const onCurChange = () => {
        const cLv = parseInt($('lab-cur')?.value || 0);
        const tEl = $('lab-tgt');
        if(tEl && parseInt(tEl.value) <= cLv) {
            tEl.value = Math.min(cLv + 1, CONFIG.MAX_LV);
        }
        calc(true);
    };

    let stockFocused = false;

    const formatStockDisplay = (el) => {
        const num = parseStock(el.value);
        if(num <= 0) { el.value = ''; el.dataset.raw = ''; return; }
        el.dataset.raw = num;
        if(num >= 1000000) {
            const m = parseFloat((num / 1000000).toFixed(3));
            el.value = m + 'M';
        } else if(num >= 1000) {
            const k = parseFloat((num / 1000).toFixed(3));
            el.value = k + 'K';
        } else {
            el.value = num.toLocaleString('ja-JP');
        }
    };

    const focusStock = (el) => {
        if(stockFocused) return;
        stockFocused = true;
        const raw = Number(el.dataset.raw || '0');
        if(raw > 0) el.value = raw.toLocaleString('ja-JP');
        el.select();
    };

    const blurStock = (el) => {
        stockFocused = false;
        const existingRaw = Number(el.dataset.raw || '0');
        if(existingRaw <= 0) {
            const num = parseStock(el.value);
            el.dataset.raw = num > 0 ? num : '';
        }
        formatStockDisplay(el);
        calc();
    };

    const addUnit = (unit) => {
        const el = $('stock');
        if (!el) return;
        const raw = Number(el.dataset.raw || '0');
        if(raw > 0) {
            el.value = raw.toLocaleString('ja-JP');
            el.dataset.raw = '';
        }
        el.value = (el.value || '') + unit.toUpperCase();
        stockFocused = true;
        calc();
        el.setSelectionRange(el.value.length, el.value.length);
        el.focus();
    };

    const backspace = () => {
        const el = $('stock');
        if (!el) return;
        const raw = Number(el.dataset.raw || '0');
        if(raw > 0) {
            el.value = raw.toLocaleString('ja-JP');
            el.dataset.raw = '';
            stockFocused = true;
        }
        let val = el.value || "";
        if(val.endsWith(',')) val = val.slice(0, -1);
        val = val.slice(0, -1);
        el.value = val;
        validateStock();
        calc();
        el.setSelectionRange(el.value.length, el.value.length);
        el.focus();
    };

    const calc = (resetTarget = false) => {
        updateSteppers();

        let hourlyProd = 0;
        for(let i=1; i<=4; i++) {
            const el = $(`f${i}`);
            const lv = parseInt(el ? el.value : 0);
            hourlyProd += (lv * CONFIG.PROD_BASE);
        }
        
        const weeklyActive = $('weekly-active') ? $('weekly-active').checked : false;
        const weeklyLv = parseInt($('weekly-lv') ? $('weekly-lv').value : 0);
        if (weeklyActive) hourlyProd += (weeklyLv * CONFIG.PROD_BASE);

        if($('total-prod')) $('total-prod').innerHTML = fmtKM(hourlyProd, true) + '/h';
        if($('res-daily')) $('res-daily').innerHTML = fmtKM(hourlyProd * 24, true);

        const cLv = parseInt($('lab-cur')?.value || 0);
        const tLv = parseInt($('lab-tgt')?.value || 0);
        const rate = parseFloat($('discount')?.value || 0);

        const rateInt = Math.round(rate * 10);
        const factor = 1000 - rateInt;

        let realCost = 0;
        const breakdownRows = [];
        if(cLv < tLv) {
            for(let i = cLv; i < tLv; i++) {
                const baseCost = DATA.COSTS[i+1] || 0;
                const discountedCost = Math.ceil((baseCost * factor) / 1000);
                realCost += discountedCost;
                breakdownRows.push({ fromLv: i, toLv: i+1, cost: discountedCost, cumulative: realCost });
            }
        }
        if($('res-cost')) $('res-cost').innerHTML = fmtKM(realCost, true);
        renderBreakdown(breakdownRows, realCost, hourlyProd);

        const badgeStr = rate > 0
            ? (lang === 'ja' ? `消費減少率 ${rate.toFixed(1)}%` : `Discount ${rate.toFixed(1)}%`)
            : '';
        ['res-disc-badge', 'breakdown-disc-badge'].forEach(id => {
            const el = $(id);
            if(!el) return;
            el.textContent = badgeStr;
            el.style.display = rate > 0 ? 'inline-block' : 'none';
        });

        const wBonus = (weeklyActive && weeklyLv >= 1) ? 250 : 0;
        const totalBonus = wBonus + activeBuff;
        const curVirusBase = DATA.VIRUS[cLv] || 0;
        const curVirusTotal = curVirusBase + totalBonus;
        const tgtVirusBase = DATA.VIRUS[tLv] || 0;
        const tgtVirusTotal = tgtVirusBase + totalBonus;

        if($('res-virus')) $('res-virus').textContent = `${fmt(curVirusTotal)} → ${fmt(tgtVirusTotal)}`;

        // --- 討伐シミュレーション ---
        const skillBonus = skillActive ? 250 : 0;
        const battleVirusTotal = curVirusTotal + skillBonus;

        if($('disp-battle-my-lv')) $('disp-battle-my-lv').textContent = cLv;
        if($('disp-battle-my-res')) $('disp-battle-my-res').textContent = fmt(battleVirusTotal);

        let maxWinLv = 0;
        let maxWinReq = 0;
        for (let i = 1; i < DATA.ENEMIES.length; i++) {
            if (DATA.ENEMIES[i] === 0) break;
            if (DATA.ENEMIES[i] <= battleVirusTotal) {
                maxWinLv = i;
                maxWinReq = DATA.ENEMIES[i];
            } else { break; }
        }
        if ($('disp-max-win-lv')) $('disp-max-win-lv').textContent = maxWinLv;
        if ($('disp-max-win-res')) $('disp-max-win-res').textContent = fmt(maxWinReq);

        let enemyLv = parseInt($('enemy-lv').value || 1);
        const nextTargetLv = maxWinLv + 1;
        let realMax = DATA.ENEMIES.findLastIndex(v => v > 0);
        if (realMax === -1) realMax = DATA.ENEMIES.length - 1;
        const safeNextTarget = (nextTargetLv <= realMax) ? nextTargetLv : realMax;

        if (resetTarget || enemyLv <= maxWinLv) {
            enemyLv = safeNextTarget;
            $('enemy-lv').value = enemyLv;
        }
        const enemyReq = DATA.ENEMIES[enemyLv] || 0;
        if($('disp-enemy-lv')) $('disp-enemy-lv').textContent = enemyLv;
        if($('disp-enemy-req')) $('disp-enemy-req').textContent = fmt(enemyReq);

        // ★★★ 与ダメージ減による色判定ロジック ★★★
        const battleStatus = $('battle-status');
        const battleDetail = $('battle-detail');
        const box = $('battle-result');

        if (box && battleDetail) {
            // スタイルの初期化（勝ち負け切り替え時に色が残らないように）
            box.style.backgroundColor = '';
            box.style.borderColor = '';

            if (enemyReq === 0) {
                 if(battleStatus) battleStatus.textContent = "";
                 battleDetail.textContent = "";
                 box.className = "battle-result-box";
            } else if (battleVirusTotal >= enemyReq) {
                // 超過時
                if(battleStatus) battleStatus.textContent = ""; 
                const txtOver = DATA.TEXT[lang].res_over;
                battleDetail.innerHTML = `<span style="color:#2E7D32; font-weight:bold;">${txtOver}: +${fmt(battleVirusTotal - enemyReq)}</span>`;
                box.className = "battle-result-box win";
            } else {
                // 不足時
                if(battleStatus) battleStatus.textContent = "";
                const diff = enemyReq - battleVirusTotal;

                let damageRate = 0.1;
                for (let i = 0; i < PENALTY_TABLE.length; i++) {
                    if (diff <= PENALTY_TABLE[i].maxDiff) {
                        damageRate = PENALTY_TABLE[i].dmg;
                        break;
                    }
                }

                const displayPenalty = parseFloat((100 - damageRate).toFixed(1));

                // --- 色判定ロジック ---
                let bgColor = "#FFFFFF"; 
                let textColor = "#C62828"; 

                if (damageRate >= 80) {
                    bgColor = "#FFF9C4"; // 黄色（注意：与ダメ80%以上）
                    textColor = "#F57F17"; 
                } else if (damageRate >= 50) {
                    bgColor = "#FFE0B2"; // 薄い赤（警告：与ダメ50%)
                    textColor = "#E65100";
                } else if (damageRate >= 20) {
                    bgColor = "#FFEBEE"; // 薄い赤（警告：与ダメ20%）
                    textColor = "#D32F2F";
                } else {
                    bgColor = "#FFCDD2"; // 濃い赤（危険：与ダメ20%未満）
                    textColor = "#B71C1C";
                }

                box.style.backgroundColor = bgColor;
                box.style.borderColor = textColor;
                // ---------------------

                const txtShort = DATA.TEXT[lang].res_short;
                const txtDmg = DATA.TEXT[lang].res_dmg;
                const txtPena = DATA.TEXT[lang].res_pena;

                battleDetail.innerHTML = `
                    <span style="color:#333;">${txtShort}: ${fmt(diff)}</span><br>
                    <div style="margin-top:4px; font-weight:bold; color:${textColor};">
                        ${txtDmg}: ${damageRate}% (${txtPena}: -${displayPenalty}%)
                    </div>
                `;
                box.className = "battle-result-box lose";
            }
        }

        const stock = parseStock($('stock')?.value || 0);
        let shortage = Math.max(0, realCost - stock);
        let safeShortage = shortage > 0 ? Math.ceil(shortage / 1000) * 1000 : 0;

        if($('res-short')) $('res-short').innerHTML = fmtKM(safeShortage, true);
        updateStatus(safeShortage, hourlyProd);

        // ★ Lv1-60 全判定テーブル更新
        renderAllLvTable(battleVirusTotal);
    };

    // =========================================
    // ★ Lv1-60 全判定テーブル
    // =========================================
    const renderAllLvTable = (battleVirusTotal) => {
        const tbody = $('all-lv-tbody');
        if (!tbody) return;

        // 部隊戦力を収集（1〜5）
        let totalPow = 0;
        for (let i = 1; i <= 5; i++) {
            const el = $(`alv-pow-${i}`);
            if (el) totalPow += parseFloat(el.value) || 0;
        }

        const sugPow = 40;
        const isJa = lang === 'ja';
        let html = '';
        let prevDmg = null;
        let visibleCount = 0;

        for (let lv = 1; lv <= 60; lv++) {
            const tRes = DATA.ENEMIES[lv];
            if (!tRes) continue;

            const shortage = tRes - battleVirusTotal;

            // ★ 耐性十分（shortage<=0）は表示しない
            if (shortage <= 0) { prevDmg = 100; continue; }

            // ダメージ率をPENALTY_TABLEから取得
            let dmgRate = 0.1;
            for (const row of PENALTY_TABLE) {
                if (shortage <= row.maxDiff) { dmgRate = row.dmg; break; }
            }

            const effPow = totalPow * (dmgRate / 100);
            const effPowDisp = effPow >= 10 ? effPow.toFixed(1) + 'M' : effPow.toFixed(2) + 'M';
            const win = effPow >= sugPow;

            // 段階境界に区切り線（前の行と段階が変わったとき）
            const divider = (prevDmg !== null && prevDmg !== 100 && dmgRate !== prevDmg) ? ' class="alv-divider"' : '';
            prevDmg = dmgRate;

            // 背景色
            let bg = '';
            if (win)                bg = 'background:#e8f5e9';
            else if (dmgRate >= 50) bg = 'background:#fff8e1';
            else if (dmgRate >= 20) bg = 'background:#fff3e0';
            else                    bg = 'background:#ffebee';

            const verdict = win
                ? `<span style="color:#2e7d32;font-weight:700">✅ ${isJa?'可':'OK'}</span>`
                : `<span style="color:#c62828;font-weight:700">❌ ${isJa?'否':'NG'}</span>`;

            const dmgColor = dmgRate >= 80 ? '#2e7d32' : dmgRate >= 50 ? '#e65100' : dmgRate >= 20 ? '#d32f2f' : '#b71c1c';

            html += `<tr${divider} style="${bg}">
                <td style="text-align:center;font-weight:600">${lv}</td>
                <td style="text-align:right">${tRes.toLocaleString()}</td>
                <td style="text-align:right;color:#c62828">-${fmt(shortage)}</td>
                <td style="text-align:center;color:${dmgColor};font-weight:700">${dmgRate}%</td>
                <td style="text-align:right;${effPow < sugPow ? 'color:#c62828' : 'color:#2e7d32'}">${effPowDisp}</td>
                <td style="text-align:center">${verdict}</td>
            </tr>`;
            visibleCount++;
        }

        // 全Lv耐性十分の場合
        if (visibleCount === 0) {
            html = `<tr><td colspan="6" style="text-align:center;padding:16px;color:#2e7d32;font-weight:600;">
                🎉 ${isJa ? 'すべてのLvで耐性十分です' : 'All levels: Resistance sufficient'}
            </td></tr>`;
        }

        tbody.innerHTML = html;

        // サマリー更新
        const resDisp = $('alv-my-res-disp');
        if (resDisp) resDisp.textContent = fmt(battleVirusTotal);
        const powDisp = $('alv-total-pow-disp');
        if (powDisp) powDisp.textContent = totalPow.toFixed(1) + 'M';
    };

    const renderBreakdown = (rows, totalCost, hourlyProd) => {
        const card = $('breakdown-card');
        const table = $('breakdown-table');
        if(!card || !table) return;
        if(rows.length <= 1) { card.style.display = 'none'; return; }
        card.style.display = 'block';

        const stock = parseStock($('stock')?.value || 0);
        const nowRaw = $('now-time')?.value || '0:00';
        const nowVal = nowRaw.includes(':') ? nowRaw.split(':') : ['0', '00'];
        const baseDate = new Date();
        baseDate.setHours(parseInt(nowVal[0])||0, parseInt(nowVal[1])||0, 0, 0);

        const isJa = lang === 'ja';
        const hdrLv   = isJa ? 'Lv'     : 'Lv';
        const hdrCost = isJa ? '必要量' : 'Cost';
        const hdrCumu = isJa ? '累計'   : 'Total';
        const hdrEta  = isJa ? '達成予測' : 'ETA';

        let html = `<table class="breakdown-tbl"><thead><tr><th>${hdrLv}</th><th>${hdrCost}</th><th>${hdrCumu}</th><th>${hdrEta}</th></tr></thead><tbody>`;
        rows.forEach(r => {
            const shortage = Math.max(0, r.cumulative - stock);
            let etaStr = '';
            if(shortage <= 0) etaStr = isJa ? '達成済' : 'Done';
            else if(hourlyProd <= 0) etaStr = '---';
            else {
                const mins = Math.ceil((shortage / hourlyProd) * 60);
                const d = new Date(baseDate.getTime() + mins * 60000);
                etaStr = `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${pz(d.getMinutes())}`;
            }
            html += `<tr${shortage <= 0 ? ' class="row-done"' : ''}><td class="bd-lv">${r.fromLv}→${r.toLv}</td><td class="bd-cost">${fmtKM(r.cost)}</td><td class="bd-cumu">${fmtKM(r.cumulative)}</td><td class="bd-eta">${etaStr}</td></tr>`;
        });
        html += '</tbody></table>';
        table.innerHTML = html;
    };

    let breakdownOpen = false;
    const toggleBreakdown = () => {
        breakdownOpen = !breakdownOpen;
        const body = $('breakdown-body');
        const icon = $('breakdown-toggle-icon');
        if(body) body.style.display = breakdownOpen ? 'block' : 'none';
        if(icon) icon.textContent = breakdownOpen ? '▼' : '▶';
    };

    const updateStatus = (shortage, hourlyProd) => {
        const elTime = $('res-time'), elDate = $('res-date'), elMsg = $('status-msg'), elRemaining = $('res-remaining');
        if(!elTime || !elDate || !elMsg) return;

        if(shortage <= 0) {
            setMsg(elMsg, elTime, "msg_ok", "OK", "#4E342E");
            elDate.textContent = "";
            if(elRemaining) elRemaining.textContent = "";
            return;
        }
        if(hourlyProd <= 0) {
            setMsg(elMsg, elTime, "msg_stop", "---", "#8D6E63");
            elDate.textContent = "--/--";
            if(elRemaining) elRemaining.textContent = "";
            return;
        }

        const hoursNeeded = shortage / hourlyProd;
        const nowRaw = $('now-time')?.value || '0:00';
        const nowVal = nowRaw.includes(':') ? nowRaw.split(':') : ['0', '00'];
        const d = new Date();
        d.setHours(parseInt(nowVal[0])||0, parseInt(nowVal[1])||0, 0, 0);
        d.setMinutes(d.getMinutes() + (hoursNeeded * 60));

        setMsg(elMsg, elTime, "msg_wait", `${d.getHours()}:${pz(d.getMinutes())}`, "#BF360C");
        elDate.textContent = `${d.getMonth()+1}/${d.getDate()}`;

        if(elRemaining) {
            const totalMins = Math.ceil(hoursNeeded * 60);
            const rDays = Math.floor(totalMins / 1440), rHours = Math.floor((totalMins % 1440) / 60), rMins = totalMins % 60;
            let parts = [];
            if(rDays > 0) parts.push(lang === 'ja' ? `${rDays}日` : `${rDays}d`);
            if(rHours > 0) parts.push(lang === 'ja' ? `${rHours}時間` : `${rHours}h`);
            if(rMins > 0 || parts.length === 0) parts.push(lang === 'ja' ? `${rMins}分` : `${rMins}m`);
            elRemaining.textContent = `${lang === 'ja' ? 'あと' : 'in'} ${parts.join(' ')}`;
        }
    };

    const setMsg = (msgEl, timeEl, msgKey, timeText, color) => {
        if(DATA.TEXT[lang] && DATA.TEXT[lang][msgKey]) msgEl.textContent = DATA.TEXT[lang][msgKey];
        msgEl.style.color = color === "#BF360C" ? "#5D4037" : color; 
        timeEl.textContent = timeText;
        timeEl.style.color = color;
    };
    const fmt = n => n.toLocaleString();
    const pz = n => String(n).padStart(2, '0');
    
    const fmtKM = (n, detailed=false) => {
        const base = fmt(n);
        const formatShort = (value, unit) => {
            const num = parseFloat(value.toFixed(2));
            return num + `<span class="unit">${unit}</span>`;
        };
        if(n >= 1000000) {
            const short = formatShort(n/1000000, 'M');
            return detailed ? `${base} (${short})` : short;
        }
        if(n >= 1000) {
            const short = formatShort(n/1000, 'K');
            return detailed ? `${base} (${short})` : short;
        }
        return base;
    };

    const parseStock = v => {
        if(!v) return 0;
        let s = v.toString().toLowerCase().replace(/,/g,'').trim().replace(/[^0-9.km]/g, '');
        if(!s) return 0;
        let m = 1;
        if(s.endsWith('k')) { m=1000; s=s.slice(0,-1); }
        else if(s.endsWith('m')) { m=1000000; s=s.slice(0,-1); }
        const parsed = parseFloat(s);
        return (isNaN(parsed) || parsed < 0) ? 0 : parsed * m;
    };

    const validateStock = () => {
        const el = document.getElementById('stock');
        if(!el) return;
        let v = el.value.replace(/[^0-9.kKmM,\.]/g, '').toUpperCase();
        if (/[KM]$/.test(v)) { el.value = v; return; }
        const raw = v.replace(/,/g, '');
        if (raw.includes('.')) { el.value = raw; return; }
        const num = parseFloat(raw);
        if(!isNaN(num) && raw !== '') el.value = num.toLocaleString('ja-JP');
        else el.value = raw;
    };
    
    const setNow = () => {
        const d = new Date();
        const tEl = $('now-time');
        if(tEl) tEl.value = `${pz(d.getHours())}:${pz(d.getMinutes())}`;
        const elDate = $('now-date');
        if(elDate) elDate.textContent = `${d.getMonth()+1}/${d.getDate()}`;
        calc();
    };

    const save = () => {
        const data = {
            fs: [1,2,3,4].map(i => { const e=$( `f${i}` ); return e?e.value:0; }),
            wk: $('weekly-lv').value, wa: $('weekly-active').checked,
            lc: $('lab-cur').value, lt: $('lab-tgt').value,
            st: $('stock').dataset.raw || $('stock').value,
            ds: $('discount').value, bf: activeBuff,
            elv: $('enemy-lv').value, sa: skillActive
        };
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(data));
        alert(lang === 'ja' ? '保存しました' : 'Saved');
    };

    const loadData = () => {
        const raw = localStorage.getItem(CONFIG.SAVE_KEY);
        if(!raw) return;
        let d;
        try { d = JSON.parse(raw); } catch(e) { localStorage.removeItem(CONFIG.SAVE_KEY); return; }
        if(d.fs) d.fs.forEach((v,i) => { if($(`f${i+1}`)) $(`f${i+1}`).value = v; });
        if(d.wk) $('weekly-lv').value = d.wk;
        if(d.wa !== undefined) $('weekly-active').checked = d.wa;
        toggleWeekly();
        if(d.lc) $('lab-cur').value = d.lc;
        if(d.lt) $('lab-tgt').value = d.lt;
        if(d.st) { const stockEl = $('stock'); if(stockEl) { stockEl.value = d.st; formatStockDisplay(stockEl); } }
        if(d.ds) { $('discount').value = d.ds; if($('disp-disc')) $('disp-disc').textContent = parseFloat(d.ds).toFixed(1); }
        if(d.bf) {
            activeBuff = parseInt(d.bf);
            const btn250 = $('btn-buff-250'), btn500 = $('btn-buff-500');
            if(activeBuff === 250 && btn250) btn250.classList.add('active');
            if(activeBuff === 500 && btn500) btn500.classList.add('active');
        }
        if(d.elv) $('enemy-lv').value = d.elv;
        if(d.sa !== undefined) {
            skillActive = d.sa;
            const btn = $('btn-skill');
            if(btn) skillActive ? btn.classList.add('active') : btn.classList.remove('active');
        }
    };

    const reset = () => { if(confirm('設定をリセットしますか？')) { localStorage.removeItem(CONFIG.SAVE_KEY); location.reload(); } };

    const setLang = (l) => {
        lang = l;
        localStorage.setItem('s6_lang', l);
        $$('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if(DATA.TEXT[l] && DATA.TEXT[l][key]) el.textContent = DATA.TEXT[l][key];
        });
        $$('.flag-icon').forEach(e => e.classList.toggle('active', e.getAttribute('alt') === l.toUpperCase()));
        calc();
    };

    const toggleAdmin = () => {
        const p = $('admin-panel'); if(!p) return;
        p.style.display = (p.style.display === 'none') ? 'block' : 'none';
        if(p.style.display === 'block') {
            if($('admin-costs')) $('admin-costs').value = DATA.COSTS.join(', ');
            if($('admin-virus')) $('admin-virus').value = DATA.VIRUS.join(', ');
            if($('admin-enemies')) $('admin-enemies').value = DATA.ENEMIES.join(', ');
        }
    };
    const saveAdmin = () => {
        try {
            const newCosts = $('admin-costs').value.split(',').map(s => parseInt(s.trim()) || 0);
            const newVirus = $('admin-virus').value.split(',').map(s => parseInt(s.trim()) || 0);
            const newEnemies = $('admin-enemies').value.split(',').map(s => parseInt(s.trim()) || 0);
            localStorage.setItem(CONFIG.DATA_KEY, JSON.stringify({ COSTS: newCosts, VIRUS: newVirus, ENEMIES: newEnemies }));
            location.reload();
        } catch(e) { alert('Error'); }
    };
    const resetAdmin = () => { if(confirm('Reset Master Data?')) { localStorage.removeItem(CONFIG.DATA_KEY); location.reload(); } };
    
    window.app = { 
        init, calc, save, reset, setLang, setNow, onCurChange, 
        toggleAdmin, saveAdmin, resetAdmin, 
        toggleBuffBtn, step, toggleWeekly, switchTab, toggleSkill, addUnit, backspace, validateStock, focusStock, blurStock, formatStockDisplay,
        toggleBreakdown,
        renderAllLvTable
    };
    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);