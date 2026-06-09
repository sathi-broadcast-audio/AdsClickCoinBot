const tg = window.Telegram?.WebApp;

// টেলিগ্রাম অ্যাপ ওপেন হলে ডাটা প্রসেস করবে
function initTelegramData() {
    if (!tg) return;
    tg.expand();
    
    const user = tg.initDataUnsafe?.user;
    if (user) {
        // ডাটা লোকাল স্টোরেজে সেভ করুন
        localStorage.setItem("userData", JSON.stringify(user));
        updateUI(user);
    }
}

function updateUI(user) {
    const userNameEl = document.getElementById("userName");
    const userIdEl = document.getElementById("userId");
    const usernameEl = document.getElementById("username");

    if (userNameEl) userNameEl.innerText = user.first_name || "User";
    if (userIdEl) userIdEl.innerText = user.id || "000000";
    if (usernameEl) usernameEl.innerText = user.username ? "@" + user.username : "No Username";
}

// পেজ লোড হলে রান হবে
document.addEventListener("DOMContentLoaded", () => {
    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) {
        updateUI(savedUser);
    }
    initTelegramData();
});
