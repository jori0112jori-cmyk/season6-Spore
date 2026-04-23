const DEFAULT_MASTER_DATA = {
  // COSTS[19] が「Lv19から20へ上げるコスト」として画面と一致するように配置
  "COSTS": [
    0, 700, 11200, 22400, 44800, 89600, 125440, 163073, 195686, 234824, 
    281788, 338146, 405776, 486931, 584317, 701180, 771299, 848428, 933270, 1129258, 
    1242183, 1366401, 1503041, 1653345, 1818679, 2000547, 2200602, 2420662, 2662728, 2928951, 
    3221846, 3544031, 3898434, 4288277, 4717105, 5188815, 5707697, 6278466, 6906313, 7596944
  ],
  // VIRUS[20] は Lv20時点の耐性 9000
  "VIRUS": [
    0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 
    2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 8500, 
    9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 
    14000, 14500, 15000, 15500, 16000, 16500, 17000, 17500, 18000, 18500, 19000
  ],
  "ENEMIES": [0, 250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 12000, 12250, 12500],
  "TEXT": {
    "ja": {
      "title": "胞子生産計算機", "tab_main": "生産計算", "tab_battle": "討伐シミュレータ", "h_prod": "生産設定", "weekly": "週間配達", "time": "基準時刻", "h_status": "目標設定（真菌研究所）", "h_buff": "コーヒーバフ (ウイルス耐性)", "h_battle": "討伐シミュレーション", "cur_lv": "現在ステータス", "tgt_lv": "目標ステータス", "lbl_lv": "Lv:", "lbl_res": "耐性:", "lbl_cur_buffed": "現在のステータス (バフ込)", "lbl_next_target": "次の目標 (NEXT TARGET)", "lbl_req_res": "必要耐性", "lbl_skill": "戦術スキル: 悪魔狩・怪物殺し +250", "lbl_max_win": "討伐可能ライン (最大)", "lbl_bonus": "強化設定 (Buff & Skill)", "lbl_indiv_check": "終末精鋭Lv & 必要耐性 (個別判定)", "res_over": "超過", "res_short": "不足", "res_dmg": "ダメージ", "res_pena": "与ダメージ", "stock": "保有量", "disc": "消費減少率(%)", "h_res": "計算結果", "r_daily": "最大生産時間(24h)", "r_cost": "必要量", "r_virus": "合計ウイルス耐性", "r_short": "不足 (切り上げ)", "btn_save": "データ保存", "btn_reset": "リセット", "btn_now": "現在", "msg_ok": "達成済み", "msg_wait": "必要量確保予測", "msg_stop": "生産量 0", "f_prefix": "胞子工場"
    },
    "en": {
      "title": "Coffee Calc", "tab_main": "Main Calc", "tab_battle": "Battle Sim", "h_prod": "Production", "weekly": "Weekly", "time": "Base Time", "h_status": "Goal Setting (Caffeine Inst.)", "h_buff": "Coffee Buff (Virus Res.)", "h_battle": "Battle Sim ", "cur_lv": "Current Status", "tgt_lv": "Target Status", "lbl_lv": "Lv:", "lbl_res": "Res:", "lbl_cur_buffed": "Current Status (Buffed)", "lbl_enemy_lv": "Doom Elite Lv", "lbl_req_res": "Req Res", "lbl_skill": "Tactical Skill: Monster Slayer +250", "lbl_max_win": "Max Defeatable Limit", "lbl_bonus": "Bonus Settings (Buff & Skill)", "lbl_indiv_check": "Enemy Lv & Req Res (Individual)", "res_over": "Surplus", "res_short": "Shortage", "res_dmg": "Damage", "res_pena": "Penalty", "stock": "Stock", "disc": "Resource Reduction(%)", "h_res": "Result", "r_daily": "Max Production Time(24h)", "r_cost": "Required Amount", "r_virus": "Total Virus Resistance", "r_short": "Shortage (Rounded Up)", "btn_save": "Save Data", "btn_reset": "Reset", "btn_now": "Now", "msg_ok": "Completed", "msg_wait": "Prediction", "msg_stop": "No Prod", "f_prefix": "Coffee Factory"
    }
  }
};