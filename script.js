const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);
const tg = window.Telegram?.WebApp;

async function initApp() {
    if (tg) tg.expand();
    const user = tg?.initDataUnsafe?.user;

    // ইউজার থাকলে ডাটাবেজে আপডেট
    if (user) {
        await supabase.from('users').upsert({ user_id: user.id, username: user.username }, { onConflict: 'user_id' });

        const { data } = await supabase.from('users').select('*').eq('user_id', user.id).single();

        if (data) {
            // ইনডেক্স পেজ
            if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
            
            // ওয়ালেট পেজ
            if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = (data.balance || 0) + " Tk";
            if(document.getElementById("totalEarned")) document.getElementById("totalEarned").innerText = (data.total_earned || 0) + " Tk";
            if(document.getElementById("totalWithdrawn")) document.getElementById("totalWithdrawn").innerText = (data.withdrawn || 0) + " Tk";
            
            // প্রোফাইল পেজ
            if(document.getElementById("userName")) document.getElementById("userName").innerText = user.first_name || "User";
            if(document.getElementById("userId")) document.getElementById("userId").innerText = user.id;
            if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count || 0;
            
            // রেফারেল লিঙ্ক
            if(document.getElementById("referralLinkInput")) document.getElementById("referralLinkInput").value = `https://t.me/AdsClickCoinBot?start=${user.id}`;
        }
    }
}

document.addEventListener("DOMContentLoaded", initApp);
