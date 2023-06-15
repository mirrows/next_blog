import NavHeader from '@/components/Nav'
import { statisticVisitor, visitorsData } from '@/req/main'
import { stone } from '@/utils/global'
import type { AppProps } from 'next/app'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import '../public/common.css';
import { marked } from 'marked'
import { mangle } from "marked-mangle";
import LazyImage from '@/components/LazyImage'
import { useRouter } from 'next/router'
import { useLazyImgs } from '@/utils/imgTool'
marked.use(mangle())

const Div = styled.div`
  .hidden{
    display: none;
  }
  .disappear{
    opacity: 0;
    z-index: -9;
  }
`

export default function App({ Component, pageProps }: AppProps) {
  const statistics = () => {
    // if (process.env.NODE_ENV !== 'production') return
    visitorsData()
  }
  const stayTime = useRef(0)
  const visitorStatistic = () => {
    statisticVisitor(stayTime.current)
    stayTime.current = 0
  }
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const loadingStart = () => {
    setLoading(true)
  }
  const loadingEnd = () => {
    setLoading(false)
  }
  useEffect(() => {
    if(!stayTime.current) {
      statistics()
    }
    const timer = setInterval(() => {
      stayTime.current = stayTime.current + 1
      stone.set({ stayTime: stayTime.current })
    }, 1000)
    router.events.on('routeChangeStart', loadingStart)
    router.events.on('routeChangeComplete', loadingEnd)
    return () => {
      clearInterval(timer)
    }
  }, [])
  const { emit } = useLazyImgs()
  stone.set({ emit })
  return (
    <>
      <NavHeader />
      {/* <Suspense fallback={
        <Div>
          <div className="ps_mask">
            <div className="loading_wrap">
              <img src="https://empty.t-n.top/pub_lic/2023_04_29/pic1682756884211870.gif" alt="loading img" />
            </div>
          </div>
        </Div>
      }>
        <Component {...pageProps} />
      </Suspense> */}
      <Component {...pageProps} />
      <Div>
        <div className={`ps_mask${loading ? '' : ' disappear'}`}>
          <div className="loading_wrap">
            <LazyImage src="https://empty.t-n.top/pub_lic/2023_04_29/pic1682756884211870.gif" alt="loading img" />
          </div>
        </div>
      </Div>
    </>
  )
}
