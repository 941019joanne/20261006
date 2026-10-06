// 儲存所有測驗題目資料
const questions = [
  // 第一題
  {
    // 設定題目內容
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",
    // 設定四個答案選項
    options: ["draw()", "setup()", "start()", "begin()"],
    // 設定正確答案索引
    answer: 1
  },
  // 第二題
  {
    // 設定題目內容
    question: "在 p5.js 中，哪一個函式通常會重複執行？",
    // 設定四個答案選項
    options: ["draw()", "loop()", "repeat()", "run()"],
    // 設定正確答案索引
    answer: 0
  },
  // 第三題
  {
    // 設定題目內容
    question: "哪一個指令可以建立畫布？",
    // 設定四個答案選項
    options: ["makeCanvas()", "createCanvas()", "newCanvas()", "canvas()"],
    // 設定正確答案索引
    answer: 1
  },
  // 第四題
  {
    // 設定題目內容
    question: "哪一個指令可以設定背景顏色？",
    // 設定四個答案選項
    options: ["color()", "fill()", "background()", "paint()"],
    // 設定正確答案索引
    answer: 2
  },
  // 第五題
  {
    // 設定題目內容
    question: "哪一個指令可以畫出圓形？",
    // 設定四個答案選項
    options: ["circle()", "ellipse()", "round()", "oval()"],
    // 設定正確答案索引
    answer: 1
  }
];

// 儲存目前題目的編號
let currentQuestion = 0;

// 儲存答對的題數
let correctCount = 0;

// 儲存是否已經回答目前題目
let answered = false;

// 儲存目前選取的選項
let selectedOption = -1;

// 儲存正確答案動畫時間
let animationTime = 0;

// 儲存響應式版面配置
let layout = {};

// 儲存目前畫布的像素密度
let previousPixelDensity = 1;

// p5.js 初始化函式
function setup() {
  // 建立符合瀏覽器大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 將畫布設定為顯示區塊，避免產生多餘空白
  canvas.style("display", "block");

  // 設定文字水平置中
  textAlign(CENTER, CENTER);

  // 設定文字垂直對齊方式
  textBaseline(CENTER);

  // 啟用平滑繪圖
  smooth();

  // 計算響應式版面
  updateLayout();

  // 記錄目前像素密度
  previousPixelDensity = pixelDensity();
}

// p5.js 每一幀繪圖函式
function draw() {
  // 重新計算目前視窗的響應式版面
  updateLayout();

  // 設定網站背景顏色
  background(245, 248, 246);

  // 判斷是否完成全部題目
  if (currentQuestion >= questions.length) {
    // 顯示測驗結果
    drawResultScreen();

    // 結束本次繪圖
    return;
  }

  // 顯示網站標題與進度
  drawTitle();

  // 顯示目前題目
  drawQuestion();

  // 顯示答案選項
  drawOptions();

  // 顯示下一題按鈕
  drawNextButton();
}

// 計算所有元件的響應式位置與尺寸
function updateLayout() {
  // 取得目前畫布寬度
  const viewportWidth = width;

  // 取得目前畫布高度
  const viewportHeight = height;

  // 計算左右安全邊距
  const sidePadding = constrain(
    min(viewportWidth * 0.06, viewportHeight * 0.04),
    16,
    56
  );

  // 設定內容區塊最大寬度
  const maxContentWidth = 900;

  // 計算內容區塊寬度
  const contentWidth = min(
    viewportWidth - sidePadding * 2,
    maxContentWidth
  );

  // 判斷目前是否為手機窄版
  const isNarrowScreen = viewportWidth < 480;

  // 判斷目前是否為橫向畫面
  const isLandscape = viewportWidth > viewportHeight;

  // 根據畫面方向計算頂端標題區高度
  const headerHeight = isLandscape
    ? constrain(viewportHeight * 0.22, 82, 145)
    : constrain(viewportHeight * 0.18, 105, 180);

  // 計算題目區塊高度
  const questionHeight = isNarrowScreen
    ? constrain(viewportHeight * 0.13, 78, 112)
    : constrain(min(viewportHeight * 0.14, viewportWidth * 0.24), 86, 140);

  // 計算答案選項高度
  const optionHeight = isNarrowScreen
    ? constrain(viewportHeight * 0.07, 48, 62)
    : constrain(min(viewportHeight * 0.078, viewportWidth * 0.15), 50, 70);

  // 計算答案選項間距
  const optionGap = isLandscape
    ? constrain(viewportHeight * 0.014, 7, 13)
    : constrain(min(viewportHeight * 0.02, viewportWidth * 0.04), 9, 18);

  // 計算題目區塊垂直位置
  const questionY =
    headerHeight + constrain(viewportHeight * 0.018, 10, 24);

  // 計算答案選項起始位置
  const optionsY =
    questionY +
    questionHeight +
    constrain(viewportHeight * 0.03, 14, 30);

  // 計算答案區塊總高度
  const optionsHeight =
    questions[0].options.length * optionHeight +
    (questions[0].options.length - 1) * optionGap;

  // 計算按鈕高度
  const buttonHeight = constrain(
    min(viewportHeight * 0.075, viewportWidth * 0.14),
    46,
    64
  );

  // 計算按鈕寬度
  const buttonWidth = constrain(
    contentWidth * (isNarrowScreen ? 0.54 : 0.42),
    145,
    220
  );

  // 計算選項與按鈕之間的間距
  const buttonGap = constrain(viewportHeight * 0.03, 14, 30);

  // 計算按鈕預設垂直位置
  const preferredButtonY = optionsY + optionsHeight + buttonGap;

  // 計算按鈕底部安全距離
  const bottomSafeArea = constrain(viewportHeight * 0.045, 16, 42);

  // 讓按鈕不超出畫布底部
  const buttonY = min(
    preferredButtonY,
    viewportHeight - buttonHeight - bottomSafeArea
  );

  // 儲存響應式版面配置
  layout = {
    // 儲存內容區塊左側位置
    contentX: (viewportWidth - contentWidth) / 2,

    // 儲存內容區塊寬度
    contentWidth: contentWidth,

    // 儲存標題區高度
    headerHeight: headerHeight,

    // 儲存題目垂直位置
    questionY: questionY,

    // 儲存題目高度
    questionHeight: questionHeight,

    // 儲存選項起始位置
    optionsY: optionsY,

    // 儲存選項高度
    optionHeight: optionHeight,

    // 儲存選項間距
    optionGap: optionGap,

    // 儲存按鈕水平位置
    buttonX: (viewportWidth - buttonWidth) / 2,

    // 儲存按鈕垂直位置
    buttonY: buttonY,

    // 儲存按鈕寬度
    buttonWidth: buttonWidth,

    // 儲存按鈕高度
    buttonHeight: buttonHeight,

    // 儲存目前是否為窄螢幕
    isNarrowScreen: isNarrowScreen,

    // 儲存目前是否為橫向畫面
    isLandscape: isLandscape
  };
}

// 繪製標題與進度
function drawTitle() {
  // 設定標題文字顏色
  fill(35, 55, 48);

  // 設定標題文字大小
  textSize(
    constrain(
      min(width * 0.065, height * 0.075),
      layout.isNarrowScreen ? 21 : 23,
      38
    )
  );

  // 顯示網站標題
  text(
    "p5.js 程式設計簡易測驗",
    width / 2,
    layout.headerHeight * 0.38
  );

  // 設定進度文字顏色
  fill(85, 105, 96);

  // 設定進度文字大小
  textSize(
    constrain(
      min(width * 0.038, height * 0.038),
      layout.isNarrowScreen ? 14 : 16,
      21
    )
  );

  // 顯示目前題目進度
  text(
    "第 " + (currentQuestion + 1) + " 題／共 " + questions.length + " 題",
    width / 2,
    layout.headerHeight * 0.72
  );
}

// 繪製題目區塊
function drawQuestion() {
  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 設定題目區塊背景顏色
  fill(224, 235, 230);

  // 移除外框
  noStroke();

  // 繪製圓角題目區塊
  rect(
    layout.contentX,
    layout.questionY,
    layout.contentWidth,
    layout.questionHeight,
    constrain(width * 0.025, 12, 22)
  );

  // 設定題目文字顏色
  fill(35, 55, 48);

  // 設定題目文字大小
  textSize(
    constrain(
      min(width * 0.043, height * 0.04),
      layout.isNarrowScreen ? 16 : 18,
      26
    )
  );

  // 設定多行文字的行距
  textLeading(
    constrain(
      min(width * 0.055, height * 0.05),
      layout.isNarrowScreen ? 22 : 24,
      34
    )
  );

  // 顯示題目文字
  text(
    questionData.question,
    width / 2,
    layout.questionY + layout.questionHeight / 2,
    layout.contentWidth - 28,
    layout.questionHeight - 16
  );
}

// 繪製四個答案選項
function drawOptions() {
  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 逐一繪製所有答案
  for (let i = 0; i < questionData.options.length; i++) {
    // 計算目前選項的垂直位置
    const optionY =
      layout.optionsY + i * (layout.optionHeight + layout.optionGap);

    // 設定選項的上下跳動位移
    let jumpOffset = 0;

    // 判斷是否要讓正確選項跳動
    if (
      answered &&
      selectedOption !== questionData.answer &&
      i === questionData.answer
    ) {
      // 計算上下跳動效果
      jumpOffset = sin(animationTime) * constrain(height * 0.014, 5, 12);

      // 推進動畫時間
      animationTime += 0.12;
    }

    // 判斷是否為答錯後的正確選項
    if (
      answered &&
      selectedOption !== questionData.answer &&
      i === questionData.answer
    ) {
      // 設定指定的正確選項背景顏色
      fill("#d8e2dc");
    } else if (
      answered &&
      selectedOption === questionData.answer &&
      i === selectedOption
    ) {
      // 設定答對選項背景顏色
      fill(190, 225, 202);
    } else if (
      answered &&
      selectedOption !== questionData.answer &&
      i === selectedOption
    ) {
      // 設定答錯選項背景顏色
      fill(245, 201, 201);
    } else {
      // 設定未作答選項背景顏色
      fill(255);
    }

    // 設定選項外框顏色
    stroke(195, 211, 202);

    // 設定選項外框粗細
    strokeWeight(constrain(width * 0.002, 1, 2));

    // 繪製選項區塊
    rect(
      layout.contentX,
      optionY + jumpOffset,
      layout.contentWidth,
      layout.optionHeight,
      constrain(width * 0.02, 10, 18)
    );

    // 設定選項文字顏色
    fill(35, 55, 48);

    // 移除文字外框
    noStroke();

    // 設定選項文字大小
    textSize(
      constrain(
        min(width * 0.041, height * 0.037),
        layout.isNarrowScreen ? 15 : 17,
        23
      )
    );

    // 顯示選項文字
    text(
      String.fromCharCode(65 + i) + ". " + questionData.options[i],
      width / 2,
      optionY + jumpOffset + layout.optionHeight / 2,
      layout.contentWidth - 24,
      layout.optionHeight - 10
    );
  }
}

// 繪製下一題按鈕
function drawNextButton() {
  // 判斷目前是否可以點擊按鈕
  const enabled = answered;

  // 設定按鈕背景顏色
  if (enabled) {
    // 設定啟用按鈕顏色
    fill(55, 95, 78);
  } else {
    // 設定停用按鈕顏色
    fill(180, 195, 187);
  }

  // 移除按鈕外框
  noStroke();

  // 繪製按鈕
  rect(
    layout.buttonX,
    layout.buttonY,
    layout.buttonWidth,
    layout.buttonHeight,
    constrain(width * 0.025, 12, 20)
  );

  // 設定按鈕文字顏色
  fill(255);

  // 設定按鈕文字大小
  textSize(
    constrain(
      min(width * 0.042, height * 0.04),
      layout.isNarrowScreen ? 16 : 18,
      22
    )
  );

  // 設定按鈕文字
  const buttonText =
    currentQuestion === questions.length - 1 ? "查看結果" : "下一題";

  // 顯示按鈕文字
  text(
    buttonText,
    layout.buttonX + layout.buttonWidth / 2,
    layout.buttonY + layout.buttonHeight / 2
  );
}

// 處理滑鼠與觸控點擊
function mousePressed() {
  // 判斷是否已完成所有題目
  if (currentQuestion >= questions.length) {
    // 不再處理點擊
    return false;
  }

  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 尚未作答時才允許選擇答案
  if (!answered) {
    // 逐一檢查四個選項
    for (let i = 0; i < questionData.options.length; i++) {
      // 計算目前選項位置
      const optionY =
        layout.optionsY + i * (layout.optionHeight + layout.optionGap);

      // 判斷點擊位置是否在選項內
      const clickedOption =
        mouseX >= layout.contentX &&
        mouseX <= layout.contentX + layout.contentWidth &&
        mouseY >= optionY &&
        mouseY <= optionY + layout.optionHeight;

      // 如果點擊到選項
      if (clickedOption) {
        // 記錄所選選項
        selectedOption = i;

        // 標記目前題目已作答
        answered = true;

        // 重設動畫時間
        animationTime = 0;

        // 判斷是否答對
        if (selectedOption === questionData.answer) {
          // 增加答對題數
          correctCount++;
        }

        // 停止檢查其他選項
        break;
      }
    }

    // 防止同一次點擊直接進入下一題
    return false;
  }

  // 判斷點擊是否位於下一題按鈕內
  const clickedNextButton =
    mouseX >= layout.buttonX &&
    mouseX <= layout.buttonX + layout.buttonWidth &&
    mouseY >= layout.buttonY &&
    mouseY <= layout.buttonY + layout.buttonHeight;

  // 如果點擊下一題按鈕
  if (clickedNextButton) {
    // 移動到下一題
    currentQuestion++;

    // 清除作答狀態
    answered = false;

    // 清除選項選取狀態
    selectedOption = -1;

    // 重設動畫時間
    animationTime = 0;
  }

  // 防止瀏覽器處理額外的滑鼠事件
  return false;
}

// 繪製測驗完成結果
function drawResultScreen() {
  // 設定結果標題顏色
  fill(35, 55, 48);

  // 設定結果標題大小
  textSize(
    constrain(
      min(width * 0.08, height * 0.1),
      layout.isNarrowScreen ? 28 : 32,
      48
    )
  );

  // 顯示完成標題
  text("測驗完成！", width / 2, height * 0.32);

  // 設定分數文字顏色
  fill(55, 95, 78);

  // 設定分數文字大小
  textSize(
    constrain(
      min(width * 0.065, height * 0.075),
      layout.isNarrowScreen ? 22 : 25,
      36
    )
  );

  // 顯示答對題數
  text(
    "你答對了 " + correctCount + " / " + questions.length + " 題",
    width / 2,
    height * 0.47
  );

  // 設定鼓勵文字顏色
  fill(85, 105, 96);

  // 設定鼓勵文字大小
  textSize(
    constrain(
      min(width * 0.043, height * 0.05),
      layout.isNarrowScreen ? 15 : 17,
      24
    )
  );

  // 設定鼓勵文字行距
  textLeading(28);

  // 顯示鼓勵文字
  text(
    "繼續練習 p5.js，讓程式設計變得更有趣！",
    width / 2,
    height * 0.59,
    width * 0.9,
    60
  );
}

// 當瀏覽器視窗大小改變時執行
function windowResized() {
  // 重新建立符合新視窗大小的畫布
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算響應式版面
  updateLayout();

  // 更新像素密度記錄
  previousPixelDensity = pixelDensity();
}