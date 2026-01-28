(async function () {
    setGameMetrics(1920, 1080, 1); // 设置游戏窗口大小和DPI
    await genshin.returnMainUi();

    keyDown("z"); // 按下 "z" 键
    await sleep(1000); // 等待1秒
    keyUp("z"); // 释放 "z" 键
    await sleep(1000); // 等待1秒

    // 获取工具按键设置，如果没有设置，则默认为 "1"
    const toolKey = settings.n || "1"; // 提供默认值 "1"

    keyPress(toolKey); // 按下工具按键
    await sleep(1000); // 等待1秒

    // 记录日志，显示当前使用的工具按键
    log.info(`已切换至工具 ${toolKey}`);
})();
