# 贡献指南

感谢您考虑为 GraphQL 客户端生成器做出贡献！以下是一些指导原则，帮助您参与项目开发。

## 开发环境设置

1. 克隆仓库：
   ```bash
   git clone https://github.com/jovanhsu/graphql-client-generator.git
   cd graphql-client-generator
   ```

2. 安装依赖：
   ```bash
   npm install
   # 或
   yarn
   ```

3. 构建项目：
   ```bash
   npm run build
   # 或
   yarn build
   ```

4. 运行测试：
   ```bash
   npm test
   # 或
   yarn test
   ```

## 开发流程

1. 创建一个新分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 进行更改并确保代码符合项目风格。

3. 提交您的更改：
   ```bash
   git commit -m "feat: 添加新功能"
   ```
   我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

4. 推送到您的分支：
   ```bash
   git push origin feature/your-feature-name
   ```

5. 创建一个 Pull Request。

## 代码风格

- 使用 TypeScript 编写代码
- 遵循项目现有的代码风格
- 添加适当的注释和文档
- 为新功能编写测试

## 报告问题

如果您发现了问题或有功能请求，请在 GitHub 上创建一个 issue，并提供以下信息：

- 问题的详细描述
- 复现步骤（如适用）
- 预期行为和实际行为
- 环境信息（操作系统、Node.js 版本等）

## 许可证

通过贡献代码，您同意您的贡献将根据项目的 MIT 许可证进行许可。 