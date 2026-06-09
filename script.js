// Telegram Mini App
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.expand();
    const user = tg.initDataUnsafe?.user;
    if (user) {
        localStorage.setItem("userData", JSON.stringify(user));
    }
}

// Load User Data
const savedUser = JSON.parse(localStorage.getItem("userData"));

if (savedUser) {
    const userName = document.getElementById("userName");
    const username = document.getElementById("username");
    const userId = document.getElementById("userId");
    const profilePhoto = document.getElementById("profilePhoto");

    if (userName) {
        userName.innerText = savedUser.first_name || "Telegram User";
    }
    if (username) {
        username.innerText = savedUser.username ? "@" + savedUser.username : "No Username";
    }
    if (userId) {
        userId.innerText = savedUser.id || "000000000";
    }
    if (profilePhoto && savedUser.photo_url) {
        profilePhoto.src = savedUser.photo_url;
    }
}

// Copy Referral Link
function copyReferralLink() {
    const referralLink = document.getElementById("referralLink");
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink.innerText);
    alert("Referral Link Copied!");
}

// Share Referral Link
const shareBtn = document.getElementById("shareBtn");
if (shareBtn) {
    shareBtn.addEventListener("click", function () {
        const referralLink = document.getElementById("referralLink");
        if (!referralLink) return;
        if (navigator.share) {
            navigator.share({
                title: "Ads Click Coin",
                text: "Join and earn rewards!",
                url: referralLink.innerText
            });
        } else {
            copyReferralLink();
        }
    });
}

// Withdraw Button
const withdrawBtn = document.getElementById("withdrawBtn");
if (withdrawBtn) {
    withdrawBtn.addEventListener("click", function () {
        const amount = document.getElementById("withdrawAmount");
        const method = document.getElementById("paymentMethod");
        const account = document.getElementById("accountNumber");

        if (!method.value || !account.value || !amount.value) {
            alert("Please fill all fields!");
            return;
        }
        alert("Withdraw request submitted successfully!");
    });
}
