const dropdowns = document.querySelectorAll("select");
const fromCurr = document.querySelector(".From select");
const toCurr = document.querySelector(".To select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector("#amount");
const form = document.querySelector("form");

// Populate currencies
for (let select of dropdowns) {
    select.innerHTML = "";

    for (let code in countryList) {
        let option = document.createElement("option");
        option.value = code;
        option.innerText = code;
        select.append(option);
    }

    select.addEventListener("change", () => {
        updateFlag(select);
        updateRate();
    });
}

// Default
fromCurr.value = "USD";
toCurr.value = "INR";
amountInput.value = 1;

updateFlag(fromCurr);
updateFlag(toCurr);
updateRate();

// Update flag
function updateFlag(select) {
    const countryCode = countryList[select.value];
    const img = select.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Get rate (NEW API)
async function updateRate() {
    try {
        const res = await fetch(
            `https://open.er-api.com/v6/latest/${fromCurr.value}`
        );
        const data = await res.json();

        if (data.result !== "success") {
            msg.innerText = "Rate not available";
            return;
        }

        const rate = data.rates[toCurr.value];
        msg.innerText = `1 ${fromCurr.value} = ${rate.toFixed(2)} ${toCurr.value}`;
    } catch {
        msg.innerText = "Error fetching rate";
    }
}

// Convert button
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const amount = amountInput.value;
        const res = await fetch(
            `https://open.er-api.com/v6/latest/${fromCurr.value}`
        );
        const data = await res.json();

        if (data.result !== "success") {
            msg.innerText = "Conversion failed";
            return;
        }

        const rate = data.rates[toCurr.value];
        const finalAmount = (amount * rate).toFixed(2);

        msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch {
        msg.innerText = "Conversion failed";
    }
});
