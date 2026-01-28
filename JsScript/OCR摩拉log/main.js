// 定义字符替换映射表
const replacementMap = {
    "监": "盐",
    "卵": "卯"
};

// 定义数字替换映射表
const numberReplaceMap = {
    "O": "0", "o": "0", "Q": "0", "０": "0",
    "I": "1", "l": "1", "i": "1", "１": "1", "一": "1",
    "Z": "2", "z": "2", "２": "2", "二": "2",
    "E": "3", "e": "3", "３": "3", "三": "3",
    "A": "4", "a": "4", "４": "4",
    "S": "5", "s": "5", "５": "5",
    "G": "6", "b": "6", "６": "6",
    "T": "7", "t": "7", "７": "7",
    "B": "8", "θ": "8", "８": "8",
    "g": "9", "q": "9", "９": "9",
};

// 定义所有图标的图像识别对象，每个图片都有自己的识别区域
let CharacterMenuRo = RecognitionObject.TemplateMatch(file.ReadImageMatSync("assets/CharacterMenu.png"), 60, 991, 38, 38);

// 定义一个函数用于识别图像
async function recognizeImage(recognitionObject, ra = null, timeout = 1000) {
    let startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        try {
            // 尝试识别图像
            let imageResult = ra.find(recognitionObject);
            if (imageResult.isExist() && imageResult.x !== 0 && imageResult.y !== 0) {
                return { x: imageResult.x, y: imageResult.y };
            }
        } catch (error) {
            log.error(`识别图像时发生异常: ${error.message}`);
        }
        await sleep(500); // 短暂延迟，避免过快循环
    }
    log.warn(`经过多次尝试，仍然无法识别图像`);
    return false;
}

// 处理数字文本：替换数字字符，只保留数字
function processNumberText(text) {
    let correctedText = text;
    let removedSymbols = [];
    
    // 应用数字替换
    for (let [wrongChar, correctChar] of Object.entries(numberReplaceMap)) {
        correctedText = correctedText.replace(new RegExp(wrongChar, 'g'), correctChar);
    }
    
    // 只保留数字
    const validChars = new Set('0123456789');
    let finalText = '';
    
    for (let char of correctedText) {
        if (validChars.has(char)) {
            finalText += char;
        } else if (char.trim() !== '') { // 忽略空白字符
            removedSymbols.push(char);
        }
    }
    
    return {
        processedText: finalText,
        removedSymbols: [...new Set(removedSymbols)] // 去重
    };
}

// 处理字符文本：替换字符，保留常见文字字符
function processCharacterText(text) {
    let correctedText = text;
    let removedSymbols = [];
    
    // 应用字符替换
    for (let [wrongChar, correctChar] of Object.entries(replacementMap)) {
        correctedText = correctedText.replace(new RegExp(wrongChar, 'g'), correctChar);
    }
    
    // 保留中文字符、英文字母和数字
    let finalText = '';
    for (let char of correctedText) {
        // 检查是否为中文字符、英文字母或数字
        if (/[\u4e00-\u9fa5a-zA-Z0-9]/.test(char)) {
            finalText += char;
        } else if (char.trim() !== '') { // 忽略空白字符
            removedSymbols.push(char);
        }
    }
    
    return {
        processedText: finalText,
        removedSymbols: [...new Set(removedSymbols)] // 去重
    };
}

// 定义一个函数用于识别文字并点击（使用字符处理）
async function recognizeTextAndClick(targetText, ocrRegion, ra = null, timeout = 1000) {
    let startTime = Date.now();
    let retryCount = 0; // 重试计数
    while (Date.now() - startTime < timeout) {
        try {
            // 尝试 OCR 识别
            let resList = ra.findMulti(RecognitionObject.ocr(ocrRegion.x, ocrRegion.y, ocrRegion.width, ocrRegion.height));
            // 遍历识别结果，检查是否找到目标文本
            for (let res of resList) {
                // 处理文本：替换字符，保留常见文字
                const { processedText, removedSymbols } = processCharacterText(res.text);
                
                // 输出去除的字符
                if (removedSymbols.length > 0) {
                    log.info(`识别文字时去除的字符: ${removedSymbols.join(', ')}`);
                }

                if (processedText.includes(targetText)) {
                    // 如果找到目标文本，计算并点击文字的中心坐标
                    let centerX = Math.round(res.x + res.width / 2);
                    let centerY = Math.round(res.y + res.height / 2);
                    await click(centerX, centerY);
                    await sleep(500);
                    return { x: centerX, y: centerY };
                }
            }
        } catch (error) {
            retryCount++;
            log.warn(`页面标志识别失败，正在进行第 ${retryCount} 次重试...`);
        }
        await sleep(500);
    }
    log.warn(`经过多次尝试，仍然无法识别文字: ${targetText}`);
    return false;
}

// 定义一个独立的函数用于在指定区域进行 OCR 识别（使用数字处理）
async function recognizeTextInRegion(ocrRegion, ra = null, timeout = 1000) {
    let startTime = Date.now();
    let retryCount = 0;
    while (Date.now() - startTime < timeout) {
        try {
            // 在指定区域进行 OCR 识别
            let ocrResult = ra.find(RecognitionObject.ocr(ocrRegion.x, ocrRegion.y, ocrRegion.width, ocrRegion.height));
            if (ocrResult) {
                // 处理文本：替换数字，只保留数字
                const { processedText, removedSymbols } = processNumberText(ocrResult.text);
                
                // 输出去除的字符
                if (removedSymbols.length > 0) {
                    log.info(`数字识别中去除的字符: ${removedSymbols.join(', ')}`);
                }
                
                return {
                    text: processedText,
                    removedSymbols: removedSymbols
                };
            } else {
                log.warn(`OCR 识别区域未找到内容`);
                return { text: null, removedSymbols: [] };
            }
        } catch (error) {
            retryCount++;
            log.warn(`OCR 摩拉数识别失败，正在进行第 ${retryCount} 次重试...`);
        }
        await sleep(500);
    }
    log.warn(`经过多次尝试，仍然无法在指定区域识别到文字`);
    return { text: null, removedSymbols: [] };
}

(async function () {
    setGameMetrics(1920, 1080, 1);
    await genshin.returnMainUi();
    const notify = settings.notify || false;

    // 按下 C 键
    keyPress("C");
    await sleep(1500);

    let recognized = false;
    let cachedFrame = null;

    cachedFrame?.dispose();
    cachedFrame = captureGameRegion();
    // 识别“角色菜单”图标或“天赋”文字
    let startTime = Date.now();
    while (Date.now() - startTime < 5000) {
        // 尝试识别“角色菜单”图标
        let characterMenuResult = await recognizeImage(CharacterMenuRo, cachedFrame, 1000);
        if (characterMenuResult) {
            await click(177, 433);
            await sleep(500);
            recognized = true;
            break;
        }

        // 尝试识别“天赋”文字
        let targetText = "天赋";
        let ocrRegion = { x: 133, y: 395, width: 115, height: 70 };
        let talentResult = await recognizeTextAndClick(targetText, ocrRegion, cachedFrame);
        if (talentResult) {
            log.info(`点击天赋文字，坐标: x=${talentResult.x}, y=${talentResult.y}`);
            recognized = true;
            break;
        }

        await sleep(1000);
    }

    // 如果识别到了“角色菜单”或“天赋”，则识别“摩拉数值”
    if (recognized) {
        cachedFrame?.dispose();
        cachedFrame = captureGameRegion();
        let ocrRegionMora = { x: 1620, y: 25, width: 152, height: 46 };
        let { text: recognizedText, removedSymbols } = await recognizeTextInRegion(ocrRegionMora, cachedFrame);
        
        if (recognizedText) {
            log.info(`成功识别到摩拉数值: {${recognizedText}}`);
            
            if (notify) {
                notification.Send(`摩拉数值: ${recognizedText}`);
            }

            // 获取当前时间
            const now = new Date();
            const formattedTime = now.toLocaleString();

            // 写入本地文件，包含去除的符号信息
            const filePath = "mora_log.txt";
            let logContent = `${formattedTime} - 摩拉数值: ${recognizedText}`;
            if (removedSymbols.length > 0) {
                logContent += ` (去除的符号: ${removedSymbols.join(', ')})`;
            }
            logContent += "\n";
            
            const result = file.WriteTextSync(filePath, logContent, true);
            if (result) {
                log.info("成功将摩拉数值写入本地日志");
            } else {
                log.error("写入日志文件失败");
            }
        } else {
            log.warn("未能识别到摩拉数值。");
        }
    } else {
        log.warn("未能识别到角色菜单或天赋，跳过摩拉数值识别。");
    }
    cachedFrame?.dispose();
    await sleep(500); 
    await genshin.returnMainUi();
})();
