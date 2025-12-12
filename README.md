# 🌸 Flower Paseli Tracker

A simple, copy-paste browser console script to track and visualize your PASELI redemption statistics on the Flower WebUI.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

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
The script will automatically navigate through your transaction pages (adding a small delay to avoid rate limits). Once finished, a colorful report will appear in the console:

