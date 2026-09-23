import { expect, test } from "@playwright/test";
import { profileFixture } from "./profile-fixture";
import { visualFixture } from "./visual-fixture";

test("landing page fits mobile, tablet and desktop without profile data", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Every match. A clearer picture." }),
  ).toBeVisible();
  await expect(page.getByText("ILLUSTRATIVE PREVIEW")).toBeVisible();
  await expect(page.locator("#riot-game-name")).toHaveValue("");
  await expect(page.locator("#riot-tag-line")).toHaveValue("");
  await expect(
    page.getByRole("heading", { name: "Match history" }),
  ).toHaveCount(0);
  for (const width of [360, 390, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.getByRole("button", { name: "Find my profile" }).click();
  await expect(page.locator("#riot-game-name")).toBeFocused();
  expect(errors).toEqual([]);
});

test("test account opens LA2 without requiring or autofilling the home search", async ({
  page,
}) => {
  const requests: string[] = [];
  await page.route("**/api/profile?**", (route) => {
    requests.push(route.request().url());
    return route.fulfill({ json: profileFixture });
  });
  await page.goto("/");
  await expect(page.locator("#riot-game-name")).toHaveValue("");
  await expect(page.locator("#riot-tag-line")).toHaveValue("");
  await page.getByRole("combobox", { name: "Server" }).click();
  await page.getByRole("option", { name: "EUW1", exact: true }).click();
  expect(requests).toEqual([]);
  await page.getByRole("button", { name: "Test account", exact: true }).click();
  await expect(page).toHaveURL("/fake-sun~kite");
  await expect(
    page.getByRole("heading", { name: "Fake Sun #Kite" }),
  ).toBeVisible();
  expect(requests).toHaveLength(1);
  expect(new URL(requests[0]).searchParams.get("region")).toBe("LA2");
  await page.getByRole("link", { name: "Rift Insight - Home" }).click();
  await expect(page.locator("#riot-game-name")).toHaveValue("");
  await expect(page.locator("#riot-tag-line")).toHaveValue("");
  await page.locator("#riot-game-name").fill("Another Player");
  await page.locator("#riot-tag-line").fill("#TEST");
  await expect(page.locator("#riot-tag-line")).toHaveValue("TEST");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL("/another-player~test");
});

test("language and server selectors are keyboard accessible and persist language", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: "Español LATAM" }).click();
  await expect(
    page.getByRole("button", { name: "Cuenta de prueba", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cada partida. Más claridad." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Cada partida. Más claridad." }),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Servidor" }).focus();
  await page.keyboard.press("ArrowDown");
  await page.getByRole("option", { name: "EUW1", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Servidor" })).toContainText(
    "EUW1",
  );
});

test("profile layout, insights, filters, participant links, and refresh work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/profile?**", (route) =>
    route.fulfill({ json: profileFixture }),
  );
  await page.goto("/fake-sun~kite");
  await expect(
    page.getByRole("heading", { name: "Fake Sun #Kite" }),
  ).toBeVisible();
  await expect(page.locator("#match-history article")).toHaveCount(30);
  for (const width of [360, 390, 540, 660, 768, 1024, 1280, 1440, 1536, 1920]) {
    await page.setViewportSize({ width, height: 1080 });
    const overflow = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: innerWidth,
      offset: scrollX,
      contentOverflow: [...document.body.querySelectorAll("*")]
        .filter(
          (element) =>
            element.scrollWidth > element.clientWidth + 2 &&
            getComputedStyle(element).overflowX === "visible",
        )
        .slice(0, 15)
        .map((element) => ({
          tag: element.tagName,
          className: element.className,
          width: element.clientWidth,
          scroll: element.scrollWidth,
          text: element.textContent?.slice(0, 80),
        })),
      elements: [...document.body.querySelectorAll("*")]
        .filter(
          (element) => element.getBoundingClientRect().right > innerWidth + 1,
        )
        .slice(0, 8)
        .map((element) => ({
          tag: element.tagName,
          className: element.className,
          right: element.getBoundingClientRect().right,
        })),
    }));
    expect(
      overflow.width,
      `overflow at ${width}px: ${JSON.stringify(overflow)}`,
    ).toBeLessThanOrEqual(width);
    if (width >= 1536) {
      const rankPanel = await page
        .getByRole("heading", { name: "Ranked overview" })
        .boundingBox();
      expect(rankPanel?.width).toBeGreaterThan(230);
    }
    const row = page.locator("#match-history article").first();
    const bounds = await row.boundingBox();
    if (width >= 1536) expect(bounds!.width).toBeLessThanOrEqual(900);
    await expect(row.getByText("GPM", { exact: true })).toBeVisible();
    await expect(row.getByText("DTPM", { exact: true })).toBeVisible();
    await expect(row.getByLabel("Vision: 35", { exact: true })).toBeVisible();
    expect(bounds?.height, `compact match at ${width}px`).toBeLessThan(
      width >= 1280 ? 140 : 230,
    );
    await expect(row.getByRole("link")).toHaveCount(0);
    await expect(row.getByRole("button")).toHaveCount(1);
    const toggle = await row.getByRole("button").boundingBox();
    expect(
      toggle!.x + toggle!.width,
      `expand button fits at ${width}px`,
    ).toBeLessThanOrEqual(bounds!.x + bounds!.width);
    expect(
      await row.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
      `no clipped match content at ${width}px`,
    ).toBeTruthy();
    expect(
      await row.evaluate((element) => getComputedStyle(element).cursor),
    ).not.toBe("pointer");
    if (width >= 1536) {
      await expect(
        row.getByRole("list", { name: "Blue team" }).getByRole("listitem"),
      ).toHaveCount(5);
      await expect(
        row.getByRole("list", { name: "Red team" }).getByRole("listitem"),
      ).toHaveCount(5);
    }
  }
  await page.getByRole("tab", { name: "JUNGLE", exact: true }).click();
  await expect(page.locator("#match-history article")).toHaveCount(6);
  await page.getByRole("tab", { name: "All Lanes" }).click();
  const match = page.locator("#match-history article").first();
  await match.getByRole("button", { name: "Show details" }).click();
  await expect(match.getByRole("link")).toHaveCount(10);
  await expect(match.getByText("DTPM", { exact: true }).last()).toBeVisible();
  await expect(match.getByText("GPM", { exact: true }).last()).toBeVisible();
  await expect(
    match.getByText("35 lane minions in the first 10 minutes", {
      exact: false,
    }),
  ).toBeVisible();
  await expect(
    match.getByRole("link", { name: "Player 2#TEST" }),
  ).toHaveAttribute("href", "/player-2~test");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await match.getByRole("button", { name: "Hide details" }).click();
  await expect(match.getByRole("link")).toHaveCount(0);
  await page.locator("#riot-game-name").fill("Different Draft");
  const request = page.waitForRequest((r) => r.url().includes("refresh=1"));
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  expect((await request).url()).toContain("gameName=Fake+Sun");
  await page.getByRole("link", { name: "Rift Insight - Home" }).click();
  await expect(
    page.getByRole("heading", { name: "Every match. A clearer picture." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("loading and missing-key errors stay visible", async ({ page }) => {
  let finish: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    finish = resolve;
  });
  await page.route("**/api/profile?**", async (route) => {
    await gate;
    await route.fulfill({
      status: 500,
      json: { error: "Not configured", code: "RIOT_API_KEY_MISSING" },
    });
  });
  await page.goto("/fake-sun~kite");
  await expect(page.getByRole("status")).toBeVisible();
  finish();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Riot API key is not configured",
  );
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

test("compact cards fit Spanish labels and keep the complete build", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("opgg-language", "es-LATAM"),
  );
  await page.route("**/api/profile?**", (route) =>
    route.fulfill({ json: profileFixture }),
  );
  await page.goto("/fake-sun~kite");
  const match = page.locator("#match-history article").first();
  await expect(match).toBeVisible();
  for (const width of [360, 390, 660, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 960 });
    expect(
      await match.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBeTruthy();
    await expect(match.getByRole("img", { name: /^Item / })).toHaveCount(7);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await match.getByRole("button").click();
  await expect(match.getByRole("link")).toHaveCount(10);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});

test("narrow match rows retain long champion names and large stats", async ({
  page,
}) => {
  const fixture = structuredClone(profileFixture);
  fixture.matches = [
    {
      ...fixture.matches[0],
      championName: "Nunu & Willump",
      queueId: 440,
      kills: 24,
      deaths: 16,
      assists: 38,
      kda: "3.88",
      cs: 450,
      goldPerMinute: 1200,
      damagePerMinute: 2450,
      takenPerMinute: 3100,
      visionScore: 125,
    },
  ];
  await page.route("**/api/profile?**", (route) =>
    route.fulfill({ json: fixture }),
  );
  await page.goto("/fake-sun~kite");
  const match = page.locator("#match-history article").first();
  await expect(match).toBeVisible();
  for (const width of [360, 390, 540, 660, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    const clipped = await match
      .locator("h4, p, dl > div")
      .evaluateAll((elements) =>
        elements
          .filter((element) => element.scrollWidth > element.clientWidth + 1)
          .map((element) => element.textContent),
      );
    expect(clipped, `clipped text at ${width}px`).toEqual([]);
    expect(
      await match.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBeTruthy();
  }
});

test("visual review screenshots", async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Every match. A clearer picture." }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/home-desktop.jpg",
    quality: 80,
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "artifacts/home-mobile.jpg",
    quality: 80,
    fullPage: true,
  });
  const fixture = process.env.REAL_ARTWORK ? visualFixture() : profileFixture;
  await page.route("**/api/profile?**", (route) =>
    route.fulfill({ json: fixture }),
  );
  await page.setViewportSize({ width: 1920, height: 1200 });
  await page.goto("/fake-sun~kite");
  await expect(page.locator("#match-history article")).toHaveCount(30);
  if (process.env.REAL_ARTWORK) {
    await expect(
      page.getByRole("img", { name: "Aurelion Sol", exact: true }).first(),
    ).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState("networkidle");
  }
  await page.screenshot({ path: "artifacts/profile-desktop.jpg", quality: 80 });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "artifacts/profile-laptop.jpg", quality: 80 });
  const match = page.locator("#match-history article").first();
  await match.getByRole("button", { name: "Show details" }).click();
  await match.screenshot({ path: "artifacts/match-expanded.jpg", quality: 80 });
  await match.getByRole("button", { name: "Hide details" }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("heading", { name: "Match history" })
    .evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: "artifacts/profile-mobile.png" });
  await match.getByRole("button", { name: "Show details" }).click();
  await match.screenshot({
    path: "artifacts/match-mobile-expanded.jpg",
    quality: 80,
  });
});
