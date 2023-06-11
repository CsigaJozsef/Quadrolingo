import {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router";
import {CityNameHookType} from "../types/core.view";

/**
 * A város nevének változását kezelő, és annak mellékhatásait horog
 */
export default function useCityName() : CityNameHookType {

    /**
     * Város nevének állapota
     */
    const [
        cityName,
        setCityName
    ] = useState<string>('')

    /**
     * Külső horgok
     */
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    /**
     * Változások kezelése
     */
    useEffect(() => {
        if (!searchParams.get("name") || searchParams.get("name")!.length < 3) {
            navigate("/")
        } else {
            setCityName(searchParams.get("name")!)
            document.title = searchParams.get("name")!
        }
    }, [navigate, searchParams])

    return [ cityName, setCityName ]
}