import {DateTime} from "luxon";
import {Resident} from "./resident/Resident";

/**
 * Katasztrófa kezelő osztály
 *
 * - Csak egy fajta katasztrófa van, az infláció
 * - A katasztrófának van egy adott esélye, hogy bekövetkezik
 * - A katasztrófának van neve
 * - Meg tudjuk mondani, hogy a katasztrófa aktív-e
 * - Meg tudjuk mondani, hogy mikor lesz vége
 */
export class Disaster {

    private chance: number
    private readonly name: string
    private isActive: boolean
    private endDate?: DateTime

    /**
     * Inicializálás
     */
    constructor() {
        this.name = 'Infláció'
        this.chance = 0.02
        this.isActive = false

    }

    /**
     * Ha bekövetkezett a katasztrófa, akkor lefuttatjuk a szükséges logikákat
     * - aktívvá tesszük a katasztrófát
     * - beállítjuk, hogy mikor lesz vége
     * @param currentDate a jelenlegi dátum (ez lesz a kezdeti dátum)
     */
    handleBegin(currentDate: DateTime) {
        if(this.isActive) return

        const random = Math.random()

        if(random <= this.chance) {
            this.endDate = currentDate.plus({ month: 6 })
            this.isActive = true
        }
    }

    /**
     * Ha aktív a katasztrófa, akkor ellenőrizzük, hogy vége van-e már
     * - ha vége van, akkor inaktívvá tesszük
     * - továbbá a befejezés dátumát töröljük
     * @param currentDate a jelenlegi dátum
     */
    handleEnd(currentDate: DateTime) {
        if(!this.isActive || !this.endDate) return

        this.isActive = this.endDate < currentDate
        if(!this.isActive){
            this.endDate = undefined
        }
    }

    /**
     * Egy adott lakosra alkalmazzuk a katasztrófa negatív hatásait
     * - jelenleg ez annyit tesz, hogy csökkentjük az elégedettséget
     * @param resident egy lakos példány
     */
    applyDisaster(resident: Resident){
        if(this.active && !resident.isDisasterApplied){
            const residentSatisfaction = resident.getSatisfaction().getSatisfaction
            resident.satisfactionValue = residentSatisfaction * this.satisfactionReducer
        }

        resident.isDisasterApplied = this.active
    }

    //Getterek
    get satisfactionReducer() {
        return 0.5
    }

    get incomeReducer() {
        return 0.5
    }

    get active() {
        return this.isActive
    }
}