import { test, expect, type Page } from "@playwright/test";

/** Stub window.open so web routing is observable without real popups. */
async function stubOpen(page: Page) {
  await page.evaluate(() => {
    (window as any).__opens = [];
    window.open = (url?: string | URL, name?: string, features?: string) => {
      (window as any).__opens.push({
        url: String(url ?? ""),
        name: name ?? "",
        features: features ?? "",
      });
      return null;
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("auto-intercepts a tel: link and offers sanitized providers", async ({ page }) => {
  await page.click('a[href="tel:+15551234567"]');
  await expect(page.locator(".pl-overlay")).toBeVisible();
  await expect(page.locator(".pl-title")).toContainText("Call +15551234567");

  // OS Default executes the sanitized E.164 number
  const osUrl = await page.getAttribute('.pl-provider[data-id="os"]', "data-url");
  expect(osUrl).toBe("tel:+15551234567");

  // Call rows only
  const kinds = await page.locator(".pl-provider").evaluateAll((rows) =>
    rows.map((r) => r.getAttribute("data-kind"))
  );
  expect(kinds).not.toContain(null);
});

test("auto-intercepts an sms: link and keeps the ?body payload", async ({ page }) => {
  await page.click('a[href="sms:+15551234567?body=Need%20help"]');
  await expect(page.locator(".pl-title")).toContainText("Text");
  const osUrl = await page.getAttribute('.pl-provider[data-id="os"]', "data-url");
  expect(osUrl).toBe("sms:+15551234567?body=Need%20help");
});

test("declarative triggers sanitize messy numbers", async ({ page }) => {
  await page.click('.phonelayer-trigger[data-phonelayer-to="(555) 123-4567"]');
  await expect(page.locator(".pl-overlay")).toBeVisible();
  await expect(page.locator(".pl-modal")).toHaveAttribute("data-clean", "5551234567");
  const osUrl = await page.getAttribute('.pl-provider[data-id="os"]', "data-url");
  expect(osUrl).toBe("tel:5551234567");
});

test("search filters the provider list live", async ({ page }) => {
  await page.click('a[href="tel:+15551234567"]');
  const all = await page.locator(".pl-provider").count();
  expect(all).toBeGreaterThan(2);

  await page.fill(".pl-search", "whatsapp");
  await expect(page.locator(".pl-provider:visible")).toHaveCount(2);
  const names = await page.locator(".pl-provider:visible").evaluateAll((rows) =>
    rows.map((r) => r.textContent ?? "")
  );
  expect(names.every((n) => n.includes("WhatsApp"))).toBe(true);

  await page.fill(".pl-search", "zzz-no-match");
  await expect(page.locator(".pl-provider:visible")).toHaveCount(0);
  await expect(page.locator(".pl-list")).toContainText("No providers match");
});

test("granular trigger overrides theme and color", async ({ page }) => {
  await page.click('.phonelayer-trigger[data-phonelayer-color="#4fd1c5"]');
  await expect(page.locator(".pl-modal")).toHaveAttribute("data-pl-theme", "light");
  const primary = await page.evaluate(
    () => getComputedStyle(document.querySelector(".pl-modal")!).getPropertyValue("--pl-primary").trim()
  );
  expect(primary).toBe("#4fd1c5");
});

test("script-level theming applies the dark theme by default", async ({ page }) => {
  await page.click('a[href="tel:+15551234567"]');
  await expect(page.locator(".pl-modal")).toHaveAttribute("data-pl-theme", "dark");
  const primary = await page.evaluate(
    () => getComputedStyle(document.querySelector(".pl-modal")!).getPropertyValue("--pl-primary").trim()
  );
  expect(primary).toBe("#7c5cff");
});

test("web providers route via a centered popup", async ({ page }) => {
  await stubOpen(page);
  await page.click('a[href="tel:+15551234567"]');
  await page.click('.pl-provider[data-id="google-voice"]');

  const opens = await page.evaluate(() => (window as any).__opens);
  expect(opens).toHaveLength(1);
  expect(opens[0].url).toContain("https://voice.google.com/u/0/calls?a=nc,+15551234567");
  expect(opens[0].features).toContain("width=600");
  expect(opens[0].features).toContain("height=700");
  await expect(page.locator(".pl-overlay")).toBeHidden();
});

test("app providers route via location and close the modal", async ({ page }) => {
  await page.click('a[href="tel:+15551234567"]');
  await page.click('.pl-provider[data-id="os"]');
  await expect(page.locator(".pl-overlay")).toBeHidden();
});

test('"remember my choice" routes directly until reset', async ({ page }) => {
  await stubOpen(page);

  // Choose WhatsApp Web and remember it
  await page.click('a[href="tel:+15551234567"]');
  await page.check(".pl-remember input");
  await page.click('.pl-provider[data-id="whatsapp-web"]');
  expect(await page.evaluate(() => (window as any).__opens)).toHaveLength(1);

  // Next click routes straight through — no modal
  await page.click('a[href="tel:+15551234567"]');
  await expect(page.locator(".pl-overlay")).toBeHidden();
  const opens = await page.evaluate(() => (window as any).__opens);
  expect(opens).toHaveLength(2);
  expect(opens[1].url).toContain("https://wa.me/+15551234567");

  // Reset restores the modal
  await page.evaluate(() => (window as any).PhoneLayer.reset());
  await page.click('a[href="tel:+15551234567"]');
  await expect(page.locator(".pl-overlay")).toBeVisible();
});

test("disables itself on mobile user agents", async ({ browser }) => {
  const ctx = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await ctx.newPage();
  await page.goto("/");

  expect(await page.evaluate(() => (window as any).PhoneLayer)).toBeUndefined();

  await page.click('a[href="tel:+15551234567"]');
  await page.waitForTimeout(300);
  await expect(page.locator(".pl-overlay")).toHaveCount(0);
  await ctx.close();
});