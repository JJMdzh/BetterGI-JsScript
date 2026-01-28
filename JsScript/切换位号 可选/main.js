(async function () {
    // 设置游戏分辨率和缩放比例
    setGameMetrics(1920, 1080, 1);
    await genshin.returnMainUi();

    // 默认角色编号为 1，可通过 settings.n 配置
    const roleNumber = settings.n || 1;

    // 按下对应角色编号的按键（假设按键为数字键）
    keyPress(roleNumber.toString());
    await sleep(1000);

    // 记录切换的角色编号
    log.info(`已切换至角色 ${roleNumber}`);
})();
