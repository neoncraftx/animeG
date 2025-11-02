import { useState } from "react";

export function useIncrement(initial: number = 0){
    const [count, setCount] = useState(initial)
    const increment = () => setCount(v => v + 1)
    const decrement = () => setCount(v => v - 1)
    return [count,increment,decrement]
}
