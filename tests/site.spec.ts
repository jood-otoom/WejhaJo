import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { site } from "../src/config/site";
import { projectCategories, projects } from "../src/data/projects";

test("filters all nine projects without linking the cards or showing status badges", async ({
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
  await expect(grid.getByRole("article")).toHaveCount(9);
  await expect(
    grid.getByText("E-Commerce Platform", { exact: true }),
  ).toHaveCount(0);
  await expect(
    grid.getByText(/solution showcase|wejha product|view project/i),
  ).toHaveCount(0);
  await expect(grid.getByRole("link")).toHaveCount(0);
  await expect(grid.getByRole("button")).toHaveCount(0);
  const portfolioUrl = page.url();
  await grid.getByRole("heading", { name: "GoTime", exact: true }).click();
  await expect(page).toHaveURL(portfolioUrl);
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
    if (url.startsWith("mailto:")) expect(url).toBe(`mailto:${site.email}`);
  }
  for (const path of ["/opengraph-image", "/brand/favicon.png"]) {
    const asset = await request.get(path);
    expect(asset.ok(), path).toBe(true);
    expect(asset.headers()["content-type"]).toContain("image/png");
  }
  const brand = await request.get("/brand/wejha-logo.png");
  expect(brand.ok()).toBe(true);
  expect(brand.headers()["content-type"]).toContain("image/png");
  const html = await page.content();
  expect(html).not.toMatch(
    /official@gotimejo\.com|CONTACT_EMAIL|CONTACT_CLIENT_LIMIT|CONTACT_ENDPOINT_LIMIT/,
  );
  expect(responses).toEqual([]);
  for (const slug of [
    ...projects.map(({ slug }) => slug),
    "e-commerce-platform",
  ]) {
    const path = `/projects/${slug}`;
    expect((await request.get(path)).status(), path).toBe(404);
  }
  expect((await request.get("/projects/gotime/opengraph-image")).status()).toBe(
    404,
  );
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain(
    "Sitemap: https://wejhajo.org/sitemap.xml",
  );
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  expect(xml).toContain("<loc>https://wejhajo.org/</loc>");
  expect(xml.match(/<loc>/g)).toHaveLength(3);
  expect(xml).not.toContain("/projects/");
});

test("shows the same official email in contact links, policies, and metadata", async ({
  page,
}) => {
  const mailto = `mailto:${site.email}`;
  await page.goto("/");
  const organization = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "{}",
  );
  expect(organization).toMatchObject({
    "@type": "Organization",
    email: site.email,
  });
  await expect(page.locator('meta[name="contact"]')).toHaveAttribute(
    "content",
    site.email,
  );

  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const selector of ["#contact", ".site-footer"]) {
      const link = page
        .locator(selector)
        .getByRole("link", { name: site.email, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", mailto);
      const bounds = await link.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
  }

  for (const path of ["/privacy", "/terms"]) {
    await page.goto(path);
    await expect(
      page
        .getByRole("main")
        .getByRole("link", { name: site.email, exact: true }),
    ).toHaveAttribute("href", mailto);
  }
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
