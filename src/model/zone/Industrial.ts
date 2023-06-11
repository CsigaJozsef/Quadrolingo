import {Zone} from './Zone'
import {Resident} from "../resident/Resident"
import {aboveCapacity, canWorkHere, demote, fromJSON, toJSON, upgrade} from "./ZoneInteractions"

/**
 * Ipari zóna
 * - eltároljuk az itt dolgozó lakosokat
 */
export class Industrial extends Zone {

    public workerNumber: number = 30
    public workers: Resident[] = []

    public constructor() {
        super(
            400,
            250,
            50,
            0.4,
            200,
            require("../../images/Industrial/industrial_1.png")
        );

        this.capacity = this.workerNumber
    }

    /**
     * Az épület reagál valamilyen interakcióra
     * @param residents: Resident[]
     */
    react(...residents: Resident[]): void {
        aboveCapacity(this)

        canWorkHere(this, residents)
    }

    /**
     * Az épület eltávolítása a pályáról
     */
    remove(...residents: Resident[]): void {
        this.workers.forEach(worker => {
            worker.isPaying = false
        })
        this.workers = []
    }

    /**
     * Az épület elmentése JSON formátumba
     */
    toJSON(): string {
        return toJSON(this, 'Industrial')
    }

    /**
     * Az épület visszatöltése JSON formátumból
     * @param s:string
     */
    fromJSON(s: string): void {
        fromJSON(this, s)
    }

    /**
     * Az épület fejlesztése a következő szintre
     */
    upgrade(): void {
        upgrade(this, 400, 30, 600)
        this.texture = require(`../../images/Industrial/industrial_${this.currentLevel}.png`)
    }

    /**
     * Az épület visszafejlesztése az előző szintre
     */
    demote(): void {
        demote(this, 400, 30, 600)
        this.texture = require(`../../images/Industrial/industrial_${this.currentLevel}.png`)
    }

}