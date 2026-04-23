/* --- Global Data Holder --- */
let DATA = { COSTS: [], VIRUS: [], ENEMIES: [], TEXT: {} };

const app = (() => {
    const CONFIG = {
        SAVE_KEY: 's6_spore_v3_safe',
        DATA_KEY: 's6_custom_data_v1',
        MAX_LV: 60
    };

    const $ = id => document.getElementById(id);

    const init = () => {
        try {
            // 常に data.js からデータを読み込む
            if (typeof DEFAULT_MASTER_DATA === 'undefined') throw new Error("data.js not found");
            DATA = JSON.parse(JSON.stringify(DEFAULT_MASTER_DATA));
            
            // 保存データの復元（IDをindex.htmlに合わせる）
            const saved = localStorage.getItem(CONFIG.SAVE_KEY);
            if(saved) {
                const s = JSON.parse(saved);
                if($('cur-lv')) $('cur-lv').value = s.cur || 0;
                if($('tgt-lv')) $('tgt-lv').value = s.tgt || 0;
                if($('stock')) $('stock').value = s.stock || 0;
                if($('discount')) $('discount').value = s.disc || 0;
            }
            calc();
        } catch(e) { console.error("Init Error:", e); }
    };

    const calc = () => {
        // index.htmlのID（cur-lv, tgt-lv）で取得するよう修正
        const curEl = $('cur-lv');
        const tgtEl = $('tgt-lv');
        if (!curEl || !tgtEl) return; 

        const cur = parseInt(curEl.textContent || curEl.value) || 0;
        const tgt = parseInt(tgtEl.textContent || tgtEl.value) || 0;
        const stock = parseInt($('stock')?.value) || 0;
        const disc = (parseFloat($('discount')?.value) || 0) / 100;

        // 必要量の計算
        let totalCost = 0;
        if (tgt > cur) {
            for (let i = cur; i < tgt; i++) {
                totalCost += (DATA.COSTS[i] || 0);
            }
        }
        totalCost = Math.floor(totalCost * (1 - disc));

        // 画面表示への反映（index.htmlのIDに合わせる）
        if($('res-cost')) $('res-cost').textContent = totalCost.toLocaleString();
        
        if($('res-virus')) {
            const curV = DATA.VIRUS[cur] || 0;
            const tgtV = DATA.VIRUS[tgt] || 0;
            $('res-virus').textContent = curV.toLocaleString() + " → " + tgtV.toLocaleString();
        }
        
        if($('res-short')) {
            const short = Math.max(0, totalCost - stock);
            $('res-short').textContent = short.toLocaleString();
        }

        // ラベルの更新（見た目用）
        if($('disp-cur-lv')) $('disp-cur-lv').textContent = cur;
        if($('disp-tgt-lv')) $('disp-tgt-lv').textContent = tgt;
        if($('disp-cur-res')) $('disp-cur-res').textContent = (DATA.VIRUS[cur] || 0).toLocaleString();
        if($('disp-tgt-res')) $('disp-tgt-res').textContent = (DATA.VIRUS[tgt] || 0).toLocaleString();

        save();
    };

    const save = () => {
        const s = {
            cur: $('cur-lv')?.value || $('disp-cur-lv')?.textContent,
            tgt: $('tgt-lv')?.value || $('disp-tgt-lv')?.textContent,
            stock: $('stock')?.value,
            disc: $('discount')?.value
        };
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(s));
    };

    window.app = {
        init, calc,
        // ボタンのIDを cur-lv / tgt-lv に修正
        step: (type, val) => {
            const id = type + '-lv'; 
            const dispId = 'disp-' + type + '-lv';
            let n = parseInt($(dispId)?.textContent) || 0;
            const nextVal = Math.max(0, Math.min(CONFIG.MAX_LV, n + val));
            
            if($(dispId)) $(dispId).textContent = nextVal;
            // 隠し入力欄がある場合も考慮
            if($(id)) $(id).value = nextVal;
            
            calc();
        },
        reset: () => { if(confirm('リセットしますか？')){ localStorage.removeItem(CONFIG.SAVE_KEY); location.reload(); }},
        // 不要な関数もエラー防止のため形だけ残す
        toggleAdmin: () => {},
        setLang: (l) => { location.reload(); }
    };

    return window.app;
})();

document.addEventListener('DOMContentLoaded', app.init);
