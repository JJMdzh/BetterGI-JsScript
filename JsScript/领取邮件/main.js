(async function () {
    setGameMetrics(1920, 1080, 1);
    await genshin.returnMainUi();
    keyPress("Escape");
    await sleep(1500);
    click(50, 605);
    await sleep(1500);
    click(150, 1015);
    await sleep(1000);
    click(1845, 45);
    await sleep(1000);
    click(1845, 45);
    await sleep(1000);
    click(1845, 45);
    log.info("已领取邮件");
})();