/* eslint-disable class-methods-use-this */
import { AnyNode, load } from 'cheerio'
import { CryptoUtil } from '../util/crypto.util'
import { BaseParser } from './_base-parser'

/**
 * @link https://shop.geekjack.net/
 */
export class GeekjackParser extends BaseParser {
  protected getListNodes(): AnyNode[] {
    const $ = load(this.html)
    const value = $('.ProductList .ProductItem').toArray()
    return value
  }

  protected parseId(node: AnyNode): string {
    const url = this.parseUrl(node)
    const value = CryptoUtil.toSHA1(url)
    return value
  }

  protected parseUrl(node: AnyNode): string {
    const $ = load(node)
    const href = $('a').attr('href')
    const value = new URL(this.url).origin + href
    return value
  }

  protected parseTitle(node: AnyNode): string {
    const $ = load(node)
    const value = $('.ProductItem__Title').text().trim()
    return value
  }

  protected parsePrice(node: AnyNode): string {
    const $ = load(node)
    const value = $('.ProductItem__PriceList').text().trim()
    return value
  }

  protected parseIsLimited(node: AnyNode): boolean {
    const title = this.parseTitle(node)
    const regexps = [
      /Limited Edition/gi,
      /Limited Quantity/gi,
    ]
    const value = regexps.some((v) => v.test(title))
    return value
  }
}
