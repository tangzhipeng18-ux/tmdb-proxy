export default {
  async fetch(request, env) {
    // CORS 头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    }

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      const url = new URL(request.url)
      let apiPath = url.pathname
      
      // 去掉代理前缀（如果有）
      if (apiPath.startsWith('/proxy')) {
        apiPath = apiPath.replace('/proxy', '')
      }
      
      // 构建 TMDB API URL
      const searchParams = new URLSearchParams(url.searchParams)
      searchParams.set('api_key', env.TMDB_API_KEY || 'your_fallback_api_key')
      
      const apiUrl = `https://api.themoviedb.org/3${apiPath}?${searchParams}`

      // 发送请求到 TMDB
      const response = await fetch(apiUrl, {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })

      // 返回响应并添加 CORS 头
      const modifiedResponse = new Response(response.body, response)
      Object.entries(corsHeaders).forEach(([key, value]) => {
        modifiedResponse.headers.set(key, value)
      })

      return modifiedResponse

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Proxy error', 
        message: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      })
    }
  }
}
