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

    //CONFIGURATION
    let forcedMaxPage = 0; 
    const minDelay = 500;  
    const maxDelay = 1000; 
    const pointsPerEuro = 100; 


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

    let voucherFrequency = {};

    let gameStats = [];
    let printerTotal = 0;
    let premiumTimeTotal = 0;
    let jubeatExpertTotal = 0;
    let jubeatExpertCount = 0;
    
    // NOUVEAU: Compteurs et Totaux spécifiques SDVX
    let sdvxStandardStartCount = 0;
    let sdvxStandardStartTotal = 0;
    let sdvxStandardCreditCount = 0;
    let sdvxStandardCreditTotal = 0;


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
                const description = cells[2].innerText.trim();
                const valueRaw = cells[3].innerText.trim();
                const valueMatch = valueRaw.match(/(-?\d+)/);


                if (type.toLowerCase().includes('voucher redemption')) {
                    if (valueMatch) {
                        const val = parseInt(valueMatch[0], 10);
                        
                        pageTotal += val;
                        transactionCount++;

                        voucherFrequency[val] = (voucherFrequency[val] || 0) + 1;

                        if (val > maxTransaction.value) {
                            maxTransaction.value = val;
                            maxTransaction.date = dateRaw;
                        }


                        if (val < minTransaction.value) {
                            minTransaction.value = val;
                            minTransaction.date = dateRaw;
                        }
                    }
                } else if(!row.classList.contains('info') && valueMatch){
                    const val = parseInt(valueMatch[0], 10);

                    if (type.toLowerCase() === "jubeat") {
                        if (val === -12) {
                            jubeatExpertTotal += val;
                            jubeatExpertCount++;
                        } else {
                            let game = gameStats.find((games) => games.type === type);
                            if(!game) {
                                gameStats.push({
                                    type: type,
                                    total: 0 - val,
                                    transactionCount: 1
                                })
                            } else {
                                game.total -= val;
                                game.transactionCount += 1;
                                gameStats = gameStats.filter((games) => games.type !== type);
                                gameStats.push(game);
                            }
                        }
                    }
                    else if (type.toLowerCase() === "sound voltex") {
                        // Gestion spécifique des types de start avec leurs totaux
                        if (description.toLowerCase().includes("standard start")) {
                            sdvxStandardStartCount++;
                            sdvxStandardStartTotal += val;
                        } else if (description.toLowerCase().includes("standard credit")) {
                             sdvxStandardCreditCount++;
                             sdvxStandardCreditTotal += val;
                        }


                        if (description.toLowerCase().includes("premium time")) {
                            premiumTimeTotal += val;
                        } else if (val < -120) {
                            printerTotal += val;
                        } else {
                            let game = gameStats.find((games) => games.type === type);
                            if(!game) {
                                gameStats.push({
                                    type: type,
                                    total: 0 - val,
                                    transactionCount: 1
                                })
                            } else {
                                game.total -= val;
                                game.transactionCount += 1;
                                gameStats = gameStats.filter((games) => games.type !== type);
                                gameStats.push(game);
                            }
                        }
                    } 
                    else {
                        let game = gameStats.find((games) => games.type === type);
                        if(!game) {
                            gameStats.push({
                                type: type,
                                total: 0 - val,
                                transactionCount: 1
                            })
                        } else {
                            game.total -= val;
                            game.transactionCount += 1;
                            gameStats = gameStats.filter((games) => games.type !== type);
                            gameStats.push(game);
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

    let mostCommonVal = 0;
    let mostCommonCount = 0;
    for (const [val, count] of Object.entries(voucherFrequency)) {
        if (count > mostCommonCount) {
            mostCommonVal = val;
            mostCommonCount = count;
        }
    }


    console.log("\n");
    console.group("%c📊 FINAL REPORT", styles.title);
    
    console.log(`%c💰 TOTAL REDEEMED VALUE : ${grandTotal}p`, styles.total);
    console.log(`%c💶 ESTIMATED SPENT      : ${eurosTotal}€ (at 100p = 1€)`, styles.currency);
    console.log(`%c↔️ Number of Redeemed Vouchers    : ${transactionCount}`, styles.sub);
    console.log(`%c📉 Average Voucher Redeemed Value  : ${average}p`, styles.sub);
    console.log(`%c🔄 Most Common Redemmed Voucher Value  : ${mostCommonVal}p (x${mostCommonCount})`, styles.sub);
    console.log(`%c🔝 Largest Redeemed Voucher Value  : ${maxTransaction.value}p (on ${maxTransaction.date})`, styles.highlight);
    console.log(`%c🔻 Smallest Redeemed Voucher Value : ${minTransaction.value}p (on ${minTransaction.date})`, styles.highlightMin);
    console.groupEnd();
    
    for(let game of gameStats) {
        console.group(`%cGame : ${game.type}`, styles.title);
        console.log(`%cTotal spent : ${game.total}p`, styles.sub);
        
        if(game.type === 'SOUND VOLTEX') {
            console.log(`%cTotal for SDVX Printer : ${0-printerTotal}p`, styles.sub);
            console.log(`%cTotal for Premium Time : ${0-premiumTimeTotal}p`, styles.sub);
            console.log(`%cStandard Start : ${0-sdvxStandardStartTotal}p (${sdvxStandardStartCount} plays)`, styles.sub);
            if (sdvxStandardCreditCount > 0) console.log(`%cLight Start : ${0-sdvxStandardCreditTotal}p (${sdvxStandardCreditCount} plays)`, styles.sub);
        }
        
        if(game.type === 'jubeat') {
             console.log(`%cTotal for Expert Option : ${0-jubeatExpertTotal}p (Count: ${jubeatExpertCount})`, styles.sub);
        }
        
        console.log(`%cTransaction count : ${game.transactionCount}`, styles.sub);
        console.log(`%cTotal ratio : ${(game.total/grandTotal)*100}%`, styles.sub);
        console.groupEnd();
    }
})();
