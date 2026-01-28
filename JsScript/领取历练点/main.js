(async function () {
    setGameMetrics(1920, 1080, 1);
    await genshin.returnMainUi();
    await genshin.claimEncounterPointsRewards();
    log.info("已领取历练点");
})();