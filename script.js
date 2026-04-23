/* --- Global Data Holder --- */
let DATA = { COSTS: [], VIRUS: [], ENEMIES: [], TEXT: {} };

const app = (() => {
    const CONFIG = {
        SAVE_KEY: 's6_spore_v3_safe',
        MAX_LV: 60
    };

    const $ = id => document.getElementById(id);

    const init = () => {
        try {
            if (typeof DEFAULT_MASTER_DATA === 'undefined') throw new Error("data.js not found");
            DATA = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
            
            // 1. 工場エリアを生成
            renderFactories();

            // 2. データの復元
            const saved = localStorage.getItem(CONFIG.SAVE_KEY);
            if(saved) {
                const s = JSON.parse(saved);
                if($('stock')) $('stock').value = s.stock || 0;
                // レベルと割引率の復元
                setStepVal('cur', parseInt(s.cur) || 19);
                setStepVal('tgt', parseInt(s.tgt) || 20);
                setStepVal('disc', parseFloat(s.disc) || 0.0);
            } else {
                setStepVal('cur', 19);
                setStepVal('tgt', 20);
                setStepVal('disc', 0.0);
            }
            
            app.setNow(); 
            calc();
        } catch(e) { console.error("Init Error:", e); }
    };

    const renderFactories = () => {
        const area = $('factory-area');
        if (!area) return;
        area.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const div = document.createElement('div');
            div.innerHTML = `
                <label style="font-size:0.75rem;">胞子工場 ${i}</label>
                <input type="number" id="fac-${i}" value="20" min="0" max="30" oninput="app.calc()">
            `;
            area.appendChild(div);
        }
    };

    // 表示されている数値を直接セットする共通関数
    const setStepVal = (type, val) => {
        const el = (type === 'disc') ? $('disp-disc') : $('disp-' + type + '-lv');
        if (!el) return;
        el.textContent = (type === 'disc') ? val.toFixed(1) : val;
        
        if (type === 'cur' || type === 'tgt') {
            const resEl = $('disp-' + type + '-res');
            if (resEl) resEl.textContent = (DATA.VIRUS[val] || 0).toLocaleString();
        }
    };

    const calc = () => {
        const cur = parseInt($('disp-cur-lv')?.textContent) || 0;
        const tgt = parseInt($('disp-tgt-lv')?.textContent) || 0;
        const stock = parseInt($('stock')?.value) || 0;
        const disc = (parseFloat($('disp-disc')?.textContent) || 0) / 100;

        // 1. 生産量の計算 (Base 720 + Lv*50)
        let hourlyProd = 0;
        for (let i = 1; i <= 4; i++) {
            const lv = parseInt($('fac-' + i)?.value) || 0;
            if (lv > 0) hourlyProd += (720 + (lv * 50)); 
        }
        if ($('total-prod')) $('total-prod').textContent = hourlyProd.toLocaleString() + '/h';
        const daily = hourlyProd * 24;
        if ($('res-daily')) $('res-daily').textContent = daily.toLocaleString();

        // 2. 必要量の合計
        let totalCost = 0;
        if (tgt > cur) {
            for (let i = cur; i < tgt; i++) {
                totalCost += (DATA.COSTS[i] || 0);
            }
        }
        totalCost = Math.floor(totalCost * (1 - disc));
        if($('res-cost')) $('res-cost').textContent = totalCost.toLocaleString();

        // 3. 不足分と完了予測
        const short = Math.max(0, totalCost - stock);
        if($('res-short')) $('res-short').textContent = short.toLocaleString();
        if($('res-virus')) {
            $('res-virus').textContent = (DATA.VIRUS[cur] || 0).toLocaleString() + " → " + (DATA.VIRUS[tgt] || 0).toLocaleString();
        }

        // 時間計算
        if (short > 0 && hourlyProd > 0) {
            const hoursNeeded = short / hourlyProd;
            const now = new Date();
            // 入力された基準時刻がある場合はそれを使う
            const baseTimeStr = $('now-time')?.value;
            if (baseTimeStr) {
                const [h, m] = baseTimeStr.split(':');
                now.setHours(h, m, 0);
            }
            const finishDate = new Date(now.getTime() + hoursNeeded * 3600000);
            
            if($('res-time')) $('res-time').textContent = finishDate.getHours().toString().padStart(2, '0') + ":" + finishDate.getMinutes().toString().padStart(2, '0');
            if($('res-date')) $('res-date').textContent = (finishDate.getMonth() + 1) + "/" + finishDate.getDate();
            if($('status-msg')) $('status-msg').textContent = "必要量を計算中";
        } else {
            if($('res-time')) $('res-time').textContent = "--:--";
            if($('res-date')) $('res-date').textContent = "--/--";
            if($('status-msg')) $('status-msg').textContent = short <= 0 ? "達成済み" : "生産量 0";
        }

        save();
    };

    const save = () => {
        const s = {
            cur: $('disp-cur-lv')?.textContent,
            tgt: $('disp-tgt-lv')?.textContent,
            stock: $('stock')?.value,
            disc: $('disp-disc')?.textContent
        };
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(s));
    };

    window.app = {
        init, calc,
        step: (type, val) => {
            const id = (type === 'disc') ? 'disp-disc' : 'disp-' + type + '-lv';
            const el = $(id);
            if(!el) return;
            let n = (type === 'disc') ? parseFloat(el.textContent) : parseInt(el.textContent);
            let nextVal = n + val;
            if (type === 'disc') {
                nextVal = Math.max(0, Math.min(30, nextVal));
            } else {
                nextVal = Math.max(0, Math.min(CONFIG.MAX_LV, nextVal));
            }
            setStepVal(type, nextVal);
            calc();
        },
        addUnit: (unit) => {
            const el = $('stock');
            let val = parseInt(el.value) || 0;
            if(unit === 'k') el.value = val + 1000;
            if(unit === 'm') el.value = val + 1000000;
            calc();
        },
        backspace: () => { $('stock').value = ''; calc(); },
        setNow: () => {
            const now = new Date();
            if($('now-time')) $('now-time').value = now.toTimeString().slice(0,5);
            if($('now-date')) $('now-date').textContent = (now.getMonth()+1) + "/" + now.getDate();
            calc();
        },
        switchTab: (tab) => {
            $('view-main').style.display = tab === 'main' ? 'block' : 'none';
            $('view-battle').style.display = tab === 'battle' ? 'block' : 'none';
            $('tab-btn-main').className = tab === 'main' ? 'tab-item active' : 'tab-item';
            $('tab-btn-battle').className = tab === 'battle' ? 'tab-item active' : 'tab-item';
        },
        reset: () => { if(confirm('リセットしますか？')){ localStorage.clear(); location.reload(); } }
    };

    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);
