import { Controller, Get, Provide, Inject } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { render } from 'ssr-core-vue3'

@Provide()
@Controller('/')
export class Index {
  @Inject()
  ctx: Context

  @Get('/')
  async handler(): Promise<void> {
    // 渲染降级参考文档 http://doc.ssr-fc.com/docs/features$csr#%E5%A4%84%E7%90%86%20%E6%B5%81%20%E8%BF%94%E5%9B%9E%E5%BD%A2%E5%BC%8F%E7%9A%84%E9%99%8D%E7%BA%A7
    const { ctx } = this
    try {
      const stream = await render(this.ctx, {
        stream: true
      })
      ctx.set("Cross-Origin-Embedder-Policy", "require-corp")
      ctx.set("Cross-Origin-Opener-Policy", "same-origin");
      ctx.body = stream
    } catch (error) {
      console.log('ssr error', error)
      const stream = await render(ctx, {
        stream: true,
        mode: 'csr'
      })
      ctx.body = stream
    }
  }
  @Get('/index/node/:node')
  async handlerNode(): Promise<void> {
    const { ctx } = this
    ctx.redirect('/')
  }
}
