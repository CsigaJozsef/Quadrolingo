import {DateTime} from "luxon";
import {Resident} from "./resident/Resident";
import {Economy} from "./economy/Economy";
import {IBuilding} from "../types/IBuilding";
import {Zone} from "./zone/Zone";
import {GameElement, LoadSimulation} from "../types/core.model";
import {Disaster} from "./Disaster";
import {ChartConverter} from "./economy/ChartConverter";
import {simulationFromJson, simulationToJson} from "../persistence/persistenceHelper";

/**
 * Szimulációt kezelő osztály
 * - itt tároljuk a jelenlegi dátumot
 * - itt tároljuk, hogy milyen léptékben haladjanak a napok
 * - itt tároljuk a lakosokat
 * - itt döntjük el, hogy mely lakosok fognak kiköltözni
 * - itt tároljuk a pénzügy osztályt
 * - itt tároljuk a katasztrófát, és itt dől el, hogy előidézésre kerül-e
 * - itt tároljuk a grafikonokat
 */
export class Simulation {

    private previousDate: DateTime
    private date: DateTime
    private currentStep: 0 | 1 | 2 | 3

    public residents: Resident[]

    private unsatisfied: number[]
    private economy: Economy
    private readonly disaster: Disaster

    public readonly economyChart: ChartConverter

    constructor() {
        this.date = DateTime.now()
        this.previousDate = DateTime.now()

        this.currentStep = 0
        this.residents = []
        this.unsatisfied = []

        this.economy = new Economy()
        this.disaster = new Disaster()
        this.economyChart = new ChartConverter()
    }

    /**
     * Egy év elteltével a lakosok öregednek egy évvel,
     * és meg kell vizsgálni, hogy életben vannak-e még.
     * - Évente van esély egy katasztrófára, azt itt vizsgáljuk
     * @param callback reagáló függvény (frontend)
     */
    handlePassedYear(callback: () => void) {
        if (this.date.year !== this.previousDate.year) {
            this.previousDate = DateTime.now()

            this.residents = this.residents.map(resident => {
                if (resident.celebrateBirthday()) {
                    return resident
                }
                return new Resident()
            })

            this.disaster.handleBegin(this.date)

            callback();
        }
    }

    /**
     * Havonta fontosabb műveletek, logikák elvégzése
     * - A grafikon frissítése
     * - Tűzesetek vizsgálása
     * - Bevétel begyűjtése
     * @param matrix pálya model
     */
    handleMonthlyTasks(matrix: GameElement[][]){
        const { cityIncome, cityExpense } = this.economy.handleIncome(matrix, this.residents, this.disaster)
        this.economyChart.appendToIncome(this.date.month, Math.abs(cityIncome));
        this.economyChart.appendToExpense(this.date.month, Math.abs(cityExpense));

        matrix.forEach(vector => {
            vector.forEach(tile => {
                tile.element.isOnFire = Math.random() < tile.element.fireChance
            })
        })

        this.economyChart.appendIncome();
        this.economyChart.appendExpense();
        this.economyChart.popBack()
    }

    /**
     * Egy hónap elteltének lekezelése
     * - ha egy lakosnak nincs munkahelye, akkor az elégedettsége csökken
     * - ha egy lakos még nem volt része a pénzügyeknek, tehát nem volt még munkája,
     * akkor hozzáadjuk a pénzügyekhez
     * - ha a lakos elégedettsége kisebb, mint 30, de elkezdett már dolgozni, akkor 30-ig visszanöveljük (nem azonnal)
     * - az elégedetlen lakosokat kiköltöztetjük
     * - ha van aktív katasztrófa, akkor megvizsgáljuk, hogy vége van-e
     * - megvizsgáljuk, hogy jöhetnek-e új lakosok
     * @param callback reagáló függvény (frontend)
     */
    handlePassedMonth(callback: (isGameOver: boolean) => void) {
        if (this.date.month !== this.previousDate.month) {
            this.previousDate = this.previousDate.plus({ month: 1 })

            this.residents.forEach(resident => {
                if (!resident.isPaying) {
                    const satisfaction = resident.getSatisfaction().getSatisfaction
                    resident.getSatisfaction().changeSatisfaction = satisfaction-1
                }else{
                    if(!resident.isEconomyApplied && resident.isPaying){
                        this.economy.changeIncome(resident.generatedProduction, false)
                        resident.isEconomyApplied = true
                    }

                    if(resident.getSatisfaction().getSatisfaction < 30){
                        const satisfaction = resident.getSatisfaction().getSatisfaction
                        resident.getSatisfaction().changeSatisfaction = satisfaction+1
                    }
                }
            })

            this.disaster.handleEnd(this.date)
            this.removeResidents()
            this.incomingResidentManager()

            callback(this.isGameOver)
        }
    }

    /**
     * Szimulációs idő léptetése
     */
    handleSimulation() {
        this.date = this.date.plus({day: 2 * this.speed})
    }

    /**
     * Vége van-e a játéknak
     */
    get isGameOver(){
        return this.economy.totalMoney <= -30000
    }

    /**
     * Az össz elégedettség függvényében új lakosokkal bővítjük a várost, ha az lehetséges
     */
    incomingResidentManager(){
        let citizensPerMonth = 20
        switch(this.overallSatisfaction){
            case 0:
            case 25:
                citizensPerMonth = 20
                break
            case 50:
                citizensPerMonth = 50
                break
            case 60:
                citizensPerMonth = 100
                break
            case 80:
                citizensPerMonth = 150
                break
            case 100:
                citizensPerMonth = 300
                break
            default:
                break
        }
        this.addNewResidents(citizensPerMonth)
    }

    /**
     * Az össz elégedettség meghatározása
     * - csak olyan lakos tartozik ebbe, akinek van otthona
     * - ha van aktív katasztrófa, akkor itt alkalmazzuk azt a lakosra
     */
    get overallSatisfaction() {
        let satisfaction = 0
        this.residents.forEach(resident => {
            this.disaster.applyDisaster(resident)

            if(resident.hasHome)
                satisfaction += resident.getSatisfaction().getSatisfaction
        })

        return (Math.round(satisfaction / this.population)) || 0
    }


    get cityMoney() {
        return this.economy.getTotalMoney()
    }

    get population() {
        const residentsWithHome = this.residents.filter(
            resident => resident.hasHome
        )

        return residentsWithHome.length
    }

    /**
     * Új lakosok hozzáadása a városhoz
     * @param numberOfResidents új lakosok száma
     */
    addNewResidents(numberOfResidents: number) {
        const residents: Resident[] = []
        let i = 0
        while (i < numberOfResidents) {
            residents.push(new Resident())
            i++
        }

        this.residents = [...this.residents, ...residents]
    }

    /**
     * Az elégedetlen lakosokat eltávolítjuk,
     * emellett pedig megvizsgáljuk, hogy jövő hónapban
     * mely lakosokat fogjuk kiköltöztetni
     */
    removeResidents() {
        this.unsatisfied.forEach(residentIndex => {
            const resident = this.residents[residentIndex]

            if(!resident) return

            if(resident.isEconomyApplied){
                this.economy.changeIncome(resident.generatedProduction, true)
                resident.isEconomyApplied = false
                resident.isPaying = false
            }
            resident.movedOut = true

            resident.getSatisfaction().changeSatisfaction = 50
        })

        this.unsatisfied = []

        this.residents.forEach((resident, index) => {
            if (resident.willMoveOut()) {
                this.unsatisfied.push(index)
            }
        })
    }

    /**
     * Épület lehelyezés lekezelése pénzügyileg
     * @param building épület amit le szeretnénk rakni
     */
    handlePlace(building: IBuilding) {
        const cost = building.buildCost

        this.changeMoney(cost)
        return true
    }

    /**
     * A játékos pénzének manipulálása pozitív, vagy negatív irányba
     * - itt a grafikont is manipuláljuk ennek megfelelően
     * @param n szóban lévő összeg
     * @param negate az adott tranzakció kiadásnak számít-e
     */
    changeMoney(n: number, negate = false){
        if(negate){
            this.economyChart.appendToExpense(this.date.month, n)
        }else{
            this.economyChart.appendToIncome(this.date.month, n)
        }

        this.economy.changeTotalMoney(n, negate)
    }

    /**
     * Rombolást lekezelő függvény pénzügyileg
     * @param building az épület, amit lerombolunk
     */
    handleDestroy(building: IBuilding) {
        const sellValue = building.sellValue
        this.changeMoney(sellValue, true)
        building.remove()

        this.residents.forEach(resident=> {
            if(!resident.isPaying && resident.hasHome){
                if(resident.isEconomyApplied){
                    this.economy.changeIncome(resident.generatedProduction, true)
                    resident.isEconomyApplied = false
                }
            }
        })

        this.removeHomelessResidents()
    }

    /**
     * A hajléktalan lakosok kiköltöztetése
     */
    removeHomelessResidents() {
        const residentsCopy: Resident[] = []
        this.residents.forEach((resident) => {
            if(!resident.hasHome) return

            residentsCopy.push(resident)
        })

        this.residents = residentsCopy
    }

    /**
     * Visszafejlesztést végző függvény pénzügyileg
     * @param zone az adott zóna típusú épület
     */
    handleDowngrade(zone: Zone){
        const zoneLevel = zone.currentLevel
        const demoteValue = zone.demoteValue

        zone.demote()

        if(zoneLevel !== zone.currentLevel){
            this.changeMoney(demoteValue, true)
        }
    }

    /**
     * Fejlesztést végző függvény pénzügyileg
     * @param zone az adott zóna típusú épület
     */
    handleUpgrade(zone: Zone){
        const zoneLevel = zone.currentLevel
        const upgradeCost = zone.upgradeCost

        zone.upgrade()

        if(zoneLevel !== zone.currentLevel){
            this.changeMoney(upgradeCost)
        }
    }

    set speed(step: 0 | 1 | 2 | 3) {
        this.currentStep = step
    }

    get speed() {
        return this.currentStep
    }

    set currentTax(tax: number) {
        this.economy.zoneTax = tax
    }

    get currentTax() {
        return this.economy.getZoneTax() * 100
    }

    get isDisasterActive() {
        return this.disaster.active
    }

    toJSON(){
        return simulationToJson(this);
    }
    fromJSON(simulationLoad : LoadSimulation){
        simulationFromJson(simulationLoad, this);
    }

    get getPreviousDate(){
        return this.previousDate;
    }
    get getEconomy(){
        return this.economy;
    }
    get getDate(){
        return this.date;
    }
    get getCurrentStep(){
        return this.currentStep;
    }
    get getUnsatisfied(){
        return this.unsatisfied;
    }
    set setPreviousDate(prevDate : DateTime){
       this.previousDate = prevDate;
    }
    set setDate(date : DateTime){
        this.date = date;
    }
    set setCurrentStep(step : 0 | 1 | 2 | 3){
        this.currentStep = step;
    }
    set setUnsatisfied(unsatisfied : number[]){
        this.unsatisfied = unsatisfied;
    }
}