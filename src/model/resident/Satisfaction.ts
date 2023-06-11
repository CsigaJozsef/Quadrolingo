import {genericFromJSON, genericToJSON} from "../../persistence/persistenceHelper";

/**
 * A lakosok elégedettségét kezelő osztály
 * - Minden lakosnak saját elégedettsége van
 * - ez az osztály ezzel kapcsolatban végez számításokat, és futtat le logikákat
 */
export class Satisfaction{
    private satisfaction : number;
    constructor() {
        this.satisfaction = 50;
    }

    /**
     * Módosítja az aktuális elégedettséget
     * - nem módosul, ha nincs benne a [0;100] intervallumban
     * @param satisfaction új elégedettség
     */
    public set changeSatisfaction(satisfaction : number){
        if(0 <= satisfaction && satisfaction <= 100){
            this.satisfaction = satisfaction;
        }
    }

    /**
     * Visszaadja, hogy elégedett-e a lakos
     */
    public isSatisfied() : boolean{
        return this.satisfaction >= 25;
    }

    /**
     * Lekérdezhetjük az elégedettség mértékét
     */
    public get getSatisfaction() : number{
        return this.satisfaction;
    }

    //Perzisztencia

    toJSON(): string {
        return genericToJSON(this, 'Satisfaction');
    }

    fromJSON(s: string): void {
        genericFromJSON(s, this);
    }
}