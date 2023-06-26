import LazyImage from "@/components/LazyImage"
import SVGIcon from "@/components/SVGIcon"
import TriggerBtn from "@/components/TriggerBtn"
import Head from "next/head"
import { FocusEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"

const DIV = styled.div`
    .lottery_bg{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 80%;
        width: unset;
        height: unset;
        max-height: 80%;
        margin: auto;
        text-align: center;
    }
    .pointer_wrap{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 6rem;
        height: 9rem;
        margin: auto;
        text-align: center;
        transition: 3s ease;
        transform: rotate(0deg);
        .pointer{
            position: relative;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            transform: translate(-50%, -70%);
        }
    }
    .start_btn{
        width: 5rem;
        height: 5rem;
        cursor: pointer;
        border-radius: 50%;
    }
    .line_wrap{
        max-width: 400px;
        max-height: 400px;
        width: 70vw;
        height: 70vw;
        border-radius: 50%;
    }
    .line{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 45%;
        width: 1px;
        transform-origin: 50% 100%;
        background-color: rgb(154 200 255 / 55%);
    }
    .area_item{
        position: absolute;
        top: 10px;
        left: 0;
        right: 0;
        max-width: 100px;
        height: unset;
        margin: auto;
        border-radius: 30%;
        overflow: hidden;
        transform-origin: 50% min(32vw, 190px);
        cursor: pointer;
    }
    .rate_table{
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 10px;
    }
    .table_wrap{
        position: absolute;
        right: 0;
        bottom: 0;
        max-width: 100vw;
        padding: 10px 5px 32px;
        background-color: rgba(0,0,0,.5);
        color: #fff;
        transform-origin: 100% 100%;
        transition: .3s;
        &.modal-active{
            transform: scale(1);
        }
        &.modal-hide{
            transform: scale(0);
        }
        input[type="text"]{
            width: 100px;
            padding: 5px;
            border-radius: 4px;
            border: none;
            outline: none;
        }
    }
    .table_switch{
        position: relative;
        z-index: 6;
        &.modal-active{
            fill: #fff;
        }
    }
    input[readonly] {
        background-color: inherit;
        border: none;
        color: #fff;
    }
    .modal_wrap{
        position: fixed;
        top: 50%;
        left: 0;
        right: 0;
        max-width: 40%;
        min-width: 240px;
        margin: auto;
        transform: translateY(-50%);
        text-align: center;
    }
    .con_img{
        position: relative;
        bottom: -16px;
        width: 160px;
        height: unset;
        z-index: 1;
    }
    .modal_content{
        position: relative;
        width: fit-content;
        min-widtH: 160px;
        max-widtH: 240px;
        padding: 10px 32px;
        background-color: #ff3030;
        border-radius: 12px;
        border: 4px solid;
        margin: auto;
        word-break: break-all;
        font-size: 2.5rem;
        font-weight: bold;
        font-family: youyuan;
        color: #ffc788;
    }
    .modal_content:after{
        content: '';
        position: absolute;
        top: 2px;
        bottom: 2px;
        left: 2px;
        right: 2px;
        border: 2px dashed;
        border-radius: 6px;
    }
    
    .sector_wrap{
        overflow: hidden;
        .sector_item{
            position: absolute;
            top: -50%;
            left: -50%;
            width: 100%;
            height: 100%;
            padding: 0;
            transform-origin: bottom right;
            cursor: pointer;
            transition: .3s;
            box-sizing: border-box;
        }
        .sector_item:before{
            content: '';
            display: block;
            width: 100%;
            height: 100%;
        }
        .sector_item:hover{
            padding: 10px;
        }
        .sector_item:hover:before{
            background-color: rgba(225,225,225, .5);
            box-shadow: 0 0 20px #cccccc;
        }
    }
`

export default function Lottery () {
    const [rotate, setRotate] = useState(false)
    const [modal, setModal] = useState(false)
    const [result, setResult] = useState(-1)
    const [deg, setDeg] = useState(0)
    // const [table, handle] = useTriggerBtn(true)
    const demo = useRef(7)
    const [areas, setArea] = useState([
        { name: 't1', checked: true, img: 'https://empty.t-n.top/pub_lic/2023_06_19/pic1687162882486612.png', target: '', percent: 0.1 },
        { name: 't2', checked: true, img: 'https://empty.t-n.top/pub_lic/2023_05_31/pic1685527384699939.png', target: '', percent: 0.05 },
        { name: 't3', checked: true, img: 'https://empty.t-n.top/pub_lic/2023_05_31/pic1685527386794892.png', target: '', percent: 0.4 },
        { name: 't4', checked: true, img: 'https://empty.t-n.top/pub_lic/2023_06_19/pic1687162735145513.png', target: '', percent: 0.1 },
        { name: 't5', checked: true, img: 'https://empty.t-n.top/pub_lic/2023_06_19/pic1687162737072848.png', target: '', percent: 0.2 },
        { name: 't6', checked: true, img: 'https://empty.t-n.top/pub_lic/2023_05_31/pic1685527382597218.png', target: '', percent: 0.15 },
    ])
    const [emptyName, setEmptyName] = useState('empty')
    const empty = useMemo(() => {
        const percent = areas.filter(e => e.checked).map(e => e.percent).reduce((pre, cur) => +(pre - cur).toFixed(4), 1)
        return percent > 0 ? [{
            name: emptyName,
            img: 'https://empty.t-n.top/pub_lic/2023_06_21/pic1687315603128458.png',
            target: '',
            percent,
        }] : []
    }, [areas, emptyName])
    const startRotate = () => {
        if(rotate) return;
        setDeg(deg => deg % 360)
        setTimeout(() => {
            setRotate(true)
        })
    }
    const stopRotate = () => {
        setRotate(false)
        setDeg(deg => deg % 360)
        setModal(true)
    }
    const handleTable = (ind: number, attr: string, val: string | boolean | number) => {
        const data = JSON.parse(JSON.stringify(areas))
        if(ind === data.length) {
            setEmptyName(val as string)
        } else {
            data[ind][attr] = val
            setArea(data);
        }
    }
    const belongArea = useCallback(() => {
        let belong = Math.random();
        const result = [...areas.filter(e => e.checked), ...empty].findIndex(area => {
            belong = belong - area.percent
            return belong <= 0
        })
        return result
    }, [areas, empty])
    const addArea = () => {
        setArea((areas) => {
            const res = JSON.parse(JSON.stringify(areas))
            res.push({
                name: emptyName !== 'empty' ? emptyName : `t${demo.current}`,
                checked: true,
                img: 'https://empty.t-n.top/pub_lic/2023_06_19/pic1687162882486612.png',
                target: '', 
                percent: empty[0].percent
            })
            return res
        })
        setEmptyName('empty')
        demo.current++
    }
    const delArea = (i: number) => {
        setArea((areas) => {
            const res = JSON.parse(JSON.stringify(areas))
            res.splice(i,1)
            return res
        })
    }
    const changePower = (e: FocusEvent<HTMLInputElement, Element>, ind: number) => {
        const percent = areas.filter(e => e.checked).map(e => e.percent).reduce((pre, cur, i) => +(pre + (i === ind ? +e.target.value : cur)).toFixed(4), 0)
        handleTable(ind, 'percent', percent > 1 ? +(+e.target.value - percent + 1).toFixed(4) : +(+e.target.value).toFixed(4))
    }
    useEffect(() => {
        if(rotate) {
            const ares = [...areas.filter(e => e.checked), ...empty]
            const ind = belongArea()
            const are = 360 / ares.length
            const swingRate = Math.random() * 0.8 + 0.1
            setResult(ind)
            setDeg(_ => 1440 + ind * are + Math.floor((swingRate - 0.5) * are))
        }
    }, [rotate, belongArea, areas, empty])
    return(<>
        <Head>
            <title>抽奖</title>
        </Head>
        <DIV>
            <LazyImage className="lottery_bg" width="460" height="460" src="https://empty.t-n.top/pub_lic/2023_06_19/pic1687141057059729.png" />
            <div className="line_wrap lottery_bg sector_wrap">
                {[...areas.filter(e => e.checked), ...empty].map((_, ind, total) => (
                    total.length > 1 && <div key={ind} className="sector_item" style={{transform: `scale(0.8) rotate(${360 / total.length * (ind - 0.5) + 90}deg) skew(${90 - 360 / total.length}deg)`}}></div>
                ))}
            </div>
            <div className="line_wrap lottery_bg no-pointer">
                {[...areas.filter(e => e.checked), ...empty].map((item, ind, total) => (
                    <LazyImage
                        key={ind}
                        className="area_item"
                        width="100"
                        height="100"
                        src={item.img}
                        style={{ width: `${18 - total.length}vw`, transform: `rotate(${360 / total.length * ind}deg)` }}
                    />
                ))}
            </div>
            <div className="line_wrap lottery_bg no-pointer">
                {[...areas.filter(e => e.checked), ...empty].map((_, ind, total) => (
                    total.length > 1 && <div key={ind} className="line" style={{ transform: `translateY(-50%) rotate(${360 / total.length * (ind + 0.5)}deg)` }}></div>
                ))}
            </div>
            <div
                className={`pointer_wrap`}
                style={{
                    transform: `rotate(${deg}deg)`,
                    transitionDuration: rotate? '3s' : '0s'
                }}
                onTransitionEnd={stopRotate}
            >
                <LazyImage
                    className="pointer"
                    width="96"
                    height="144"
                    src="https://empty.t-n.top/pub_lic/2023_06_21/pic1687328567823851.png"
                />
            </div>
            <LazyImage className="lottery_bg start_btn" width="80" height="80" src="https://empty.t-n.top/pub_lic/2023_06_21/pic1687328322726591.webp" onClick={startRotate} />
            <div className="rate_table">
                <TriggerBtn>
                    <SVGIcon className="table_switch" type="list" width="32" />
                    <div className="table_wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>名称</th>
                                    <th>权重</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...areas, ...empty].map((item, ind, total) => (<tr key={ind}>
                                    <td>{
                                        'checked' in item && typeof item.checked === "boolean" ? 
                                        (<input type="checkbox" name="" defaultChecked={item.checked} id="" onChange={(e) => handleTable(ind, 'checked', e.target.checked)} />) : 
                                        ( total.length < 10 ? <SVGIcon type="plus" style={{ fill: '#fff' }} onClick={addArea} /> : '')
                                    }</td>
                                    <td><input type="text" value={item.name} onChange={(e) => handleTable(ind, 'name', e.target.value)} /></td>
                                    <td><input type="text" {...('checked' in item ? {} : {readOnly: true, disabled: true})} value={item.percent} onChange={(e) => handleTable(ind, 'percent', e.target.value)} onBlur={(e) => changePower(e, ind)} /></td>
                                    <td>{'checked' in item && total.length > 2 ? <SVGIcon type="trash" style={{ fill: '#fff' }} width="16" onClick={() => delArea(ind)} /> : ''}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                </TriggerBtn>
            </div>
            {result !== -1 && modal && <div className="modal_mask" onClick={() => {setModal(false)}}>
                <div className="modal_wrap">
                    <LazyImage className="con_img" width="342" height="286" src="https://empty.t-n.top/pub_lic/2023_06_26/pic1687747158480258.gif" />
                    <div className="modal_content">{[...areas.filter(e => e.checked), ...empty][result]?.name}</div>
                </div>
            </div>}
        </DIV>
    </>)
}