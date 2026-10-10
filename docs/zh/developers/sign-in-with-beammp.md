---
description: "让用户用 BeamMP 账号登录你的应用：创建应用、将用户引导到 BeamMP、用授权码换取令牌并读取用户资料。"
---
# 使用 BeamMP 登录

本页面向希望让用户通过 BeamMP 账号登录自己网站或应用的开发者。完成后，你将得到一个可用的 OAuth 2.0 登录流程，它会返回用户的 BeamMP 账号 ID、用户名、头像，以及（在用户允许的情况下）电子邮件地址。

BeamMP 使用 OAuth 2.0 的**授权码**流程。它只支持 OAuth 2.0，不是 OpenID Connect：没有 `id_token`，没有发现文档，也没有 JWKS。

## 端点

| 用途 | 方法和地址 |
|---|---|
| 授权（在用户的浏览器中打开） | `GET https://accounts.beammp.com/auth/external` |
| 令牌交换 | `POST https://api.beammp.com/v1/oauth/token` |
| 用户资料 | `GET https://api.beammp.com/v1/oauth/userinfo` |
| 撤销令牌 | `POST https://api.beammp.com/v1/oauth/revoke` |

## 创建你的应用

你可以在 [accounts.beammp.com](https://accounts.beammp.com) 上 BeamMP 账号的**开发者控制台**中创建应用。开发者功能需要按账号单独开通，默认并未开启。如需开通，请在 [Discord 服务器](https://discord.gg/beammp)上联系 BeamMP 团队。

你需要填写：

| 字段 | 说明 |
|---|---|
| 应用名称 | 3 到 80 个字符。在用户被要求授权你的应用时显示。 |
| 网站 | 可选。完整的 `https://` 或 `http://` 地址。在授权页面上显示为链接。 |
| 隐私政策 URL | 可选，但强烈建议填写。完整的 `https://` 或 `http://` 地址。在授权页面上显示为链接，这样用户在授权之前就能了解你会如何使用他们的数据。如果不填，授权页面会显示你没有提供隐私政策。 |
| 描述 | 可选。在授权页面上显示。 |
| 重定向 URI | 每行一个。使用 `https://` 地址；开发期间，`localhost` 和 `127.0.0.1` 可以使用 `http://`。不接受自定义协议。 |

保存时会检查网站和隐私政策地址。只接受普通的 `http://` 或 `https://` 地址：不接受 `javascript:`、`data:` 或 `ftp:` 地址，也不接受包含用户名和密码的地址。

随后你会得到一个**客户端 ID** 和一个**客户端密钥**。密钥只显示一次，之后你可以轮换它。

::: warning 将密钥保存在你的服务器上
切勿把客户端密钥放进浏览器或移动应用。如果你的应用无法保管密钥，例如单页应用，请改用 [PKCE](#pkce)。
:::

## 将用户引导到 BeamMP

在用户的浏览器中打开此地址：

```
https://accounts.beammp.com/auth/external
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https%3A%2F%2Fexample.com%2Fcallback
  &response_type=code
  &scope=profile%20email
  &state=RANDOM_VALUE
  &code_challenge=CHALLENGE
  &code_challenge_method=S256
```

| 参数 | 是否必填 | 说明 |
|---|---|---|
| `client_id` | 是 | 你的客户端 ID。 |
| `redirect_uri` | 是 | 必须与你注册的某个重定向 URI 完全一致。 |
| `response_type` | 是 | 必须为 `code`。不支持其他值。 |
| `scope` | 否 | 以空格分隔。默认为 `profile`。参见[权限范围](#scopes)。 |
| `state` | 建议填写 | 由你生成的随机值，会原样返回。请检查它是否一致，以防止伪造的回调。 |
| `code_challenge` | 建议填写 | PKCE 质询。参见 [PKCE](#pkce)。 |
| `code_challenge_method` | 使用质询时必填 | 必须为 `S256`。不支持 `plain`。 |

用户先登录 BeamMP；如果其账号启用了密码和双因素验证码，则需要输入。随后会看到一个页面，显示你的应用名称、描述、网站和隐私政策链接，以及你请求的权限。用户可以选择同意或拒绝。

如果请求本身无效，例如应用未知、`redirect_uri` 未注册或权限范围不受支持，BeamMP 会向用户显示错误，而不会重定向到你的应用。

已被封禁、已停用或仍在等待恢复的账号无法授权任何内容。

## 接收授权码

用户同意后，BeamMP 会将其重定向到你的 `redirect_uri`：

```
https://example.com/callback?code=AUTHORIZATION_CODE&state=RANDOM_VALUE
```

如果用户拒绝，你收到的将是 `?error=access_denied&state=RANDOM_VALUE`。

授权码的有效期为 5 分钟，且只能使用一次。兑换失败的尝试同样会使其失效，因此请重新申请新的授权码，而不是重试。

## 用授权码换取访问令牌

请从你的服务器调用令牌端点。请求体以 `application/x-www-form-urlencoded` 格式发送，也接受 JSON。

使用客户端密钥，并通过 HTTP Basic 认证：

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d code_verifier=YOUR_VERIFIER
```

或者将凭据放在请求体中：

```bash
curl -X POST https://api.beammp.com/v1/oauth/token \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d redirect_uri=https://example.com/callback \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code_verifier=YOUR_VERIFIER
```

`redirect_uri` 必须与你打开授权地址时发送的值相同。如果你发送了 `code_challenge`，请同时发送 `code_verifier`。

成功的响应：

```json
{
  "access_token": "bmp_at_...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile email"
}
```

访问令牌的有效期为 1 小时。不提供刷新令牌：令牌过期后，请让用户重新走一遍登录流程。如果用户的 BeamMP 会话仍然有效，这个过程会很快。

## 读取用户资料

```bash
curl https://api.beammp.com/v1/oauth/userinfo \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

```json
{
  "sub": "12345",
  "username": "Racer",
  "picture": "https://api.beammp.com/v1/avatars/abc123",
  "email": "racer@example.com",
  "email_verified": true
}
```

| 字段 | 所需权限范围 | 说明 |
|---|---|---|
| `sub` | 任意 | 用户永久不变的 BeamMP 账号 ID，为字符串。请用它来识别账号。 |
| `username` | `profile` | 可能随时间改变。不要把它用作键。 |
| `picture` | `profile` | 用户头像的地址，或 `null`。可以在任何网站上显示。 |
| `email` | `email` | 用户的主电子邮件地址，或 `null`。 |
| `email_verified` | `email` | 该地址是否已通过验证。 |

BeamMP 会在每次调用时检查账号状态。如果用户在授权你的应用之后被封禁或停用，userinfo 会返回 `401 invalid_token`，直到其账号恢复正常。

## 撤销令牌

当用户断开与你的应用的连接时，请撤销其令牌：

```bash
curl -X POST https://api.beammp.com/v1/oauth/revoke \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d token=ACCESS_TOKEN
```

正如 RFC 7009 所述，此接口始终返回 `200 {}`，对未知或已过期的令牌也是如此。你只能撤销颁发给你自己应用的令牌。发送密钥是可选的，但如果发送了，就必须正确。

## 权限范围 {#scopes}

| 权限范围 | 提供的内容 |
|---|---|
| `profile`（默认） | `sub`、`username`、`picture` |
| `email` | `email`、`email_verified` |

不支持 `openid`。许多 OAuth 库默认会添加它。请将其关闭，否则请求会被拦截，并提示不受支持的权限。

只请求你需要的权限：用户会在授权页面上看到每一项权限。

## 客户端身份验证

你可以用以下两种方式之一对令牌请求进行身份验证：

- **客户端密钥**，适用于带有服务器的 Web 应用。使用 HTTP Basic，或在请求体中发送 `client_id` 和 `client_secret`。只能使用其中一种方式，不能同时使用。如果你使用 Basic，同时又在请求体中发送了 `client_id`，则两者必须一致。
- **PKCE**，适用于无法保管密钥的应用，或作为额外的保护。打开授权地址时发送 `code_challenge`，兑换授权码时发送 `code_verifier`。

令牌请求必须至少证明这两者之一。如果你发送了 `code_challenge`，则始终会校验 `code_verifier`，即使你同时还发送了密钥。密钥错误时请求会被拒绝，但不会使授权码失效。建议在使用密钥的同时也使用 PKCE。

## PKCE {#pkce}

仅支持 `S256` 方法。

- `code_verifier`：一个 43 到 128 个字符的随机字符串，字符取自 `A-Z a-z 0-9 - . _ ~`。
- `code_challenge`：验证器的 SHA-256 哈希，经 base64url 编码且不带填充。它的长度始终为 43 个字符。

```js
import crypto from "node:crypto";

const verifier = crypto.randomBytes(32).toString("base64url");           // 43 characters
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
// send `challenge` when you open the authorization address; keep `verifier` and send it when you exchange the code
```

## 错误

令牌和撤销接口的错误以 JSON 返回，带有标准错误码：

```json
{ "error": "invalid_grant", "error_description": "Authorization code is invalid, expired, or does not match this request" }
```

| `error` | 状态码 | 含义 |
|---|---|---|
| `invalid_request` | 400 | 缺少必需的参数，或同时使用了两种客户端身份验证方式。 |
| `invalid_client` | 401 | 客户端未知、密钥错误，或既没有密钥也没有 PKCE。 |
| `invalid_grant` | 400 | 授权码无效、已过期、已被使用，或与应用或 `redirect_uri` 不匹配。此外还包括：PKCE 验证失败，或账号不可用，例如已被封禁。 |
| `unsupported_grant_type` | 400 | 仅支持 `authorization_code`。 |
| `invalid_token`（userinfo） | 401 | 访问令牌无效、已过期或已被撤销，或其对应的账号不可用。 |

## 限制与有效期

| 项目 | 数值 |
|---|---|
| 授权码 | 5 分钟，仅可使用一次 |
| 访问令牌 | 1 小时 |
| 令牌和撤销端点 | 失败的请求限制为每个 IP 地址每分钟 30 次。成功的请求不计入。 |
| Userinfo 端点 | 每个 IP 地址每分钟 600 次请求 |

## 重定向 URI

- 重定向 URI 必须与已注册的某个 URI 完全一致：协议、主机、端口、路径和查询参数都要相同。
- 在生产环境中请使用 `https://` 重定向 URI。`http://` 仅在开发时用于 `localhost` 和 `127.0.0.1`。

## 上线之前

- 填写你的隐私政策 URL，让用户在授权之前能够阅读。
- 每次登录都生成新的随机 `state`，并在用户返回时进行验证。
- 使用 PKCE，即使你同时使用客户端密钥也是如此。
- 客户端密钥只保存在你的服务器上。
- 通过 `sub` 识别用户，绝不要用 `username` 或 `email`。
- 从你的服务器调用令牌端点，而不是从浏览器调用。
- 不要记录或存储访问令牌，保留时间不要超过必要的时长。
