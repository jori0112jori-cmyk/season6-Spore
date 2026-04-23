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
            // 1. data.js からマスターデータを読み込む
            if (typeof DEFAULT_MASTER_DATA === 'undefined') throw new Error("data.js not found");
            DATA = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
            
            // 2. 胞子工場の入力欄を生成
            renderFactories();

            // 3. 設定値の復元
            const saved = localStorage.getItem(CONFIG.SAVE_KEY);
            if(saved) {
                const s = JSON.parse(saved);
                if($('stock')) $('stock').value = s.stock || 0;
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

    // 工場入力欄の生成
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

    // 画面表示（Lv、耐性、割引率）を更新する内部関数
    const setStepVal = (type, val) => {
        const el = (type === 'disc') ? $('disp-disc') : $('disp-' + type + '-lv');
        if (!el) return;

        if (type === 'disc') {
            el.textContent = val.toFixed(1);
        } else {
            el.textContent = val;
            const resEl = $('disp-' + type + '-res');
            if (resEl) resEl.textContent = (DATA.VIRUS[val] || 0).toLocaleString();
            
            // 討伐シミュレータ側も同期
            if (type === 'cur') {
                if($('disp-battle-my-lv')) $('disp-battle-my-lv').textContent = val;
                if($('disp-battle-my-res')) $('disp-battle-my-res').textContent = (DATA.VIRUS[val] || 0).toLocaleString();
            }
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

        // 2. 必要量の合計計算 (data.js の COSTS を参照)
        let totalCost = 0;
        if (tgt > cur) {
            for (let i = cur; i < tgt; i++) {
                totalCost += (DATA.COSTS[i] || 0);
            }
        }
        totalCost = Math.floor(totalCost * (1 - disc));
        if($('res-cost')) $('res-cost').textContent = totalCost.toLocaleString();

        // 3. 不足分と時間予測
        const short = Math.max(0, totalCost - stock);
        if($('res-short')) $('res-short').textContent = short.toLocaleString();
        if($('res-virus')) {
            $('res-virus').textContent = (DATA.VIRUS[cur] || 0).toLocaleString() + " → " + (DATA.VIRUS[tgt] || 0).toLocaleString();
        }

        if (short > 0 && hourlyProd > 0) {
            const hoursNeeded = short / hourlyProd;
            const now = new Date();
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
        init, calc, save,
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
        reset: () => { if(confirm('設定をリセットしますか？')){ localStorage.clear(); location.reload(); } }
    };

    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);
