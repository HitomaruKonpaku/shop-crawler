import Bottleneck from 'bottleneck'

export const hostLimiter = new Bottleneck.Group({ maxConcurrent: 5 })
