/*
==========================================================================
PearlFlow - 全域組態與 Supabase 初始化 (完全覆蓋版)
@file        js/global-config.js
@version     1.0.6
@updated     2026-08-17
@description 使用正確的 Publishable key 初始化 Supabase Client
==========================================================================
*/

const SUPABASE_URL = 'https://foiczezuudovzufofsyc.supabase.co';
// 請將下方字串替換為您第一張截圖中的 Publishable key (sb_publishable_...)
const SUPABASE_ANON_KEY = 'sb_publishable_IJ2CGw3kS5hC8JgVlD-h5g_ktEpPMK3'; 

(function initSupabase() {
    try {
        const supabaseFactory = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);

        if (supabaseFactory && typeof supabaseFactory.createClient === 'function') {
            window.supabaseClient = supabaseFactory.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            window.supabase = window.supabaseClient;
        } else if (window.supabaseClient && typeof window.supabaseClient.from === 'function') {
            // 已成功初始化，保持現狀
        } else {
            console.error('Supabase SDK 未能成功取得 createClient 方法，請檢查 HTML 是否已載入 Supabase CDN Script');
        }
    } catch (err) {
        console.error('Supabase 初始化失敗：', err);
    }
})();
