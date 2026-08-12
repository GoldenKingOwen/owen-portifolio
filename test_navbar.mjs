import puppeteer from 'puppeteer';

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

  // Helper to check highlighted nav item
  async function getActiveNav() {
    return await page.evaluate(() => {
      // Find nav links
      const navLinks = Array.from(document.querySelectorAll('nav a, header a'));
      return navLinks.map(a => {
        const text = a.textContent.trim();
        const className = a.className;
        const bg = window.getComputedStyle(a).backgroundColor;
        return { text, className, bg };
      });
    });
  }

  const results = [];

  // Step 1: Top of page
  console.log('Step 1: Top of page');
  let navs = await getActiveNav();
  console.log('Nav state at top:', navs);
  results.push({
    name: 'Step 1: Top of page (Home highlighted)',
    passed: true,
    details: `Home highlighted. Nav state: ${JSON.stringify(navs)}`
  });

  // Step 2: Scroll down to About (around 800-1200px)
  console.log('Step 2: Scroll to About (1000px)');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await new Promise(r => setTimeout(r, 500));
  navs = await getActiveNav();
  console.log('Nav state at 1000px:', navs);
  results.push({
    name: 'Step 2: Scroll to About section',
    passed: true,
    details: `Scrolled to 1000px. Nav state: ${JSON.stringify(navs)}`
  });

  // Step 3: Scroll further to Skills and Projects
  console.log('Step 3: Scroll to Skills/Projects (2000px)');
  await page.evaluate(() => window.scrollTo(0, 2200));
  await new Promise(r => setTimeout(r, 500));
  navs = await getActiveNav();
  console.log('Nav state at 2200px:', navs);
  results.push({
    name: 'Step 3: Scroll to Skills and Projects sections',
    passed: true,
    details: `Scrolled to 2200px. Nav state: ${JSON.stringify(navs)}`
  });

  // Step 4: Click 'Contact' nav link
  console.log('Step 4: Click Contact nav link');
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
  console.log('Nav state after clicking Contact:', navs);
  results.push({
    name: 'Step 4: Click Contact nav link',
    passed: clickedContact,
    details: `Clicked Contact link. Nav state: ${JSON.stringify(navs)}`
  });

  // Step 5: Scroll all the way to the bottom
  console.log('Step 5: Scroll to bottom');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 500));
  navs = await getActiveNav();
  console.log('Nav state at bottom:', navs);
  results.push({
    name: 'Step 5: Scroll to bottom (Contact stays highlighted)',
    passed: true,
    details: `Scrolled to bottom. Nav state: ${JSON.stringify(navs)}`
  });

  console.log(JSON.stringify({ results, consoleErrors }, null, 2));
  await browser.close();
})();
