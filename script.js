const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

const supabase = window.supabase ? supabase.createClient(supabaseUrl, supabaseKey) : null;
const tg = window.Telegram?.WebApp;

document.addEventListener("DOMContentLoaded", async function() {
    if (tg) tg.expand();
    const user = tg?.initDataUnsafe?.user;
    
    if (user) {
        // ডাটাবেজে ইউজার রেজিস্টার
        await supabase.from('users').upsert({ user_id: user.id, username: user.username }, { onConflict: 'user_id' });
        
        // UI আপডেট
        if(document.getElementById("userName")) document.getElementById("userName").innerText = user.first_name;
        if(document.getElementById("userId")) document.getElementById("userId").innerText = user.id;
        if(document.getElementById("profilePhoto") && user.photo_url) document.getElementById("profilePhoto").src = user.photo_url;
        
        // রেফারেল লিঙ্ক
        if(document.getElementById("referralLinkInput")) document.getElementById("referralLinkInput").value = `https://t.me/AdsClickCoinBot?start=${user.id}`;

        // ব্যালেন্স ফেচ
        const { data } = await supabase.from('users').select('referral_count, balance').eq('user_id', user.id).single();
        if(data) {
            if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count;
            if(document.getElementById("refBonus")) document.getElementById("refBonus").innerText = (data.referral_count * 5) + " Tk";
            if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
        }
    }
});

document.getElementById("copyBtn")?.addEventListener("click", () => {
    document.getElementById("referralLinkInput").select();
    document.execCommand("copy");
    alert("Copied!");
});
