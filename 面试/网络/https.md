#### 简单概括

HTTPS 并不是一种新的协议，只不过是 HTTP 在通讯接口(在 HTTP 和 TCP 之间建立中间层)用 SSL 或者 TLS 代替

简单理解就是`HTTS = HTTP + SSL/TLS`

#### 优势

- 加密，保证了数据的隐私性和完整性
- 身份验证，一定程度上保证了安全性，极大提高了攻击者的攻击成本。

#### 与 HTTP 区别

- 端口 HTTP 是 80,HTTPS 是 443 (默认情况下)
- 弥补了 HTTP 的缺点，保证了数据的隐私性、完整性、身份验证。也就是说比 HTTP 更安全

#### 主要工作流程

主要是采用对称密钥加密和非对称密钥加密组合而成的混合加密机制进行传输。

**简单描述步骤：**

1. 客户端发起请求
2. 服务端返回证书和公钥给客户端
3. 客户端验证证书，验证成功后得到公钥
4. 用公钥加密对称公钥发送给服务器
5. 服务端用私钥解密得到对称公钥
6. 后面的传输过程都用这个对称公钥进行加密传输

#### TLS 加密类型区别

###### ECDHE

当前主流的 TLS1.2 版本的握手方式：

1. 客户端请求，发送 client_random 和 TSL 版本号、加密套件给服务器

2. 服务端确认 TSL 版本，发送 server_random 和 server_params、加密套件、证书给客户端

3. 客户端收到信息后,验证证书，验证成功会发送一个 client_params 给服务器

4. 发送的同时,客户端会通过**ECDHE 算法**计算出一个 pre_random,计算方式是 pre_random = ECDHE(client_params,server_params)

5. 这时客户端就拥有了 client_params、server_params、pre_random 三个随机数，然后通过三个随机数生成最后的 secret，这个 secret 就是对称秘钥。

6.生成完 secret 后，给服务器发送一个收尾信息,通知服务器后面都用对称加密方式通讯.

7. 服务器在接受到 client 后，也通过同样的方式生成 secret,生成后也会发一个收尾信息给客户端。

8. 双方得到对方的收尾信息后，握手结束，开始用 secret 对称秘钥进行报文传输

###### RSA

传统的方式，流程大概如下

1. 客户端发送 client_random 和 TSL 版本号、加密套件给服务器

2. 服务端确认 TSL 版本，发送 server_random、加密套件、证书给客户端

3. 客户端收到信息后,验证证书，验证成功的话，就用 RSA 算法生成一个 pre_random,然后用公钥加密 pre_random 发送给服务器

4. 客户端此时拥有 client_random、server_radom、pre_random，然后通过伪随机函数和三个参数计算得出最终的 secret

5. 服务器接收到并用私钥得到 pre_randomhou ,通过同样的方式生成 secret

6. 通过对称公钥 secret 进行后面的报文传输

###### 区别

1. 算法区别 RSA 和 ECDHE

2. ECDHE 加密需要参数是 client_params 和 serve_params,RSA 需要的是 client_random 和 serve_random

3. ECDHE 加密收尾前可以提前发送 http 报文

4. RSA 不具有向前安全性，ECDHE 有

#### 什么是向前安全性

简单来说，就是一次破解后不影响历史版本的安全性

如果 RSA 加密中，第三方如果有服务端的私钥，就可以通过解密拿到 pre_random、server_random、client_random 生成 secret,往前的所有报文都可以通过这个方式破解，所以不具备向前安全性。

而 ECDHE 在每次握手的时候都会重新产生一个 client_params 和 server_params,即使破解当前的私钥，也不影响历史的请求报文加密效果。

### HTTPS 没有应用在所有网站里

- 需要购买证书

- 加密通讯会消耗更多的服务器资源

- 部署之类需要更多的配置

- 安全意识问题

## 参考文献

- [x] [ShutdownHTTP 系列-HTTPS 篇(4)(LinDaiDai)](<https://github.com/LinDaiDai/niubility-coding-js/blob/master/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/ShutdownHTTP%E7%B3%BB%E5%88%97-HTTPS%E7%AF%87(4).md>)
