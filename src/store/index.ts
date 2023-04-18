import { defineStore } from 'pinia'

// import axios from 'axios'

export const useAdminInfoStore = defineStore('adminInfo', {
  state: (): AdminInfo => ({
    account: '',
    nickname: '',
    usetime: '',
    route_list: null
  }),
  persist: true,
})

export interface AdminInfo {
  account: string
  nickname: string
  usetime: string
  route_list: Array<number> | null

}
