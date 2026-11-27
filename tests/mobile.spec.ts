import { expect, test } from "@playwright/test";

test("supports menu disclosure, Escape and hash navigation on a phone", async ({
  page,
}, testInfo) => {
  if (testInfo.project.name === "chromium")
    await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const menu = page.getByRole("button", { name: "Open menu" });
  await expect(nav).toBeHidden();
  await menu.click();
  await expect(nav).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await nav.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(nav).toBeHidden();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

for (const width of [375, 768, 1024, 1440, 1920]) {
  test(`fits the home and on-page demos at ${width}px`, async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "Chromium viewport matrix");
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/");
    expect(
      await page.locator(".network-art").evaluate((art) => {
        const bounds = art.getBoundingClientRect();
        return [...art.querySelectorAll(".network-node")].every((node) => {
          const box = node.getBoundingClientRect();
          return (
            box.left >= bounds.left &&
            box.right <= bounds.right + 1 &&
            bounds.right <= window.innerWidth
          );
        });
      }),
    ).toBe(true);
    await page.locator(".impact-feature").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("combobox", { name: "Governorate" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("#portfolio-grid .project-card")).toHaveCount(9);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}
