import { Page, test, expect } from "@playwright/test";

export async function setup({ page }: { page: Page }) {
  await page.goto(`http://localhost:8181`);
  await expect(page.locator('h1')).toContainText('E2E channel test');

  // collect all console logs
  page.on('console', msg => {
    console.log(msg)
  })

  // create iFrame with other page
  await page.evaluate(async () => {
    // change headline to "Main window"
    document.body.innerHTML = `<h1>Main window</h1>`;

    // add iFrame with new page
    var iframe = document.createElement('iframe');
    iframe.src = 'http://localhost:8182';
    iframe.id = 'subFrame'
    document.body.appendChild(iframe);
  })

  await page.waitForEvent('load');

  const subFrame = page.frame({ name: 'subFrame' });

  if (subFrame === null) {
    throw new Error('The child iFrame "subFrame" was not found');
  }

  await subFrame.evaluate(async () => {
    // change headline to "Sub window"
    document.body.innerHTML = `<h1>Sub window</h1>`;
  })

  return {
    mainFrame: page,
    subFrame: subFrame
  }
}