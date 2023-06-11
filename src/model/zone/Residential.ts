import {Zone} from "./Zone";
import {Resident} from "../resident/Resident";
import {aboveCapacity, canLiveHere, demote, fromJSON, toJSON, upgrade} from "./ZoneInteractions";

/**
 * Lakossági zóna
 * - eltároljuk az itt lakókat egy tömbben
 * - ebben a zónában zóna szintű elégedettséget is tárolunk,
 * alapból ezzel az elégedettséggel inicializáljuk a beköltöző lakosokat
 */
export class Residential extends Zone {
    public residents: Resident[] = []
    private zoneSatisfaction: number;

    constructor() {
        super(
            400,
            250,
            50,
            0.3,
            200,
            require("../../images/Residential/residential_1.png")
        );
        this.capacity = 15
        this.zoneSatisfaction = 50
    }

    get getZoneSatisfaction(): number {
        return this.zoneSatisfaction;
    }

    set zoneSatisfactionValue(x: number) {
        this.zoneSatisfaction = x
        if (this.zoneSatisfaction > 100) {
            this.zoneSatisfaction = 100
        }
        if (this.zoneSatisfaction < 0) {
            this.zoneSatisfaction = 0
        }
    }

    /**
     * Az épület reagál valamilyen interakcióra
     * @param residents
     */
    react(...residents: Resident[]): void {
        aboveCapacity(this)

        canLiveHere(this, residents)
    }

    /**
     * Az épület eltávolítása a pályáról
     */
    remove(): void {
        this.residents.forEach(resident => {
            resident.hasHome = false
        })
    }

    /**
     * Az épület elmentése JSON formátumba
     */
    toJSON(): string {
        return toJSON(this, 'Residential')
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
        this.texture = require(`../../images/Residential/residential_${this.currentLevel}.png`)
    }

    /**
     * Az épület visszafejlesztése az előző szintre
     */
    demote(): void {
        demote(this, 400, 30, 600)
        this.texture = require(`../../images/Residential/residential_${this.currentLevel}.png`)
    }

    /**
     * Az épületben lévő szabad helyek száma
     */
    get requiredResidents() {
        return this.capacity - this.residents.length
    }
}

