# FitMaster iOS — Design Document

> 把现有单文件 Web App 变成 iPhone 原生体验的 App，最终目标可上 App Store。

**Status**: Draft v1
**Branch**: `mobile-ios`
**Owner**: @etherimirr

---

## 1. 目标 & 约束

**目标**
- iPhone 原生 App 体验，与 Web 版功能基本对齐
- 可选上架 App Store
- 数据可在 iPhone / iPad / Mac (Web) 之间同步

**约束**
- 单人维护，不想完全重写已有 ~3700 行 HTML/JS
- 不想搞复杂后端
- 个人数据隐私优先（不上传到自建服务器）

---

## 2. 技术方案对比

| 方案 | 改造成本 | UX | 代码复用 | 上架 App Store | iCloud 同步 |
|---|---|---|---|---|---|
| **PWA** (Add to Home Screen) | ⭐ 极低 | 中 | 100% | ❌ | ❌ |
| **Capacitor** (HTML 包壳) | ⭐⭐ 低 | 中-高 | 95% | ✅ | ✅ |
| **React Native** | ⭐⭐⭐⭐ 高 | 高 | 0% | ✅ | ✅ |
| **SwiftUI 原生重写** | ⭐⭐⭐⭐⭐ 极高 | 极高 | 0% | ✅ | ✅ |

**推荐：Capacitor**

理由：
- 现有代码几乎不动，iOS 也能上架
- 可逐步加原生模块（Camera / HealthKit / Notifications / Siri）
- 同一套核心代码 Web/iOS/Android 共用
- 关键页面后期可换成 SwiftUI 原生组件

---

## 3. 架构

```
┌──────────────────────────────────────────────────┐
│  iOS App (Capacitor Container)                   │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │  WKWebView                                 │  │
│  │  ─ index.html (现有所有 UI / JS)            │  │
│  │  ─ data layer 改用 Capacitor Preferences   │  │
│  └────────────────────────────────────────────┘  │
│                       ↕                           │
│  ┌────────────────────────────────────────────┐  │
│  │  Capacitor Bridge (JS ↔ Native)            │  │
│  └────────────────────────────────────────────┘  │
│                       ↕                           │
│  ┌────────────────────────────────────────────┐  │
│  │  Native Plugins (Swift)                    │  │
│  │  ─ Camera          ─ HealthKit             │  │
│  │  ─ Filesystem      ─ Speech Framework      │  │
│  │  ─ Notifications   ─ SiriKit / Shortcuts   │  │
│  │  ─ Background      ─ WidgetKit             │  │
│  │  ─ iCloud Drive    ─ Live Activities       │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

**目录结构**

```
fitmaster/
├── index.html                   ← 现有 Web 入口（保留）
├── ios/                         ← Capacitor 生成的 Xcode 项目
│   ├── App/
│   │   ├── App.xcodeproj
│   │   └── App/
│   │       ├── AppDelegate.swift
│   │       ├── Info.plist
│   │       └── public/          ← Web 资源被复制到这里
├── src-mobile/                  ← 移动端专属适配代码
│   ├── storage.js               ← 替换 localStorage 的 shim
│   ├── camera.js                ← 替换 file input
│   ├── healthkit.js             ← 新增 HealthKit 桥接
│   └── notifications.js
├── capacitor.config.ts
├── package.json
└── docs/
    └── MOBILE_IOS_DESIGN.md     ← 本文档
```

---

## 4. 数据存储与同步

### 当前状态（Web 版）
所有数据在浏览器 `localStorage`，单设备绑定，无同步。

### 移动端策略

**Layer 1 - 本地存储**：`@capacitor/preferences`
- API 与 localStorage 几乎一样，写一个 shim 即可让现有代码无感切换
- 数据存在 iOS 加密的 NSUserDefaults / Keychain

**Layer 2 - iCloud Drive 同步**（v1 推荐）
- 把整个 data JSON 序列化到 iCloud Drive 容器目录
- iPhone 修改 → iCloud 自动 sync → iPad / Mac 取到
- 无需登录、无需服务器、无需用户信任你（Apple 帮你）
- 冲突策略：last-write-wins + 保留本地备份（出问题可手动 merge）

**Layer 3 - Web 同步**（可选 v2）
- Web 版加一个"导入 iCloud 备份"入口（用户手动从 iCloud Drive 选 JSON）
- 完全双向同步需要后端，暂不做

### 数据 Schema
不变。继续用 `DEFAULT_DATA`。仅 IO 层切换。

```js
// storage.js shim
import { Preferences } from '@capacitor/preferences';
async function loadData() {
  const { value } = await Preferences.get({ key: 'fitmaster.v1' });
  return value ? JSON.parse(value) : DEFAULT_DATA;
}
async function saveData(data) {
  await Preferences.set({ key: 'fitmaster.v1', value: JSON.stringify(data) });
  syncToICloud(data); // fire-and-forget
}
```

---

## 5. 功能范围

### v1 全量移植（用 Capacitor 包壳后即可工作）
- 主页打卡 + AI 整理
- 训练记录 / 动作库 / 计划
- 饮食 / 饮水 / 断食 / 补剂
- 体重 / 体测 / 进度照
- 成就 / 挑战 / 周报
- 计算工具
- 自定义追踪器
- 模块开关
- 双语 / 主题

### v1 移动端增强
- 📸 **原生相机**：替换 `<input type="file">`，体验更顺
- 🎤 **Speech Framework**：中文识别比 WebSpeech 准很多
- 🔔 **本地推送**：休息计时器到点真正震动 + 锁屏
- 📊 **底部 Tab 栏**：取代 sidebar
- 🌗 **跟随系统主题**

### v2 原生集成
- ⌚ **HealthKit**：自动读取步数 / 心率 / 睡眠 / 活动消耗，写回体重和训练
- 🎙️ **Siri Shortcuts**："Hey Siri, 记一组深蹲 100kg×5"
- 🔄 **iCloud 同步**：iPhone ↔ iPad ↔ Mac (Web)

### v3 高级
- 📱 **WidgetKit**：主屏幕小组件（今日热量、训练打卡）
- 🔴 **Live Activities**：训练计时器在锁屏 / 灵动岛实时显示
- 🍎 **Apple Watch**：手腕上记录组数 / 心率

### 不做（明确）
- 社交功能
- 营养师/教练市场
- IAP 订阅（个人项目，免费）
- 后端账号系统

---

## 6. 移动端 UX 重设计

### 导航
桌面 sidebar (15 项) → 底部 5 项 TabBar：
```
🏠 主页 (打卡)   🤖 AI   🏋️ 训练   📊 数据   ⚙️ 我的
```

其他模块（动作库 / 计算工具 / 成就 / 计划）用二级页面，从对应 Tab 进入。

### 屏幕适配
- iPhone SE (4.7") → iPhone 17 Pro Max (6.9")
- 单手操作友好：关键按钮在拇指区
- Dynamic Type 支持（字号跟随系统）
- Safe Area 适配（刘海 / 灵动岛）

### 手势
- 下拉刷新（同步状态）
- 左滑删除记录
- 长按打开快捷菜单

### 输入优化
- 数字键盘 vs 文本键盘自动切换
- 长按打卡按钮 → 直接录音
- 拍照按钮在打卡卡片显眼位置

---

## 7. 原生 iOS 集成清单

| 功能 | iOS API | 优先级 | Capacitor 插件 |
|---|---|---|---|
| 相机/相册 | UIImagePickerController | P0 | `@capacitor/camera` |
| 本地通知 | UNUserNotificationCenter | P0 | `@capacitor/local-notifications` |
| 持久存储 | NSUserDefaults | P0 | `@capacitor/preferences` |
| 文件 IO | FileManager | P0 | `@capacitor/filesystem` |
| 网络 | URLSession | P0 | (内置 fetch) |
| 触觉反馈 | UIFeedbackGenerator | P1 | `@capacitor/haptics` |
| 分享 | UIActivityViewController | P1 | `@capacitor/share` |
| 状态栏 | UIStatusBar | P1 | `@capacitor/status-bar` |
| HealthKit | HKHealthStore | P1 | 自定义 plugin |
| Speech | SFSpeechRecognizer | P1 | 自定义 plugin |
| iCloud Drive | NSFileCoordinator | P1 | 自定义 plugin |
| Live Activities | ActivityKit | P2 | 自定义 plugin |
| WidgetKit | WidgetKit | P2 | 自定义 plugin |
| Siri Shortcuts | App Intents | P2 | 自定义 plugin |

---

## 8. AI 集成

继续用 Claude / OpenAI HTTP API（Capacitor 内 fetch 与 Web 一致）。

**移动端 AI 调整**：
- API key 存 Keychain（比 Preferences 安全）
- 拍照后图片自动 base64 化送入 vision 模型（API 不变）
- 加 "Hey Siri, 让我打个卡" → SiriKit Intent → 进 App 自动语音输入

**未来选项**：
- Apple Intelligence on-device 小模型（隐私好，但能力弱）
- 提供官方代理（避免用户处理 API key），需要后端

---

## 9. 隐私 & App Store 合规

### 隐私
- 所有数据本地 + iCloud（用户自己的）
- AI key 用户自填，不经过我们服务器
- 不收集任何遥测
- 不上传任何身体数据到第三方（只送给用户配置的 AI）

### Info.plist 必填
```xml
<key>NSCameraUsageDescription</key>
<string>用于拍摄进度照片和饮食/训练截图，全程本地处理。</string>

<key>NSMicrophoneUsageDescription</key>
<string>用于语音输入打卡内容。</string>

<key>NSSpeechRecognitionUsageDescription</key>
<string>把你的语音转成文字记录。</string>

<key>NSHealthShareUsageDescription</key>
<string>读取你的步数、心率、睡眠数据自动同步到健身日志。</string>

<key>NSHealthUpdateUsageDescription</key>
<string>把你记录的体重和训练写回 Apple 健康。</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>保存进度照片到相册。</string>

<key>NSUbiquitousContainers</key>
<dict>...</dict>  <!-- iCloud 容器配置 -->
```

### App Store 评审风险
- ⚠️ AI key 用户自填的方案可能被审查"为什么不你自己付费"。预案：加一个"演示模式"用免费小模型
- ⚠️ HealthKit 需要详细说明每项数据用途
- ⚠️ "fitness app" 类目竞争激烈但门槛不高，应该能过

---

## 10. 开发路线图

> **当前模式：免费 Apple ID（不付 $99）**。
> 限制：App 装到 iPhone 后 7 天过期需重装；不能用 HealthKit / iCloud / Push 通知。
> 决定升级到 $99 后再做 Phase 3+。

### Phase 0 — 准备（你做）
- [ ] 装 Xcode（Mac App Store，~10GB）
- [ ] 用你的 Apple ID 在 Xcode 登录
- [ ] 准备数据线连 iPhone（或用模拟器）

### Phase 1 — Capacitor 包装（1-2 周，免费）
- [ ] 初始化 Capacitor 项目
- [ ] 把 `index.html` 拷进 `ios/App/App/public/`
- [ ] 写 `storage.js` shim 替换 localStorage
- [ ] 替换 file input 为 Capacitor Camera
- [ ] 在 Xcode 模拟器跑通基本功能
- [ ] 真机测试

**完成标准**：可以在 iPhone 上跑，所有 Web 功能可用，照片拍摄走原生。

### Phase 2 — 原生增强（2-3 周，免费）
- [ ] 本地通知（休息计时器到点）— 免费 ID 可用
- [ ] Speech Framework 替换 WebSpeech
- [ ] 移动端 UI 适配（底部 tab、手势）
- [ ] Haptics 反馈

**完成标准**：移动端 UX 顺手，关键交互原生化。

⚠️ **以下 Phase 需要 $99 Apple Developer 才能做**

### Phase 3 — HealthKit + iCloud（2-3 周，需 $99）
- [ ] HealthKit 读取步数 / 睡眠 / 心率 / 活动消耗
- [ ] HealthKit 写体重和训练
- [ ] iCloud Drive 同步实现
- [ ] 多设备测试

**完成标准**：和 Apple Watch / Health 联动，多设备数据自动同步。

### Phase 4 — App Store 上架（1 周，需 $99）
- [ ] 隐私政策网页
- [ ] App icon / 启动屏 / 截图
- [ ] App Store Connect 配置
- [ ] TestFlight beta（自己 + 几个朋友）
- [ ] 提交审核

**完成标准**：上架 App Store。

### Phase 5 — 高级功能（弹性）
- [ ] Live Activities（训练计时器锁屏）
- [ ] Home Screen Widget
- [ ] Siri Shortcuts
- [ ] Apple Watch 伴侣 App

---

## 11. 关键决策点

| # | 决策 | 选择 | 备注 |
|---|---|---|---|
| 1 | 上架 App Store？ | ✅ **是** | 需 Apple Developer $99/年 |
| 2 | AI Key 处理 | ✅ **用户自填** | 节省成本；引导用户去 Anthropic / OpenAI Console |
| 3 | iCloud 同步 | ✅ **v1 就做** | iPhone ↔ iPad ↔ Mac (Web) 自动同步 |
| 4 | iPad 适配 | v1 自适应 (默认) | 不做专门 iPad UI |
| 5 | Android | 以后 (默认) | Capacitor 免费送，但 v1 不测试 |
| 6 | 同步冲突策略 | last-write-wins + 本地保留 7 个版本 | 简单可靠 |
| 7 | 重写关键页面为 SwiftUI | 否 (默认) | 能用 WebView 就 WebView，性能不够时再说 |
| 8 | 中英文 i18n | 沿用 Web 版 (默认) | 保持单一真相源 |
| 9 | 后端 | 不要 (默认) | 全部 P2P + iCloud |

---

## 12. 风险

| 风险 | 影响 | 应对 |
|---|---|---|
| WebView 性能不够 | 中 | 关键页面后期可重写为 SwiftUI |
| Apple 审查拒绝 | 中 | 提前看 App Store guidelines；准备演示视频 |
| iCloud 同步冲突 | 低 | last-write-wins + 本地保留近 7 个版本 |
| Capacitor 升级 break | 低 | 锁定大版本 |
| 用户不会自填 AI Key | 中 | 加引导教程；保留无 AI 也能用的体验 |

---

## 13. 成本估算

| 项 | 成本 |
|---|---|
| Apple Developer Program | $99 / 年 |
| iCloud 容量 | 免费 (用户自己的 iCloud) |
| 域名 (隐私政策托管) | 已有 GitHub Pages 即可 |
| 开发工具 (Xcode) | 免费 |
| 服务器 | $0 (无后端) |
| **总计** | **$99 / 年** |

---

## 14. 下一步行动

1. **本文档评审** ← 当前
2. 决策表第 1 项（是否目标上架）
3. Phase 1 启动：在 `mobile-ios` 分支初始化 Capacitor

---

## 附录 A: Capacitor 初始化命令参考

```bash
# 在 fitmaster 根目录
npm init -y
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios

npx cap init FitMaster com.etherimirr.fitmaster --web-dir=.
npx cap add ios

# 每次改 index.html 后
npx cap sync ios

# 在 Xcode 打开
npx cap open ios
```

## 附录 B: 推荐插件清单

```json
{
  "dependencies": {
    "@capacitor/core": "latest",
    "@capacitor/ios": "latest",
    "@capacitor/preferences": "latest",
    "@capacitor/camera": "latest",
    "@capacitor/local-notifications": "latest",
    "@capacitor/filesystem": "latest",
    "@capacitor/haptics": "latest",
    "@capacitor/share": "latest",
    "@capacitor/status-bar": "latest",
    "@capacitor/keyboard": "latest"
  }
}
```
