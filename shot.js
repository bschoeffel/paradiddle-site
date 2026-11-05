const { chromium, devices } = require('playwright');
const SITES = [['mesproches', 'https://mesproches.app/'], ['maisonsainto', 'https://maisonsainto.com/']];
(async () => {
  const b = await chromium.launch();
  for (const [nom, url] of SITES) {
    for (const [mode, opts] of [['desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }], ['mobile', devices['iPhone 13']]]) {
      const ctx = await b.newContext({ ...opts, locale: 'fr-FR' });
      const p = await ctx.newPage();
      try {
        await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
        await p.waitForTimeout(2500);
        await p.screenshot({ path: `out/${nom}-${mode}.png` });
        await p.screenshot({ path: `out/${nom}-${mode}-full.jpg`, fullPage: true, type: 'jpeg', quality: 70 });
        console.log('OK', nom, mode);
      } catch (e) { console.log('KO', nom, mode, e.message); }
      await ctx.close();
    }
  }
  await b.close();
})();
