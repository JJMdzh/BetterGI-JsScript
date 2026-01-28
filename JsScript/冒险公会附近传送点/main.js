(async function () {
    setGameMetrics(1920, 1080, 1);
    const coordinates = {
        "蒙德": { x: -867.69, y: 2281.50 },
        "璃月": { x: 267.92, y: -665.01 },
        "稻妻": { x: -4402.56, y: -3052.88 },
        "须弥": { x: 2790.18, y: -482.59 },
        "枫丹": { x: 4514.18, y: 3630.40 },
        "纳塔": { x: 9050.99, y: -1878.81 }
    };
    const { x, y } = coordinates[settings.selectedCountry] || coordinates["枫丹"];
    await genshin.tp(x, y);
    log.info(`已传送至 ${settings.selectedCountry || "枫丹"}，坐标: (${x}, ${y})`);
})();
