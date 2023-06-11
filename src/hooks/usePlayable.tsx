import {useEffect, useState} from "react";

/**
 * A játék követelményeit ellenőrző horog
 * - eldönti, hogy a játék játszható-e az adott eszközön
 */
export default function usePlayable(){

    const [
        isPlayable,
        setPlayable
    ] = useState(true)

    useEffect(() => {
        const widthCheck = () => {
            setPlayable(window.innerWidth >= 1000)
        }

        widthCheck()

        window.addEventListener('resize', widthCheck)

        return () => {
            window.removeEventListener('resize', widthCheck)
        }
    }, [])

    return isPlayable
}