export interface DiscordNotifierConfig {
  webhookUrl: string
  message?: string
}

export interface Config {
  interval: number
  urls: string[]
  notifier?: {
    discord?: DiscordNotifierConfig[]
  }
}
