import { AnyNode } from 'cheerio'
import { ShopItem } from '../interface/shop.interface'

export abstract class BaseParser {
  constructor(
    protected readonly url: string,
    protected readonly html: string,
  ) { }

  public parse(): ShopItem[] {
    const items = this.getListNodes()
      .map((v) => this.parseOne(v))
      .filter((v) => v)
    return items
  }

  protected abstract getListNodes(): AnyNode[]

  protected abstract parseId(node: AnyNode): string

  protected abstract parseUrl(node: AnyNode): string

  protected abstract parseTitle(node: AnyNode): string

  protected abstract parsePrice(node: AnyNode): string

  protected abstract parseIsLimited(node: AnyNode): boolean

  protected parseOne(node: AnyNode): ShopItem {
    try {
      const item: ShopItem = {
        id: this.parseId(node),
        url: this.parseUrl(node),
        title: this.parseTitle(node),
        price: this.parsePrice(node),
        isLimited: this.parseIsLimited(node),
      }
      return item
    } catch (error) {
      return null
    }
  }
}
