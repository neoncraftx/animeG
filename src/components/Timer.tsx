import type React from "react";
import { useEffect } from "react";

export function Timer({time,leftTime,onSetLeftTime}: {time: number,leftTime: number,onSetLeftTime: React.Dispatch<React.SetStateAction<number>>}){
    useEffect(() => {
        const x = setInterval(() => {
            onSetLeftTime( v => v-1)
        }, 1000)
        return () => {
            clearInterval(x)
        }
    },[time])
    console.log(time)
    return <div>
        <p>{leftTime} </p>
    </div>
}