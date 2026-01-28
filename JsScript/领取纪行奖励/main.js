let BangRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/Bang.png"), 1541, 17, 13, 19); // 默认的 BangRo 区域
let Player1Ro = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/1p.png"), 345, 28, 32, 32);
let BuildRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/Build.png"), 1354, 44, 22, 22);

(async function () {
    setGameMetrics(1920, 1080, 1);
    await genshin.returnMainUi();

    try {
        // 检查是否识别到 Build 和 1p 图标
        let player1Result = captureGameRegion().find(Player1Ro);
        let buildResult = captureGameRegion().find(BuildRo);

        if (player1Result.isExist() && buildResult.isExist()) {
            // 如果识别到 Build 和 1p 图标，调整 BangRo 的识别区域
            BangRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/Bang.png"), 1623, 17, 13, 19);
            log.info("识别到在尘歌壶：调整识别区域");
        }

        // 在这里进行图像识别 BangRo
        let result = captureGameRegion().find(BangRo);
        if (result.isExist()) {
            log.info("纪行图标区域找到感叹号");
            // 如果识别成功，可以在这里添加一些操作，比如点击识别到的位置
            await keyMouseScript.runFile(`assets/AltDown.json`);
            await sleep(500);

            click(result.x - 21, result.y + 33);
            await sleep(500);

            await keyMouseScript.runFile(`assets/AltUp.json`);
            await sleep(1500);
        } else {
            log.warn("未识别到需要领取纪行");
            // 如果识别失败，可以选择终止脚本或者继续执行后续操作
            return;
        }

        click(960, 50);
        await sleep(1000);

        click(1720, 980);
        await sleep(2000);

        click(860, 50);
        await sleep(300);

        click(860, 50);
        await sleep(1000);

        click(1720, 980);
        await sleep(1000);

        await genshin.returnMainUi();

        log.info("已完成 领取纪行奖励");
    } catch (error) {
        log.error(`执行操作时发生错误: ${error.message}`);
    }
})();
