import { chromium } from 'playwright';

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  console.log('Navigating to homepage...');
  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/current-home.png', fullPage: false });
  console.log('Homepage screenshot taken!');

  console.log('Navigating to sample post...');
  await page.goto('http://127.0.0.1:8080/ya-renkler-olmasaydi', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'screenshots/current-post.png', fullPage: false });
  console.log('Post detail screenshot taken!');

  await browser.close();
}

takeScreenshots().catch(console.error);
