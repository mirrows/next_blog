import { bingQuery } from '@/req/main';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import styled from 'styled-components';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';
SwiperCore.use([Autoplay]);
// Import Swiper styles
import 'swiper/css';

type BingPic = {
  url: string,
  title: string,
  copyright: string,
  copyrightlink: string,
}


const Div = styled.div`
  min-height: 100vh;
  .pic_wrap{
    position: relative;
    .bing_card{
      position: absolute;
      bottom: 20px;
      right: 20px;
      max-width: 300px;
      width: 100%;
      padding: 10px 20px 20px;
      line-height: 1.2;
      background-color: rgba(0,0,0,.65);
      box-sizing: border-box;
      border-radius: 12px;
      color: #fff;
    }
    .copyright{
      color:#fff;
      text-decoration: underline;
    }
  }
  .pic_item{
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    vertical-align: bottom;
  }
  @media (max-width: 450px) {
    .pic_wrap .bing_card{
      bottom: 0;
      right: 0;
      max-width: 100%;
      padding: 5px 10px;
      border-radius: 0;
      text-align: center;
      .copyright{
        font-size: 12px;
      }
    }
  }
`

export default function Home() {
  const [pics, setPics] = useState<BingPic[]>([]);

  useEffect(() => {
    bingQuery().then((res) => {
      if (!res?.data) return;
      setPics(res.data);
    })
  }, [])
  return (
    <>
      <Head>
        <title>welcome to my world</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <main>
        <Div>
          <Swiper
            loop={true}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            effect="slide"
          >
            {pics.map((pic, ind) => (<SwiperSlide key={ind} className="pic_wrap">
              <img src={pic.url} className="pic_item" alt="bing" />
              <div className="bing_card">
                <h3>{pic.title}</h3>
                <a className="copyright" href={pic.copyrightlink} target="_blank">{pic.copyright}</a>
              </div>
            </SwiperSlide>))}
          </Swiper>
        </Div>
      </main>
    </>
  )
}

