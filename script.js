const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;
const tg = window.Telegram?.WebApp;

document.addEventListener("DOMContentLoaded", async function() {
    if (tg) tg.expand();
    const user = tg?.initDataUnsafe?.user;
    
    if (user) {
        // ইউজার রেজিস্টার
        await supabase.from('users').upsert({ user_id: user.id, username: user.username }, { onConflict: 'user_id' });
        
        // প্রোফাইল এলিমেন্ট আপডেট
        if(document.getElementById("userName")) document.getElementById("userName").innerText = user.first_name || "User";
        if(document.getElementById("userId")) document.getElementById("userId").innerText = user.id;
        if(document.getElementById("profilePhoto") && user.photo_url) document.getElementById("profilePhoto").src = user.photo_url;
        
        // রেফারেল লিঙ্ক
        if(document.getElementById("referralLinkInput")) document.getElementById("referralLinkInput").value = `https://t.me/AdsClickCoinBot?start=${user.id}`;

        // ডাটাবেজ থেকে ডাটা ফেচ
        const { data, error } = await supabase.from('users').select('referral_count, balance').eq('user_id', user.id).single();
        
        if (data) {
            if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
            if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = (data.balance || 0) + " Tk";
            if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count || 0;
            if(document.getElementById("refBonus")) document.getElementById("refBonus").innerText = ((data.referral_count || 0) * 5) + " Tk";
        }
    }
});

// বাটন ইভেন্ট
document.getElementById("copyBtn")?.addEventListener("click", () => {
    const input = document.getElementById("referralLinkInput");
    if(input) { input.select(); document.execCommand("copy"); alert("Copied!"); }
});

document.getElementById("shareBtn")?.addEventListener("click", () => {
    const link = document.getElementById("referralLinkInput")?.value;
    if(link) window.Telegram.WebApp.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(link));
});
