// সুপাবেস কনফিগারেশন
const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

// সুপাবেস ক্লায়েন্ট ইনিশিয়ালাইজ (এটি সিডিএন এর মাধ্যমে কাজ করবে)
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// টেলিগ্রাম ওয়েব অ্যাপ
const tg = window.Telegram?.WebApp;
if (tg) tg.expand();

// ইউজার ডাটা লোড ও সেভ
document.addEventListener("DOMContentLoaded", function() {
    const user = tg?.initDataUnsafe?.user;
    if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
    }

    const savedUser = JSON.parse(localStorage.getItem("userData"));

    if (savedUser) {
        document.getElementById("userName")?.innerText = savedUser.first_name || "Telegram User";
        document.getElementById("username")?.innerText = savedUser.username ? "@" + savedUser.username : "No Username";
        document.getElementById("userId")?.innerText = savedUser.id || "000000000";
        
        const photo = document.getElementById("profilePhoto");
        if (photo && savedUser.photo_url) photo.src = savedUser.photo_url;
    }
});

// কপি রেফারেল লিঙ্ক
function copyReferralLink() {
    const link = document.getElementById("referralLink")?.innerText;
    if (link) {
        navigator.clipboard.writeText(link);
        alert("Referral Link Copied!");
    }
}
document.getElementById("shareBtn")?.addEventListener("click", copyReferralLink);

// উইথড্র ফাংশন
document.getElementById("withdrawBtn")?.addEventListener("click", function() {
    const amount = document.getElementById("withdrawAmount")?.value;
    const method = document.getElementById("paymentMethod")?.value;
    const account = document.getElementById("accountNumber")?.value;

    if (!amount || !method || !account) {
        alert("Please fill all fields!");
        return;
    }
    
    // এখানে সুপাবেস ডাটাবেজে উইথড্র রিকোয়েস্ট পাঠানোর লজিক যোগ হবে
    alert("Withdraw request submitted successfully!");
});
