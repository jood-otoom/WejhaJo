import { expect, test } from "@playwright/test";

test("validates contact fields and preserves input when the unconfigured server rejects it", async ({
  page,
}) => {
  await page.goto("/#contact");
  const form = page.getByRole("form", { name: "Project inquiry" });
  await form.getByRole("button", { name: "Send inquiry" }).click();
  await expect(form.getByLabel("Full name")).toBeFocused();
  await expect(form.getByText("Enter a valid email address.")).toBeVisible();
  await form.getByLabel("Full name").fill("Noor Ahmad");
  await form.getByLabel("Email address").fill("noor@example.com");
  await form
    .getByLabel("Project description")
    .fill("I would like to improve our booking workflows.");
  const failed = page.waitForResponse((response) =>
    response.url().endsWith("/api/contact"),
  );
  await form.getByRole("button", { name: "Send inquiry" }).click();
  expect((await failed).status()).toBe(503);
  await expect(form.getByRole("alert")).toContainText(
    "We couldn’t send your inquiry right now.",
  );
  await expect(form.getByLabel("Full name")).toHaveValue("Noor Ahmad");
});

test("locks submission while pending and renders confirmed success", async ({
  page,
}) => {
  let submissions = 0;
  let respond: () => void = () => {};
  const pending = new Promise<void>((resolve) => {
    respond = resolve;
  });
  await page.route("**/api/contact", async (route) => {
    submissions++;
    await pending;
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/#contact");
  const form = page.getByRole("form", { name: "Project inquiry" });
  await form.getByLabel("Full name").fill("Noor Ahmad");
  await form.getByLabel("Email address").fill("noor@example.com");
  await form
    .getByLabel("Project description")
    .fill("I would like to improve our booking workflows.");
  await form.getByRole("button", { name: "Send inquiry" }).click();
  await expect(
    form.getByRole("button", { name: "Sending inquiry…" }),
  ).toBeDisabled();
  await form.getByLabel("Full name").press("Enter");
  respond();
  await expect(form.getByRole("status")).toContainText("Your inquiry was sent");
  await expect(form.getByLabel("Full name")).toHaveValue("");
  expect(submissions).toBe(1);
});
