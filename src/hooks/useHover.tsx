import {useEffect, useRef, useState} from "react";
import {Subject, Subscription} from "rxjs";
import {Coordinate} from "../types/core.model";
import {GridElementInteract} from "../types/core.view";

/**
 * Grid események példánya
 */
export const gridEvent = new Subject<GridElementInteract>()

/**
 * A Grid hover eseményeket kezelő horog
 * - feladata, hogy feliratkozzon a Grid eseményekre, és arról ha kell, akkor iratkozzon is le
 * - továbbá végrehajtja a Grid esemény kiváltódására a megfelelő logikát
 * @param inView a látóterünkön belül van-e az adott GridElement
 * @param coord a GridElement koordinátája
 */
export function useHover(inView: boolean, coord: Coordinate){

    /**
     * Hovering állapot (rajta van-e az egerünk)
     */
    const [
        isHovering,
        setHovering
    ] = useState<boolean>(false)

    /**
     * Az esemény feliratkozásunk referenciája
     */
    const gridSub = useRef<Subscription>()

    /**
     * Változások kezelése
     */
    useEffect(() => {
        if(inView){
            //Feliratkozás létrehozása látóteren belül
            gridSub.current = gridEvent.subscribe(place => {
                //Ha nincs a látótérben, akkor ne menjünk tovább
                if (!inView) return

                //Nézzük meg, hogy a mi koordinátánk benne van-e az esemény koordinátáinak tömbjében
                const index = place.coords.findIndex(
                    p => p.x === coord.x && p.y === coord.y
                )

                //Ha benne van, akkor jelenleg az adott elemen rajta van a kurzor
                setHovering(index !== -1)
            })
        }else{
            //Ha nincs a látótérben, akkor iratkozzunk le
            gridSub.current?.unsubscribe()
        }

        return () => {
            gridSub.current?.unsubscribe()
        }
    }, [coord.x, coord.y, inView])

    return isHovering
}