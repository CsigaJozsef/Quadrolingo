import {IBuilding} from '../../types/IBuilding';
import {genericFromJSON, genericToJSON} from "../../persistence/persistenceHelper";

/**
 * Erdő típus, az IBuilding tulajdonságon felül:
 * - meg tudjuk mondani, hogy mennyi idős
 * - meg tudjuk mondani a fenntartási költségét
 * - meg tudjuk mondani a kínált bónuszokat
 */
export class Forest implements IBuilding {

    public age: number = 0;
    public maintenance: number = 1;
    public bonus: number = 10;

    public buildCost: number = 100;
    public buildSize: number = 1;
    public crimeChance: number = 0;
    public effect: number = 0;

    public fireChance: number = 0.3;
    public isOnFire: boolean = false;
    public sellValue: number = 40;

    public texture: string = require(`../../images/Forest/forest_${this.randomPic()}.png`);

    /**
     * EGy véletlenszerű képetválaszt az erdőnek
     * @returns {number}
     */
    randomPic(): number {
        return Math.round(Math.random() * (5 - 1) + 1)
    }

    /**
     * Kezeli az erdő növekedését az idő múlásával
     */
    grow(): void {
        if (this.age < 10) {
            this.age += 1;
            this.bonus += 5;
        } else {
            this.maintenance = 0;
        }
    }

    /**
     * Visszaadja az erdő fenntartási költségét
     * @returns {number}
     */
    getMaintenance(): number {
        return this.maintenance;
    }

    react(): void {
    }

    remove(): void {
    }

    /**
     * JSON string-et csinál az objektumból
     * @returns {string}
     */
    toJSON(): string {
        return genericToJSON(this, 'Forest');
    }

    /**
     * A JSON string-et beolvassa az objektumba
     * @param {string} s
     */
    fromJSON(s: string): void {
        genericFromJSON(s, this);
    }

}
