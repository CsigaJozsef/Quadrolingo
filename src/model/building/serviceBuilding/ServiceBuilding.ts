import {IBuilding} from "../../../types/IBuilding";
import {Resident} from "../../resident/Resident";

/**
 * A kiszolgáló épületek absztrakt osztálya
 * - eltároljuk, hogy hol melyik lakos dolgozik
 * - minden ilyen épülethez tartozik fenntartási költség
 */
export abstract class ServiceBuilding implements IBuilding {

    public maintenance: number = 100;
    public workerCapacity: number = 50;

    //public crimeChance: number = 0;

    //public fireChance: number = 0;
    public isOnFire: boolean = false;
    public sellValue: number = 250;

    protected constructor(
        public buildSize: number,
        public buildCost: number,
        public effect: number,
        public fireChance:number,
        public crimeChance:number,
        public texture: string
    ) {

    }

    /**
     * Visszaadja a fenntartási költségét az adott kiszolgáló épületnek
     * @returns {number}
     */
    getMaintenance(): number {
        return this.maintenance;
    }

    /**
     * JSON string-et az adott típusú kiszolgáló épületté alakít
     * @param {string} s
     */
    abstract fromJSON(s: string): void;

    /**
     * Lakókkal való interakció lekezelése
     * @param {Resident[]} residents
     */
    abstract react(...residents: Resident[]): void;

    /**
     * Törli az elemet a játéktérről
     */
    abstract remove(): void;

    /**
     * JSON string-et csinál az objektumból
     * @returns {string}
     */
    abstract toJSON(): string ;

}




