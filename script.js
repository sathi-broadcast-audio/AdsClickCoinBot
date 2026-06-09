// সুপাবেস কনফিগারেশন (আপনার কি গুলো এখানে আছে)
const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;
const tg = window.Telegram?.WebApp;

async function initApp() {
    if (tg) tg.expand();
    
    // টেলিগ্রাম থেকে ইউজার তথ্য নেওয়া
    const user = tg?.initDataUnsafe?.user;
    if (!user) {
        console.log("ইউজার তথ্য পাওয়া যায়নি!");
        return;
    }

    // ১. ডাটাবেজে ইউজার রেজিস্টার বা আপডেট করা
    await supabase.from('users').upsert({ 
        user_id: user.id, 
        username: user.username 
    }, { onConflict: 'user_id' });

    // ২. প্রোফাইল পেজের ডাটা আপডেট
    if(document.getElementById("userName")) document.getElementById("userName").innerText = user.first_name || "User";
    if(document.getElementById("userId")) document.getElementById("userId").innerText = user.id;
    
    // ৩. ডাটাবেজ থেকে ব্যালেন্স ও অন্যান্য তথ্য ফেচ করা
    const { data } = await supabase.from('users').select('*').eq('user_id', user.id).single();
    
    if (data) {
        // ইনডেক্স এবং ওয়ালেট পেজের জন্য
        if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
        if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = (data.balance || 0) + " Tk";
        if(document.getElementById("totalEarned")) document.getElementById("totalEarned").innerText = (data.total_earned || 0) + " Tk";
        if(document.getElementById("totalWithdrawn")) document.getElementById("totalWithdrawn").innerText = (data.withdrawn || 0) + " Tk";
        
        // প্রোফাইল পেজের জন্য
        if(document.getElementById("profileBalance")) document.getElementById("profileBalance").innerText = (data.balance || 0) + " Tk";
        if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count || 0;
        if(document.getElementById("refBonus")) document.getElementById("refBonus").innerText = ((data.referral_count || 0) * 5) + " Tk";
        
        // রেফারেল লিঙ্ক
        const refInput = document.getElementById("referralLinkInput");
        if(refInput) refInput.value = `https://t.me/AdsClickCoinBot?start=${user.id}`;
    }
}

// অ্যাপ রান করা
initApp();

// কপি বাটন ফাংশন
document.getElementById("copyBtn")?.addEventListener("click", () => {
    const input = document.getElementById("referralLinkInput");
    if(input) {
        input.select();
        document.execCommand("copy");
        alert("Referral link copied!");
    }
});

// শেয়ার বাটন ফাংশন
document.getElementById("shareBtn")?.addEventListener("click", () => {
    const link = document.getElementById("referralLinkInput")?.value;
    if(link) window.Telegram.WebApp.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(link));
});
