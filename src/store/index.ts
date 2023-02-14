import { defineStore } from 'pinia'

// import axios from 'axios'

export const useAdminInfoStore = defineStore('adminInfo', {
  state: (): AdminInfo => ({
    account: '',
    nickname: '',
    usetime: '',
  }),
  persist: true,
})
export interface AdminInfo {
  account: string
  nickname: string
  usetime: string
}
