import { expect, test, type Page } from "@playwright/test";

async function openDemo(page: Page, name: string) {
  await page.goto("/#work");
  await page
    .locator(".portfolio-demos > details > summary")
    .filter({ hasText: name })
    .click();
  return page.getByRole("region", { name, exact: true });
}

test("selects a governorate on the map, changes metric and resets", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.locator(".impact-feature").scrollIntoViewIfNeeded();
  const panel = page.getByRole("region", { name: "Program impact explorer" });
  const region = panel.getByRole("button", { name: "Amman", exact: true });
  await expect(
    panel
      .getByRole("group", { name: "Map of Jordan’s governorates" })
      .getByRole("button"),
  ).toHaveCount(12);
  await region.focus();
  await expect(panel.locator(".map-tooltip")).toContainText("Amman · 265");
  await page.keyboard.press("Enter");
  await expect(region).toHaveAttribute("aria-pressed", "true");
  await expect(panel.getByRole("combobox")).toHaveValue("JO-AM");
  await panel.getByRole("button", { name: "Programs" }).click();
  await expect(panel.locator(".impact-value")).toContainText("5");
  await panel.getByRole("button", { name: "Reset selection" }).click();
  await expect(panel.getByRole("combobox")).toHaveValue("");
  await expect(panel.locator(".impact-value")).toContainText("31");
  expect(errors).toEqual([]);
});

test("updates BI date and program filters and displays chart data", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning")
      errors.push(message.text());
  });
  const panel = await openDemo(page, "Business intelligence dashboard");
  await panel.getByLabel("Date range").selectOption("1");
  await panel
    .getByLabel("Program", { exact: true })
    .selectOption("Skills workshops");
  await expect(panel.locator(".demo-kpi").first()).toContainText("141");
  await expect(panel.getByRole("progressbar")).toHaveAttribute("value", "84");
  await panel.getByText("View demographic data").click();
  await expect(panel.getByRole("row", { name: /Oct 81 52 8/ })).toBeVisible();
  const chart = panel.locator("svg.recharts-surface[tabindex]");
  await chart.focus();
  await page.keyboard.press("ArrowRight");
  await expect(panel.locator(".recharts-tooltip-wrapper")).toContainText(
    "Women",
  );
  expect(errors).toEqual([]);
});

test("changes sales forecast horizon and explores the interactive chart", async ({
  page,
}) => {
  const panel = await openDemo(page, "Sales forecasting dashboard");
  await panel.getByLabel("Forecast period").selectOption("6");
  await expect(panel.locator(".demo-kpi").nth(1)).toContainText("1,825");
  await panel.getByText("View forecast data").click();
  await expect(panel.getByRole("row", { name: /Apr ’27/ })).toContainText(
    "1825",
  );
  const chart = panel.locator("svg.recharts-surface[tabindex]");
  await chart.focus();
  await page.keyboard.press("ArrowRight");
  await expect(panel.locator(".recharts-tooltip-wrapper")).toContainText(
    "Historical",
  );
});

test("uses the knowledge chat and opens a source excerpt", async ({ page }) => {
  const panel = await openDemo(page, "Knowledge assistant");
  await panel
    .getByRole("button", { name: "Who approves a purchase request?" })
    .click();
  await expect(panel.getByRole("log")).toContainText("JOD 500");
  await panel.getByText("Procurement policy · Page 7").click();
  await expect(panel.getByText(/require the department lead/)).toBeVisible();
  await panel
    .getByRole("textbox", { name: "Your question" })
    .fill("Where do I report a system issue?");
  await panel.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(panel.getByText("IT service guide · Page 2")).toBeVisible();
});

test("browses, books and cancels a GoTime example slot on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const panel = await openDemo(page, "GoTime booking demo");
  await panel.getByLabel("Sport").selectOption("Football");
  await expect(
    panel.getByRole("button", { name: /Capital Five-a-Side/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await panel.getByRole("button", { name: "Sat Dec 5" }).click();
  await panel.getByRole("button", { name: "18:30", exact: true }).click();
  await panel.getByRole("button", { name: "Book selected time" }).click();
  await expect(panel.getByRole("status")).toContainText(
    "Sample booking added.",
  );
  await panel.getByRole("button", { name: /Cancel booking/ }).click();
  await expect(panel.getByText("No sample bookings yet.")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("filters procurement orders and changes data views", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const panel = await openDemo(page, "Procurement workspace");
  await panel.getByLabel("Order status").selectOption("In transit");
  await expect(panel.getByRole("row")).toHaveCount(2);
  await expect(panel.getByRole("row", { name: /PO-1043/ })).toBeVisible();
  await panel.getByRole("button", { name: "Suppliers" }).click();
  await expect(
    panel.getByRole("table", { name: "Supplier directory" }),
  ).toBeVisible();
  await panel.getByRole("button", { name: "Inventory" }).click();
  await expect(
    panel.getByRole("table", { name: "Inventory overview" }),
  ).toContainText("Reorder");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
