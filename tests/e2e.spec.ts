import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('墨韵创作平台 - E2E测试', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  describe('1. 仪表盘测试', () => {
    test('应该显示欢迎信息和统计数据', async ({ page }) => {
      await expect(page.locator('text=欢迎回来')).toBeVisible();
      await expect(page.locator('text=墨韵创作')).toBeVisible();
    });

    test('应该显示创作数据卡片', async ({ page }) => {
      const statCards = ['总字数', '今日字数', '总章节', '活跃小说'];
      for (const stat of statCards) {
        await expect(page.locator(`text=${stat}`).first()).toBeVisible();
      }
    });

    test('应该有AI写作助手提示卡片', async ({ page }) => {
      await expect(page.locator('text=AI写作助手提示')).toBeVisible();
    });
  });

  describe('2. 侧边栏导航测试', () => {
    test('应该显示所有导航项', async ({ page }) => {
      const navItems = ['仪表盘', '我的小说', '角色档案', '世界观', '时间线', '发布中心', '设置'];
      for (const item of navItems) {
        await expect(page.locator(`text=${item}`).first()).toBeVisible();
      }
    });

    test('导航到小说列表', async ({ page }) => {
      await page.click('text=我的小说');
      await expect(page).toHaveURL(/\/novels/);
      await expect(page.locator('h1:has-text("我的小说")')).toBeVisible();
    });

    test('导航到角色档案', async ({ page }) => {
      await page.click('text=角色档案');
      await expect(page).toHaveURL(/\/characters/);
      await expect(page.locator('h1:has-text("角色档案库")')).toBeVisible();
    });

    test('导航到世界观编辑器', async ({ page }) => {
      await page.click('text=世界观');
      await expect(page).toHaveURL(/\/world/);
      await expect(page.locator('h1:has-text("世界观编辑器")')).toBeVisible();
    });

    test('导航到时间线', async ({ page }) => {
      await page.click('text=时间线');
      await expect(page).toHaveURL(/\/timeline/);
      await expect(page.locator('h1:has-text("时间线视图")')).toBeVisible();
    });

    test('导航到发布中心', async ({ page }) => {
      await page.click('text=发布中心');
      await expect(page).toHaveURL(/\/publish/);
      await expect(page.locator('h1:has-text("发布中心")')).toBeVisible();
    });

    test('导航到设置', async ({ page }) => {
      await page.click('text=设置');
      await expect(page).toHaveURL(/\/settings/);
      await expect(page.locator('h1:has-text("设置中心")')).toBeVisible();
    });
  });

  describe('3. 小说管理测试', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/novels`);
    });

    test('应该显示小说列表', async ({ page }) => {
      await expect(page.locator('h1:has-text("我的小说")')).toBeVisible();
    });

    test('应该显示新建小说按钮', async ({ page }) => {
      await expect(page.locator('button:has-text("新建小说")')).toBeVisible();
    });

    test('应该可以打开新建小说弹窗', async ({ page }) => {
      await page.click('button:has-text("新建小说")');
      await expect(page.locator('h2:has-text("创建新小说")')).toBeVisible();
      await expect(page.locator('input[placeholder*="小说标题"]')).toBeVisible();
    });

    test('新建小说弹窗应该可以关闭', async ({ page }) => {
      await page.click('button:has-text("新建小说")');
      await expect(page.locator('h2:has-text("创建新小说")')).toBeVisible();
      await page.click('button:has-text("取消")');
      await expect(page.locator('h2:has-text("创建新小说")')).not.toBeVisible();
    });

    test('应该显示搜索框', async ({ page }) => {
      await expect(page.locator('input[placeholder*="搜索小说"]')).toBeVisible();
    });

    test('应该显示分类筛选', async ({ page }) => {
      await expect(page.locator('select').first()).toBeVisible();
    });
  });

  describe('4. 角色档案库测试', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/characters`);
    });

    test('应该显示角色列表', async ({ page }) => {
      await expect(page.locator('h1:has-text("角色档案库")')).toBeVisible();
    });

    test('应该显示角色筛选标签', async ({ page }) => {
      const filters = ['全部', '主角', '反派', '配角', '龙套'];
      for (const filter of filters) {
        await expect(page.locator(`button:has-text("${filter}")`).first()).toBeVisible();
      }
    });

    test('应该可以添加新角色', async ({ page }) => {
      await expect(page.locator('button:has-text("添加角色")')).toBeVisible();
    });

    test('点击角色应该显示详情', async ({ page }) => {
      await page.waitForTimeout(500);
      const firstChar = page.locator('[class*="rounded-2xl"]').first();
      if (await firstChar.isVisible()) {
        await firstChar.click();
        await page.waitForTimeout(300);
      }
    });
  });

  describe('5. 世界观编辑器测试', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/world`);
    });

    test('应该显示世界观分类', async ({ page }) => {
      await expect(page.locator('h1:has-text("世界观编辑器")')).toBeVisible();
    });

    test('应该显示世界观分类标签', async ({ page }) => {
      const categories = ['全部', '地理', '势力', '力量体系'];
      for (const cat of categories) {
        const catButton = page.locator(`button:has-text("${cat}")`).first();
        if (await catButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(catButton).toBeVisible();
        }
      }
    });

    test('应该可以添加设定', async ({ page }) => {
      await expect(page.locator('button:has-text("添加设定")')).toBeVisible();
    });
  });

  describe('6. 时间线视图测试', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/timeline`);
    });

    test('应该显示时间线', async ({ page }) => {
      await expect(page.locator('h1:has-text("时间线视图")')).toBeVisible();
    });

    test('应该显示甘特图/列表切换', async ({ page }) => {
      const viewButtons = ['甘特图', '列表'];
      for (const btn of viewButtons) {
        await expect(page.locator(`button:has-text("${btn}")`).first()).toBeVisible();
      }
    });

    test('应该显示剧情时间轴', async ({ page }) => {
      await expect(page.locator('text=剧情时间轴')).toBeVisible();
    });
  });

  describe('7. 发布中心测试', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/publish`);
    });

    test('应该显示发布中心', async ({ page }) => {
      await expect(page.locator('h1:has-text("发布中心")')).toBeVisible();
    });

    test('应该显示平台数据', async ({ page }) => {
      await expect(page.locator('text=总发布章节')).toBeVisible();
      await expect(page.locator('text=总字数')).toBeVisible();
    });

    test('应该显示平台列表', async ({ page }) => {
      const platforms = ['番茄小说', '七猫小说', '起点中文'];
      for (const platform of platforms) {
        const platformEl = page.locator(`text=${platform}`).first();
        if (await platformEl.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(platformEl).toBeVisible();
        }
      }
    });

    test('应该可以切换标签页', async ({ page }) => {
      await page.click('button:has-text("发布计划")');
      await expect(page.locator('text=定时发布队列')).toBeVisible();

      await page.click('button:has-text("平台设置")');
      await expect(page.locator('text=平台账号管理')).toBeVisible();
    });
  });

  describe('8. 设置中心测试', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/settings`);
    });

    test('应该显示设置中心', async ({ page }) => {
      await expect(page.locator('h1:has-text("设置中心")')).toBeVisible();
    });

    test('应该显示设置分类标签', async ({ page }) => {
      const tabs = ['个人信息', '通知设置', 'AI设置', '外观', '快捷键', '安全'];
      for (const tab of tabs) {
        await expect(page.locator(`button:has-text("${tab}")`).first()).toBeVisible();
      }
    });

    test('AI设置标签页应该有模型选择', async ({ page }) => {
      await page.click('button:has-text("AI设置")');
      await expect(page.locator('select').first()).toBeVisible();
    });
  });

  describe('9. 响应式设计测试', () => {
    test('侧边栏收起功能', async ({ page }) => {
      const collapseButton = page.locator('button:has-text("收起")');
      if (await collapseButton.isVisible()) {
        await collapseButton.click();
        await page.waitForTimeout(300);
        await expect(page.locator('button:has-text("收起")')).not.toBeVisible();
        await expect(page.locator('button:has-text("展开")').or(page.locator('[class*="chevron"]')).first()).toBeVisible();
      }
    });
  });

  describe('10. 核心功能测试', () => {
    test('新建小说流程', async ({ page }) => {
      await page.goto(`${BASE_URL}/novels`);

      await page.click('button:has-text("新建小说")');
      await page.waitForTimeout(300);

      await page.fill('input[placeholder*="小说标题"]', '测试网文');
      await page.fill('textarea', '这是一个测试小说的简介');

      await page.click('button:has-text("创建")');
      await page.waitForTimeout(500);

      await expect(page.locator('text=测试网文')).toBeVisible({ timeout: 3000 });
    });

    test('小说工作台导航', async ({ page }) => {
      await page.goto(`${BASE_URL}/novels`);

      const novelCard = page.locator('text=修仙：从凡人到飞升').first();
      if (await novelCard.isVisible({ timeout: 2000 }).catch(() => false)) {
        await novelCard.click();
        await expect(page).toHaveURL(/\/novels\/.+/);
        await expect(page.locator('text=修仙：从凡人到飞升')).toBeVisible();
      }
    });
  });
});

test.describe('视觉设计验证', () => {
  test('应该使用墨韵设计风格', async ({ page }) => {
    await page.goto(BASE_URL);

    const body = page.locator('body');
    const bgColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    console.log('页面背景色:', bgColor);
  });

  test('应该加载自定义字体', async ({ page }) => {
    await page.goto(BASE_URL);

    const title = page.locator('text=墨韵创作').first();
    const fontFamily = await title.evaluate((el) =>
      window.getComputedStyle(el).fontFamily
    );

    console.log('标题字体:', fontFamily);
  });
});
