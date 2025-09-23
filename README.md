# TMDB 代理 Worker

一个基于 Cloudflare Workers 的 TMDB API 代理服务，用于解决影视库刮削工具的 TMDB 访问问题。

## 功能特性

- 🔄 **API 代理**：无缝代理 TMDB API 请求
- 🌐 **CORS 支持**：解决浏览器跨域问题
- 🔒 **安全认证**：保护您的 TMDB API 密钥
- ⚡ **快速响应**：基于 Cloudflare 全球网络
- 🖼️ **图片代理**：支持 TMDB 图片资源代理（可选）

## 快速开始

### 前置要求

1. Cloudflare 账户
2. TMDB API 密钥（[申请地址](https://www.themoviedb.org/settings/api)）
3. GitHub 账户

### 部署步骤

1. **Fork 本项目**
   ```bash
   git clone https://github.com/your-username/tmdb-proxy-worker.git
   cd tmdb-proxy-worker
   ```

2. **配置 GitHub Secrets**
   - 进入仓库 Settings → Secrets and variables → Actions
   - 添加以下 Secrets：
     - `CLOUDFLARE_API_TOKEN`：Cloudflare API 令牌
     - `CLOUDFLARE_ACCOUNT_ID`：Cloudflare 账户 ID
     - `TMDB_API_KEY`：您的 TMDB API 密钥

3. **自动部署**
   - 推送代码到 main 分支将自动触发部署
   - 查看 Actions 标签页确认部署状态

### 手动部署

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署 Worker
wrangler deploy
```

## 使用方法

### API 端点

您的 Worker 部署后，基础 URL 为：
```
https://your-worker-name.your-subdomain.workers.dev
```

### 示例请求

**获取电影信息**
```
GET /movie/550
```

**搜索电影**
```
GET /search/movie?query=avatar
```

**获取电视剧信息**
```
GET /tv/1399
```

### 在刮削工具中配置

#### Jellyfin
1. 进入 **控制台** → **插件** → **TheMovieDb**
2. 设置 API 地址为您的 Worker URL
3. 保存设置

#### TinyMediaManager
1. 进入 **Settings** → **Movies** → **TheMovieDb**
2. 在 **API URL** 中填写 Worker 地址
3. 点击 **Test** 验证连接

#### Emby
1. 进入 **管理** → **库** → **元数据** → **The Movie Database**
2. 修改 API 服务器地址

## 配置说明

### 环境变量

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `TMDB_API_KEY` | TMDB API 密钥 | ✅ |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 | ✅ |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID | ✅ |

### 自定义配置

修改 `wrangler.toml` 文件：

```toml
name = "tmdb-proxy"
compatibility_date = "2024-01-01"
main = "worker.js"

# 自定义路由（可选）
routes = [
  "yourdomain.com/tmdb/*"
]
```

## 开发

### 本地开发

```bash
# 启动本地开发服务器
wrangler dev

# 监听文件变化
wrangler dev --live-reload
```

### 项目结构

```
tmdb-proxy-worker/
├── worker.js          # Worker 主代码
├── wrangler.toml      # 配置文件
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Actions 工作流
└── README.md          # 项目文档
```

## 故障排除

### 常见问题

**Q: 部署失败，提示权限错误**
A: 检查 Cloudflare API 令牌是否具有正确权限（Workers Scripts Edit）

**Q: API 返回 401 错误**
A: 验证 TMDB API 密钥是否正确配置在环境变量中

**Q: 刮削工具无法连接**
A: 检查 Worker URL 是否正确，测试直接浏览器访问

**Q: 速率限制错误**
A: TMDB 有 API 调用限制，建议添加缓存或降低请求频率

### 查看日志

```bash
# 查看 Worker 日志
wrangler tail
```

## 高级功能

### 图片代理支持

启用图片代理功能，修改 `worker.js`：

```javascript
// 在 fetch 函数中添加图片代理处理
if (url.pathname.startsWith('/image/')) {
  const imageUrl = `https://image.tmdb.org/t/p/original${url.pathname.replace('/image', '')}`
  return fetch(imageUrl)
}
```

### 缓存优化

添加响应缓存减少 API 调用：

```javascript
// 缓存 API 响应
const cacheKey = request.url
const cache = caches.default
let response = await cache.match(cacheKey)

if (!response) {
  // 处理请求...
  response = new Response(response.body, response)
  response.headers.append('Cache-Control', 's-maxage=3600')
  ctx.waitUntil(cache.put(cacheKey, response.clone()))
}
```

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 免责声明

本项目仅用于学习和研究目的，请遵守 TMDB 的 API 使用条款。
