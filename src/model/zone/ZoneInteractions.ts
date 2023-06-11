import {Zone} from "./Zone";
import {Residential} from "./Residential";
import {Commercial} from "./Commercial";
import {Industrial} from "./Industrial";
import {Resident} from "../resident/Resident";
import {GenericElement, genericFromJSON, genericToJSON} from "../../persistence/persistenceHelper";

/**
 * Üzleti épület reagál, ha elérte a vásárlókapacitása alsó határát
 * @param commercial: Commercial
 * @param residents: Resident[]
 */
export const canShopHere = (commercial: Commercial, residents: Resident[]) => {
    for (const resident of residents) {
        if (commercial.customerCapacity <= commercial.customers.length)
            break

        if (!resident.isPaying) {
            continue
        }

        const index = commercial.customers.findIndex(
            r => r.equals(resident)
        )

        if (index !== -1) {
            continue
        }

        commercial.customers.push(resident)
    }
}

/**
 * Ipari és Üzleti épület reagál, ha elérte a dolgozókapacitása alsó határát
 * @param workZone: Industrial | Commercial
 * @param residents: Resident[]
 */
export const canWorkHere = (workZone: Industrial | Commercial, residents: Resident[]): void => {

    for (const resident of residents) {
        if (workZone.workerNumber <= workZone.workers.length) {
            return
        }

        if (resident.isPaying || !resident.hasHome) {
            continue
        }

        const index = workZone.workers.findIndex(
            r => r.equals(resident)
        )

        if (index !== -1) {
            continue;
        }

        resident.isPaying = true
        workZone.workers.push(resident)
    }
}

/**
 * Lakóépület reagál, ha elérte a lakókapacitása alsó határát
 * @param residential: Residential
 * @param residents: Resident[]
 */
export const canLiveHere = (residential: Residential, residents: Resident[]): void => {
    for (const resident of residents) {
        if (residential.capacity <= residential.residents.length)
            return

        const index = residential.residents.findIndex(
            r => r.equals(resident)
        )

        if (index !== -1) {
            continue;
        }

        if (resident.hasHome) continue

        resident.hasHome = true
        residential.residents.push(resident)
        resident.satisfactionValue = residential.getZoneSatisfaction
    }
}

/**
 * Lakóépület reagál, ha elérte a lakókapacitása felső határát
 * @param residential: Residential
 */
const aboveLiveCapacity = (residential: Residential): void => {
    if (residential.residents.length > residential.capacity) {
        while (residential.residents.length > residential.capacity) {
            const resident = residential.residents.pop()
            if (resident) {
                resident.hasHome = false;
            }
        }
    }
}

/**
 * Ipari és Üzleti épület reagál, ha elérte a dolgozókapacitása felső határát
 * @param workZone: Industrial | Commercial
 */
const aboveWorkerCapacity = (workZone: Industrial | Commercial): void => {
    if (workZone.workerNumber <= workZone.workers.length) {
        while (workZone.workerNumber < workZone.workers.length) {
            const worker = workZone.workers.pop()
            if (worker) {
                worker.isPaying = false
            }
        }
    }
}

/**
 * Üzleti épület reagál, ha elérte a vásárlókapacitása felső határát
 * @param commercial: Commercial
 */
const aboveCustomerCapacity = (commercial: Commercial): void => {
    if (commercial.customerCapacity <= commercial.customers.length) {
        while (commercial.customerCapacity < commercial.customers.length) {
            commercial.customers.pop()
        }
    }
}

/**
 * Az épület reagál, ha elérte a befogadóképessége felső határát (residents/workers/customers)
 * @param zone: Zone
 */
export const aboveCapacity = (zone: Zone): void => {
    // Residential
    if (zone instanceof Residential) {
        aboveLiveCapacity(zone)
    }

    // Commercial
    if (zone instanceof Commercial) {
        aboveWorkerCapacity(zone)

        aboveCustomerCapacity(zone)
    }

    //Industrial
    if (zone instanceof Industrial) {
        aboveWorkerCapacity(zone)
    }
}

/**
 * Az épület elmentése JSON formátumba
 * @param zone: Zone
 * @param zoneType: string (The type of the zone)
 */
export const toJSON = (zone: Zone, zoneType: string): string => {
    return genericToJSON(zone as GenericElement, zoneType);
}

/**
 * Az épület visszatöltése JSON formátumból
 * @param zone: Zone
 * @param json:string
 */
export const fromJSON = (zone: Zone, json: string): void => {
    genericFromJSON(json, zone as GenericElement);
}

/**
 * Az épület fejlesztése a következő szintre
 * @param zone: Zone
 * @param sellValue: number
 * @param capacity: number
 * @param upgradeCost: number
 */
export const upgrade = (zone: Zone, sellValue: number, capacity: number, upgradeCost: number): void => {
    if (zone.currentLevel < 3) {

        zone.sellValue += sellValue
        zone.capacity += capacity
        zone.upgradeCost += upgradeCost

        zone.currentLevel++
    }
}


/**
 * Az épület visszafejlesztése az előző szintre
 * @param zone: Zone
 * @param sellValue: number
 * @param capacity: number
 * @param upgradeCost: number
 */
export const demote = (zone: Zone, sellValue: number, capacity: number, upgradeCost: number): void => {
    if (zone.currentLevel > 1) {

        zone.sellValue -= sellValue
        zone.capacity -= capacity
        zone.upgradeCost -= upgradeCost

        zone.currentLevel--
    }
}