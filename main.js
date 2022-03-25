const puppeteer = require('puppeteer');

module.exports._LaunchBrowser = async (opts) => {
    const browser = await puppeteer.launch(opts);
    const page = await browser.newPage();

    return {page, browser};
}
