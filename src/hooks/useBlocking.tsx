import {useEffect} from "react";

/**
 * Oldal elhagyását kezelő horog
 * - a felhasználó lehet, hogy véletlen zárná be az oldalt, ezért megerősítést kérünk tőle
 */
export default function useBlocking() {
    const alertUser = (ev: BeforeUnloadEvent) => {
        ev.preventDefault()
        ev.returnValue = false
    }

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser)

        return () => {
            window.removeEventListener('beforeunload', alertUser)
        }
    }, [])

}