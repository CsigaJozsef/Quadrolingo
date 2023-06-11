import {IBuilding} from "types/IBuilding";
import {genericFromJSON, genericToJSON} from "../../persistence/persistenceHelper";
import {Connection} from "../../types/core.model";

/**
 * A játéktér út típusa, az IBuilding tulajdonságon felül:
 * - meg tudjuk mondani róla, hogy kapcsolódik-e a kezdő úthoz
 * - meg tudjunk mondani, hogy az adott út kezdő út-e
 * - meg tudjuk mondani, hogy milyen irányban kapcsolódnak hozzá utak
 */
export class Road implements IBuilding {

    connected: boolean;
    isEntryPoint: boolean;

    buildCost: number;
    buildSize: number;
    crimeChance: number;
    effect: number;

    fireChance: number;
    isOnFire: boolean;
    sellValue: number;
    texture: string;

    connection: Connection

    public constructor() {
        this.connected = false;
        this.isEntryPoint = false;

        this.buildCost = 20;
        this.buildSize = 1;
        this.crimeChance = 0;
        this.effect = 0;

        this.fireChance = 0;
        this.isOnFire = false;
        this.sellValue = 5;

        this.texture = require("../../images/Road/road.png");

        this.connection = {
            left: false, right: false, up: false, down: false
        }
    }

    react(): void {}

    remove(): void {}

    /**
     * JSON string-et Úttá alakít
     * @param {string} s
     */
    fromJSON(s: string): void {
        genericFromJSON(s, this);
    }

    /**
     * JSON string-et csinál az objektumból
     * @returns {string}
     */
    toJSON(): string {
        return genericToJSON(this, 'Road');
    }

    setConnected() : void {
        this.connected = true;
    }

    setDisconnected() : void {
        this.connected = false;
    }

    isConnected() : boolean {
        return this.connected;
    }
}