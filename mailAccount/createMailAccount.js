const { config } = require("../config");
const { _LaunchBrowser } = require("../main");
const { generateCredentials } = require('../credentials/generateCredentials');
const { delay } = require("../helpers/delay");
const { log } = require("../logger/logger");

module.exports.createMailAccount = async (options) => {
    try {
        // const { page, browser } = await (await _LaunchBrowser({headless: false, slowMo: 40}));
        const { page, browser } = await (await _LaunchBrowser({headless: true, slowMo: 20}));
        const _page = page;
        const _browser = browser;
        // const _page =  await _LaunchBrowser({headless: false, slowMo: 100}) // For Dev Tests
        // const _page = await _LaunchBrowser({headless: true}) 
        await _page.goto(config.registerMailUrl);
    
        const args = process.argv.slice(2);
        const argsArray = [args[0], args[1]];
        
        // Rodo accept
        await _page.click(`body > div.rodo-popup > div.rodo-popup-buttons > button.rodo-popup-agree`);
    
        //Find personal info and then type it
        const personalInfoInputs = await _page.evaluate(() => [...document.querySelectorAll('#mainApp > div > div > div > div > div.register-page-wrapper > div > form > div.register-form__inputs > div > input')].map(el => el.getAttribute('id')));
    
        for(let i = 0; i<personalInfoInputs.length; i++) {
            await _page.type(`input[id="${personalInfoInputs[i]}"]`, `${args[i]}`)
        }
        
        // Randomize and type birthday day
        const dateOfBirth = Math.floor(Math.random() * (28 - 1 + 1) + 1)
        await _page.type(`input[id="birthdayDay"]`, `${dateOfBirth}`)
    
        //Find month input then type month
        await _page.click(`#mainApp > div > div > div > div > div.register-page-wrapper > div > form > div.register-form__inputs > div.register-form__inputs__birthday > div.account-input-container.account-select > div.account-input > input`);
        await _page.click(`.account-select__options__item`);
    
        // Type birthday year
        await _page.type(`input[id="birthdayYear"]`, '1993');
    
        // Find sex input then type sex
        await delay(100)
        await _page.click(`#mainApp > div > div > div > div > div.register-page-wrapper > div > form > div.register-form__inputs > div.account-input-container.account-select > div.account-input > input`)
        await delay(100)
        await _page.click(`.account-select__options__item`);
    
        // Generate credentials from function 
        // returns {email, password, fullNameWithDot}
        const credentials = generateCredentials(argsArray);
    
        //Find email input then type email
        const emailInput = await _page.evaluate(() => document.querySelector('#mainApp > div > div > div > div > div.register-page-wrapper > div > form > div.register-form__inputs > div.register-form__inputs-mail > div > input').getAttribute('id'));
        const randomizedAccountNumber = Math.floor(Math.random() * (9999 - 100 + 100) + 100);
        await delay(100)
        await _page.click(`input[id="${emailInput}"]`, {clickCount: 3});
        await delay(300)
        await _page.type(`input[id="${emailInput}"]`, `${credentials.fullNameWithDot}${randomizedAccountNumber}`);
    
        // Type password to password inputs
        await _page.type(`input[id="password"]`, `${credentials.password}`);
        await _page.type(`input[id="rePassword"]`, `${credentials.password}`);
    
        //  Accept agreements
        await _page.waitForSelector(`input[name="agreementacceptAll-acceptAll"]`);
        await _page.evaluate(() => {
            document.querySelector(`input[name="agreementacceptAll-acceptAll"]`).parentElement.click();
          });
    
        // Submit form
        // save target of original page to know that this was the opener:     
        const pageTarget = _page.target();
        //execute click on first tab that triggers opening of new tab:
        await _page.waitForSelector(`#mainApp > div > div > div > div > div.register-page-wrapper > div > form > div.register-form__information > button`);
        await _page.click(`#mainApp > div > div > div > div > div.register-page-wrapper > div > form > div.register-form__information > button`);
        log(`${credentials.fullNameWithDot}${randomizedAccountNumber}@interia.pl:${credentials.password}`, 'accounts');
        console.log(`account created, check logs`);
        //check that the first page opened this new page:
        const newTarget = await _browser.waitForTarget(target => target.opener() === pageTarget);
        //get the new page object:
        const newPage = await newTarget.page();
        await _browser.close();
    } catch(err) {
        console.log(err);
    }
}

this.createMailAccount();