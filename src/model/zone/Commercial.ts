import {Zone} from './Zone'
import {Resident} from "../resident/Resident";
import {aboveCapacity, canShopHere, canWorkHere, demote, fromJSON, toJSON, upgrade} from "./ZoneInteractions";

/**
 * Üzleti zóna
 * - eltároljuk benne az itt dolgozó, és itt vásárló embereket
 * - ha valaki itt dolgozik, az nem zárja ki, hogy itt is vásárolhasson
 */
export class Commercial extends Zone {

    public workerNumber: number = 10

    public customerCapacity: number = 60

    public workers: Resident[] = []
    public customers: Resident[] = []

    constructor() {
        super(
            400,
            250,
            50,
            0.3,
            200,
            require("../../images/Commercial/commercial_1.png")
        );
        this.capacity = this.workerNumber + this.customerCapacity
    }

    /**
     * Az épület reagál valamilyen interakcióra
     * @param residents: Resident[]
     */
    react(...residents: Resident[]): void {
        aboveCapacity(this)

        canWorkHere(this, residents)

        canShopHere(this, residents)
    }

    /**
     * Az épület eltávolítása a pályáról
     */
    remove(...residents: Resident[]): void {
        this.workers.forEach(resident => {
            resident.isPaying = false
        })

        this.workers = []
        this.customers = []
    }

    /**
     * Az épület elmentése JSON formátumba
     */
    toJSON(): string {
        return toJSON(this, 'Commercial')
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
        upgrade(this, 500, 60, 700)
        this.texture = require(`../../images/Commercial/commercial_${this.currentLevel}.png`)
    }

    /**
     * Az épület visszafejlesztése az előző szintre
     */
    demote(): void {
        demote(this, 500, 60, 700)
        this.texture = require(`../../images/Commercial/commercial_${this.currentLevel}.png`)
    }

}