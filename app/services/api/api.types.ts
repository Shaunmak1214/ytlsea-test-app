/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface EpisodeItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure: {
    link: string
    type: string
    length: number
    duration: number
    rating: { scheme: string; value: string }
  }
  categories: string[]
}

export interface ApiFeedResponse {
  status: string
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  }
  items: EpisodeItem[]
}

export interface IAccount {
  accountName: string
  accountNumber: string
  accountType: string
  currency: string
  balance: number
  isActive: boolean
  token: string
  provider: string
  preferred: string
  authorizedAmount: number
  user: string
}

export interface ITransaction {
  account: string
  amount: number
  transactionId: string
  transactionType: string // "reload" or "transfer"
  status: string // "pending", "success", "cancelled" or "failed"
  errorCode?: string
  errorMessage?: string
  tokenId: string
  to?: string // phone number
  createdAt: string
}

export interface ITransactionCreate {
  account: string
  description: string
  amount: number
  transactionType: string
  tokenId: string
}

/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
