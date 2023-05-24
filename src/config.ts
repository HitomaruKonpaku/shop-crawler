import { readFileSync } from 'fs'
import yaml from 'js-yaml'
import { Config } from './interface/config.interface'

const defaultConfig: Config = {
  interval: 1,
  urls: [],
  notifier: {},
}

const externalConfig = yaml.load(readFileSync('config.yaml', 'utf-8'))

export const config: Config = Object.assign(defaultConfig, externalConfig)

console.debug(JSON.stringify({
  interval: config.interval,
  urls: config.urls,
}, null, 2))
