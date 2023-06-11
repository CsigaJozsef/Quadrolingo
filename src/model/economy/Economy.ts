import {Resident} from "../resident/Resident";
import {Forest} from "../building/Forest";
import {ServiceBuilding} from "../building/serviceBuilding/ServiceBuilding";
import {GameElement} from "../../types/core.model";
import {Disaster} from "../Disaster";
import {genericFromJSON, genericToJSON} from "../../persistence/persistenceHelper";

/**
 * Pénzügyeket kezelő osztály
 * - itt tároljuk a jelenlegi adót
 * - a játékos pénzét
 * - a játékos bevételét (mennyit fog kapni következő hónapban)
 * - a nyugdíjat
 * - azt, hogy mennyi fenntartási költséget kell majd levonni
 */
export class Economy{

    public zoneTax : number;
    private cityIncome : number;
    public totalMoney : number;
    public pension : number;
    public maintenance : number;

    constructor(
    ){
        this.zoneTax = 0.2;
        this.cityIncome = 0;
        this.totalMoney = 6000;
        this.pension = 0;
        this.maintenance = 0;
    }

    /**
     * Beállítja az adó mértékét a kapott összegre
     * @param {number} newTax
     */
    modifyTax(newTax : number) : void{
        this.zoneTax = newTax;
    }

    /**
     * Megváltoztatja az aktuális bevétel mértékét a kapott összeggel (ha hamisat kap növeli, egyébként csökkenti)
     * @param {number} difference
     * @param {bool} negate
     */
    changeIncome(difference : number, negate = false) : void{
        this.cityIncome += (negate ? -1 : 1) * difference;
    }

    /**
     * Beállítja a város bevételét a kapott értékre
     * @param {number} income
     */
    set income(income: number){
        this.cityIncome = income
    }

    /**
     * Megváltoztatja az aktuális vagyon mértékét a kapott összeggel (ha hamisat kap növeli, egyébként csökkenti)
     * @param {number} difference
     * @param {bool} negate
     */
    changeTotalMoney(difference: number, negate = false): void {
        this.totalMoney += (negate ? 1 : -1) * difference
    }

    /**
     * Kiszámolja az összes kiadás, bevétel, esetleges katasztrófa esetén a város vagyonát
     * @param {GameElement[][]} gameArea
     * @param {Resident[]} residents
     * @param {Disaster} disaster
     */
    handleIncome(gameArea : GameElement[][], residents : Resident[], disaster: Disaster) {

        const expense = Math.round(this.cityIncome * this.zoneTax)
            -
            (this.calculatePensionValue(residents) + this.calculateMaintenance(gameArea));

        let tempIncome = this.totalMoney + expense
        if(disaster.active){
            tempIncome *= disaster.incomeReducer
        }
        this.totalMoney = tempIncome

        return { cityIncome: this.cityIncome * this.zoneTax, cityExpense: expense }
    }

    /**
     * Kiszáolja a fizetendő nyugdíj mennyiségét
     * @param {Resident[]} residents
     * @returns {number}
     */
    calculatePensionValue(residents : Resident[]) : number{
        let pension = 0;
        residents.forEach(resident =>{
            if(resident.getAge > resident.getPensionAge){
                pension += (resident.getTotalTexBefore)/240/2
            }
        })
        this.pension = pension;
        return this.pension;
    }

    /**
     * Kiszámolja a teljes fenntartás költségét
     * @param {GameElement[][]} gameArea
     * @returns {number}
     */
    calculateMaintenance(gameArea : GameElement[][]) : number{
        let maintenance = 0;
        gameArea.forEach(row => row.forEach(element => {
            if(element.element && (element.element instanceof Forest || element.element instanceof ServiceBuilding)){
                maintenance += element.element.maintenance;
            }
        }))
        this.maintenance = maintenance;
        return this.maintenance;
    }

    /**
     * Visszaadja a kivetett odó mértékét
     * @returns {number}
     */
    getZoneTax() : number{
        return this.zoneTax;
    }

    /**
     * Visszaadja a teljes bevételt
     * @returns {number}
     */
    getCityIncome() : number{
        return this.cityIncome;
    }

    /**
     * Visszaadja a város pénzének mennyiségét
     * @returns {number}
     */
    getTotalMoney() : number{
        return this.totalMoney;
    }

    /**
     * Visszaadja hogy mennyi nyugdíjat kell a városnak fizetnie összesen
     * @returns {number}
     */
    getPension() : number{
        return this.pension;
    }

    /**
     * Visszaadja a teljes fenntartási költségét a városnak
     * @returns {number}
     */
    getMaintenance() : number{
        return this.maintenance;
    }

    /**
     * JSON string-et csinál az objektumból
     * @returns {string}
     */
    toJSON(): string {
        return genericToJSON(this, 'Economy');
    }

    /**
     * A JSON string-et beolvassa az objektumba
     * @param {string} s
     */
    fromJSON(s: string): void {
        genericFromJSON(s, this);
    }
}