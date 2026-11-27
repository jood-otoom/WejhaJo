import { expect, test } from "@playwright/test";

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
