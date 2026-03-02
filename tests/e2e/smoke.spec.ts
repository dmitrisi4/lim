import { expect, test } from "@playwright/test";

test("home page opens and navigates to feed", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Instagram x Duolingo")).toBeVisible();

  await page.getByRole("link", { name: "Открыть ленту" }).click();
  await expect(page).toHaveURL(/\/feed/);

  await expect(page.getByRole("link", { name: "Новая пачка" })).toBeVisible();
  await expect(page.getByText(/XP/)).toBeVisible();
});

test("interaction button works in feed", async ({ page }) => {
  await page.goto("/feed");

  const button = page.getByRole("button", { name: /Проверить|Отметить как пройдено|Завершить мини-игру|Отправить пару/ }).first();
  await expect(button).toBeVisible();

  const optionalRadio = page.locator('input[type="radio"]').first();
  if (await optionalRadio.isVisible()) {
    await optionalRadio.check();
  }

  await button.click();
  await expect(page.getByText(/Карточка засчитана|Ответ принят/)).toBeVisible();
});
