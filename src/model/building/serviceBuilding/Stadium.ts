import {ServiceBuilding} from "./ServiceBuilding";
import {Resident} from "../../resident/Resident";
import {customerReaction, handleRemove, workerReaction} from "./ServiceBuildingReactions";
import {genericFromJSON, genericToJSON} from "../../../persistence/persistenceHelper";

/**
 * Stadion kiszolgáló épület
 */
export class Stadium extends ServiceBuilding {
    public visitorCapacity: number = 20;

    public workers: Resident[] = []
    public customers: Resident[] = []

    constructor() {
        super(4, 1000, 0, 0.3, 0.3,require("../../../images/ServiceBuilding/stadium_4.png"));
    }

    /**
     * Lakókkal való interakció lekezelése
     * @param {Resident[]} residents
     */
    react(...residents: Resident[]): void {
        workerReaction(this, residents);

        customerReaction(this, residents);
    }

    /**
     * Törli az elemet a játéktérről
     */
    remove(): void {
        handleRemove(this);
    }

    /**
     * JSON string-et csinál az objektumból
     * @returns {string}
     */
    toJSON(): string {
        return genericToJSON(this, 'Stadium');
    }

    /**
     * JSON string-et Stadionná alakít
     * @param {string} s
     */
    fromJSON(s: string): void {
        genericFromJSON(s, this);
    }
}