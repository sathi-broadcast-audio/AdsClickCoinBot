import { getData, setData } from './api.js';

const tg = window.Telegram.WebApp;
tg.ready();

// ইউজার আইডি পাওয়ার ফাংশন
export const getUserId = () => tg.initDataUnsafe.user?.id || "guest_123";

// ব্যালেন্স এবং ডাটা আপডেট করার ফাংশন
export async function updateUI() {
    const userId = getUserId();
    const data = await getData(`user_${userId}`) || { 
        balance: 0, 
        tasks: [], 
        referrals: [], 
        history: [] 
    };

    // UI আপডেট (ID অনুযায়ী)
    if (document.getElementById("userName")) document.getElementById("userName").innerText = tg.initDataUnsafe.user?.first_name || "Guest";
    if (document.getElementById("userId")) document.getElementById("userId").innerText = userId;
    if (document.getElementById("homeBalance")) document.getElementById("homeBalance").innerText = data.balance.toFixed(2) + " Tk";
    if (document.getElementById("walletBalance")) document.getElementById("walletBalance").innerText = data.balance.toFixed(2) + " Tk";
    
    // রেফারেল কাউন্ট আপডেট
    if (document.getElementById("refCount")) {
        document.getElementById("refCount").innerText = data.referrals.length;
    }

    // রেফারেল লিংক সেট করা
    const refInput = document.getElementById("referralLinkInput");
    if (refInput) refInput.value = `https://t.me/AdsClickCoinBot?start=${userId}`;

    // রেফারেল লিস্ট দেখানো (রেফারেল পেজের জন্য)
    const refList = document.getElementById("refer-list");
    if (refList) {
        refList.innerHTML = data.referrals.map(ref => `
            <div class="card">
                <p>User ID: ${ref.id}</p>
                <p>Status: ${ref.balance >= 5 ? '✅ Counted' : '⏳ Pending (< 5 Tk)'}</p>
            </div>
        `).join('');
    }
}

// টাস্ক হ্যান্ডলার
window.handleTask = async (taskId) => {
    const userId = getUserId();
    let data = await getData(`user_${userId}`);
    
    // টাস্ক চেক
    if (!data.tasks.includes(taskId)) {
        data.balance += 0.50;
        data.tasks.push(taskId);
        await setData(`user_${userId}`, data);
        alert("টাস্ক সফল!");
        updateUI();
    } else {
        alert("টাস্কটি আগেই সম্পন্ন করেছেন।");
    }
};

// অ্যাপ শুরু হলে ইউআই আপডেট
updateUI();
