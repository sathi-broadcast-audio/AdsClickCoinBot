// ১. সুপাবেস কনফিগারেশন
const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);
const tg = window.Telegram?.WebApp;

// ২. মেইন ফাংশন - যা সব পেজেই চলবে
async function initApp() {
    if (tg) tg.expand();
    const user = tg?.initDataUnsafe?.user;

    // যদি ইউজার না পাওয়া যায়, তবে ব্রাউজার টেস্টের জন্য ডামি ইউজার
    const currentUser = user || { id: 12345, first_name: "Guest", username: "guest" };

    // ইউজার ডাটাবেজে আপডেট
    await supabase.from('users').upsert({ 
        user_id: currentUser.id, 
        username: currentUser.username 
    }, { onConflict: 'user_id' });

    // ডাটাবেজ থেকে তথ্য আনা
    const { data } = await supabase.from('users').select('*').eq('user_id', currentUser.id).single();
    
    if (data) {
        // ইনডেক্স ও ওয়ালেট পেজ
        if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = (data.balance || 0) + " Tk";
        if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = (data.balance || 0) + " Tk";
        
        // প্রোফাইল পেজ
        if(document.getElementById("userName")) document.getElementById("userName").innerText = currentUser.first_name;
        if(document.getElementById("userId")) document.getElementById("userId").innerText = currentUser.id;
        if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count || 0;
        
        // রেফারেল পেজ
        const refInput = document.getElementById("referralLinkInput");
        if(refInput) refInput.value = `https://t.me/AdsClickCoinBot?start=${currentUser.id}`;
    }
}

// ৩. টাস্ক সম্পন্ন করার ফাংশন
window.completeTask = async function(amount) {
    const user = tg?.initDataUnsafe?.user;
    if (!user) return alert("Please open inside Telegram!");
    
    // ডাটাবেজে ব্যালেন্স যোগ করা (আপডেট লজিক)
    const { data: userData } = await supabase.from('users').select('balance').eq('user_id', user.id).single();
    const newBalance = (userData.balance || 0) + amount;
    
    await supabase.from('users').update({ balance: newBalance }).eq('user_id', user.id);
    alert("Task completed! " + amount + " Tk added.");
    location.reload(); // ব্যালেন্স রিফ্রেশ করার জন্য
};

// ৪. উইথড্র ফাংশন
window.submitWithdraw = async function() {
    const amount = document.getElementById("withdrawAmount").value;
    const method = document.getElementById("payMethod").value;
    if(amount < 50) return alert("Minimum withdraw is 50 Tk");
    
    alert("Withdraw request for " + amount + " Tk via " + method + " submitted!");
    // এখানে ডাটাবেজে উইথড্র টেবিল আপডেট লজিক বসবে
};

// ৫. কপি বাটন
window.copyRef = function() {
    const input = document.getElementById("referralLinkInput");
    input.select();
    document.execCommand("copy");
    alert("Copied!");
};

document.addEventListener("DOMContentLoaded", initApp);
