const supabaseUrl = 'https://sfcfliatfpgrlsfyhnax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmY2ZsaWF0ZnBncmxzZnlobmF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDA1OTQsImV4cCI6MjA5NjU3NjU5NH0.K3wEIvh5vNTm_KPmB0njCv4FDwtMKROTkCN2wj-d7Qk';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function initApp() {
    const tg = window.Telegram?.WebApp;
    if (tg) tg.expand();
    
    // টেলিগ্রাম থেকে ইউজার ডাটা নেওয়া
    const user = tg?.initDataUnsafe?.user;
    
    // যদি ইউজার না থাকে, তবে টেস্টের জন্য একটি আইডি ধরে নেওয়া (যা ডাটাবেজে আছে)
    const userId = user?.id || 12345; 

    console.log("Current User ID:", userId);

    // ডাটাবেজ থেকে ডাটা আনা
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error("Database Error:", error);
        return;
    }

    if (data) {
        console.log("Data Found:", data);
        
        // সব আইডিগুলো আপডেট করা
        if(document.getElementById("userName")) document.getElementById("userName").innerText = user?.first_name || "Guest";
        if(document.getElementById("userId")) document.getElementById("userId").innerText = data.user_id;
        if(document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = data.balance + " Tk";
        if(document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = data.balance + " Tk";
        if(document.getElementById("refCount")) document.getElementById("refCount").innerText = data.referral_count;
        
        const refInput = document.getElementById("referralLinkInput");
        if(refInput) refInput.value = `https://t.me/AdsClickCoinBot?start=${data.user_id}`;
    }
}

document.addEventListener("DOMContentLoaded", initApp);
