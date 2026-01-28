(async function () {
    const time = Math.max(0, Number(settings.time || 10));
    const timeset = 1000 * time;
    log.info(`等待${time}秒`);
    await sleep(timeset);
})();
