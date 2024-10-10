import { Api } from "app/services/api"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import * as SecureStore from "expo-secure-store"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    phoneNumber: "",
    authToken: types.maybe(types.string),
    refreshToken: types.maybe(types.string),
    accountNumber: "",
    tokenId: "",
    fullName: "",
    basicRoleLocalAuthenticated: false,
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken // Automatically checks if authToken is present
    },
    get validationError() {
      if (store.phoneNumber.length === 0) return "can't be blank"
      if (store.phoneNumber.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.phoneNumber))
        return "must be a valid email address"
      return ""
    },
  }))
  .actions((store) => ({
    async constructor() {
      const authtoken = await SecureStore.getItemAsync("authToken")
      const refreshtoken = await SecureStore.getItemAsync("refreshToken")
      if (authtoken !== null) {
        await this.setAuthToken(authtoken)
        await this.setRefreshToken(refreshtoken)
      } else {
        await this.setAuthToken("")
        await this.setRefreshToken("")
      }
    },
    async login(password: string) {
      const api = new Api()
      const result = await api.login(store.phoneNumber, password)
      if (result.kind === "ok") {
        const data = result.data.data
        this.setAuthToken(data.tokens.access.token)
        this.setRefreshToken(data.tokens.refresh.token)
        this.setFullName(data.user.name)
        return result
      } else {
        return result
      }
    },
    async checkPhoneNumber(phoneNumber: string) {
      const api = new Api()
      const result = await api.checkPhoneNumber(phoneNumber)
      if (result.kind === "ok") {
        this.setPhoneNumber(phoneNumber)
        return result
      } else {
        return result
      }
    },
    async setPhoneNumber(phoneNumber: string) {
      store.phoneNumber = phoneNumber
    },
    async setAccountNumber(accountNumber: string) {
      store.accountNumber = accountNumber
    },
    async setTokenId(tokenId: string) {
      store.tokenId = tokenId
    },
    async setAuthToken(authToken: string) {
      store.authToken = authToken
      await SecureStore.setItemAsync("authToken", authToken)
    },
    async setRefreshToken(refreshToken: string) {
      store.refreshToken = refreshToken
      await SecureStore.setItemAsync("refreshToken", refreshToken)
    },
    async setFullName(fullName: string) {
      store.fullName = fullName
    },
    async setBasicRoleLocalAuthenticated(authenticated: boolean) {
      store.basicRoleLocalAuthenticated = authenticated
    },
    async setBalance(balance: number) {
      await SecureStore.setItemAsync("balance", balance.toString())
    },
    async getBalance() {
      return await SecureStore.getItemAsync("balance")
    },
    async logout() {
      this.setAuthToken("")
      this.setRefreshToken("")
      this.setFullName("")
      this.setAccountNumber("")
      this.setBasicRoleLocalAuthenticated(false)
      this.setBalance(0)
      await SecureStore.deleteItemAsync("authToken")
      await SecureStore.deleteItemAsync("refreshToken")
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
