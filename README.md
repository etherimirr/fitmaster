# FitMaster · 个人健身监督台

> 单文件、纯本地、零依赖的全功能健身管理 App。打开 `index.html` 就能用。

[English version below ↓](#english)

## ✨ 特性

### 📔 打卡为中心
- 一个大输入框：写字 / 🎤 语音 / 📷 拍照三种方式
- AI 自动拆分写入：训练 / 饮食 / 体重 / 不适 / 进度照
- 一键查看 "今日已记录的内容"
- 状态/精力/心情星级评分 + 睡眠时长
- 4 个快速卡片：饮水 / 训练 / 饮食 / 体重

### 🤖 AI 健身教练
- 接入 **Anthropic Claude** 或 **OpenAI GPT**（含视觉模型）
- 可读取你的全部数据，给出个性化建议
- 16+ 工具调用：自动写训练 / 饮食 / 体重 / 日志 / 周期 / 设置 / 模块开关 / 自定义追踪器
- 文字 + 语音 + 图片三种输入

### 🔬 科学动态卡路里引擎
- BMR：Mifflin-St Jeor + Katch-McArdle (有体脂时切换)
- 日常活动系数（不含训练）+ 当天实际训练消耗（按 MET）
- 女性月经周期跟踪：黄体期 BMR +7.5% 自动加上
- 4 种目标：减脂 / 增肌 / 维持 / **体型重塑 (recomp)**
- 每日"剩余可吃 X kcal"实时更新 + 详细分解

### 🏋️ 训练记录
- 100+ 内置动作（按部位筛选）
- 每组：重量 / 次数 / **RPE 评分** / 超级组 / 递减组 / 力竭标签
- 内置浮动休息计时器（60s/90s/2min/3min 一键启动）
- 30+ 个动作详细教程（要领 / 技巧 / 错误 / 目标肌肉 SVG 图）
- YouTube + B 站一键搜索教学视频

### 🍱 饮食与补剂
- 35+ 食物营养数据库
- 早午晚餐 + 加餐分组，自动统计宏量
- 💧 饮水追踪 / ⏰ 16:8 断食计时器 / 💊 补剂打卡

### 📈 身体数据
- 体重 / 体脂 / 胸/腰/臀/大臂/大腿围度
- 📸 进度照片对比（自动压缩）
- 🩹 身体不适地图（点击身体部位标记酸痛级别）

### 🏆 成就 & 挑战
- 18 个成就徽章（PR / 连续打卡 / 减重 / 训练量等）
- 6 个挑战（30 天俯卧撑 / 21 天饮水 / 14 天好眠等）
- 周报 / 月报 / 年度回顾 + 一键打印 PDF

### 🧮 计算器工具箱
1RM 最大重量 · 杠铃配重器 · 海军体脂率 · 理想体重 · 每日饮水量 · 宏量营养拆分 · 运动热量消耗 · 预热组生成

### 📦 模块化架构
- 13 个模块可自由开关（左下角设置）
- 自定义追踪器：冥想 / 屏幕时间 / 冷水澡等任意指标，主页自动显示
- AI 也能管理这些模块

### 🌐 双语支持
中文 / English 一键切换，包括所有动作名 / 食物名 / AI 系统提示词。

### 🎨 体验
- 🌓 浅色 / 深色主题
- ⌨️ 键盘快捷键（数字 1-9 切页面 / N 新建训练）
- 🔔 浏览器系统通知（休息结束等）
- 💾 数据 100% 存浏览器 localStorage，永不联网（除非你用 AI）
- 📤 一键 JSON 备份/恢复

## 🚀 使用

```bash
git clone https://github.com/etherimirr/fitmaster.git
cd fitmaster
open index.html  # macOS
# 或者直接双击 index.html
```

完全离线运行。需要 AI 功能时去 "AI 助手" 页填 API Key（仅存本地）：
- Claude: https://console.anthropic.com/settings/keys
- OpenAI: https://platform.openai.com/api-keys

## 🛠️ 技术栈

- 纯 HTML + CSS + JS（无任何依赖、无构建工具）
- 数据存 `localStorage`
- 图片用 `Canvas` 自动压缩
- 语音输入用 `Web Speech API`
- AI 调用用浏览器原生 `fetch`
- 单文件 ~3700 行

## 📄 License

MIT

---

<a name="english"></a>

# FitMaster · Personal Fitness Tracker

> A single-file, fully-offline, zero-dependency fitness app. Open `index.html` and start using.

## ✨ Features

- **Daily Check-in centric**: text / voice / photo input → AI auto-parses into workouts, meals, weight, symptoms, progress photos
- **AI Coach** (Claude / GPT with vision): reads your data, gives advice, can write to any module via 20+ tool calls
- **Scientific Dynamic Calories**: Mifflin/Katch-McArdle BMR + daily-life multiplier + actual workout burn (MET-based) + female cycle adjustment + recomp/cut/bulk modes; shows real-time "kcal remaining"
- **Workouts**: 100+ exercises, RPE/superset/dropset tags, floating rest timer, 30+ detailed exercise guides with target-muscle SVG diagrams
- **Diet & Supplements**: 35+ food DB, water tracker, fasting timer (16:8/18:6/24h), supplement log
- **Body**: weight/BF/measurements + progress photos + soreness body map
- **Achievements**: 18 badges, 6 challenges, weekly/monthly/year reports
- **Calculators**: 1RM, plate calc, Navy body fat, ideal weight, water need, macro split, calorie burn, warmup
- **Modular**: 13 toggleable modules + user-defined custom trackers (meditation, screen time, etc.)
- **Bilingual**: Chinese / English instant switch (all UI, exercise names, food names, AI prompt)
- **Privacy**: All data in browser localStorage. Never sent anywhere unless you use AI.

## 🚀 Usage

```bash
git clone https://github.com/etherimirr/fitmaster.git
cd fitmaster
open index.html
```

Get AI API key (optional, for the assistant):
- Claude: https://console.anthropic.com/settings/keys
- OpenAI: https://platform.openai.com/api-keys

## 🛠️ Tech

Vanilla HTML/CSS/JS, no build tools, no dependencies, single file ~3700 lines.

## 📄 License

MIT
