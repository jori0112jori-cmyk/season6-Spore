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
            // 1. data.js の読み込み確認
            if (typeof DEFAULT_MASTER_DATA === 'undefined') throw new Error("data.js not found");
            DATA = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
            
            // 2. 工場エリア（胞子工場 I～IV）を画面に生成
            renderFactories();

            // 3. データの復元と初期値セット
            const saved = localStorage.getItem(CONFIG.SAVE_KEY);
            if(saved) {
                const s = JSON.parse(saved);
                if($('stock')) $('stock').value = s.stock || 0;
                if($('discount')) $('discount').value = s.disc || 0;
                updateDisplay('cur', s.cur || 19);
                updateDisplay('tgt', s.tgt || 20);
            } else {
                updateDisplay('cur', 19);
                updateDisplay('tgt', 20);
            }
            
            calc();
        } catch(e) { console.error("Init Error:", e); }
    };

    // 胞子工場の入力欄を生成する
    const renderFactories = () => {
        const area = $('factory-area');
        if (!area) return;
        area.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const div = document.createElement('div');
            div.className = 'factory-input-unit'; // 必要に応じてCSSクラス名を調整してください
            div.innerHTML = `
                <label style="font-size:0.8rem;">胞子工場 ${i}</label>
                <input type="number" id="fac-${i}" value="20" min="0" max="30" oninput="app.calc()" style="width:100%; padding:8px; border-radius:4px; border:1px solid #CCC;">
            `;
            area.appendChild(div);
        }
    };

    // 画面上の Lv と 耐性 表示を更新する
    const updateDisplay = (type, lv) => {
        const dispLv = $('disp-' + type + '-lv');
        const dispRes = $('disp-' + type + '-res');
        const resVal = (DATA.VIRUS[lv] !== undefined) ? DATA.VIRUS[lv] : 0;
        
        if (dispLv) dispLv.textContent = lv;
        if (dispRes) dispRes.textContent = resVal.toLocaleString();
        
        // 討伐シミュレータ側の表示も連動
        if (type === 'cur') {
            if($('disp-battle-my-lv')) $('disp-battle-my-lv').textContent = lv;
            if($('disp-battle-my-res')) $('disp-battle-my-res').textContent = resVal.toLocaleString();
        }
    };

    const calc = () => {
        // 現在値を取得
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
        if ($('res-daily')) $('res-daily').textContent = (hourlyProd * 24).toLocaleString();

        // 2. 必要量の合計 (data.js から正確に取得)
        let totalCost = 0;
        if (tgt > cur) {
            for (let i = cur; i < tgt; i++) {
                totalCost += (DATA.COSTS[i] || 0);
            }
        }
        totalCost = Math.floor(totalCost * (1 - disc));

        // 3. 表示への反映
        if($('res-cost')) $('res-cost').textContent = totalCost.toLocaleString();
        if($('res-virus')) {
            const curV = DATA.VIRUS[cur] || 0;
            const tgtV = DATA.VIRUS[tgt] || 0;
            $('res-virus').textContent = curV.toLocaleString() + " → " + tgtV.toLocaleString();
        }
        
        const short = Math.max(0, totalCost - stock);
        if($('res-short')) $('res-short').textContent = short.toLocaleString();
        if($('status-msg')) $('status-msg').textContent = short <= 0 ? "達成済み" : "必要量を計算中";

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
        // ボタン操作（＋ －）
        step: (type, val) => {
            const el = $('disp-' + type + '-lv') || $('disp-' + type);
            if(!el) return;
            let n = (type === 'disc') ? parseFloat(el.textContent) : parseInt(el.textContent);
            let nextVal = n + val;
            
            if (type === 'disc') {
                nextVal = Math.max(0, Math.min(30, nextVal)).toFixed(1);
            } else {
                nextVal = Math.max(0, Math.min(CONFIG.MAX_LV, nextVal));
            }
            
            el.textContent = nextVal;
            if (type === 'cur' || type === 'tgt') updateDisplay(type, nextVal);
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
