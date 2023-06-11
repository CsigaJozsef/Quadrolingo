import {IBuilding} from '../../types/IBuilding'
import {Resident} from "../resident/Resident";

/**
 * Zóna típus alaposztály
 * - Ezek az épület típusok fejleszthetőek
 * - ezért eltároljuk a jelenlegi szintjüket
 * - illetve a maximális szintet, amit elérhetnek
 */
export abstract class Zone implements IBuilding {

    public buildSize: number = 1
    public crimeChance: number = 0.3

    public isOnFire: boolean = false
    public effect: number = 0

    public maxLevel: number = 3
    public capacity: number = 0

    public currentLevel: number = 1

    protected constructor(
        public upgradeCost: number,
        public demoteValue: number,
        public sellValue: number,
        public fireChance: number,
        public buildCost: number,
        public texture: string) {
    }

    /**
     * Az épület reagál valamilyen interakcióra
     * @param residents
     */
    abstract react(...residents: Resident[]): void;

    /**
     * Az épület eltávolítása a pályáról
     */
    abstract remove(...residents: Resident[]): void;

    /**
     * Az épület elmentése JSON formátumba
     */
    abstract toJSON(): string;

    /**
     * Az épület visszatöltése JSON formátumból
     * @param s:string
     */
    abstract fromJSON(s: string): void;

    /**
     * Az épület fejlesztése a következő szintre
     */
    abstract upgrade(): void;

    /**
     * Az épület visszafejlesztése az előző szintre
     */
    abstract demote(): void;

}