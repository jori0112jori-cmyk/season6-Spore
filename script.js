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
            
            // 1. 工場の入力欄を生成（これがないと日産が計算されません）
            renderFactories();

            // 2. データの復元
            const saved = localStorage.getItem(CONFIG.SAVE_KEY);
            if(saved) {
                const s = JSON.parse(saved);
                if($('stock')) $('stock').value = s.stock || 0;
                if($('discount')) $('discount').value = s.disc || 0;
                // レベルの復元
                setVal('cur', s.cur || 0);
                setVal('tgt', s.tgt || 1);
            } else {
                setVal('cur', 0);
                setVal('tgt', 1);
            }
            
            calc();
        } catch(e) { console.error("Init Error:", e); }
    };

    // 工場（I～IV）の入力欄を作る関数
    const renderFactories = () => {
        const area = $('factory-area');
        if (!area) return;
        area.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const div = document.createElement('div');
            div.innerHTML = `
                <label>工場 ${i}</label>
                <input type="number" id="fac-${i}" value="0" min="0" max="30" oninput="app.calc()">
            `;
            area.appendChild(div);
        }
    };

    const setVal = (type, val) => {
        const dispLv = $('disp-' + type + '-lv');
        const dispRes = $('disp-' + type + '-res');
        if (dispLv) dispLv.textContent = val;
        if (dispRes) dispRes.textContent = (DATA.VIRUS[val] || 0).toLocaleString();
    };

    const calc = () => {
        const cur = parseInt($('disp-cur-lv')?.textContent) || 0;
        const tgt = parseInt($('disp-tgt-lv')?.textContent) || 0;
        const stock = parseInt($('stock')?.value) || 0;
        const disc = (parseFloat($('disp-disc')?.textContent) || 0) / 100;

        // --- 1. 生産量の計算 ---
        let hourlyProd = 0;
        for (let i = 1; i <= 4; i++) {
            const lv = parseInt($('fac-' + i)?.value) || 0;
            // 仮の生産量計算式（必要に応じて調整してください）
            if (lv > 0) hourlyProd += (720 + (lv * 50)); 
        }
        if ($('total-prod')) $('total-prod').textContent = hourlyProd.toLocaleString() + '/h';
        if ($('res-daily')) $('res-daily').textContent = (hourlyProd * 24).toLocaleString();

        // --- 2. 必要量の計算 ---
        let totalCost = 0;
        if (tgt > cur) {
            for (let i = cur; i < tgt; i++) {
                totalCost += (DATA.COSTS[i] || 0);
            }
        }
        totalCost = Math.floor(totalCost * (1 - disc));

        // --- 3. 画面表示 ---
        if($('res-cost')) $('res-cost').textContent = totalCost.toLocaleString();
        if($('res-virus')) {
            const curV = DATA.VIRUS[cur] || 0;
            const tgtV = DATA.VIRUS[tgt] || 0;
            $('res-virus').textContent = curV.toLocaleString() + " → " + tgtV.toLocaleString();
        }
        
        const short = Math.max(0, totalCost - stock);
        if($('res-short')) $('res-short').textContent = short.toLocaleString();

        // 完了メッセージなど
        if($('status-msg')) {
            $('status-msg').textContent = short <= 0 ? "達成済み" : "不足分を生産中";
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
            const dispId = 'disp-' + type + '-lv';
            const el = $(dispId);
            if(!el) return;
            let n = parseInt(el.textContent) || 0;
            const nextVal = Math.max(0, Math.min(CONFIG.MAX_LV, n + val));
            el.textContent = nextVal;
            
            // 耐性表示も更新
            const resId = 'disp-' + type + '-res';
            if($(resId)) $(resId).textContent = (DATA.VIRUS[nextVal] || 0).toLocaleString();
            
            calc();
        },
        addUnit: (unit) => {
            const el = $('stock');
            let val = parseInt(el.value) || 0;
            if(unit === 'k') el.value = val * 1000;
            if(unit === 'm') el.value = val * 1000000;
            calc();
        },
        setNow: () => {
            const now = new Date();
            if($('now-time')) $('now-time').value = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
            calc();
        },
        reset: () => { if(confirm('リセットしますか？')){ localStorage.removeItem(CONFIG.SAVE_KEY); location.reload(); }},
        switchTab: (tab) => {
            $('view-main').style.display = tab === 'main' ? 'block' : 'none';
            $('view-battle').style.display = tab === 'battle' ? 'block' : 'none';
            $('tab-btn-main').className = tab === 'main' ? 'tab-item active' : 'tab-item';
            $('tab-btn-battle').className = tab === 'battle' ? 'tab-item active' : 'tab-item';
        }
    };

    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);
