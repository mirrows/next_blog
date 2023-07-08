import ImgUpload from "@/components/ImgUpload"
import SVGIcon from "@/components/SVGIcon"
import { queryPicList } from "@/req/demos"
import { RefType } from "@/types/demos"
import { stone } from "@/utils/global"
import Head from "next/head"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import UploadPicList from "./components/PicList"


const DIV = styled.div`
    padding: 80px 0;
    margin: 0 auto;
    background-image: url('https://empty.t-n.top/pub_lic/2023_07_08/pic1688805979076243.jpg');
    text-align: center;
    .uploader_wrap{
        width: 60%;
        min-width: 200px;
        max-width: 900px;
        padding: 10px;
        margin: auto;
        border: 2px dashed gray;
        border-radius: 6px;
        background-image: url(https://empty.t-n.top/pub_lic/2023_07_08/pic1688805979076243.jpg);
        box-shadow: 0 0 5px #999;
        cursor: pointer;
    }
    .tips{
        font-size: 0.8em;
        color: gray;
    }
    @media (max-width: 769px) {
        .uploader_wrap{
            width: 90%;
        }
    }
    .switch_wrap{
        margin: 10px;
    }
    .switch_btn{
        padding: 4px 20px;
        background-color: #fff;
        border: 1px solid #000;
        font-size: 1rem;
        color: #000;
    }
    .switch_btn.active{
        background-color: #000;
        color: #fff;
    }
    .switch_btn:hover{
        box-shadow: none;
    }
`

type Folder = {
    path: string,
    name: string,
}

type Props = {
    list: Folder[]
}


export default function ImgSource({ list }: Props) {
    const [personal, setPersonal] = useState(false)
    const [isOwner, setOwner] = useState(false)
    const commonRef = useRef<RefType>(null)
    const privateRef = useRef<RefType>(null)
    const curPersonal = useRef(false)
    const afterUpload = async () => {
        // await queryFolder();
        // queryPics(0);
        if (curPersonal.current) {
            privateRef.current?.afterUpload()
        } else {
            commonRef.current?.afterUpload()
        }
    }
    const onStartUpload = () => {
        curPersonal.current = personal
    }
    useEffect(() => {
        stone.isGithubOwner((isowner) => setOwner(isowner))
    }, [])
    return (<>
        <Head>
            <title>延迟图床</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
            <DIV className="bg_wrap">
                <ImgUpload
                    className="uploader_wrap"
                    personal={personal}
                    onFinish={afterUpload}
                    onStartUpload={onStartUpload}
                >
                    <div>
                        <SVGIcon width="32" style={{ fill: 'gray' }} type="plus_no_outline" />
                    </div>
                </ImgUpload>
                {isOwner && <div className="switch_wrap">
                    <button className={`switch_btn${personal ? '' : ' active'}`} onClick={() => setPersonal(false)}>COMMON</button>
                    <button className={`switch_btn${personal ? ' active' : ''}`} onClick={() => setPersonal(true)}>PRIVATE</button>
                </div>}
                <UploadPicList ref={commonRef} list={list} path="mini/" show={!personal} className={personal ? 'hide' : ''} />
                {isOwner && <UploadPicList ref={privateRef} list={[]} path="personal/mini/" show={!!personal} className={personal ? '' : 'hide'} />}
            </DIV>
        </main>
    </>)
}

export const getStaticProps = async (context: any) => {
    const props: Partial<Props> = {}
    const list = await queryPicList('mini/');
    if (list?.data) {
        const data = list.data
        props.list = data
    }
    return { props }
}
