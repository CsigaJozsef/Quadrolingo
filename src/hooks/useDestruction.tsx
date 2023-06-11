import {Dispatch, SetStateAction, useEffect, useState} from "react";

/**
 * Folyamatos rombolást elősegítő horog
 * - a folyamatos rombolás az 'R' billentyűgombbal változtatható (ki/be)
 * - amíg aktív, addig a bal egérgomb lenyomására vagy nyomvatartására minden épületet lerombolunk
 */
function useDestruction(): [ boolean, Dispatch<SetStateAction<boolean>> ] {

    /**
     * A folyamatos rombolás állapota
     */
    const [
        destruct,
        setDestruct
    ] = useState(false)

    /**
     * Változtatások végrehajtása
     */
    useEffect(() => {

        const handleButtonEvent = (e: KeyboardEvent) => {
            if(e.key === 'r'){
                setDestruct(prev => !prev)
            }
        }

        window.addEventListener('keypress', handleButtonEvent)

        return () => {
            window.removeEventListener('keypress', handleButtonEvent)
        }

    }, [])

    return [ destruct, setDestruct ]

}

export default useDestruction