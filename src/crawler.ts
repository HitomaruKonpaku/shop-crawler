/* eslint-disable class-methods-use-this */
import axios from 'axios'
import Bottleneck from 'bottleneck'
import { config } from './config'
import { ShopItem } from './interface/shop.interface'
import { hostLimiter } from './limiter'
import { GeekjackParser } from './parser/geekjack-parser'

export class Crawler {
  private readonly limiter = new Bottleneck({ minTime: 1000 })
  private readonly items: Record<string, ShopItem> = {}

  private hostname: string
  private isInitial = true

  constructor(
    private readonly url: string,
  ) {
    const tmpUrl = new URL(this.url)
    this.hostname = tmpUrl.hostname
  }

  public start() {
    this.queueInfo()
  }

  private async queueInfo() {
    const limiter = this.limiter.chain(hostLimiter.key(this.hostname))
    await limiter.schedule(() => this.getInfo())
    this.isInitial = false
    setTimeout(() => this.queueInfo(), config.interval * 1000)
  }

  private async getInfo() {
    try {
      console.debug(new Date().toISOString(), '-->', this.url)
      const { data: payload } = await axios.get(this.url)
      const items = new GeekjackParser(this.url, payload).parse()
      console.debug(new Date().toISOString(), '<--', this.url, { itemCount: items.length })
      items.forEach((v) => this.handleItem(v))
    } catch (error) {
      console.error(new Date().toISOString(), error.message, { url: this.url, func: 'getInfo' })
      debugger
    }
  }

  private handleItem(item: ShopItem) {
    if (this.items[item.id]) {
      return
    }
    this.items[item.id] = item
    if (this.isInitial) {
      return
    }
    if (!item.isLimited) {
      return
    }
    this.notifyItem(item)
  }

  private async notifyItem(item: ShopItem) {
    if (config.notifier?.discord?.length) {
      await Promise.allSettled(config.notifier.discord.map(async (v) => {
        const payload = { content: [v.message, item.url].join('\n') }
        await axios.post(v.webhookUrl, payload)
      }))
    }
  }
}
