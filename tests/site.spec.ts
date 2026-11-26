import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { projectCategories, projects } from "../src/data/projects";

test("filters all portfolio categories and opens each project detail", async ({
  page,
}) => {
  await page.goto("/");
  const filters = page.getByRole("group", { name: "Filter projects" });
  const grid = page.locator("#portfolio-grid");
  for (const category of projectCategories) {
    const button = filters.getByRole("button", {
      name: category,
      exact: true,
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    const matches = projects.filter((project) => project.category === category);
    await expect(grid.getByRole("article")).toHaveCount(matches.length);
    for (const { name } of matches)
      await expect(
        grid.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
  }
  await filters.getByRole("button", { name: "All", exact: true }).click();
  await expect(grid.getByRole("article")).toHaveCount(10);
  await grid.getByRole("link", { name: "View project: GoTime" }).click();
  await expect(page).toHaveURL(/\/projects\/gotime$/);
  for (const { slug, name } of projects) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { name, level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Intended business value" }),
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://wejhajo.org/projects/${slug}`,
    );
  }
});

test("navigates by keyboard, updates section state and changes process stage", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const approach = nav.getByRole("link", { name: "Our Approach" });
  await approach.focus();
  await page.keyboard.press("Enter");
  await expect(approach).toHaveAttribute("aria-current", "location");
  await page.getByRole("button", { name: "Train & Empower" }).click();
  await expect(page.locator("#process-description")).toContainText(
    "onboarding",
  );
  await page.getByRole("button", { name: "Next stage" }).click();
  await expect(
    page.locator("#process-description").getByRole("heading"),
  ).toHaveText("Support & Grow");
});

test("checks links, social images and absence of contact credentials in public output", async ({
  page,
  request,
}) => {
  const responses: string[] = [];
  page.on("pageerror", (error) => responses.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") responses.push(message.text());
  });
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  expect(response?.headers()["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https:\/\/wejhajo\.org\/?$/,
  );
  const links = await page
    .locator("a[href]")
    .evaluateAll((anchors) =>
      anchors.map(
        (anchor) => (anchor as HTMLAnchorElement).getAttribute("href") ?? "",
      ),
    );
  for (const url of new Set(links)) {
    const [path, id] = url.split("#");
    if ((!path || path === "/") && id)
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    else if (path.startsWith("/"))
      expect((await request.get(path)).ok(), path).toBe(true);
    expect(url).not.toMatch(/^mailto:/);
  }
  for (const path of [
    "/opengraph-image",
    "/projects/gotime/opengraph-image",
    "/brand/favicon.png",
  ]) {
    const asset = await request.get(path);
    expect(asset.ok(), path).toBe(true);
    expect(asset.headers()["content-type"]).toContain("image/png");
  }
  const brand = await request.get("/brand/wejha-mark.webp");
  expect(brand.ok()).toBe(true);
  expect(brand.headers()["content-type"]).toContain("image/webp");
  const html = await page.content();
  expect(html).not.toMatch(
    /RESEND_API_KEY|UPSTASH_REDIS_REST_TOKEN|CONTACT_HASH_SECRET/,
  );
  expect(responses).toEqual([]);
  expect((await request.get("/projects/unknown-project")).status()).toBe(404);
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain(
    "Sitemap: https://wejhajo.org/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain("<loc>https://wejhajo.org/</loc>");
  expect(xml.match(/<loc>/g)).toHaveLength(13);
});

test("passes axe on the home page and loaded map", async ({ page }) => {
  await page.goto("/");
  const impact = page.getByRole("region", {
    name: "Program impact explorer",
  });
  await page.locator(".impact-feature").scrollIntoViewIfNeeded();
  await expect(
    impact.getByRole("button", { name: "Amman", exact: true }),
  ).toBeVisible();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
});
