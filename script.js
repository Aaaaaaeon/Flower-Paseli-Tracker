(async function() {
    console.clear();
    const styles = {
        title: "background: #2c3e50; color: #fff; font-size: 14px; padding: 5px 10px; border-radius: 4px; font-weight: bold;",
        success: "color: #27ae60; font-weight: bold;",
        info: "color: #2980b9;",
        total: "background: #27ae60; color: white; font-size: 18px; padding: 10px; border-radius: 5px; font-weight: bold; display: block; margin: 10px 0;",
        sub: "font-size: 14px; color: #fff; font-weight: bold;",
        highlight: "color: #d35400; font-weight: bold;",
        highlightMin: "color: #2980b9; font-weight: bold;",
        currency: "background: #f1c40f; color: #333; font-size: 16px; padding: 8px; border-radius: 5px; font-weight: bold; display: block; margin-top: 10px;"
    };

    console.log("%c🚀 Script started...", styles.title);

    // ==========================================
    // CONFIGURATION
    // ==========================================
    let forcedMaxPage = 0; // Set a number (e.g., 21) if auto-detection fails
    const minDelay = 500;  // 0.5 seconds min
    const maxDelay = 1000; // 1.0 seconds max
    const pointsPerEuro = 100; // 100p = 1€
    // ==========================================

    const parser = new DOMParser();
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function detectMaxPage() {
        if (forcedMaxPage > 0) return forcedMaxPage;
        const paginationLinks = Array.from(document.querySelectorAll('.pagination li a'));
        const pageNumbers = paginationLinks.map(a => {
            const match = a.href.match(/[?&]page=(\d+)/);
            if (match) return parseInt(match[1]);
            const num = parseInt(a.innerText.trim());
            return isNaN(num) ? 0 : num;
        });
        return pageNumbers.length ? Math.max(...pageNumbers) : 1;
    }

    const maxPage = detectMaxPage();
    
    let urlTemplate = window.location.href;
    if (urlTemplate.includes('?')) {
        if (urlTemplate.match(/[?&]page=\d+/)) {
            urlTemplate = urlTemplate.replace(/([?&]page=)\d+/, '$1{{PAGE}}');
        } else {
            urlTemplate += '&page={{PAGE}}';
        }
    } else {
        urlTemplate += '?page={{PAGE}}';
    }

    console.log(`%c📄 ${maxPage} pages to analyze.`, styles.info);

    let grandTotal = 0;
    let transactionCount = 0;
    
    let maxTransaction = {
        value: 0,
        date: "N/A"
    };

    let minTransaction = {
        value: Infinity,
        date: "N/A"
    };

    for (let i = 1; i <= maxPage; i++) {
        const url = urlTemplate.replace('{{PAGE}}', i);
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const html = await response.text();

            const doc = parser.parseFromString(html, 'text/html');
            const rows = Array.from(doc.querySelectorAll('table.table tbody tr'));
            let pageTotal = 0;

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 4) return;

                const dateRaw = cells[0].innerText.trim();
                const type = cells[1].innerText.trim();
                const valueRaw = cells[3].innerText.trim();

                if (type.toLowerCase().includes('voucher redemption')) {
                    const valueMatch = valueRaw.match(/(-?\d+)/);
                    if (valueMatch) {
                        const val = parseInt(valueMatch[0], 10);
                        
                        pageTotal += val;
                        transactionCount++;

                        if (val > maxTransaction.value) {
                            maxTransaction.value = val;
                            maxTransaction.date = dateRaw;
                        }

                        if (val < minTransaction.value) {
                            minTransaction.value = val;
                            minTransaction.date = dateRaw;
                        }
                    }
                }
            });

            grandTotal += pageTotal;
            console.log(`%c[${i}/${maxPage}]%c Page processed (Running Total: ${grandTotal}p)`, styles.success, "color: #999");

        } catch (err) {
            console.error(`❌ Error on page ${i}:`, err);
        }

        if (i < maxPage) {
            const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
            await sleep(delay);
        }
    }

    const average = transactionCount > 0 ? (grandTotal / transactionCount).toFixed(0) : 0;
    if (minTransaction.value === Infinity) minTransaction.value = 0;

    const eurosTotal = (grandTotal / pointsPerEuro).toFixed(2);

    console.log("\n");
    console.group("%c📊 FINAL REPORT", styles.title);
    
    console.log(`%c💰 TOTAL REDEEMED VALUE : ${grandTotal}p`, styles.total);
    console.log(`%c💶 ESTIMATED SPENT      : ${eurosTotal}€ (at 100p = 1€)`, styles.currency);
    console.log(`%c↔️ Transaction Count    : ${transactionCount}`, styles.sub);
    console.log(`%c📉 Average Transaction  : ${average}p / transaction`, styles.sub);
    console.log(`%c🔝 Largest Transaction  : ${maxTransaction.value}p (on ${maxTransaction.date})`, styles.highlight);
    console.log(`%c🔻 Smallest Transaction : ${minTransaction.value}p (on ${minTransaction.date})`, styles.highlightMin);
    
    console.groupEnd();
})();
