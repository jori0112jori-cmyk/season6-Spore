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

    const init = () => {
        try {
            // 常に data.js からデータを読み込む（ブラウザの保存データは無視する）
            if (typeof DEFAULT_MASTER_DATA === 'undefined') throw new Error("data.js not found");
            DATA = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
            
            // 入力状態（現在Lvや保有量）だけを復元
            const saved = localStorage.getItem(CONFIG.SAVE_KEY);
            if(saved) {
                const s = JSON.parse(saved);
                if($('cur-lv')) $('cur-lv').value = s.cur || 0;
                if($('tgt-lv')) $('tgt-lv').value = s.tgt || 0;
                if($('stock')) $('stock').value = s.stock || 0;
                if($('disc')) $('disc').value = s.disc || 0;
            }
            calc();
        } catch(e) { console.error("Init Error:", e); }
    };

    // この関数はもう不要なので中身を空にするか、呼び出しを消す
    const loadMasterData = () => {
        // 何もしない（カスタムデータの読み込みを廃止）
    };

    const calc = () => {
        const cur = parseInt($('cur-lv').value) || 0;
        const tgt = parseInt($('tgt-lv').value) || 0;
        const stock = parseInt($('stock').value) || 0;
        const disc = (parseInt($('disc').value) || 0) / 100;

        // --- 必要量の計算ロジック修正 ---
        // Lv19→20の場合、COSTS[19]を参照するように固定
        let totalCost = 0;
        if (tgt > cur) {
            for (let i = cur; i < tgt; i++) {
                totalCost += (DATA.COSTS[i] || 0);
            }
        }
        // 割引適用
        totalCost = Math.floor(totalCost * (1 - disc));

        // 表示更新
        $('res-cost').textContent = totalCost.toLocaleString();
        $('res-virus').textContent = (DATA.VIRUS[cur] || 0).toLocaleString();
        
        const short = Math.max(0, totalCost - stock);
        $('res-short').textContent = short.toLocaleString();
        $('res-short').className = short > 0 ? 'value highlight' : 'value';

        save();
    };

    const save = () => {
        const s = {
            cur: $('cur-lv').value,
            tgt: $('tgt-lv').value,
            stock: Stock = $('stock').value,
            disc: $('disc').value
        };
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(s));
    };

    // 外部公開メソッド
    window.app = {
        init, calc, 
        step: (id, val) => {
            const el = $(id);
            let n = parseInt(el.value) || 0;
            el.value = Math.max(0, Math.min(CONFIG.MAX_LV, n + val));
            calc();
        },
        reset: () => { if(confirm('データをリセットしますか？')){ localStorage.removeItem(CONFIG.SAVE_KEY); location.reload(); }},
        resetAdmin: () => { if(confirm('マスターデータを初期化しますか？')){ localStorage.removeItem(CONFIG.DATA_KEY); location.reload(); }}
    };

    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);