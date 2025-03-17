#!/bin/bash

# 构建项目
echo "构建项目..."
npm run build

# 创建全局链接
echo "创建全局链接..."
echo "注意：可能需要输入密码来获取权限"
sudo npm link

echo "安装完成！现在可以使用 'graphql-client-gen' 命令了。"
echo "示例："
echo "  graphql-client-gen --schema ./example/schema.graphqls --output ./example/generated/cli-test"
echo "  graphql-client-gen --help"