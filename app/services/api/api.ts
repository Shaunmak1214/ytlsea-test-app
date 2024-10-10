/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig, ITransactionCreate } from "./api.types"
import { getGeneralApiProblem } from "./apiProblem"
import generateChecksum from "app/utils/security/checksum"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async login(phoneNumber: string, password: string) {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.apisauce.post("/auth/login", {
        phoneNumber,
        password,
      })
      console.log("login response", response)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) {
          return {
            ...problem,
            message: response.data?.message || "",
          }
        }
      }

      const data = response

      return { kind: "ok", data }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data", error: e.message }
    }
  }

  async checkPhoneNumber(phoneNumber: string) {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.apisauce.post(`users/by-phone-number`, {
        phoneNumber,
      })
      console.log("checkPhoneNumber response", response)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const data = response

      return { kind: "ok", data }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data", error: e.message }
    }
  }

  async getAccount(authToken: string) {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.apisauce.get(
        `accounts/by-user-id`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      console.log("getAccount response", response)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const data = response

      return { kind: "ok", data }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data", error: e.message }
    }
  }

  async getTransactions(authToken: string) {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.apisauce.get(
        `transactions/by-user-id`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )
      console.log("getTransactions response", response)

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const data = response

      return { kind: "ok", data }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data", error: e.message }
    }
  }

  async createTransaction(authToken: string, trxData: ITransactionCreate) {
    try {
      // make the api call
      const response: ApiResponse<any> = await this.apisauce.post(
        `transactions`,
        {
          ...trxData,
          checksum: generateChecksum(trxData),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      )

      // the typical ways to die when calling an api
      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      const data = response

      return { kind: "ok", data }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data", error: e.message }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
