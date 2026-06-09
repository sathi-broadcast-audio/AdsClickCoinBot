const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

// সুপাবেস ক্লায়েন্ট
const supabase = window.supabase ? supabase.createClient(supabaseUrl, supabaseKey) : null;
const tg = window.Telegram?.WebApp;

document.addEventListener("DOMContentLoaded", function() {
    if (tg) tg.expand();

    // টেলিগ্রাম থেকে ইউজার ডাটা নেওয়া
    const user = tg?.initDataUnsafe?.user;
    if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
    }

    const savedUser = JSON.parse(localStorage.getItem("userData"));
    if (savedUser) {
        // প্রোফাইল পেজের জন্য ডাটা আপডেট
        document.getElementById("userName")?.innerText = savedUser.first_name || "User";
        document.getElementById("userId")?.innerText = savedUser.id || "000000";
        document.getElementById("username")?.innerText = savedUser.username ? "@" + savedUser.username : "No Username";
        
        // প্রোফাইল ফটো আপডেট
        const photoEl = document.getElementById("profilePhoto");
        if (photoEl && savedUser.photo_url) {
            photoEl.src = savedUser.photo_url;
        }

        // রেফারেল পেজের জন্য লিঙ্ক জেনারেট
        const refLinkInput = document.getElementById("referralLinkInput");
        if (refLinkInput) {
            refLinkInput.value = `https://t.me/AdsClickCoinBot?start=${savedUser.id}`;
        }
    }
});

// কপি ফাংশন
document.getElementById("copyBtn")?.addEventListener("click", function() {
    const copyText = document.getElementById("referralLinkInput");
    if (copyText) {
        copyText.select();
        document.execCommand("copy");
        alert("Referral link copied!");
    }
});
