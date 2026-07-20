import { expect, test } from "@playwright/test";

const loggedInUser = {
  id: "e2e-user",
  displayName: "E2E 사용자",
};

const emptyHomeResponse = {
  midMixes: [],
  popular: [],
  latest: [],
};

async function mockHome(page) {
  await page.route("**/api/home", (route) =>
    route.fulfill({ status: 200, json: emptyHomeResponse }),
  );
}

async function mockLoggedInUser(page) {
  await page.route("**/api/user", (route) =>
    route.fulfill({ status: 200, json: loggedInUser }),
  );
}

test("비로그인 사용자는 보호 페이지에서 홈으로 이동한다", async ({
  page,
}) => {
  await mockHome(page);
  await page.route("**/api/user", (route) =>
    route.fulfill({ status: 401, json: {} }),
  );

  await page.goto("/#/emotion");

  await expect(page).toHaveURL(/#\/home$/);
  await expect(page.getByRole("heading", { name: "Popular" })).toBeVisible();
});

test("로그인 사용자가 감정을 입력하고 추천 결과를 확인한다", async ({
  page,
}) => {
  await mockHome(page);
  await mockLoggedInUser(page);

  let requestBody;

  await page.route("**/api/emotion/recommend", async (route) => {
    requestBody = route.request().postDataJSON();

    await route.fulfill({
      status: 200,
      json: {
        moodLabel: "행복",
        reason: "밝고 활기찬 분위기가 어울립니다.",
        keywords: ["밝은", "활기찬"],
        tracks: [
          {
            id: "track-1",
            uri: "spotify:track:track-1",
            title: "E2E 추천곡",
            artist: "테스트 아티스트",
            cover: "/logo.svg",
          },
        ],
      },
    });
  });

  await page.goto("/#/emotion");

  await expect(
    page.getByRole("heading", { name: "오늘의 감정에 맞는 음악 추천" }),
  ).toBeVisible();

  await page
    .getByPlaceholder("예: 오늘 너무 지치고 아무것도 하기 싫어")
    .fill("오늘 기분이 좋아");
  await page.getByRole("button", { name: "음악 추천받기" }).click();

  await expect(page.getByRole("heading", { name: "행복" })).toBeVisible();
  await expect(page.getByText("E2E 추천곡")).toBeVisible();
  await expect(page.getByText("테스트 아티스트")).toBeVisible();
  expect(requestBody).toEqual({ text: "오늘 기분이 좋아" });
});

test("페이지를 떠난 뒤 완료된 이전 추천 응답은 렌더링하지 않는다", async ({
  page,
}) => {
  await mockHome(page);
  await mockLoggedInUser(page);

  let requestStarted = false;

  await page.route("**/api/emotion/recommend", async (route) => {
    requestStarted = true;

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      await route.fulfill({
        status: 200,
        json: {
          moodLabel: "오래된 결과",
          reason: "페이지를 떠난 뒤에는 표시되면 안 됩니다.",
          keywords: [],
          tracks: [],
        },
      });
    } catch {
      // AbortController로 요청이 취소되면 fulfill이 실패할 수 있습니다.
    }
  });

  await page.goto("/#/emotion");
  await page
    .getByPlaceholder("예: 오늘 너무 지치고 아무것도 하기 싫어")
    .fill("응답이 늦는 요청");
  await page.getByRole("button", { name: "음악 추천받기" }).click();
  await expect.poll(() => requestStarted).toBe(true);

  await page.evaluate(() => {
    window.location.hash = "#/home";
  });
  await expect(page.getByRole("heading", { name: "Popular" })).toBeVisible();

  await page.waitForTimeout(400);
  await page.evaluate(() => {
    window.location.hash = "#/emotion";
  });

  await expect(
    page.getByRole("heading", { name: "오늘의 감정에 맞는 음악 추천" }),
  ).toBeVisible();
  await expect(page.getByText("오래된 결과")).toHaveCount(0);
});
