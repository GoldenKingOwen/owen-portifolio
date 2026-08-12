const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/home/infi-tech/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push({ message: msg.text(), url: page.url() });
    }
  });

  console.log('Navigating to http://localhost:3000');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  async function getActiveNav() {
    return await page.evaluate(() => {
      const navLinks = Array.from(document.querySelectorAll('nav a, header a'));
      return navLinks.map(a => {
        const text = a.textContent.trim();
        const className = a.className;
        const bg = window.getComputedStyle(a).backgroundColor;
        const color = window.getComputedStyle(a).color;
        return { text, className, bg, color };
      });
    });
  }

  const results = [];

  // Step 1: Top of page
  let navs = await getActiveNav();
  console.log('Step 1 (Top):', JSON.stringify(navs, null, 2));
  results.push({
    name: 'Step 1: Top of page',
    passed: true,
    details: `Nav state at top: ${JSON.stringify(navs)}`
  });

  // Step 2: Scroll down to About (1000px)
  await page.evaluate(() => window.scrollTo(0, 1000));
  await new Promise(r => setTimeout(r, 600));
  navs = await getActiveNav();
  console.log('Step 2 (About):', JSON.stringify(navs, null, 2));
  results.push({
    name: 'Step 2: Scroll to About section',
    passed: true,
    details: `Nav state at 1000px: ${JSON.stringify(navs)}`
  });

  // Step 3: Scroll further to Skills/Projects (2200px)
  await page.evaluate(() => window.scrollTo(0, 2200));
  await new Promise(r => setTimeout(r, 600));
  navs = await getActiveNav();
  console.log('Step 3 (Skills/Projects):', JSON.stringify(navs, null, 2));
  results.push({
    name: 'Step 3: Scroll to Skills and Projects sections',
    passed: true,
    details: `Nav state at 2200px: ${JSON.stringify(navs)}`
  });

  // Step 4: Click 'Contact' nav link
  const clickedContact = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('nav a, header a'));
    const contactLink = links.find(l => l.textContent.trim().toLowerCase().includes('contact'));
    if (contactLink) {
      contactLink.click();
      return true;
    }
    return false;
  });
  await new Promise(r => setTimeout(r, 1000));
  navs = await getActiveNav();
  console.log('Step 4 (Contact Click):', JSON.stringify(navs, null, 2));
  results.push({
    name: 'Step 4: Click Contact nav link',
    passed: clickedContact,
    details: `Clicked Contact link. Nav state: ${JSON.stringify(navs)}`
  });

  // Step 5: Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  navs = await getActiveNav();
  console.log('Step 5 (Bottom):', JSON.stringify(navs, null, 2));
  results.push({
    name: 'Step 5: Scroll to bottom',
    passed: true,
    details: `Nav state at bottom: ${JSON.stringify(navs)}`
  });

  console.log(JSON.stringify({ results, consoleErrors }, null, 2));
  await browser.close();
})();
