// Copy Referral Link

function copyReferralLink() {

    const referralLink =
    document.getElementById("referralLink");

    if(!referralLink) return;

    navigator.clipboard.writeText(
        referralLink.innerText
    );

    alert("Referral Link Copied!");
}


// Demo Withdraw Button

const withdrawBtn =
document.getElementById("withdrawBtn");

if(withdrawBtn){

    withdrawBtn.addEventListener(
    "click",
    function(){

        alert(
        "Withdraw request submitted successfully!"
        );

    });

}
