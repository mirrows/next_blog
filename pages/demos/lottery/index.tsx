import LazyImage from "@/components/LazyImage"
import SVGIcon from "@/components/SVGIcon"
import Head from "next/head"
import { FocusEvent, useCallback, useEffect, useMemo, useState } from "react"
import styled from "styled-components"

const DIV = styled.div`
    .lottery_bg{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 80%;
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
        margin: auto;
        border-radius: 30%;
        overflow: hidden;
        transform-origin: 50% min(32vw, 190px);
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
        input[type="text"]{
            width: 100px;
        }
    }
    .table_switch{
        position: relative;
        z-index: 6;
    }
    .table_switch.light_switch{
        fill: #fff;
    }
    input[readonly] {
        background-color: inherit;
        border: none;
        color: #fff;
    }
`

export default function Lottery () {
    const [rotate, steRotate] = useState(false)
    const [deg, setDeg] = useState(0)
    const [table, setTable] = useState(true)
    const [areas, setArea] = useState([
        { name: 't1', checked: true, img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_19/pic1687162882486612.png', target: '', percent: 0.1 },
        { name: 't2', checked: true, img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_05_31/pic1685527384699939.png', target: '', percent: 0.05 },
        { name: 't3', checked: true, img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_05_31/pic1685527386794892.png', target: '', percent: 0.4 },
        { name: 't4', checked: true, img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_19/pic1687162735145513.png', target: '', percent: 0.1 },
        { name: 't5', checked: true, img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_19/pic1687162737072848.png', target: '', percent: 0.2 },
        { name: 't6', checked: true, img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_05_31/pic1685527382597218.png', target: '', percent: 0.15 },
    ])
    const empty = useMemo(() => {
        const percent = areas.filter(e => e.checked).map(e => e.percent).reduce((pre, cur) => +(pre - cur).toFixed(4), 1)
        return percent > 0 ? [{
            name: 'empty',
            img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_21/pic1687315603128458.png',
            target: '',
            percent,
        }] : []
    }, [areas])
    const startRotate = () => {
        if(rotate) return;
        setDeg(deg => deg % 360)
        setTimeout(() => {
            steRotate(true)
        })
    }
    const stopRotate = () => {
        steRotate(false)
        setDeg(deg => deg % 360)
    }
    const handleTable = (ind: number, attr: string, val: string | boolean | number) => {
        const data = JSON.parse(JSON.stringify(areas))
        data[ind][attr] = val
        setArea(data);
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
                name: '',
                checked: true,
                img: 'https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_19/pic1687162882486612.png',
                target: '', 
                percent: empty[0].percent
            })
            return res
        })
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
            setDeg(_ => 1440 + ind * are + Math.floor((swingRate - 0.5) * are))
        }
    }, [rotate, belongArea, areas, empty])
    return(<>
        <Head>
            <title>抽奖</title>
        </Head>
        <DIV>
            <LazyImage className="lottery_bg" src="https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_19/pic1687141057059729.png" />
            <div className="line_wrap lottery_bg">
                {[...areas.filter(e => e.checked), ...empty].map((item, ind, total) => (
                    <LazyImage
                        key={ind}
                        className="area_item"
                        src={item.img}
                        style={{ width: `${30 - total.length*2}vw`, transform: `rotate(${360 / total.length * ind}deg)` }}
                    />
                ))}
            </div>
            <div className="line_wrap lottery_bg">
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
                    src="https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_21/pic1687328567823851.png"
                />
            </div>
            <LazyImage className="lottery_bg start_btn" src="https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_21/pic1687328322726591.webp" onClick={startRotate} />
            <div className="rate_table">
                <div className="table_wrap" style={{ scale: table ? '1' : '0' }}>
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
                                    (<SVGIcon type="plus" style={{ fill: '#fff' }} onClick={addArea} />)
                                }</td>
                                <td><input type="text" value={item.name} onChange={(e) => handleTable(ind, 'name', e.target.value)} /></td>
                                <td><input type="text" {...('checked' in item ? {} : {readOnly: true})} value={item.percent} onChange={(e) => handleTable(ind, 'percent', e.target.value)} onBlur={(e) => changePower(e, ind)} /></td>
                                <td>{'checked' in item && total.length > 2 ? <SVGIcon type="trash" style={{ fill: '#fff' }} width="16" onClick={() => delArea(ind)} /> : ''}</td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
                <SVGIcon className={`table_switch${table? ' light_switch' : ''}`} type="list" width="32" onClick={() => setTable(val => !val)} />
            </div>
        </DIV>
    </>)
}