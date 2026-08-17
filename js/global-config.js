// js/global-config.js - PearlFlow 全域配置與 Supabase 初始化

const CONFIG = {
    appName: 'PearlFlow',
    version: '1.3.0',
    idleTimeoutMinutes: 15, // 閒置 15 分鐘自動登出
    
    // Supabase 連線資訊 (請替換為您的專案專屬 URL 與 Anon Key)
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseKey: 'YOUR_SUPABASE_ANON_KEY',

    // 角色權限定義
    ROLES: {
        ADMIN: 'Admin', // 老闆 (最高權限)
        STAFF: 'Staff'  // 員工
    },

    // 步驟四態打卡狀態
    STEP_STATUS: {
        NOT_STARTED: 'NOT_STARTED', // 未開始
        IN_PROGRESS: 'IN_PROGRESS', // 進行中
        PAUSED:      'PAUSED',      // 暫停中
        COMPLETED:   'COMPLETED',   // 已完成
        SKIPPED:     'SKIPPED'      // 無此步驟
    }
};

// 初始化 Supabase Client (強制指定使用 sessionStorage)
const supabase = window.supabase ? window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey, {
    auth: {
        storage: window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true
    }
}) : null;

// 閒置自動登出邏輯
let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(async () => {
        if (supabase) {
            await supabase.auth.signOut();
            alert('系統檢測到您已閒置超過 15 分鐘，為維護資訊安全，已自動為您登出。');
            window.location.href = 'index.html';
        }
    }, CONFIG.idleTimeoutMinutes * 60 * 1000);
}

// 監聽使用者操作以刷新閒置計時器
['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
    window.addEventListener(event, resetIdleTimer);
});
resetIdleTimer();
