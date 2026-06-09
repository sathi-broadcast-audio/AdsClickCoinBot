const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

// সুপাবেস কানেকশন
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
const tg = window.Telegram?.WebApp;

async function initApp() {
    if (tg) tg.expand();
    
    // টেলিগ্রাম ইউজার ডেটা
    const user = tg?.initDataUnsafe?.user || { id: 12345, first_name: "Test", username: "tester" };

    // ১. ইউজার আপডেট
    await supabase.from('users').upsert({ user_id: user.id, username: user.username }, { onConflict: 'user_id' });

    // ২. ডাটা ফেচ
    const { data } = await supabase.from('users').select('*').eq('user_id', user.id).single();
    
    if (data) {
        // এলিমেন্ট চেক করে ডাটা বসানো
        if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
        if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = (data.balance || 0) + " Tk";
        if(document.getElementById("totalEarned")) document.getElementById("totalEarned").innerText = (data.total_earned || 0) + " Tk";
        if(document.getElementById("totalWithdrawn")) document.getElementById("totalWithdrawn").innerText = (data.withdrawn || 0) + " Tk";
        
        if(document.getElementById("userName")) document.getElementById("userName").innerText = user.first_name;
        if(document.getElementById("userId")) document.getElementById("userId").innerText = user.id;
        
        if(document.getElementById("profilePhoto") && user.photo_url) document.getElementById("profilePhoto").src = user.photo_url;
        
        if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count || 0;
        if(document.getElementById("refBonus")) document.getElementById("refBonus").innerText = ((data.referral_count || 0) * 5) + " Tk";
        
        if(document.getElementById("referralLinkInput")) document.getElementById("referralLinkInput").value = `https://t.me/AdsClickCoinBot?start=${user.id}`;
    }
}

// পেজ লোড হলে অ্যাপ চালু হবে
document.addEventListener("DOMContentLoaded", initApp);
