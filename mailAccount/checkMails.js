const { config } = require("../config");
const { monitoredCredentials } = require("../credentials/monitoredCredentials");
const { delay } = require("../helpers/delay");
const { log } = require("../logger/logger");
const { _LaunchBrowser } = require("../main");

module.exports.checkMails = async () => {
    try {
        for(account in monitoredCredentials) {
            const { page, browser } = await _LaunchBrowser({headless: true});
            const _page = page, _browser = browser;
            await _page.goto(config.loginMailUrl);
        
            // Rodo accept
            await _page.click(`body > div.rodo-popup > div.rodo-popup-buttons > button.rodo-popup-agree`);
        
            // Find and type email
            await _page.type(`input[id="email"]`, `${monitoredCredentials[account].email}`)
        
            // Find and type password
            await _page.type(`input[id="password"]`, `${monitoredCredentials[account].password}`)
        
            //Log in
            await _page.waitForSelector(`#sitebar > form > button`);
            await _page.click(`#sitebar > form > button`);
            // await delay(500);
    
            const newPage = await browser.newPage();
            await newPage.goto(config.mailUrl);
    
            try {
                await newPage.click(`#wrapper > div.dialog-list.dialog-list--shown.maximized-wrapper > div > div.dialog-container > div.dialog__close.icon.icon-close`);
            } catch(err) {
                log(`error after logging (not found element to close), ${err}`, 'errors');
            }
            await newPage.screenshot({
                path: `./mailAccount/status/${monitoredCredentials[account].email}.png`,
                fullPage: true
            })
    
            page.close();
            newPage.close();
        }
        browser.close();
    } catch(err) {
        log(`error with logging, ${err}`, 'errors');
    }
} 

this.checkMails();