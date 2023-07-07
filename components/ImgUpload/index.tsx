import { uploadBase64, uploadUrl } from "@/req/demos"
import { Format } from "@/utils/common"
import { file2Base64, fileCompressor } from "@/utils/imgTool"
import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import SVGIcon from "../SVGIcon"

type Props = {
    clickable?: boolean,
    children: JSX.Element | JSX.Element[],
    personal?: boolean,
    [key: string]: any,
}

type UploadType = {
    uploadStatus: 'WAIT' | 'SUCCESS' | 'ERROR' | 'LOADING',
}

const DIV = styled.div`
    .upload_footer{
        /* display: flex;
        justify-content: space-between;
        align-items: center; */
        min-height: 24px;
        margin-top: 10px;
        text-align: left;
    }
    .url_input_wrap{
        display: inline-block;
        position: relative;
        vertical-align: middle;
        .url_input_wrap{
            margin-right: 10px;
        }
        .url_input{
            flex: 1 1 0;
            width: 100%;
            height: 100%;
            padding-right: 36px;
            box-sizing: border-box;
            font-size: 1rem;
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
        display: inline-block;
        /* display: flex;
        align-items: flex-end;
        justify-content: center;
        flex: 1; */
        padding: 0 8px;
        margin: 0 10px;
        white-space: nowrap;
        font-size: 1rem;
        color: gray;
    }
    .tmp_wrap{
        display: flex;
        max-height: 215px;
    }
    .tmp_item_wrap{
        position: relative;
    }
    .tmp_item{
        width: 40px;
        height: 96px;
        object-fit: cover;
        margin: 5px;
    }
    .tmp_del_btn{
        position: absolute;
        right: 0;
        top: 0;
        width: 15px;
        padding: 0 0 5px 5px;
        border-radius: 0 0 0 20px;
        fill: #fff;
        background-color: #000;
    }
    .tmp_status_btn{
        position: absolute;
        left: 5px;
        bottom: 5px;
        width: 20px;
    }
    .submit_btn{
        float: right;
    }
`

export default function ImgUpload({ clickable = true, children, personal = false, onFinish = () => { }, ...props }: Props) {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [files, setFiles] = useState<File[]>([])
    const [urls, setUrls] = useState<string[]>([])
    const [urlInput, setUrlInput] = useState('')
    const [show, setShow] = useState(false)
    const win = useRef(typeof window !== "undefined" ? window?.URL || window?.webkitURL : undefined)
    const total = useMemo(() => {
        return [
            ...files.map(e => {
                const src = win.current?.createObjectURL(e) || ''
                return {
                    id: src.slice(30, 50),
                    type: 'file',
                    src,
                }
            }),
            ...urls.map(e => ({
                id: e.slice(30, 50),
                type: 'url',
                src: e,
            }))]
    }, [urls, files])
    const [uploadStatusMap, setUploadStatusMap] = useState<{ [key: string]: UploadType['uploadStatus'] }>({})
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
        const blob = file.type.match('gif') && !path.match('mini') ? file : await fileCompressor(file, options)
        const base64 = await file2Base64(blob);
        const result = await uploadBase64({ content: base64.split(',')[1], path })
        return result
    }
    const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const newMap = { ...uploadStatusMap };
        for (let i = 0; i < files.length; i++) {
            const name = 'pic' + Date.now() + String(Math.random()).slice(4, 7) + '.' + files[i].name.split('.').reverse()[0]
            const path = `${Format(new Date(), 'YYYY_MM_DD')}/${name}`
            let status: UploadType['uploadStatus'] = 'LOADING';
            newMap[total[i].id] = status
            setUploadStatusMap({ ...newMap })
            const mini = await uploadFile(files[i], { quality: 0.1, mimeType: 'image/jpeg' }, `${personal ? 'personal/' : ''}mini/${path}`)
            const normal = await uploadFile(files[i], { quality: 1024 * 1024 * 2 > files[i].size ? 1024 * 1024 * 2 / files[i].size : 0.8 }, `${personal ? 'personal/' : ''}normal/${path}`)
            if (normal.code || mini.code) {
                status = 'ERROR'
            }
            newMap[total[i].id] = status === 'LOADING' ? 'SUCCESS' : status
            setUploadStatusMap({ ...newMap })
        }
        for (let i = 0; i < urls.length; i++) {
            let status: UploadType['uploadStatus'] = 'LOADING';
            newMap[total[i + files.length].id] = status
            const mini = await uploadUrl({ url: urls[i], path: `${personal ? 'personal/' : ''}mini/${Format(new Date(), 'YYYY_MM_DD')}` })
            const normal = await uploadUrl({ url: urls[i], path: `${personal ? 'personal/' : ''}normal/${Format(new Date(), 'YYYY_MM_DD')}` })
            if (normal.code || mini.code) {
                status = 'ERROR'
            }
            newMap[total[i + files.length].id] = status === 'LOADING' ? 'SUCCESS' : status
            setUploadStatusMap({ ...newMap })
        }
        onFinish();
        setUrls((urls) => urls.filter((_, i) => newMap[total[i + files.length].id] === 'ERROR'))
        setFiles((files) => files.filter((_, i) => newMap[total[i].id] === 'ERROR'))
    }
    const inputUrl = () => {
        setUrls(urls => Array.from(new Set([...urls, urlInput])))
        setUrlInput('')
    }
    const handlekeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        inputUrl()
    }
    const deleteTmpPic = (pic: typeof total[number], i: number) => {
        if (pic.type === 'file') {
            setFiles((files) => {
                const res = [...files]
                res.splice(i, 1)
                return res
            })
        } else if (pic.type === 'url') {
            setUrls((urls) => {
                const res = [...urls]
                res.splice(i - files.length, 1)
                return res
            })
        }
    }
    useEffect(() => {
        setUploadStatusMap(obj => {
            const map: { [key: string]: UploadType['uploadStatus'] } = {}
            total.forEach(e => {
                map[e.id] = obj[e.id] || 'WAIT'
            })
            return map
        })
    }, [total])
    useEffect(() => {
        setShow(true)
    }, [])
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
                {total.map((e, i) => (
                    <div key={e.id} className={`tmp_item_wrap upload_${uploadStatusMap[e.id]}`}>
                        <img className="tmp_item" width="40" height="96" src={e.src} alt="" />
                        <SVGIcon className="tmp_del_btn" type="close" onClick={() => deleteTmpPic(e, i)} />
                        {{
                            SUCCESS: <SVGIcon className="tmp_status_btn" type="yes" fill="green" />,
                            ERROR: <SVGIcon className="tmp_status_btn" type="no" fill="red" />,
                            WAIT: '',
                            LOADING: <SVGIcon className="tmp_status_btn rotate" type="loading" fill="gray" />,
                        }[uploadStatusMap[e.id]]}
                    </div>
                ))}
            </div>
            {show && <div className="upload_footer">
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
                {!!total.length && <span className="file_wrap">
                    {total.length}
                </span>}
                {!!total.length && <button className="normal_btn submit_btn" onClick={handleSubmit}>submit</button>}
            </div>}
        </DIV>
    )
}