/*
==========================================================================
PearlFlow - 全域組態與 Supabase 初始化 (完全覆蓋版)
@file        js/global-config.js
@version     1.0.5
@updated     2026-08-17
@description 防止全域命名空間衝突，將 Supabase 實例統一掛載至 window.supabaseClient
==========================================================================
*/

const SUPABASE_URL = 'https://foiczezuudovzufofsyc.supabase.co'; // 請替換為您的 Supabase URL
const SUPABASE_ANON_KEY = 'sb_publishable_IJ2CGw3kS5hC8JgVlD-h5g_ktEpPMK3';           // 請替換為您的 Supabase Anon Key

// 初始化 Supabase Client 實例
(function initSupabase() {
    try {
        // 取得 Supabase 工廠函式 (相容 v1 與 v2 CDN)
        const supabaseFactory = window.supabase || supabase;

        if (supabaseFactory && typeof supabaseFactory.createClient === 'function') {
            window.supabaseClient = supabaseFactory.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            // 為了相容性，同時將 .from 代理至 window.supabase
            window.supabase = window.supabaseClient;
        } else if (window.supabaseClient && typeof window.supabaseClient.from === 'function') {
            // 已初始化過，保持現狀
        } else {
            console.error('Supabase SDK 未能成功取得 createClient 方法');
        }
    } catch (err) {
        console.error('Supabase 初始化失敗：', err);
    }
})();
