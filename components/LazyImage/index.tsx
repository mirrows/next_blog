import { useEffect, useRef, useState } from "react"

type TProps = {
    src: string,
    className?: string,
    [key: string]: any
}

function LazyImage({ src, className, ...props }: TProps) {
    const loadingGif = useRef(process.env.NEXT_PUBLIC_LOADING_GIF || 'https://empty.t-n.top/pub_lic/2023_06_09/pic1686281264582557.gif')
    const failImg = useRef('https://pic.mksucai.com/00/38/98/82832a25323c0abe.webp')
    const [imgSrc, setSrc] = useState(loadingGif.current)
    const imgRef = useRef<HTMLImageElement | null>(null)
    const handleError = () => {
        setSrc(failImg.current)
    }
    useEffect(() => {
        const clientHeight = document.documentElement.clientHeight
        const clientWidth = document.documentElement.clientWidth
        imgRef.current?.classList.add('lazy')
        if(
            imgRef.current 
            && !(imgRef.current.getBoundingClientRect().top < -imgRef.current.clientHeight
            || imgRef.current.getBoundingClientRect().top > 1.5 * clientHeight)
            && !(imgRef.current.getBoundingClientRect().left < -clientWidth
            || imgRef.current.getBoundingClientRect().left > 1.5 * clientWidth)
        ) {
            setSrc(src)
            imgRef.current.classList.remove('lazy')
        }
    }, [src])
    return (
        // <div className="inline-block">
        <img
            className={className ? `lazy ${className}` : 'lazy'}
            ref={imgRef}
            src={imgSrc}
            data-src={src}
            alt=""
            onError={handleError}
            {...props}
        />
            // <button onClick={handleError}>emmm</button>
        // </div>
        
    )
}


export default LazyImage