async function move(direction, time) {
    const keyMap = {
        "前": "W",
        "后": "S",
        "左": "A",
        "右": "D"
    };
    const key = keyMap[direction];
    /*if (!key) {
        throw new Error(`无效的方向: ${direction}`);
    }*/

    keyDown(key);
    await sleep(time);
    keyUp(key);
    log.info(`向${direction}移动${time}毫秒`);
}

(async function () {
    await genshin.returnMainUi();
    try {
        const time = Math.max(100, Number(settings.time || 200));
        const direction = settings.direction || "后";

        await move(direction, time);
        await sleep(200);
    } catch (error) {
        log.error(`发生错误: ${error.message}`);
    }
})();

