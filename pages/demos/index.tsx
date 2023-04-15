import createEffect from '@/utils/fire_canvas'
import { stone } from '@/utils/global'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import FireCanvas from './components/fireCanvas'


const DIV = styled.div`
  overflow: hidden;
`

export default function Demos() {
  return (
    <>
      <Head>
        <title>Demos</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DIV>
          <FireCanvas />
        </DIV>
      </main>
    </>
  )
}
