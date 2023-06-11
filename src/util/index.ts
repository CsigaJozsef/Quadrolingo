/**
 * Ebben a fájlban Utility függvények találhatóak, céljuk, hogy általános segítséget nyújtsanak attól függetlenül,
 * hogy milyen környezetben lettek éppen meghívva
 */
import {IBuilding} from "../types/IBuilding";
import {Road} from "../model/building/Road";
import {Forest} from "../model/building/Forest";
import {Stadium} from "../model/building/serviceBuilding/Stadium";
import {PoliceStation} from "../model/building/serviceBuilding/PoliceStation";
import {FireStation} from "../model/building/serviceBuilding/FireStation";
import {Commercial} from "../model/zone/Commercial";
import {Industrial} from "../model/zone/Industrial";
import {Residential} from "../model/zone/Residential";
import {Grass} from "../model/building/Grass";
import {Building} from "../types/core.view";

/**
 * A Frontend számára eltárolt Building típusú tömb,
 * vizuális reprezentációt biztosít az épületeknek
 */
export const buildings: Building[] = [
    {
        img: require('../images/Road/road.png'),
        name: 'Út',
        getType: () => new Road()
    },
    {
        img: require('../images/Forest/forestCard.png'),
        name: 'Erdő',
        getType: () => new Forest()
    },
    {
        img: require('../images/ServiceBuilding/firestationCard.png'),
        name: 'Tűzoltóság',
        getType: () => new FireStation()
    },
    {
        img: require('../images/ServiceBuilding/policestationCard.png'),
        name: 'Rendőrség',
        getType: () => new PoliceStation()
    },
    {
        img: require('../images/ServiceBuilding/stadium.png'),
        name: 'Stadion',
        getType: () => new Stadium()
    },
    {
        img: require('../images/Residential/residentialCard.png'),
        name: 'Lakossági Zóna',
        getType: () => new Residential()
    },
    {
        img: require('../images/Industrial/industrialCard.png'),
        name: 'Ipari Zóna',
        getType: () => new Industrial()
    },
    {
        img: require('../images/Commercial/commercialCard.png'),
        name: 'Üzleti Zóna',
        getType: () => new Commercial()
    },
]

/**
 * Értesítési kulcsok
 */
export enum NotifyTypeKey {
    EMPTY_NOTIFICATION = 0,

    FILETYPE_ERROR = 'filetype-error',
    PERSISTENCE_LOAD_ERROR = 'persistence-load-error',
    DESTRUCTION_MODE_ON = 'destruction-mode-on',
    DESTRUCTION_MODE_OFF = 'destruction-mode-off',
    ZONE_UPGRADE = 'zone-upgrade',
    ZONE_DEMOTE = 'zone-demote',
    OBJECT_COLLISION = 'object-collision'
}

/**
 * Előfordul, hogy egy épületnek csak a típusát tároljuk,
 * ekkor szükségünk van egy gyártófüggvényre, ami visszaállítja
 * azoknak az eredeti típusát, tehát magát az objektumot
 *
 * @param type az objektum típusa
 */
export const elementFactory = (type: string): IBuilding => {
    let element = new Grass()
    switch (type) {
        case 'Road':
            element = new Road()
            break
        case 'Forest':
            element = new Forest()
            break
        case 'Stadium':
            element = new Stadium()
            break
        case 'PoliceStation':
            element = new PoliceStation()
            break
        case 'FireStation':
            element = new FireStation()
            break
        case 'Commercial':
            element = new Commercial()
            break
        case 'Industrial':
            element = new Industrial()
            break
        case 'Residential':
            element = new Residential()
            break
        default:
            break
    }
    return element
}

/**
 * Előfordul, hogy szerializált alakban tárolunk egy objektumot,
 * ekkor ez a függvény visszakonvertálja IBuilding típusú objektumra
 *
 * @param selectedBuilding a szerializált objektum
 */
export const toIBuilding = (selectedBuilding: string | undefined) => {
    if (!selectedBuilding)
        return undefined

    const obj = JSON.parse(selectedBuilding)
    const element = elementFactory(obj.type)
    element?.fromJSON(JSON.stringify(obj))

    return element
}