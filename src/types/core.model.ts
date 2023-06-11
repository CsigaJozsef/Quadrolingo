import {IBuilding} from "./IBuilding";

/**
 * Távolsági koordináta
 * - coordinate: az itt tárolt koordináta
 * - distance: a koordináta távolsága
 */
export type DistanceCoordinate = {
    coordinate:Coordinate,
    distance:number
}

/**
 * Kapcsolódó koordináták
 * - coordinates: a kapcsolódó koordináták tömbje (pl:. Stadion)
 * - reacted: reagált-e már valamelyik koordináta
 */
type ConnectedCoordinate = {
    coordinates: Coordinate[]
    reacted: boolean
}

/**
 * Visszatöltő mátrix, a perzisztencia ez alapján tölti vissza az adatokat (JSON formátumból, így minden string)
 * - connectedCoords: a kapcsolódó koordináták
 * - coord: az elem koordinátája
 * - element: a tárolt elem
 */
export type LoadMatrix = {
    connectedCoords: string
    coord: string
    element: string
}

/**
 * A játéktér egy eleme
 * - element: az itt tárolt elem
 * - coord: az elem koordinátája
 * - connectedCoords: az elemhez tartozó koordináták
 */
export type GameElement = {
    element: IBuilding,
    coord: Coordinate,
    connectedCoords: ConnectedCoordinate,
}

/**
 * Az útkereséshez használt típus, eldönti, hogy merre van út az adott elem körül
 */
export type roadsAround = {
    up: boolean,
    down: boolean,
    right: boolean,
    left: boolean,
    count: number
}

/**
 * A szimulációt visszatöltő típus, a perzisztencia használja
 * - economy: a gazdasági adatok
 * - residents: a lakosok adatainak tömbje
 * - previousDate: az előző hónapban módosítótt dátum
 * - date: az aktuálisan használt dátum (amit folyamatosan léptetünk)
 * - currentStep: milyen mértékben növeljük a napokat
 * - unsatisfied: az előző hónapban elégedetlen lakosok, akik ki fognak költözni
 */
export type LoadSimulation = {
    economy: string,
    residents: string[],
    previousDate: string,
    date:string,
    currentStep: 0|1|2|3,
    unsatisfied: number[]
}

/**
 * Általános kétdimenziós koordináta típus (x,y) párban
 */
export type Coordinate = {
    x: number,
    y: number
}

/**
 * Egy út kapcsolatait meghatározó típus
 * (melyik irányban kapcsolódik hozzá másik út)
 */
export type Connection = {
    left: boolean
    right: boolean
    up: boolean
    down: boolean
}

/**
 * A pénzügy diagramunk típusa
 * - borderColor
 * - backgroundColor
 */
export type ChartStyle = {
    borderColor: string
    backgroundColor: string
}

/**
 * Havi adatok megjelenítésének típusa
 * - month: a hónap neve
 * - data: a tárolt adat
 */
export type MonthlyData = {
    month: string
    data: number
}