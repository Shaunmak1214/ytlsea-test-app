import { Api } from "app/services/api"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import * as SecureStore from "expo-secure-store"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    phoneNumber: "",
    authToken: types.maybe(types.string),
    isAuthenticated: types.maybe(types.boolean),
    refreshToken: types.maybe(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
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
        await this.setIsAuthenticated(true)
      } else {
        await this.setIsAuthenticated(false)
        await this.setAuthToken("")
        await this.setRefreshToken("")
      }
    },
    async login(phoneNumber: string, password: string) {
      const api = new Api()
      const result = await api.login(phoneNumber, password)
      console.log(result)
      if (result.kind === "ok") {
        const data = result.data.data
        this.setAuthToken(data.tokens.access.token)
        this.setRefreshToken(data.tokens.refresh.token)
        this.setIsAuthenticated(true)
        return result
      } else {
        return result
      }
    },
    async getAuthToken() {
      let token = store.authToken
      if (token === "") {
        token = await SecureStore.getItemAsync("authToken")
        store.authToken = token
        store.isAuthenticated = token !== ""
      }
      return token
    },
    async setAuthToken(authToken: string) {
      store.authToken = authToken
      await SecureStore.setItemAsync("authToken", authToken)
    },
    async setRefreshToken(refreshToken: string) {
      store.refreshToken = refreshToken
      await SecureStore.setItemAsync("refreshToken", refreshToken)
    },
    async setIsAuthenticated(isAuthenticated: boolean) {
      store.isAuthenticated = isAuthenticated
    },
    async logout() {
      store.authToken = ""
      store.refreshToken = ""
      store.isAuthenticated = false
      await SecureStore.deleteItemAsync("authToken")
      await SecureStore.deleteItemAsync("refreshToken")
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
