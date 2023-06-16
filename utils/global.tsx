import { GblData } from "@/types/global";
import { useRef } from "react";
import { deepClone } from "./common";
import { NormalObj } from "@/types/common";

const gbData: GblData = {
  number: 0,
  str: '666',
  token: '',
  userInfo: {},
  preview: {},
  stayTime: 0,
  bing: [],
  isOwner: false,
  emit: () => {}
}

export const env = {
  messUrl: process.env.NEXT_PUBLIC_MESS_URL,
  user: process.env.NEXT_PUBLIC_GITHUB_USER,
  clientID: process.env.NEXT_PUBLIC_CLIENT_ID,
  loadingGif: process.env.NEXT_PUBLIC_LOADING_GIF,
}

export const stone = {
  data: { ...gbData },
  events: {} as NormalObj<Function[]>,
  get(key: keyof typeof gbData) {
    return deepClone(this.data[key]);
  },
  set(newData: Partial<typeof gbData>) {
    this.data = { ...this.data, ...newData };
  },
  on(name: string, cb: Function) {
    this.events[`event_${name}`] || (this.events[`event_${name}`] = [])
    if(typeof cb === 'function') {
      this.events[`event_${name}`].push(cb)
    }
  },
  async emit(name: string, ...props: any) {
    const events = this.events[`event_${name}`]?.filter((e: Function) => !!e) || []
    if(!events?.length) return
    for(let i = 0; i < events.length; i++) {
      await events[i](...props)
    }
  }
}

if (typeof window !== "undefined") {
  if (localStorage.tmpData) {
    console.log(localStorage.tmpData && JSON.parse(localStorage.tmpData))
    stone.set(JSON.parse(localStorage.tmpData))
    // localStorage.removeItem('tmpData')
  }

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('tmpData', JSON.stringify(stone.data))
    console.log(localStorage.tmpData && JSON.parse(localStorage.tmpData))
  })
}

