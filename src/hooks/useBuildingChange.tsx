import {useEffect, useRef} from "react";
import {buildingSelectedEvent as gameBarEvent} from "../components/City/GameBar";
import {setSelectedBuilding, setSelectedElement} from "../redux/GameSlice";
import {Subscription} from "rxjs";
import {useAppDispatch} from "../redux/hooks";

/**
 * Kiválasztott épület változását kezelő horog
 * - feliratkozik a buildingChanged eseményre, és ha kell majd le is iratkozik róla
 * - az esemény kiváltódásakor lefuttatja a szükséges logikákat
 */
export default function useBuildingChange(){

    /**
     * Redux
     */
    const dispatch = useAppDispatch()

    /**
     * esemény feliratkozás referencia
     */
    const buildingChanged = useRef<Subscription>()

    /**
     * Változások kezelése
     */
    useEffect(() => {
        buildingChanged.current = gameBarEvent.subscribe(selectedBuilding => {
            dispatch(setSelectedBuilding(selectedBuilding.toJSON()))
            dispatch(setSelectedElement(undefined))
        })

        return () => {
            buildingChanged.current?.unsubscribe()
        }
    })

}