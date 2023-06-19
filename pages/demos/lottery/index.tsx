import LazyImage from "@/components/LazyImage"
import SVGIcon from "@/components/SVGIcon"
import { useCallback, useEffect, useState } from "react"
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
        width: 12rem;
        height: 12rem;
        margin: auto;
        text-align: center;
        transition: 3s ease;
        transform: rotate(0deg);
        .pointer{
            position: relative;
            top: 50%;
            left: 50%;
            width: 100%;
            transform: translate(-50%, -59%);
            cursor: pointer;
        }
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
    .lottery_area{
        width: 40%;
        height: 40%;
    }
    .area_item{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 6.5rem;
        margin: auto;
        transform-origin: 50% 175%;
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
        padding: 10px 0 32px;
        background-color: rgba(0,0,0,.5);
        color: #fff;
        transform-origin: 100% 100%;
        transition: .3s;
    }
    .table_switch{
        position: relative;
        z-index: 6;
    }
    .table_switch.light_switch{
        fill: #fff;
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
    const handleTable = (ind: number, attr: string, val: string | boolean) => {
        const data = JSON.parse(JSON.stringify(areas))
        data[ind][attr] = val
        setArea(data);
    }
    const belongArea = useCallback(() => {
        let belong = Math.random();
        return areas.filter(e => e.checked).findIndex(area => {
            belong = belong - area.percent
            return belong <= 0
        })
    }, [areas])
    useEffect(() => {
        if(rotate) {
            const ind = belongArea()
            const are = 360 / areas.length
            const swingRate = Math.random() * 0.8 + 0.1
            setDeg(_ => 1440 + ind * are + Math.floor(swingRate * are - 30))
        }
    }, [rotate, belongArea, areas])
    return(
        <DIV>
            <LazyImage className="lottery_bg" src="https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_19/pic1687141057059729.png" />
            <div className="lottery_area lottery_bg">
                {areas.filter(e => e.checked).map((item, ind, total) => (
                    <LazyImage
                        key={ind}
                        className="area_item"
                        src={item.img}
                        style={{ transform: `translateY(-128%) rotate(${360 / total.length * ind}deg)` }}
                    />
                ))}
            </div>
            <div className="line_wrap lottery_bg">
                {areas.filter(e => e.checked).map((_, ind, total) => (
                    <div key={ind} className="line" style={{ transform: `translateY(-50%) rotate(${360 / total.length * (ind + 0.5)}deg)` }}></div>
                ))}
            </div>
            <div
                className={`pointer_wrap`}
                style={{
                    transform: `rotate(${deg}deg)`,
                    transitionDuration: rotate? '3s' : '0s'
                }}
                onClick={startRotate}
                onTransitionEnd={stopRotate}
            >
                <LazyImage
                    className="pointer"
                    src="https://cdn.jsdelivr.net/gh/huaasto/empty@master/pub_lic/2023_06_19/pic1687154440558219.png"
                />
            </div>
            <div className="rate_table">
                <div className="table_wrap" style={{ scale: table ? '1' : '0' }}>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>名称</th>
                                <th>权重</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.map((item, ind) => (<tr key={ind}>
                                <td><input type="checkbox" name="" defaultChecked={item.checked} id="" onChange={(e) => handleTable(ind, 'checked', e.target.checked)} /></td>
                                <td><input type="text" defaultValue={item.name} onChange={(e) => handleTable(ind, 'name', e.target.value)} /></td>
                                <td><input type="text" defaultValue={item.percent} onChange={(e) => handleTable(ind, 'percent', e.target.value)} /></td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
                <SVGIcon className={`table_switch${table? ' light_switch' : ''}`} type="list" width="32" onClick={() => setTable(val => !val)} />
            </div>
        </DIV>
    )
}