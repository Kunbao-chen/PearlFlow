/*
==========================================================================
PearlFlow - 全域組態與 Supabase 初始化
@file        js/global-config.js
@version     1.0.4
@updated     2026-08-17
@description 正確初始化 Supabase Client 並掛載至 window.supabase
==========================================================================
*/

const SUPABASE_URL = 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co'; // 替換為您的 Supabase URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';                // 替換為您的 Supabase Anon Key

// 確保 Supabase SDK 已載入並正確建立 Client 實例
if (typeof supabase !== 'undefined' && supabase.createClient) {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase SDK 未正確載入，請確認 CDN script 標籤');
}
