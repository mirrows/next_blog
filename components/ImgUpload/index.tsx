import { useRef } from "react"

type Props = {
    clickable?: boolean,
    children: JSX.Element | JSX.Element[],
    [key: string]: any,
}

export default function ImgUpload ({ clickable = true, children, ...props }: Props) {
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const clickHandle = () => {
        if(!clickable) return
        inputRef.current?.click();
    }
    return(
    <div ref={wrapRef} {...props} onClick={clickHandle}>
        {children}
        <input ref={inputRef} type="file" name="" id="" style={{display: 'none'}} />
    </div>
    )
}