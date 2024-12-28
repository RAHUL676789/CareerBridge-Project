import { useRef } from "react";

export const debounce = (func,delay)=>{
    const debounceTimer = useRef(null);
    return (inputval)=>{
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            func(inputval);
        }, delay);

    }
};