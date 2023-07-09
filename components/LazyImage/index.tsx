import RImage from "next/image"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

const MImage = styled(RImage)`
    min-width: 60px;
    min-height: 60px;
    &:after{
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 0;
        width: 0;
        border: 50px solid #fff;
        border-top-width: 0;
        border-radius: 20px;
        margin: auto;
        background-color: #fff;
        animation: rotate 1.2s linear infinite;
    }
`

type TProps = {
    src: string,
    loadingPic?: string,
    className?: string,
    [key: string]: any
}

function LazyImage({ loadingPic, src, className, ...props }: TProps) {
    const loadingGif = useRef(loadingPic || process.env.NEXT_PUBLIC_LOADING_GIF || 'https://empty.t-n.top/pub_lic/2023_06_09/pic1686281264582557.gif')
    const failImg = useRef('https://empty.t-n.top/pub_lic/2023_06_26/pic1687748007844003.png')
    const [imgSrc, setSrc] = useState(loadingGif.current)
    const imgRef = useRef<HTMLImageElement | null>(null)
    const handleError = () => {
        setSrc(failImg.current)
    }
    useEffect(() => {
        const clientHeight = document.documentElement.clientHeight
        const clientWidth = document.documentElement.clientWidth
        imgRef.current?.classList.add('lazy')
        if (
            imgRef.current
            && !(imgRef.current.getBoundingClientRect().top < -imgRef.current.clientHeight
                || imgRef.current.getBoundingClientRect().top > 1.5 * clientHeight)
            && !(imgRef.current.getBoundingClientRect().left < -clientWidth
                || imgRef.current.getBoundingClientRect().left > 1.5 * clientWidth)
            // && imgRef.current.getBoundingClientRect().width
            // && imgRef.current.getBoundingClientRect().height
        ) {
            setSrc(src)
            imgRef.current?.classList.remove('lazy')
        }
    }, [src])
    return (<>
        <MImage
            className={`${className ? `lazy ${className}` : 'lazy'}`}
            ref={imgRef}
            src={imgSrc}
            data-src={src}
            alt=""
            onError={handleError}
            {...props}
        />
    </>

        // <Image
        //     // className={className ? `lazy ${className}` : 'lazy'}
        //     className={className}
        //     ref={imgRef}
        //     src={imgSrc}
        //     // src={imgSrc}
        //     // data-src={src}
        //     alt=""
        //     lazyBoundary=""
        //     placeholder="blur"
        //     blurDataURL={loadingGif.current}
        //     loading="lazy"
        //     onError={handleError}
        //     {...props}
        // />
    )
}


export default LazyImage