import { config } from './config'
import { Crawler } from './crawler'

async function bootstrap() {
  const { urls } = config

  urls.forEach((url) => {
    const crawler = new Crawler(url)
    crawler.start()
  })
}

bootstrap()
