import {DistanceMatrix} from '../DistanceMatrix';
import {Coordinate, GameElement} from "../../types/core.model";
import {Residential} from "./Residential";
import {Industrial} from "./Industrial";
import {Commercial} from "./Commercial";
import {Grass} from "../building/Grass";
import {Road} from "../building/Road";
import {Forest} from "../building/Forest";
import {IBuilding} from "../../types/IBuilding";
import {FireStation} from "../building/serviceBuilding/FireStation";
import {PoliceStation} from "../building/serviceBuilding/PoliceStation";
import {Zone} from "./Zone";
import {Stadium} from "../building/serviceBuilding/Stadium";

/**
 * Ez az osztály felel a területi effektek kifejtéséért, illetve
 * adott területet effektáló épületek kezeléséért
 * */
export class EffectManager{

    /**
     * @param c - Melyik koordináta körül akarjuk ezt a mátrixot létrehozni
     *
     * @param matrix - A pályára mutató referencia, a megfelelő koordináták másolásához, illetve a távolságok számolásához
     *
     * @param radius - Adott pontol mekkor távolságú pontokat válogassuk bele a distance mátrixba
     *
     * @description - Előkészíti magát a distance mátrixot
     * */
    private setupDistanceMatrix(c: Coordinate, matrix:GameElement[][],radius:number){
        const coords = matrix.map(vector => {
            return vector.map(elem => elem.coord)
        })
        let dMatrix = new DistanceMatrix(coords);
        return dMatrix.calculateFrom(c, radius)
    }

    /**
     * @description - Egy adott sugáron belüli rezidenciák és lakosaik elégedettségét megváltoztatja
     * */
    changeSatisfactionInRadiusOf(c:Coordinate, matrix:GameElement[][], effect: number, radius: number):void{
        //Előkészít egy mátrixot ami egy adott sugáron belül elhelyezkedők pálya elemeket tartalmazza, távolsággal, koordinátával
        let d = this.setupDistanceMatrix(c,matrix,radius)

        d.forEach(vector => {
            vector.forEach(elem => {
                //Mivel tudjuk hogy a lehelyezett nem rezidencia így azt nem akarjuk vizsgálni (c!=elem.coordinate)
                //Rezidenciákat keresünk
                if(c.x !== elem.coordinate.x && c.y !== elem.coordinate.y
                    && matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Residential)
                {
                    console.log('Residential on ' + (elem.coordinate.x) +':'+ (elem.coordinate.y))
                    let actResidential = matrix[elem.coordinate.y][elem.coordinate.x].element as Residential
                    //Az adott rezidenciában lakó lakosoknak megváltoztatjuk az elégedettségét
                    actResidential.residents.forEach(resident => {
                        resident.satisfactionValue = resident.getSatisfaction().getSatisfaction + effect;
                    })
                    //Mivel késöbb költözhetnek be ezért a zone satisfactionben tároljuk el,
                    // hogy a késöbbi beköltözők milyen elégedettséggel kezdik az életüket ott
                    actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction + effect;
                }
            })
        })
    }

    /**
     * @description - Egy adott pozicióra lehelyezett tűzoltóság hatásait felyti ki
     * */
    newFireStationAt(c:Coordinate, matrix:GameElement[][]):void{
        //changeSatisfactionInRadiusOf mintája alapján
        let d = this.setupDistanceMatrix(c,matrix,30)

        d.forEach(vector => {
            vector.forEach(elem => {
                if(c.x !== elem.coordinate.x && c.y !== elem.coordinate.y
                    && matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Residential)
                {
                    console.log('Residential on ' + (elem.coordinate.x) +':'+ (elem.coordinate.y))
                    let actResidential = matrix[elem.coordinate.y][elem.coordinate.x].element as Residential
                    actResidential.residents.forEach(resident => {
                        resident.satisfactionValue = resident.getSatisfaction().getSatisfaction + 20;
                    })
                    actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction + 20;
                }

                //A megfelelő zónákra megváltoztatjuk a fireChance-et
                if(c.x !== elem.coordinate.x && c.y !== elem.coordinate.y
                    && (matrix[elem.coordinate.y][elem.coordinate.x].element instanceof PoliceStation
                    || matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Stadium
                    || matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Zone
                    || matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Forest)){
                    console.log("fireChance changed")
                    matrix[elem.coordinate.y][elem.coordinate.x].element.fireChance = 0.1
                }
            })
        })
    }

    /**
     * @description - Egy adott pozicióra lehelyezett rendőrség hatásait felyti ki
     * */
    newPoliceStationAt(c:Coordinate, matrix:GameElement[][]):void{
        //changeSatisfactionInRadiusOf mintája alapján
        let d = this.setupDistanceMatrix(c,matrix,30)
        //console.table(d);

        d.forEach(vector => {
            vector.forEach(elem => {
                if(c !== elem.coordinate && matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Residential){
                    console.log('Residential on ' + (elem.coordinate.x) +':'+ (elem.coordinate.y))
                    let actResidential = matrix[elem.coordinate.y][elem.coordinate.x].element as Residential
                    actResidential.residents.forEach(resident => {
                        resident.satisfactionValue = resident.getSatisfaction().getSatisfaction + 30;
                    })
                    actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction + 30;
                }

                //A megfelelő zónákra megváltoztatjuk a crimeChance-et
                if(c !== elem.coordinate && (matrix[elem.coordinate.y][elem.coordinate.x].element instanceof FireStation
                    || matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Stadium
                    || matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Residential
                    || matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Industrial
                    || matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Forest))
                {
                    console.log("crimeChance changed")
                    matrix[elem.coordinate.y][elem.coordinate.x].element.crimeChance = 0.05
                }
            })
        })
    }

    /**
     * @description - Egy adott pozicióra lehelyezett tűzöltóság hatásait felyti vonja vissza
     * */
    destroyFireStationAt(c:Coordinate, matrix:GameElement[][]){
        let d = this.setupDistanceMatrix(c,matrix,30)

        //Megekeressük az elemeket amelyekre hatás volt kifejtve ezen stáció által
        d.forEach(vector => {
            vector.forEach(elem => {

                let actBlock = matrix[elem.coordinate.y][elem.coordinate.x].element

                if(c !== elem.coordinate && (actBlock instanceof PoliceStation || actBlock instanceof Stadium
                    || actBlock instanceof Zone || actBlock instanceof Forest)){

                    //Mikor találunk ilyen elemet ellenőrizzük, hogy van-e másik tűzoltóság,
                    // ami hatást felytene ki és ez alapján változtatjuk az értékeit a talált elemnek
                    if(!(this.isFireStationAround({x:elem.coordinate.x,y:elem.coordinate.y}, c, matrix))){
                        console.log("No other fire station around")
                        if(actBlock instanceof Industrial){
                            actBlock.fireChance = 0.4
                        }
                        else if(actBlock instanceof Residential)
                        {
                            let actResidential = actBlock as Residential
                            actResidential.fireChance = 0.3
                            actResidential.residents.forEach(resident => {
                                resident.satisfactionValue = resident.getSatisfaction().getSatisfaction - 20;
                            })
                            actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction - 20;
                        }
                        else
                        {
                            actBlock.fireChance = 0.3
                        }
                    }
                    else
                    {
                        if(actBlock instanceof Residential)
                        {
                            let actResidential = actBlock as Residential
                            actResidential.residents.forEach(resident => {
                                resident.satisfactionValue = resident.getSatisfaction().getSatisfaction - 20;
                            })
                            actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction - 20;
                        }
                        console.log("Other  fire station found")
                    }
                }
            })
        })
    }

    /**
     * @description - Egy adott pozicióra lehelyezett rendőrség hatásait felyti vonja vissza
     * */
    destroyPoliceStationAt(c:Coordinate, matrix:GameElement[][]){
        let d = this.setupDistanceMatrix(c,matrix,30)

        //Megkeressük azokat a lehelyezett elemeket amelyekre hatást fejtettünk ki
        d.forEach(vector => {
            vector.forEach(elem => {

                let actBlock = matrix[elem.coordinate.y][elem.coordinate.x].element

                if(c !== elem.coordinate && (actBlock instanceof FireStation || actBlock instanceof Stadium
                    || actBlock instanceof Zone || actBlock instanceof Forest))
                {
                    //Mikor találunk ilyen elemet ellenőrizzük, hogy van-e másik rendőrség,
                    // ami hatást felytene ki és ez alapján változtatjuk az értékeit a talált elemnek
                    if(!this.isPoliceStationAround({x:elem.coordinate.x,y:elem.coordinate.y}, c, matrix)){
                        console.log("No other police station found")
                        if(actBlock instanceof Residential)
                        {
                            let actResidential = actBlock as Residential
                            actResidential.crimeChance = 0.3
                            actResidential.residents.forEach(resident => {
                                resident.satisfactionValue = resident.getSatisfaction().getSatisfaction - 30;
                            })
                            actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction - 30;
                        }
                        else
                        {
                            actBlock.crimeChance = 0.3
                        }
                    }
                    else
                    {
                        if(actBlock instanceof Residential)
                        {
                            let actResidential = actBlock as Residential
                            actResidential.residents.forEach(resident => {
                                resident.satisfactionValue = resident.getSatisfaction().getSatisfaction - 30;
                            })
                            actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction - 30;
                        }
                        console.log("Other  police station found")
                    }
                }
            })
        })
    }

    /**
     * @description - Egy segédfüggvény adott koordináta körül elhelyezkedő rendőrségek megtalálására
     * */
    private isPoliceStationAround(c:Coordinate, cPrevStation:Coordinate, matrix:GameElement[][]):boolean{
        let d = this.setupDistanceMatrix(c,matrix,30)
        console.log("Looking for other police station")
        let l = false
        //Végigjárjuk a megfelelő sugárban a koordinátákat,
        // és ha találunk rendőrséget akkor ki lépünk a keresésből és igazzal térünk vissza
        d.forEach(vector => {
            vector.forEach(elem => {
                if(c.x !== elem.coordinate.x && c.y !== elem.coordinate.y
                    && cPrevStation.x !== elem.coordinate.x && cPrevStation.y !== elem.coordinate.y
                    && matrix[elem.coordinate.y][elem.coordinate.x].element instanceof PoliceStation){
                    console.log("Police station in area found")
                    l = true
                    return true
                }
            })
            if(l){
                return true;
            }
        })
        return l
    }

    /**
     * @description - Egy segédfüggvény adott koordináta körül elhelyezkedő tűzoltóságok megtalálására
     * */
    private isFireStationAround(c:Coordinate, cPrevStation:Coordinate, matrix:GameElement[][]):boolean{
        //isPoliceStationAround mintájára
        let d = this.setupDistanceMatrix(c,matrix,30)
        console.log("Looking for other fire station destroyed at:"+cPrevStation.x+" : "+cPrevStation.y)
        let l = false
        d.forEach(vector => {
            vector.forEach(elem => {
                if(c.x !== elem.coordinate.x && c.y !== elem.coordinate.y
                    && cPrevStation.x !== elem.coordinate.x && cPrevStation.y !== elem.coordinate.y
                    && matrix[elem.coordinate.y][elem.coordinate.x].element instanceof FireStation){
                    console.log("Fire station in area found")
                    l = true;
                    return
                }
            })
            if(l) return
        })
        return l
    }

    takeEffectsAroundOf(c:Coordinate, matrix:GameElement[][]){

        let d10 = this.setupDistanceMatrix(c,matrix,10)
        let d30 = this.setupDistanceMatrix(c,matrix,30)
        let d50 = this.setupDistanceMatrix(c,matrix,50)
        //console.table(d);
        let effectSum = 0;
        d10.forEach(vector => {
            vector.forEach(elem => {
                if(c !== elem.coordinate){
                    if(matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Industrial){
                        effectSum -= 5
                    }
                    if(matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Commercial){
                        effectSum += 5
                    }
                }
            })
        })

        d30.forEach(vector => {
            vector.forEach(elem => {
                if(c !== elem.coordinate){
                    if(matrix[elem.coordinate.y][elem.coordinate.x].element instanceof FireStation){
                        effectSum += 20
                    }
                    if(matrix[elem.coordinate.y][elem.coordinate.x].element instanceof PoliceStation){
                        effectSum += 30
                    }
                }
            })
        })

        //effectSumHelperForStadium
        let eshs = 0

        d50.forEach(vector => {
            vector.forEach(elem => {
                if(c !== elem.coordinate){
                    if(matrix[elem.coordinate.y][elem.coordinate.x].element instanceof Stadium){
                        eshs += 50
                    }
                }
            })
        })

        effectSum += (eshs / 4)

        console.log("Sum of effects:"+effectSum)
        let actResidential = matrix[c.y][c.x].element as Residential
        actResidential.residents.forEach(resident => {
            resident.satisfactionValue = resident.getSatisfaction().getSatisfaction + effectSum;
        })
        actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction + effectSum;
    }

    /**
     * A lakózóna épülésekor felveszi az összes erdő aktuális bónuszát maga körül, ezt valósítja meg a függvény
     * @param {Coordinate} c
     * @param {GameElement[][]} matrix
     */
    calculateTreeBonusFromResidential(c:Coordinate, matrix:GameElement[][]){
        let element : IBuilding;
        let d3 = this.setupDistanceMatrix(c,matrix,3)
        //console.table(d3);

        let sumEffect = 0;

        d3.forEach(vector => {
            vector.forEach(elem => {
                if(c.x !== elem.coordinate.x && c.y !== elem.coordinate.y){
                    element = matrix[elem.coordinate.y][elem.coordinate.x].element
                    if(element instanceof Forest){
                        const values = this.calculateDirectionOfForest(element, sumEffect);
                        sumEffect += values.bonus
                    }
                }
            })
        })

        /*

        let totalBonus = 0;
        let isNorthGood = true;
        let isEastGood = true;
        let isSouthGood = true;
        let isWestGood = true;


        for(let i = 1; i <= 3; i++){
            if(c.y + i < matrix.length && isSouthGood) {
                element = matrix[c.y + i][c.x].element;
                const values = this.calculateDirectionOfForest(element, totalBonus);
                isSouthGood = values.direction;
                totalBonus = values.bonus;
            }
            if (c.y - i >= 0 && isNorthGood) {
                element = matrix[c.y - i][c.x].element;
                const values = this.calculateDirectionOfForest(element, totalBonus);
                isNorthGood = values.direction;
                totalBonus = values.bonus;
            }
        }

        for(let i = 1; i <= 3; i++){
            if(c.x + i < matrix[c.y].length && isEastGood) {
                element = matrix[c.y][c.x + i].element;
                const values = this.calculateDirectionOfForest(element, totalBonus);
                isEastGood = values.direction;
                totalBonus = values.bonus;
            }
            if ( c.x - i >= 0 && isWestGood) {
                element = matrix[c.y][c.x - i].element;
                const values = this.calculateDirectionOfForest(element, totalBonus);
                isWestGood = values.direction;
                totalBonus = values.bonus;
            }
        }
         */

        this.addBonusToActualResidental(matrix[c.y][c.x].element as Residential, sumEffect);
    }

    /**
     * Az erdőkből induló bónusz kiszámítását valósítja emg attól függően hogy törlünk, építünk vagy az erdő növekedett
     * @param {Coordinate} c
     * @param {GameElement[][]} matrix
     * @param {boolean} isDelete
     * @param {boolean} isGrow
     */
    calculateTreeBonusFromForest(c:Coordinate, matrix:GameElement[][], isDelete : boolean, isGrow : boolean){
        let forest = matrix[c.y][c.x].element as Forest;
        let bonus = (isDelete ? forest.bonus*-1 : forest.bonus);
        bonus = (isGrow ? 5 : bonus);
        /*
        let isNorthDone = false;
        let isEastDone = false;
        let isSouthDone = false;
        let isWestDone = false;
         */
        let element : IBuilding;

        let d3 = this.setupDistanceMatrix(c,matrix,3)
        //console.table(d3);

        d3.forEach(vector => {
            vector.forEach(elem => {
                if(c.x !== elem.coordinate.x && c.y !== elem.coordinate.y){
                    element = matrix[elem.coordinate.y][elem.coordinate.x].element;
                    if(element instanceof Residential){
                            this.addBonusToActualResidental(element, bonus);
                    }
                }
            })
        })

        /*

        for(let i = 1; i <= 3; i++) {
            if ( c.y + i < matrix.length && !isSouthDone) {
                element = matrix[c.y + i][c.x].element;
                if (element instanceof Residential) {
                    isSouthDone = true;
                    this.addBonusToActualResidental(element, bonus);
                }else if(!(element instanceof Grass || element instanceof Road)){
                    isSouthDone = true;
                }
            }
            if (c.y - i >= 0 && !isNorthDone) {
                element = matrix[c.y - i][c.x].element;
                if (element instanceof Residential) {
                    isNorthDone = true;
                    this.addBonusToActualResidental(element, bonus);
                }else if(!(element instanceof Grass || element instanceof Road)){
                    isNorthDone = true;
                }
            }
        }
        for(let i = 1; i <= 3; i++){
            if (c.x + i < matrix[c.y].length && !isEastDone) {
                element = matrix[c.y][c.x + i].element;
                if (element instanceof Residential) {
                    isEastDone = true;
                    this.addBonusToActualResidental(element, bonus);
                }else if(!(element instanceof Grass || element instanceof Road)){
                    isEastDone = true;
                }
            }
            if (c.x - i >= 0 && !isWestDone) {
                element = matrix[c.y][c.x - i].element;
                if (element instanceof Residential) {
                    isWestDone = true;
                    this.addBonusToActualResidental(element, bonus);
                }else if(!(element instanceof Grass || element instanceof Road)){
                    isWestDone = true;
                }
            }
        }

         */
    }

    /**
     * Megkeresi hogy van-e fa a latótávon és ha igen, akkor visszaadja a totális bónuszt ami az adott épületre kerül
     * illetve hogy lehet-e abba az irányba ovább haladni (nincs-e valami ami takarná ami mögötte van)
     * @param {IBuilding} element
     * @param {number} totalBonus
     * @returns {bonus : number, direction : boolean}
     */
    calculateDirectionOfForest(element : IBuilding,totalBonus : number) : {bonus : number, direction : boolean}{
        if (element instanceof Forest) {
            return {bonus : element.bonus + totalBonus, direction : false};
        } else if (element instanceof Grass || element instanceof Road) {
            return {bonus : totalBonus, direction : true};
        }
        return {bonus : totalBonus, direction : false};
    }

    /**
     * A kapott bónuszt hozzáadja az összes lakóhoz illetve a lakózónához
     * @param {Residential} actResidential
     * @param {number} bonus
     */
    addBonusToActualResidental(actResidential : Residential, bonus : number){
        actResidential.residents.forEach(resident => {
            resident.satisfactionValue = resident.getSatisfaction().getSatisfaction + bonus;
        })
        actResidential.zoneSatisfactionValue = actResidential.getZoneSatisfaction + bonus;
    }
}