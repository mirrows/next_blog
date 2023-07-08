import ImgUpload from "@/components/ImgUpload"
import LazyImage from "@/components/LazyImage"
import SVGIcon from "@/components/SVGIcon"
import { queryPicList } from "@/req/demos"
import { RefType } from "@/types/demos"
import Head from "next/head"
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from "react"
import styled from "styled-components"


const DIV = styled.div`
    .list_wrap{
        max-width: 1200px;
        padding: 0 10px 10px;
        margin: 10px auto;
    }
    .timestone{
        width: fit-content;
        padding: 10px 20px;
        background-color: #000;
        font-size: 1.2rem;
        color: #fff;
    }
    .time_fold_wrap{
        margin-bottom: 10px;
    }
    .pics_item_wrap{
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fill, 130px);
        grid-template-rows: repeat(auto-fill, 320px);
        gap: 10px;
        min-width: 200px;
        max-width: 1200px;
        width: 100%;
        margin: 10px 0;
    }
    @media (max-width: 769px) {
        .pics_item_wrap{
            grid-template-columns: repeat(auto-fill, 80px);
            grid-template-rows: repeat(auto-fill, 180px);
            gap: 5px;
            margin: 5px 0;
        }
        .img_item{
            width: 80px;
            height: 180px;
        }
    }
    .no_more_tips{
        font-size: 2rem;
        font-weight: 700;
        font-family: youyuan;
        letter-spacing: 0.1rem;
        color: gray;
    }
`

type Folder = {
  path: string,
  name: string,
}

type Props = {
  list: Folder[],
  path?: string,
  show?: boolean | string,
  [key: string]: any,
}

type Pic = {
  download_url: string,
  cdn_url: string,
  sha: string,
  name: string
}

type PicsMap = {
  [key in Folder['path']]: Pic[]
}


const Piclist = forwardRef(({ list, path = 'mini/', show = true, ...props }: Props, ref: Ref<any>) => {
  const [folders, setFolders] = useState(list)
  const [pics, setPics] = useState<PicsMap>({})
  const page = useRef(0)
  const size = useRef(1)
  const once = useRef(false)
  const [end, setEnd] = useState(false)
  const io = useRef<IntersectionObserver>()
  const footer = useRef<HTMLDivElement | null>(null)
  const queryPics = async (num: number) => {
    const path = folders[num]?.path
    if (!path) return
    const { data } = await queryPicList(path);
    setPics(val => ({
      ...val,
      [path]: data
    }))
    return data
  }
  const queryFolder = async () => {
    const { data } = await queryPicList(path);
    await new Promise(res => {
      setTimeout(async () => {
        setFolders(data)
        res(data)
      })
    })

  }
  const firstTime = async () => {
    page.current += 1
    for (let i = 0; i < size.current; i++) {
      await queryPics(i + size.current * (page.current - 1));
    }
    if (folders.length <= page.current * size.current) {
      setEnd(true)
    }
  }
  useImperativeHandle(ref, () => ({
    afterUpload: async () => {
      await queryFolder();
      queryPics(0);
    },
  }))
  useEffect(() => {
    if (show) {
      footer.current && io.current?.observe(footer.current)
    } else {
      footer.current && io.current?.unobserve(footer.current);
      return
    }
    if (once.current) return
    once.current = true
    firstTime().then(() => {
      io.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (entries[0].intersectionRatio <= 0) return;
        firstTime()
      }, {
        rootMargin: '500px 0px'
      });
      footer.current && io.current?.observe(footer.current)
    });
  }, [show])
  useEffect(() => {
    queryFolder()
    return () => {
      footer.current && io.current?.unobserve(footer.current);
      io.current?.disconnect();
    }
  }, [])
  return (<>
    <DIV {...props}>
      <div className="list_wrap">
        {folders.map((fold, i) => (
          <div key={fold.path} className={`time_fold_wrap${page.current * size.current > i ? '' : ' hide'}`}>
            <div className="timestone">{fold.name}</div>
            <div className="pics_item_wrap">
              {pics[fold.path]?.map(pic => (
                <div key={pic.name} className="pic_item_wrap">
                  <LazyImage className="img_item" src={pic.cdn_url} width="130" height="320" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div ref={footer}>
        {end ? (
          <div className="no_more_tips">真的一点都没有了。。。。。。</div>
        ) : (
          <SVGIcon className="load_more_sign rotate" width="48" type="loading" fill="gray" />
        )}
      </div>
    </DIV>
  </>)
}
)

export default Piclist