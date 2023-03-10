import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'


export default function Home() {
  const [secret, setSecret] = useState('');
  const [github, setGithub] = useState('');
  const router = useRouter();
  const parseObj2queryStr = (obj: { [key: string]: any }) => {
    const data = Object.keys(obj).map(key => `${key}=${String(obj[key])}`).join('&')
    return data ? `?${data}` : ''
  }
  const parsequeryStr2Obj = (str: string) => {
    const obj: { [key: string]: string } = {}
    const data = str.split('?')[1]?.split('&').forEach((item) => {
      const [key, value] = item.split('=')
      obj[key] = value
    })
    return obj
  }

  const login = () => {
    console.log(process.env.NEXT_PUBLIC_SECRET, process.env.NEXT_PUBLIC_CLIENT_ID, location.origin)
    const par = {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      // redirect_uri: location.origin,
      scope: 'repo',
    }
    // console.log(parseObj2queryStr(par));
    location.href = `https://github.com/login/oauth/authorize${parseObj2queryStr(par)}`
    // setGithub(`https://github.com/login/oauth/authorize${parseObj2queryStr(par)}`)
  }

  const queryToken = (code: any) => {
    const par = {
      url: 'https://github.com/login/oauth/access_token',
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
      },
      data: {
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_SECRET,
        code,
      }
    }
    fetch('https://mess.t-n.top/mess/', {
      // fetch('/github/login/oauth/access_token', {
      method: 'POST',
      body: JSON.stringify(par),
    }).then(res => res.json()).then(data => {
      console.log(data)
      data.access_token && sessionStorage.setItem('token', data.access_token);
      queryCurUser();
      router.push('/');
    })
  }
  const queryCurUser = () => {
    const par = {
      url: 'https://api.github.com/user',
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${sessionStorage.token}`,
      },
    }
    fetch('https://mess.t-n.top/mess/', {
      method: 'POST',
      body: JSON.stringify(par),
    }).then(res => res.json()).then(data => {
      console.log(data)
      data.login && sessionStorage.setItem('userInfo', JSON.stringify(data));
    })
  }

  useEffect(() => {
    const query = parsequeryStr2Obj(router.asPath)
    if (query.code) {
      console.log(query.code);
      queryToken(query.code);
      // router.push('/');
    } else {
      if (!sessionStorage.token) return;
      queryCurUser();

    }
  }, [])
  return (
    <>
      <Head>
        <title>welcome to my world 666</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <main>
        <img src="/github.svg" style={{ width: '32px' }} alt='github' onClick={login} />
        <div>
          <Link href="/about">关于我们</Link>
        </div>
      </main>
    </>
  )
}

