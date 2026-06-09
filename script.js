const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

// সুপাবেস ক্লায়েন্ট ইনিশিয়ালাইজেশন
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
const tg = window.Telegram?.WebApp;

async function initApp() {
    if (tg) tg.expand();
    
    // টেলিগ্রাম ইউজার ডেটা
    const user = tg?.initDataUnsafe?.user;
    
    // ব্রাউজারে টেস্ট করার জন্য ডামি ইউজার (টেলিগ্রামের বাইরে টেস্ট করতে এটি দরকার)
    const currentUser = user || { id: 123456, first_name: "TestUser", username: "testuser" };

    try {
        // ১. ডাটাবেজে ইউজার রেজিস্টার বা আপডেট
        await supabase.from('users').upsert({ 
            user_id: currentUser.id, 
            username: currentUser.username 
        }, { onConflict: 'user_id' });

        // ২. ডাটাবেজ থেকে সব তথ্য একবারে নেওয়া
        const { data, error } = await supabase.from('users').select('*').eq('user_id', currentUser.id).single();
        
        if (data && !error) {
            // হোম পেজ
            if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
            
            // প্রোফাইল পেজ
            if(document.getElementById("userName")) document.getElementById("userName").innerText = currentUser.first_name || "User";
            if(document.getElementById("userId")) document.getElementById("userId").innerText = currentUser.id;
            if(document.getElementById("profileBalance")) document.getElementById("profileBalance").innerText = (data.balance || 0) + " Tk";
            if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count || 0;
            if(document.getElementById("refBonus")) document.getElementById("refBonus").innerText = ((data.referral_count || 0) * 5) + " Tk";
            
            // ওয়ালেট পেজ
            if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = (data.balance || 0) + " Tk";
            if(document.getElementById("totalEarned")) document.getElementById("totalEarned").innerText = (data.total_earned || 0) + " Tk";
            if(document.getElementById("totalWithdrawn")) document.getElementById("totalWithdrawn").innerText = (data.withdrawn || 0) + " Tk";
            
            // রেফারেল পেজ
            const refInput = document.getElementById("referralLinkInput");
            if(refInput) refInput.value = `https://t.me/AdsClickCoinBot?start=${currentUser.id}`;
        }
    } catch (err) {
        console.error("ডাটা লোড হতে সমস্যা:", err);
    }
}

initApp();

// কপি বাটন
document.getElementById("copyBtn")?.addEventListener("click", () => {
    const input = document.getElementById("referralLinkInput");
    if(input) { input.select(); document.execCommand("copy"); alert("Copied!"); }
});
