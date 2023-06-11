/**
 * A Frontendhez tartozó típus/interfész deklarációk
 *
 * Az átláthatóság, illetve kódismétlés
 * elkerülése végett tároljuk itt ezeket az elemeket
 */

import {Dispatch, SetStateAction} from "react";
import {GameMatrix} from "../model/GameMatrix";
import {IBuilding} from "./IBuilding";
import {Coordinate} from "./core.model";
import {AlertColor} from "@mui/material";
import {NotifyTypeKey} from "../util";

/**
 * Egy adott Grid elemen történő interakciók típusa
 * - coords: érintett koordinátájú elemek
 * - build: építkezünk-e
 */
export type GridElementInteract = {
    coords: Coordinate[],
    build: boolean
}

/**
 * GridElement Property interfész
 * - coord: a Grid elem koordinátája
 */
export interface IGridElementProps {
    coord: Coordinate,
}

/**
 * Command Bar Property interfész
 * - cityName: a város neve
 * - setCityName: város nevét módosító (állapot) függvény
 */
export interface ICommandBarProps {
    cityName: string,
    setCityName: Dispatch<SetStateAction<string>>
}

/**
 * Economy Modal Property interfész, a pénzügy modal típusa
 * - isOpen: meg van-e nyitva
 * - model: egy model állapot példány
 * - setModel: a model állapotát módosító függvény
 * - onClose: a modal bezárását kezelő függvény
 */
export interface IEconomyModalProps {
    isOpen: boolean
    model: GameMatrix
    setModel: (g: GameMatrix) => void
    onClose: () => void
}

/**
 * Building Card Property interfész, a GameBar-on a kártyák típusa
 * - building: az aktuális építmény kártya típus
 * - onSelect: a kiválasztást lekezelő függvény, paramétere az építmény kártya neve (garantáltan egyedi)
 */
export interface IBuildingCardProps {
    building: Building
    onSelect: (name: string) => void
}

/**
 * Place Screen Property interfész, a lerakási információkat tartalmazó komponens paramétere(i)
 * - selectedBuilding: a jelenleg kiválasztott épület (a kártyák közül)
 */
export interface IPlaceScreenProps {
    selectedBuilding: string | undefined
}

/**
 * Upgrade Screen Property interfész, a fejlesztési képernyő pataméterei
 * - canUpgrade: fejleszthető-e
 * - isMin: minimális szintű-e (kizáró eset)
 * - isMax: maximális szintű-e (kizáró eset)
 * - element: a jelenleg kiválasztott épület a pályáról
 * - onUpgrade: fejlesztés eseményt kezelő függvény
 * - onDemote: visszafejlesztés eseményt kezelő függvény
 */
export interface IUpgradeProps {
    canUpgrade: boolean,
    isMin: boolean,
    isMax: boolean,
    element?: IBuilding,
    onUpgrade: () => void
    onDemote: () => void
}

/**
 * Destroy Screen Property interfész, a romboló képernyő paraméterei
 * - element: a jelenleg kiválasztott épület a pályáról
 * - onDestroy: rombolás eseményt kezelő függvény
 */
export interface IDestroyProps {
    element?: IBuilding,
    onDestroy: () => void
}

/**
 * Értesítési típus, model szerepkör
 * - key: az értesítés kulcsa
 * - msg: az értesítés üzenete a felhasználó számára is értelmezhető módon
 * - severity: az értesítés besorolása
 */
export type NotifyType = {
    key: NotifyTypeKey,
    msg: string,
    severity: AlertColor
}

/**
 * Az értesítési állapot típusa, view szerepkör
 * - notifyMsg: az értesítés üzenete a felhasználó számára is értelmezhető módon
 * - notifySeverity: az értesítés besorolása
 */
export type NotifyStateType = {
    notifyMsg?: string,
    notifySeverity?: AlertColor
}

/**
 * A horog visszatérési típusa
 * - notify: az értesítési állapot típusa, view szerepkör
 * - show: jelenjen-e meg az értesítés
 * - setKey: értesítés kulcs módosítása
 * - setShow: értesítés láthatóságának módosítása
 */
export type NotifyHookType = [
    notify: NotifyStateType,
    show: boolean,
    setKey: Dispatch<SetStateAction<NotifyTypeKey>>,
    setShow: Dispatch<SetStateAction<boolean>>
]

/**
 * A useCityName horog visszatérési típusa
 */
export type CityNameHookType = [ cityName: string, setCityName: Dispatch<SetStateAction<string>> ]

/**
 * A model kontextus típusa
 * - model: GameMatrix model állapot példány
 * - setModel: GameMatrix model állapot változtató függvény
 */
export type ModelContextType = {
    model: GameMatrix,
    setModel: (g: GameMatrix) => void
}

/**
 * A rombolás kontextus típusa
 * - destruct: romboló módban vagyunk-e
 * - setDestruct: a rombolás állapotmódosító függvénye
 */
export type DestructionContextType = {
    destruct: boolean,
    setDestruct: Dispatch<SetStateAction<boolean>>
}

/**
 * Az értesítés kontextus típusa
 * - A benne tárolt érték az értesítés kulcsát módosító állapotfüggvény
 */
export type NotifyContextType = Dispatch<SetStateAction<NotifyTypeKey>>

export type Building = {
    img: any
    name: string
    getType: () => IBuilding
}