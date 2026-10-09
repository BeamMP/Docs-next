---
description: "帮助改进 BeamMP 文档：在 GitHub 上编辑页面、在本地预览你的更改、遵循风格指南，以及提交拉取请求后会发生什么。"
---
# 参与贡献

你可以通过修正错误、补充缺失的内容或撰写新页面来帮助改进这些文档。本页介绍具体方法。

## 动笔之前

请阅读[风格指南](https://github.com/__repo__/blob/main/STYLE_GUIDE.md)。它说明了页面应该怎样写、每种提示框应在什么时候使用，以及如何书写图片和链接。

英文页面是基准。修改英文页面后，其他语言会随之跟进。如果想参与翻译，请参阅[翻译](#translating)。

## 在 GitHub 上编辑页面

这是修改拼写、语法和做小幅补充的最快方法。它需要你具备一些 Markdown 知识。

1. 点击你想修改的页面底部的 **Edit this page**。
2. 将项目 Fork 到你自己的 GitHub 账号中。
3. 进行你的更改。
4. 将更改提交（commit）到你的 fork。
5. 向 [@repo@](https://github.com/__repo__) 提交拉取请求（pull request）。

## 在本地预览你的更改

对于较大的修改，请在编写的同时预览你的更改。

1. Fork 本项目并克隆你的 fork。
2. 安装 [Node.js](https://nodejs.org) 22 或更高版本，然后运行 `npm install`。
3. 运行 `npm run dev`，并打开它输出的地址。你编辑时，页面会随之更新。
4. 进行你的更改，然后运行 `npm test` 和 `npm run check`。检查会找出失效链接、未闭合的提示框、缺失的图片以及无法渲染的页面。
5. 提交到你的 fork，并打开一个拉取请求。

## 接下来会发生什么

BeamMP 模组团队（Mod Team）的成员会审核你的拉取请求，然后批准它，或要求你修改。待你完成修改后，我们会再次审核。合并之后，它会被自动部署。

## 翻译 {#translating}

这些文档通过 [GitLocalize](https://gitlocalize.com/repo/9180) 翻译成多种语言。GitLocalize 有时会把已经翻译过的段落显示为“未翻译”，所以在修改某个页面之前，请先确认它是否已经翻译。
