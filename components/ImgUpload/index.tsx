import { uploadBase64, uploadUrl } from "@/req/demos"
import { Format } from "@/utils/common"
import { file2Base64, fileCompressor } from "@/utils/imgTool"
import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react"
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
        align-items: stretch;
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
            height: 100%;
            min-height: 28px;
            padding-right: 36px;
            box-sizing: border-box;
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
    .file_wrap{
        display: flex;
        align-items: flex-end;
        justify-content: center;
        flex: 1;
        padding: 0 8px;
        border: 3px dashed gray;
        margin: 0 10px;
        border-radius: 4px;
        white-space: nowrap;
        font-size: 1rem;
        color: gray;
    }
    .tmp_item{
        width: 40px;
        height: 96px;
        object-fit: cover;
        margin: 5px;
    }
    .tmp_wrap{
        max-height: 215px;
    }
`

export default function ImgUpload({ clickable = true, children, ...props }: Props) {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [files, setFiles] = useState<File[]>([])
    const [urls, setUrls] = useState<string[]>([])
    const [urlInput, setUrlInput] = useState('')
    const win = useRef(typeof window !== "undefined" ? window?.URL || window?.webkitURL : undefined)
    const total = useMemo(() => {
        return [
            ...files.map(e => ({
                type: 'file',
                src: win.current?.createObjectURL(e) || '',
            })),
            ...urls.map(e => ({
                type: 'url',
                src: e,
            }))]
    }, [urls, files])
    const clickHandle = () => {
        if (!clickable) return
        inputRef.current?.click();
    }
    const handlefile = (e: ChangeEvent<HTMLInputElement>) => {
        const oldVal = [...total]
        setTimeout(() => {
            oldVal.forEach(p => {
                if (p.type === 'file') {
                    win.current?.revokeObjectURL(p.src)
                }
            })
        })
        // win.current?
        e.target.files?.length && setFiles([...Array.from(e.target.files)])
    }
    const uploadFile = async (file: File, options: any, path: string) => {
        console.log(file.type)
        const blob = file.type.match('gif') && !path.match('mini') ? file : await fileCompressor(file, options)
        const base64 = await file2Base64(blob);
        const result = await uploadBase64({ content: base64.split(',')[1], path })
        return result
    }
    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        for (let i = 0; i < files.length; i++) {
            const name = 'pic' + Date.now() + String(Math.random()).slice(4, 7) + '.' + files[i].name.split('.').reverse()[0]
            const path = `${Format(new Date(), 'YYYY_MM_DD')}/${name}`
            await uploadFile(files[i], { quality: 0.1 }, `mini/${path}`)
            await uploadFile(files[i], { quality: 1024 * 1024 * 2 > files[i].size ? 1024 * 1024 * 2 / files[i].size : 0.8 }, `normal/${path}`)
        }
        for (let i = 0; i < urls.length; i++) {
            await uploadUrl({ url: urls[i], path: `mini/${Format(new Date(), 'YYYY_MM_DD')}` })
            await uploadUrl({ url: urls[i], path: `normal/${Format(new Date(), 'YYYY_MM_DD')}` })
        }
        setFiles([])
        setUrls([])
    }
    const inputUrl = () => {
        setUrls(urls => Array.from(new Set([...urls, urlInput])))
        setUrlInput('')
    }
    const handlekeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        inputUrl()
    }
    useEffect(() => {
        console.log(total)
    }, [total])
    return (
        <DIV ref={wrapRef} {...props} onClick={clickHandle}>
            {!!total.length || children}
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
            <div className="scroll_er tmp_wrap" onClick={e => e.stopPropagation()}>
                {total.map(e => (
                    <img key={e.src?.slice(30, 50)} className="tmp_item" width="40" height="96" src={e.src} alt="" />
                ))}
            </div>
            <div className="upload_footer">
                <div className="url_input_wrap" onClick={e => e.stopPropagation()}>
                    <input
                        className="normal_input url_input"
                        type="text"
                        value={urlInput}
                        onInput={e => setUrlInput(e.currentTarget.value)}
                        onKeyUp={handlekeyUp}
                    />
                    <SVGIcon className="enter_icon" type="enter" onClick={inputUrl} />
                </div>
                {!!total.length && <div className="file_wrap">
                    <span>total: {total.length}</span>
                </div>}
                {!!total.length && <button className="normal_btn submit_btn" onClick={handleSubmit}>submit</button>}
            </div>
        </DIV>
    )
}