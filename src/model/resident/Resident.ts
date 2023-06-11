import {Satisfaction} from "./Satisfaction";
import {genericFromJSON, genericToJSON} from "../../persistence/persistenceHelper";

/**
 * Lakos osztály
 * - minden lakosnak van egyedi azonosítója
 * - van egy generált bevétele, amiből adózni fog
 * - van elégedettsége
 * - van életkora
 * - meg tud halni
 * - tudjuk, hogy van-e otthona
 * - tudjuk, hogy van-e munkahelye
 * - tudjuk hogy kihatott-e rá a katasztrófa
 */
export class Resident {

    /**
     * Ez a változó határozza meg az egyedi azonosítót
     * @private
     */
    private static globalId = 0

    private readonly id: number
    public readonly generatedProduction: number;
    private totalTaxBefore : number;
    private money: number;
    private age: number;
    private satisfaction: Satisfaction;
    private readonly pensionAge: number;

    private isPartOfEconomy: boolean
    public isEconomyApplied: boolean

    public hasHome: boolean
    public isDisasterApplied: boolean
    public movedOut: boolean
    constructor() {
        this.id = ++Resident.globalId

        this.generatedProduction = Math.round(Math.random() * 30 + 75);
        this.pensionAge = 65;
        this.money = 0;
        this.age = 18;
        this.satisfaction = new Satisfaction();
        this.totalTaxBefore = 0;

        this.isPartOfEconomy = false
        this.hasHome = false
        this.isDisasterApplied = false
        this.isEconomyApplied = false
        this.movedOut = false;
    }

    /**
     * Évente egyszer megnöveljük a korát a lakosnak
     * - 5% esély van arra, hogy meghal
     * - ha még él, akkor a visszatérési érték igaz
     */
    public celebrateBirthday(): boolean {
        const isAlive = (Math.random() > 0.05);
        if (isAlive) ++this.age;
        return isAlive;
    }

    /**
     * Tud-e még dolgozni (elérte-e már a nyugdíjas kort)
     */
    public canWork(): boolean {
        if(this.age < this.pensionAge){
            return true
        }
        this.isPartOfEconomy = false
        return false;
    }

    /**
     * Ki fog-e költözni hosszan tartó elégedetlenség miatt
     * - elégedetlenség vizsgálatot végzünk
     */
    public willMoveOut(): boolean {
        return !this.satisfaction.isSatisfied();
    }

    /**
     * Lekérdezzük a lakos korát
     */
    public get getAge(): number {
        return this.age;
    }

    //Perzisztencia

    toJSON(): string {
        return genericToJSON(this, 'Resident');
    }

    fromJSON(s: string): void {
        genericFromJSON(s, this);
    }

    //Perzisztencia vége

    getSatisfaction(){
        return this.satisfaction
    }

    get isPaying(){
        return this.isPartOfEconomy
    }

    set isPaying(isPaying){
        this.isPartOfEconomy = isPaying
    }

    equals(resident: Resident){
        return this.id === resident.id
    }

    set satisfactionValue(x: number) {
        this.satisfaction.changeSatisfaction = x
    }

    setSatisfaction(sat : Satisfaction) : void{
        this.satisfaction = sat;
    }
    
    get getPensionAge(){return this.pensionAge}
    get getTotalTexBefore(){return this.totalTaxBefore}
}