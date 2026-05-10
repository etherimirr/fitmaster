# iOS 快速上手

> 当前进度：Phase 1 完成。Capacitor 已接入，shim 已就绪，可在 Xcode 中跑了。

## 你需要做的

### 1. 安装完整 Xcode（如果还没装）
1. 打开 Mac App Store
2. 搜 "Xcode"
3. 点 **Get** / **Install**（约 10GB，需要等）
4. 安装完打开 Xcode 一次（会装额外组件）
5. 在 Xcode → Settings → Accounts 加入你的 Apple ID（免费即可）

### 2. 在 Xcode 打开项目
```bash
cd ~/Desktop/fitmaster
git checkout mobile-ios
npm install            # 第一次需要
npm run sync           # 把 index.html + shims 同步到 ios/
npm run ios            # 打开 Xcode
```

或者直接：
```bash
open ios/App/App.xcworkspace
```

### 3. 在 Xcode 里跑起来

#### 模拟器跑（不需要 iPhone）
1. Xcode 顶部选一个模拟器（如 "iPhone 15 Pro"）
2. 点 ▶️ 三角形按钮（或 Cmd+R）
3. 等编译，模拟器自动启动，App 运行

#### 真机跑
1. 数据线连接你的 iPhone（或无线开发）
2. iPhone 设置 → 隐私与安全 → 开启"开发者模式"，重启
3. Xcode 顶部选你的 iPhone 名字
4. 点 ▶️
5. 第一次跑时 iPhone 会提示"未受信任的开发者"
   - iPhone → 设置 → 通用 → VPN 与设备管理 → 你的 Apple ID → 信任
6. 再回到主屏幕点开 FitMaster App

⚠️ **免费 Apple ID 的限制**：
- App 在 iPhone 上 7 天后失效，需要重新连 Xcode 跑一次
- 不能用 HealthKit / iCloud / Push 通知
- 一次最多装 3 个用免费 ID 签名的 App

升级到 $99 Apple Developer 解除上述所有限制。

## 修改代码后如何更新

每次改了 `index.html` 或 `src-mobile/*.js`：
```bash
npm run sync
```
这会把最新代码复制到 iOS 项目里。然后回 Xcode 重新点 ▶️。

## 当前已实现

- ✅ Capacitor 项目结构
- ✅ Storage shim：自动用 Capacitor Preferences 替换 localStorage（数据持久化更可靠）
- ✅ Camera shim：所有 `<input type="file">` 自动调用原生相机/相册选择器
- ✅ Notifications shim：休息计时器结束用原生本地通知
- ✅ Info.plist 权限描述（相机、相册、麦克风、语音识别）
- ✅ Web 模式 100% 兼容（src-mobile/*.js 在浏览器里是 no-op）

## 待做（Phase 2）

- [ ] Speech Framework 替换 WebSpeech（更准的中文识别）
- [ ] Haptics 触觉反馈
- [ ] 移动端 UI（底部 Tab Bar 替换侧边栏）
- [ ] 启动屏 + App Icon
- [ ] 暗色模式自动跟随系统

## 待做（Phase 3+，需 $99 Apple Developer）

- [ ] HealthKit 自动读步数 / 心率 / 睡眠
- [ ] iCloud 同步（多设备）
- [ ] App Store 上架
- [ ] Live Activities（锁屏训练计时）
- [ ] Home Screen Widget

## 故障排查

| 问题 | 解决 |
|---|---|
| Xcode 报 `pod install` 失败 | `cd ios/App && pod install` |
| 模拟器无法启动 | Xcode → Window → Devices and Simulators → Erase All Content |
| 真机签名报错 | Xcode → 选中 App target → Signing & Capabilities → Team 选你 Apple ID |
| Web 改了但模拟器没更新 | 必须 `npm run sync` 一次 |
