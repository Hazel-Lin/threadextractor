import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, Lock, Server, UserCheck, AlertTriangle } from "lucide-react"

export function PrivacySection() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            隐私政策
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            我们重视您的隐私，承诺保护您的个人信息安全
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            最后更新时间：2024年7月17日
          </p>
        </div>

        {/* Privacy Commitment */}
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-base text-green-800 dark:text-green-300">
            <strong>隐私承诺：</strong>Thread Extractor 采用完全客户端处理方式，
            不收集、存储或传输您的个人信息。所有操作都在您的浏览器本地完成。
          </AlertDescription>
        </Alert>

        {/* Information We Don't Collect */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Eye className="h-6 w-6 text-green-500" />
              我们不收集的信息
            </CardTitle>
            <CardDescription className="text-lg">
              以下信息我们绝不收集或存储
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">个人身份信息</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    姓名、邮箱地址
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    电话号码
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    家庭住址
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    身份证号码
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">使用数据</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    您输入的 Threads 链接
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    提取的视频内容
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    下载历史记录
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    使用频率统计
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">设备信息</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    设备唯一标识符
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    操作系统详细信息
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    浏览器指纹
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    地理位置信息
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">账户信息</h4>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    用户账户（无需注册）
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    登录凭据
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    社交媒体账户
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    支付信息
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-6 w-6 text-blue-500" />
              客户端处理原理
            </CardTitle>
            <CardDescription className="text-lg">
              了解我们如何保护您的隐私
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
                    本地处理
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    所有的链接解析和视频提取操作都在您的浏览器中完成，不经过我们的服务器。
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
                    代理请求
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    为了绕过浏览器的跨域限制，我们使用第三方代理服务（allorigins.win），
                    但不会记录或存储任何请求内容。
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
                    即时清理
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    页面刷新或关闭后，所有临时数据都会被自动清除，不留任何痕迹。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third Party Services */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Server className="h-6 w-6 text-orange-500" />
              第三方服务
            </CardTitle>
            <CardDescription className="text-lg">
              我们使用的外部服务及其隐私政策
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-lg">
                  AllOrigins 代理服务
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  用于解决浏览器跨域访问限制，获取 Threads 页面内容。
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    服务提供商：AllOrigins (allorigins.win)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    数据传输：仅传输 URL 地址
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    数据存储：不存储任何用户数据
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    隐私政策：遵循其服务条款
                  </li>
                </ul>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-lg">
                  CDN 和静态资源
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  用于加载网站资源和提升访问速度。
                </p>
                <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    服务提供商：Vercel, Cloudflare
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    数据收集：基本访问日志（IP、时间戳）
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    数据用途：性能优化和安全防护
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    保留期限：通常 30 天内自动删除
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserCheck className="h-6 w-6 text-purple-500" />
              您的权利
            </CardTitle>
            <CardDescription className="text-lg">
              作为用户，您享有以下权利
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">完全匿名</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  无需注册或提供任何个人信息即可使用所有功能。
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">随时停止</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  您可以随时停止使用我们的服务，无需任何操作。
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">数据透明</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  我们的代码开源，您可以审查我们如何处理数据。
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">问题反馈</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  对隐私政策有疑问可随时联系我们。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Alert variant="destructive" className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-300">
            <strong>重要提醒：</strong>
            虽然我们不收集您的数据，但请注意您下载的内容可能受版权保护。
            请确保您有权下载和使用这些内容，并遵守相关法律法规。
          </AlertDescription>
        </Alert>

        {/* Contact */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-indigo-200 dark:border-gray-600">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">联系我们</CardTitle>
            <CardDescription className="text-lg">
              如果您对隐私政策有任何疑问
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-3 max-w-md mx-auto">
              <p className="text-gray-600 dark:text-gray-400">
                <strong>邮箱：</strong> privacy@threadextractor.com
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>GitHub：</strong> github.com/threadextractor/threadextractor
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                我们承诺在收到您的隐私相关询问后 48 小时内回复。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}