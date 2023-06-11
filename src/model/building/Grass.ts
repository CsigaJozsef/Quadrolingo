import {IBuilding} from "../../types/IBuilding";

/**
 * Ez az osztály csak design szerepet tölt be,
 * semmilyen funkcionalitás nem tartozik hozzá,
 * csak annyi, hogy különböző fű textúrákat jelenítsen meg
 */
export class Grass implements IBuilding{
    buildCost: number;
    buildSize: number;
    crimeChance: number;
    effect: number;

    fireChance: number;
    isOnFire: boolean;
    sellValue: number;

    texture: string;

    constructor() {
        this.buildCost = 0
        this.buildSize = 1
        this.crimeChance = 0
        this.effect = 0
        this.fireChance = 0
        this.isOnFire = false
        this.sellValue = 0

        const rand = Math.round(Math.random() * (2 - 1) + 1)
        this.texture = require(`../../images/Grass/grass_${rand}.png`)
    }

    fromJSON(s: string): void {}

    react(): void {}

    remove(): void {}

    toJSON(): string {
        return "";
    }

}