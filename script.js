// সুপাবেস কনফিগারেশন
const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

const supabase = window.supabase ? supabase.createClient(supabaseUrl, supabaseKey) : null;
const tg = window.Telegram?.WebApp;

document.addEventListener("DOMContentLoaded", async function() {
    if (tg) tg.expand(); // টেলিগ্রাম অ্যাপ এক্সপ্যান্ড করা
    
    const user = tg?.initDataUnsafe?.user;
    
    if (user) {
        // ১. ডাটাবেজে ইউজার রেজিস্টার বা আপডেট করা[span_0](start_span)[span_0](end_span)
        await supabase.from('users').upsert({ 
            user_id: user.id, 
            username: user.username 
        }, { onConflict: 'user_id' });
        
        // ২. প্রোফাইল পেজের জন্য ডাটা আপডেট[span_1](start_span)[span_1](end_span)
        if(document.getElementById("userName")) document.getElementById("userName").innerText = user.first_name || "User";
        if(document.getElementById("userId")) document.getElementById("userId").innerText = user.id;
        if(document.getElementById("profilePhoto") && user.photo_url) document.getElementById("profilePhoto").src = user.photo_url;
        
        // ৩. রেফারেল লিঙ্ক জেনারেট করা[span_2](start_span)[span_2](end_span)
        const refInput = document.getElementById("referralLinkInput");
        if(refInput) refInput.value = `https://t.me/AdsClickCoinBot?start=${user.id}`;
        
        // ৪. ডাটাবেজ থেকে ব্যালেন্স ও স্ট্যাটাস ফেচ করা[span_3](start_span)[span_3](end_span)
        const { data } = await supabase.from('users').select('referral_count, balance').eq('user_id', user.id).single();
        
        if (data) {
            // Index ও Wallet পেজের জন্য ব্যালেন্স আপডেট[span_4](start_span)[span_4](end_span)
            if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
            if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = (data.balance || 0) + " Tk";
            
            // Profile ও Refer পেজের জন্য রেফারেল আপডেট[span_5](start_span)[span_5](end_span)
            if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count || 0;
            if(document.getElementById("refBonus")) document.getElementById("refBonus").innerText = ((data.referral_count || 0) * 5) + " Tk";
        }
    }
});

// কপি করার লজিক[span_6](start_span)[span_6](end_span)
document.getElementById("copyBtn")?.addEventListener("click", () => {
    const input = document.getElementById("referralLinkInput");
    if(input) {
        input.select();
        document.execCommand("copy");
        alert("Referral link copied!");
    }
});

// শেয়ার করার লজিক[span_7](start_span)[span_7](end_span)
document.getElementById("shareBtn")?.addEventListener("click", () => {
    const link = document.getElementById("referralLinkInput")?.value;
    if (link && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(link) + "&text=" + encodeURIComponent("Join this amazing App and earn money!"));
    }
});
