(async function () {
    setGameMetrics(1920, 1080, 1); // 设置游戏参数
    log.info("请确保处于主界面");
    await genshin.returnMainUi();

    keyPress("VK_F2"); // 按 F2
    await sleep(500); // 等待500ms，确保F2操作生效

    click(330, 1010); // 点击世界权限
    await sleep(1000); // 等待1000ms，确保点击操作生效

    const domainName = settings.domainName || "不允许加入"; // 获取权限设置，默认为“不允许加入”

    // 根据权限设置点击对应按钮
    const actions = {
        "直接加入": () => click(430, 920),
        "不允许加入": () => click(430, 870),
        "确认后可加入": () => click(430, 970)
    };

    const action = actions[domainName] || actions["不允许加入"];
    action(); // 执行对应的操作
    await sleep(500); // 等待500ms，确保点击操作生效

    keyPress("Escape"); // 退出菜单
    log.info(`权限设置为：${domainName}`);
})();
