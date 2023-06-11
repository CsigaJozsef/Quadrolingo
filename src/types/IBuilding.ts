import {Resident} from "../model/resident/Resident";

/**
 * Minden lerakható elem alapja
 * - ez az interfész tartalmaz minden olyan információt, ami igaz az összes lerakható objektumra
 */
export interface IBuilding {

    buildSize: number
    buildCost: number

    fireChance: number
    crimeChance: number
    isOnFire: boolean

    sellValue: number
    effect: number

    texture: string

    react(...residents: Resident[]): void

    remove(...residents: Resident[]): void

    toJSON(): string

    fromJSON(s: string): void

}
