import { queryGithubToken, queryUser } from "@/req/main"
import { UserInfo } from "@/types/github"
import { parseObj2queryStr, parsequeryStr2Obj } from "@/utils/common"
import { stone } from "@/utils/global"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"


const Div = styled.div`
.nav{
  display: flex;
  justify-content:space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 30;
  box-shadow: inset 0 60px 20px -30px #fff;
  .expand_icon{
    display:none;
  }
  .nav_list{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 420px;
    padding: 5px 20px;
    font-weight: bold;
    .nav_item{
      display: block;
      text-decoration: underline;
      color: #000;
      .nav_icon{
        width: 32px;
        border-radius: 50%;
      }
    }
    .item_right{
      justify-content: flex-end;
      text-align: right;
      span{
        display: none;
      }
    }
  }
}

@media (max-width: 769px) {
  .nav{
    .nav_list{
      display: none;
      .item_right span{
        display: inline;
      }
    }
    .expand_icon{
      display: block;
    }
    .right_nav_wrap:hover .nav_list{
      display: block;
      position: absolute;
      right: 0;
      top: 50px;
      width: 180px;
      padding: 10px 0;
      background-color: rgba(0,0,0,.5);
      .nav_item{
        display: flex;
        align-items: center;
        padding: 5px 10px;
        color: #fff;
        fill: #fff;
        text-decoration: none;
        .nav_icon{
          margin: 0 10px;
        }
      }
    }
  }
}
`

const NavHeader = () => {
  const [user, setUser] = useState<UserInfo>()
  const router = useRouter();

  const login = () => {
    const par = {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      scope: 'repo',
    }
    location.href = `https://github.com/login/oauth/authorize${parseObj2queryStr(par)}`
  }

  const queryToken = (code: any) => {
    queryGithubToken({ code }).then(res => {
      if (!res.access_token) return;
      stone.set({ token: res.access_token })
      queryCurUser();
      router.push('/');
    })
  }
  const queryCurUser = () => {
    queryUser().then(data => {
      stone.set({ userInfo: data })
      setUser(data)
    })
  }

  useEffect(() => {
    const query = parsequeryStr2Obj(router.asPath)
    if (query.code) {
      queryToken(query.code);
    } else {
      if (!stone.data.token) return;
      queryCurUser();
    }
  }, [])

  return (
    <Div>
      <div className='nav'>
        <Link href="/">
          <img style={{ height: '45px', padding: '5px 20px' }} src="/name.png" alt="" />
        </Link>
        <div className="right_nav_wrap">
          <img src="/list.svg" className='expand_icon' style={{ width: '32px', padding: '5px 10px' }} alt='list' />
          <div className='nav_list'>
            <Link className="nav_item" href="/">
              <svg viewBox="0 0 1024 1024" className="nav_icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1024 590.432 512 193.024 0 590.432 0 428.416 512 30.976 1024 428.416ZM896 576 896 960 640 960 640 704 384 704 384 960 128 960 128 576 512 288Z"></path></svg>
              <span>Home</span>
            </Link>
            <Link className="nav_item" href="/demos">
              <svg viewBox="0 0 1024 1024" className="nav_icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M64 224h896v512H64V224z m532.496 640h309.35c65.38 0 118.154-54.164 118.154-121.264V217.264C1024 150.164 971.224 96 905.846 96H546V32h-68v64H118.154C52.774 96 0 150.164 0 217.264v525.472C0 809.836 52.776 864 118.154 864h311.6l-190.826 88.984 28.738 61.628L478 916.532V992h68v-76.516l210.704 98.252 28.738-61.63L596.496 864z"></path></svg>
              <span>Demos</span>
            </Link>
            <Link className="nav_item" href="/about">
              <svg viewBox="0 0 1024 1024" className="nav_icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M947.2 415.530667h-302.506667c-24.192-2.901333-42.624-24.192-42.624-49.28v-317.44A48.768 48.768 0 0 0 553.301333 0h-105.856c-27.093333 0-48.853333 21.973333-48.853333 48.853333v320.768c-1.322667 24.192-21.290667 43.690667-45.269333 45.909334H274.090667A49.450667 49.450667 0 0 1 231.253333 369.578667V48.853333C231.253333 21.76 209.28 0 182.442667 0H76.544C49.493333 0 27.733333 21.973333 27.733333 48.853333v926.293334C27.733333 1002.24 49.706667 1024 76.544 1024h870.869333c27.093333 0 48.810667-21.973333 48.810667-48.853333V464.384A48.981333 48.981333 0 0 0 947.2 415.530667z m-139.349333 350.293333c0 27.093333-21.973333 48.853333-48.810667 48.853333h-105.856a48.810667 48.810667 0 0 1-48.810667-48.853333v-99.882667c0-27.093333 21.973333-48.853333 48.810667-48.853333h105.856c27.093333 0 48.810667 21.973333 48.810667 48.853333v99.882667z"></path></svg>
              <span>About me</span>
            </Link>
            {user ? (<a className="nav_item item_right" href={user.html_url} target="_blank">
              <span>{user.login}</span>
              <img src={user.avatar_url} className="nav_icon" alt="" />
            </a>)
              : (<div className="nav_item item_right" onClick={login}>
                <span>Login</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="nav_icon" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>
              </div>)}
          </div>
        </div>

      </div>
    </Div>
  )
}

export default NavHeader