/*
==========================================================================
PearlFlow - 全域組態與 Supabase 初始化 (完全覆蓋版)
@file        js/global-config.js
@version     1.0.4
@updated     2026-08-17
@description 正確初始化 Supabase Client 並掛載至 window.supabase 實例
==========================================================================
*/

// 請替換為您 Supabase Project 的實際 API 資訊
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

// 確保 Supabase SDK CDN 已經載入，並透過 createClient 建立實例物件
if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase SDK 未正確載入，請確認 HTML 中的 CDN <script> 標籤！');
}
