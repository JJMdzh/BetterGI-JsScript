(async function () {
    // 设置游戏分辨率和缩放比例
    setGameMetrics(1920, 1080, 1);
    await genshin.returnMainUi();
    keyPress("L");
    await sleep(5000);
    log.info("按下 L 键，等待读条");

    // 执行一系列固定点击操作
    click(75, 1020); await sleep(500);
    moveMouseTo(700, 115);await sleep(50);
    leftButtonDown();await sleep(400);
    leftButtonUp();await sleep(50);
    click(560, 200); await sleep(500);
    click(335, 1020); await sleep(500);

    for (let i = 1; i < settings.n; i++) {
        click(1845, 540);
        await sleep(400);
        log.info(`循环点击坐标 (1845, 540)，第 ${i} 次`);
    }

    click(1555, 1020); await sleep(1000); log.info("点击退出按钮 (1555, 1020)");
    await genshin.returnMainUi();
    log.info(`操作完成，已切换至第 ${settings.n} 队`);
})();
