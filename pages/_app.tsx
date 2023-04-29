import NavHeader from '@/components/Nav'
import { statisticVisitor, visitorsData } from '@/req/main'
import createEffect from '@/utils/fire_canvas'
// import createEffect from '@/utils/fire_canvas'
import { stone } from '@/utils/global'
import type { AppProps } from 'next/app'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import '../public/common.css'

const DIV = styled.div`
  overflow: hidden;
  .fire_wrap{
    position: fixed;
    width: 100%;
    height: 100%;
    vertical-align: bottom;
    z-index: -1;
  }
`

export default function App({ Component, pageProps }: AppProps) {
  const statistics = () => {
    // if (process.env.NODE_ENV !== 'production') return
    visitorsData()
  }
  const stayTime = useRef(0)
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const canvasObj = useRef<{ ruin: () => void; }>()
  const visitorStatistic = () => {
    statisticVisitor(stayTime.current)
    stayTime.current = 0
  }
  const reset = () => {
    if (!canvas.current) return;
    canvasObj.current?.ruin()
    canvasObj.current = createEffect(canvas.current)
  }
  useEffect(() => {
    if (canvas.current) {
      // createFire(canvas.current)
      canvasObj.current = createEffect(canvas.current)
    }
    statistics()
    const timer = setInterval(() => {
      stayTime.current = stayTime.current + 1
      stone.set({ stayTime: stayTime.current })
    }, 1000)
    window.addEventListener('beforeunload', visitorStatistic)
    // window.addEventListener('resize', reset)
    return () => {
      clearInterval(timer)
      window.removeEventListener('beforeunload', visitorStatistic)
      // window.removeEventListener('resize', reset)
      canvasObj.current?.ruin()
    }
  }, [])
  return (
    <>
      <NavHeader />
      <Component {...pageProps} />
      <DIV>
        <canvas className='fire_wrap' ref={canvas}></canvas>
      </DIV>
    </>
  )
}
