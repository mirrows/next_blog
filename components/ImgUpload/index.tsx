import { ChangeEvent, MouseEvent, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import SVGIcon from "../SVGIcon"

type Props = {
    clickable?: boolean,
    children: JSX.Element | JSX.Element[],
    [key: string]: any,
}

const DIV = styled.div`
    .upload_footer{
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }
    .url_input_wrap{
        position: relative;
        .url_input_wrap{
            margin-right: 10px;
        }
        .url_input{
            flex: 1 1 0;
            width: 100%;
        }
        .enter_icon{
            position: absolute;
            right: 6px;
            top: 0;
            bottom: 0;
            height: 12px;
            width: 12px;
            padding: 4px;
            background-color: #000;
            border-radius: 4px;
            margin: auto;
            fill: #fff;
        }
    }
    .submit_btn{
        margin-left: 10px;
    }
`

export default function ImgUpload({ clickable = true, children, ...props }: Props) {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [files, setFiles] = useState([])
    const [urls, setUrls] = useState([])
    const total = useMemo(() => {
        return [...files, ...urls]
    }, [urls, files])
    const clickHandle = () => {
        if (!clickable) return
        inputRef.current?.click();
    }
    const handlefile = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files)
    }
    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
    }
    return (
        <DIV ref={wrapRef} {...props} onClick={clickHandle}>
            {children}
            <input
                ref={inputRef}
                type="file"
                name=""
                id=""
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlefile}
            />
            <div className="upload_footer" onClick={e => e.stopPropagation()}>
                <div className="url_input_wrap">
                    <input className="normal_input url_input" type="text" />
                    <SVGIcon className="enter_icon" type="enter" />
                </div>
                <button className="normal_btn submit_btn" onClick={handleSubmit}>submit</button>
            </div>
        </DIV>
    )
}