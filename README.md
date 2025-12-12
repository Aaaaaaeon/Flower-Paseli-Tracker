# 🌸 Flower Paseli Tracker

A simple, copy-paste browser console script to track and visualize your PASELI redemption statistics on the Flower WebUI.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

## 📖 About

**Flower Paseli Tracker** allows arcade rhythm game players to easily audit their spending history. By running directly in your browser's console, it safely scrapes your transaction history pages to calculate:

*   💰 **Total PASELI redeemed**
*   💶 **Estimated real currency cost** (default: 100p = 1€)
*   📈 **Average transaction value**
*   🔝 **Largest & Smallest single transactions** (with dates)

No installation or browser extension is required. The script runs locally in your session and sends no data externally.

## 🚀 How to Use

### 1. Navigate to your Wallet
1. Log in to the **Flower WebUI**.
2. Go to the profile dropdown menu and select **Petals**.
3. In the **Wallet List**, click on the specific arcade/store you want to analyze.

### 2. Open the Console
1. Press `F12` (or `Ctrl+Shift+J` on Chrome / `Ctrl+Shift+K` on Firefox) to open the Developer Tools.
2. Select the **Console** tab.

> **Note for Chrome users:** If this is your first time pasting code into the console, you may need to type `allow pasting` and hit Enter to unlock this feature.

### 3. Run the Script
1. Copy the entire code from the `script.js` file in this repository.
2. Paste it into the console.
3. Press **Enter**.

### 4. View Results
The script will automatically navigate through your transaction pages (adding a small delay to avoid rate limits). Once finished, a colorful report will appear in the console, with the following informations:
*   💰 TOTAL REDEEMED VALUE
*   💶 ESTIMATED SPENT
*   ↔️ Number of Redeemed Vouchers
*   📉 Average Voucher Redeemed Value
*   🔄 Most Common Redemmed Voucher Value
*   🔝 Largest Redeemed Voucher Value
*   🔻 Smallest Redeemed Voucher Value

*   **Game : pop'n music**
*   Total spent : 660p
*   Transaction count : 8
*   Total ratio : 1.8776671408250356%
*   **Game : jubeat**
*   Total spent 
*   Total for Expert Option 
*   Transaction count 
*   Total ratio 
*   **Game : SOUND VOLTEX**
*   Total spent 
*   Total for SDVX Printer
*   Total for Premium Time
*   Standard Start
*   Light Start
*   Transaction count
*   Total ratio

## ⚙️ Configuration

You can customize the script by editing the variables at the top of the code before pasting:
// CONFIGURATION
*   let forcedMaxPage = 0; // Set a number of pages if auto-detection fails
*   const minDelay = 500; // Min delay between pages in ms (default: 0.5s)
*   const maxDelay = 1000; // Max delay between pages in ms (default: 1.0s)
*   const pointsPerEuro = 100; // Conversion rate (default: 100p = 1€)

## 📜 The Script

You can find the full script in the [script.js](script.js) file. Open it, copy the content, and paste it into your console.

## ⚠️ Disclaimer

This script is a third-party tool and is **not affiliated with Flower, Konami, or any arcade network**.
*   **Safety:** The script runs entirely on your client-side browser. It does not collect, store, or transmit your credentials or data anywhere.
*   **Use Responsibly:** While the script includes delays to respect server load, use it sparingly. The author is not responsible for any account limitations resulting from excessive request flooding.

## 🤝 Contributing

Feel free to fork this repository and submit pull requests if you want to improve the scraping logic or add new statistics!

---

*Enjoying your stats? Don't be shy to star the repo and share your results!* ⭐

