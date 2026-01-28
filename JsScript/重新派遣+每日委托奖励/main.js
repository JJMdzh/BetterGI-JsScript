eval(file.readTextSync("lib/region.js"));

// 加载图片资源并转换为识别对象（Ro）
const F_DialogueRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/F_Dialogue.png"));
const CommissionsRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/Commissions.png"));
const ExpeditionRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/Expedition.png"));
const ExitRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/Exit.png"));

// 通过识别F_Dialogue打开界面
async function openByFDialogue() {
    keyPress("F");
    await sleep(1000);
    click(960, 540); // 点击地图中心
    await sleep(1500);
    let ra = null;

    // 使用F_DialogueRo进行识别
    const fResult = await recognizeImage(F_DialogueRo, ra, 2000, 500, true, "F_Dialogue");
    if (fResult.isDetected) {
        await drawAndClearRedBox(fResult, fResult.ra);
        await sleep(500);
        return fResult.ra;
    } else {
        log.error("未识别到F_Dialogue，无法打开界面");
        return null;
    }
}

// 每日委托流程
async function handleCommissions() {
    const ra = await openByFDialogue();
    if (!ra) return;

    // 使用CommissionsRo进行识别
    const commResult = await recognizeImage(CommissionsRo, ra, 2000, 500, "Commissions");
    if (commResult.isDetected) {
        await drawAndClearRedBox(commResult, ra);
        click(commResult.x, commResult.y); // 直接点击图片坐标
        await sleep(1000);
        click(960, 540); // 点击领取奖励
        await sleep(3000);
        click(960, 960); // 点击关闭奖励界面
        log.info("每日委托流程完成");
    } else {
        log.error("未识别到Commissions，跳过委托流程");
    }
}

// 探索派遣流程
async function handleExpedition() {
    const ra = await openByFDialogue(); // 重新通过F_Dialogue打开界面
    if (!ra) return;

    // 使用ExpeditionRo进行识别
    const expResult = await recognizeImage(ExpeditionRo, ra, 2000, 500, "Expedition");
    if (expResult.isDetected) {
        await drawAndClearRedBox(expResult, ra);
        click(expResult.x, expResult.y); // 直接点击图片坐标

        await sleep(1000);
        click(160, 1010); // 点击派遣任务
        await sleep(1000);
        click(1160, 1020); // 点击重新派遣
        await sleep(500);
        log.info("已重新探索派遣");
        keyPress("Escape");
        await sleep(3000);
        log.info("探索派遣流程完成");
    } else {
        log.error("未识别到Expedition，跳过派遣流程");
    }
}

(async function () {
    setGameMetrics(1920, 1080, 1);

    await genshin.returnMainUi();
    // 主流程执行
    try {
        await handleExpedition(); // 处理派遣
        await handleCommissions(); // 处理委托
        await genshin.returnMainUi();
        await genshin.returnMainUi();
    } catch (error) {
        log.error("主流程错误: " + error.message);
    }
})();