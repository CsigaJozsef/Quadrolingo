import {IBuilding} from "../types/IBuilding";
import {Road} from "./building/Road";
import {RoadManager} from "./RoadManager";
import {Forest} from "./building/Forest";
import {Stadium} from "./building/serviceBuilding/Stadium";
import {Simulation} from "./Simulation";
import {Grass} from "./building/Grass";
import {Zone} from "./zone/Zone";
import {Coordinate, GameElement, LoadMatrix} from "../types/core.model";
import {Industrial} from "./zone/Industrial";
import {Commercial} from "./zone/Commercial";
import {EffectManager} from "./zone/EffectManager";
import {gameMatrixFromJson, gameMatrixToJson} from "../persistence/persistenceHelper";
import {Residential} from "./zone/Residential";
import {FireStation} from "./building/serviceBuilding/FireStation";
import {PoliceStation} from "./building/serviceBuilding/PoliceStation";

/**
 * A játék mögött álló model
 * - itt jön létre a pálya
 * - itt tároljuk a szimulációt
 * - itt kezeljük az utakat
 * - itt kezeljük a kiosztott területi hatásokat
 * - itt tároljuk és kezeljük a pályát
 */
export class GameMatrix{

    private matrix: GameElement[][]
    private matrixSize: number;
    public simulation: Simulation

    private rManager: RoadManager;

    private eManager: EffectManager;

    constructor(n: number) {
        //Inicializálás
        this.simulation = new Simulation()
        this.matrixSize = n;
        this.matrix = []
        this.rManager = new RoadManager();
        this.eManager = new EffectManager();

        //Pálya létrehozása
        for (let i = 0; i < n; i++) {
            const vector: GameElement[] = []
            for (let j = 0; j < n; j++) {
                const random = Math.random()
                vector.push({
                    coord: {
                        x: j,
                        y: i
                    },
                    element: random <= 0.05 ? new Forest() : new Grass(),
                    connectedCoords: {
                        coordinates: [],
                        reacted: false
                    }
                })
            }
            this.matrix.push(vector)
        }

        //Kezdő utak lehelyezése és alaphelyzetbe állítása
        this.matrix[0][20].element = new Road();
        this.matrix[1][20].element = new Road();
        this.matrix[2][20].element = new Road();

        (this.matrix[0][20].element as Road).setConnected();
        (this.matrix[1][20].element as Road).setConnected();
        (this.matrix[2][20].element as Road).setConnected();

        (this.matrix[0][20].element as Road).isEntryPoint = true;
        (this.matrix[1][20].element as Road).isEntryPoint = true;
        (this.matrix[2][20].element as Road).isEntryPoint = true;

        this.rManager.addNewRoadToRecords({x:20,y:1})
        this.rManager.addNewRoadToRecords({x:20,y:2})
        this.rManager.connectRoadsInContext(20,0, this.matrix)
    }

    /**
     * A pálya módosítása
     * @param matrix új pálya
     */
    set board(matrix: GameElement[][], ){
        this.matrix = matrix
    }

    /**
     * Egy épülethez szükséges koordináták meghatározása
     * @param c jelenlegi koordináta
     * @param building lehelyezendő épület
     */
    getCoordinates(c: Coordinate, building: IBuilding): Coordinate[] {
        if(building.buildSize === 4){
            return [
                { x: c.x, y: c.y },
                { x: c.x-1, y: c.y },
                { x: c.x, y: c.y-1 },
                { x: c.x-1, y: c.y-1 }
            ]
        }else{
            return [
                c
            ]
        }
    }

    /**
     * Foglalt-e az adott terület
     * @param c jelenlegi koordináta
     */
    isOccupied(c: Coordinate) {
        const { x,y } = c

        return !!this.matrix[y][x].element && !(this.matrix[y][x].element instanceof Grass)
    }

    /**
     * Ha valamilyen fontos műveletet végzünk a pályán,
     * például új épületeket rakunk le, akkor a pálya többi részének
     * arra reagálni kell.
     * Ez a függvény pedig pontosan ezt csinálja, végigiterál az egész pályán,
     * és minden lehelyezett elemtől reagálást vár el
     */
    reactToAction(){
        this.matrix.forEach(vector => {
            vector.forEach(gameElement => {
                if(gameElement.element instanceof Stadium){
                    const connections = [ gameElement ]

                    gameElement.connectedCoords.coordinates.forEach(({x,y}) => {
                        connections.push(this.matrix[y][x])
                    })

                    //A Stadion 4 elemből áll, nem szeretnénk, hogy mind a 4 reagáljon
                    if(!connections.some(conn => conn.connectedCoords.reacted)){
                        gameElement.connectedCoords.reacted = true
                        gameElement.element.react(...this.simulation.residents)
                    }
                }else{
                    gameElement.element.react(...this.simulation.residents)
                }
            })
        })

        this.cleanupAfterReaction()
    }

    /**
     * Miután reagált a pálya a módosításokra,
     * azután takarítási folyamatokat kell végeznünk,
     * például a stadionnál beállítani, hogy egy elem se reagált még.
     *
     * Ez a következő reagálás miatt fontos
     * @private
     */
    private cleanupAfterReaction(){
        this.matrix.forEach(vector => {
            vector.forEach(gameElement => {
                gameElement.connectedCoords.reacted = false
            })
        })
    }

    /**
     * A pálya reagálásának kiváltása egy épület lerakásakor
     */
    handleBuildingPlaced(){
        this.reactToAction()
    }

    /**
     * Ez a függvény végzi el a lerakási folyamatokat
     * - megvizsgálja, hogy létező épületet akarunk-e lerakni
     * - megvizsgálja, hogy az adott pozícióra lerakható-e az épület
     * - külön esetre szedi az épületeket a szükséges méretek szerint
     * - az egynél nagyobb méretű épületeknél megfelelően lehelyezi a textúrákat,
     * illetve összeköti őket, hogy ezek egy elemként funkcionálnak
     * - ha szükséges területi hatást kiváltani, akkor kiváltja azt
     * - az egy egység méretű épületeknél külön esetre szedi az utakat,
     * mivel azokhoz külön logikák kapcsolódnak
     * @param c jelenlegi koordináta
     * @param building lehelyezendő épület
     */
    place(c: Coordinate, building?: IBuilding){
        if(!building) return false

        const { x,y } = c

        if(building.buildSize === 4){
            if(x-1 < 0 || y-1 < 0 || !this.rManager.isElementNextToRoad(4,c,building instanceof Road, this.matrixSize, this.matrix)){
                return false
            }

            const temp = [
                this.matrix[y][x],
                this.matrix[y][x-1],
                this.matrix[y-1][x],
                this.matrix[y-1][x-1]
            ]

            if(temp.some(elem => !!elem.element && !(elem.element instanceof Grass))){
                return false
            }

            if(!this.simulation.handlePlace(building)){
                return false
            }

            this.matrix[y][x].element = new Stadium()
            this.matrix[y][x].element!.texture = require('images/ServiceBuilding/stadium_4.png')
            this.matrix[y][x].connectedCoords.coordinates = [
                { x: x-1, y: y },
                { x: x-1, y: y-1 },
                { x: x, y: y-1 },
            ]

            this.matrix[y][x-1].element = new Stadium()
            this.matrix[y][x-1].element!.texture = require('images/ServiceBuilding/stadium_3.png')
            this.matrix[y][x-1].connectedCoords.coordinates = [
                { x, y },
                { x: x-1, y: y-1 },
                { x, y: y-1 },
            ]

            this.matrix[y-1][x].element = new Stadium()
            this.matrix[y-1][x].element!.texture = require('images/ServiceBuilding/stadium_2.png')
            this.matrix[y-1][x].connectedCoords.coordinates = [
                { x: x-1, y },
                { x: x-1, y: y-1 },
                { x, y },
            ]

            this.matrix[y-1][x-1].element = new Stadium()
            this.matrix[y-1][x-1].element!.texture = require('images/ServiceBuilding/stadium_1.png')
            this.matrix[y-1][x-1].connectedCoords.coordinates = [
                { x, y },
                { x: x-1, y },
                { x, y: y-1 },
            ]

            this.handleBuildingPlaced()
            this.eManager.changeSatisfactionInRadiusOf(c, this.matrix, 50, 50)
            return true
        }else{
            if(this.matrix[y][x].element && !(this.matrix[y][x].element instanceof Grass))
                return false

            if(this.rManager.isElementNextToRoad(1,{x,y},building instanceof Road, this.matrixSize, this.matrix)){
                if(!this.simulation.handlePlace(building)){
                    return false
                }

                this.matrix[y][x].element = building
                this.handleBuildingPlaced()

                if(building instanceof Residential){
                    this.eManager.takeEffectsAroundOf(c, this.matrix);
                    this.eManager.calculateTreeBonusFromResidential(c, this.matrix);
                }

                if(building instanceof Forest){
                    this.eManager.calculateTreeBonusFromForest(c, this.matrix, false, false);
                }

                if(building instanceof Industrial){
                    this.eManager.changeSatisfactionInRadiusOf(c,this.matrix,-5, 10);
                }

                if(building instanceof Commercial){
                    this.eManager.changeSatisfactionInRadiusOf(c,this.matrix,5, 10);
                }

                if(building instanceof FireStation){
                    this.eManager.newFireStationAt(c,this.matrix)
                }

                if(building instanceof PoliceStation){
                    this.eManager.newPoliceStationAt(c,this.matrix)
                }
            }

            if(building instanceof Road){
                const newRoad = {x,y}
                this.rManager.addNewRoadToRecords(newRoad);
                this.rManager.connectRoads(y,x,this.matrixSize,this.matrix);
                this.rManager.connectRoadsInContext(x,y, this.matrix)
            }

            return true
        }
    }

    /**
     * Egy adott koordinátán levő épület lerombolását végzi
     * - megvizsgálja, hogy az adott pozíción van-e épület
     * - ha az adott pozíción út van, akkor az út speciális rombolási függvényét váltja ki
     * - visszavonja a területi hatásokat
     * - az egy egységnél nagyobb épületeket csoportosan eltávolítja
     * @param c jelenlegi koordináta
     */
    destroy(c: Coordinate){
        const { x, y } = c

        if(this.matrix[y][x].element){
            this.simulation.handleDestroy(this.matrix[y][x].element)

            if (this.matrix[y][x].element instanceof Road) {
                const road = this.matrix[y][x].element as Road

                if (road.isEntryPoint) return
                else this.rManager.destroyRoad({x, y}, this.matrixSize, this.matrix)
            }

            if (this.matrix[y][x].element instanceof Industrial) {
                this.eManager.changeSatisfactionInRadiusOf(c, this.matrix, 5, 10);
            }


            if(this.matrix[y][x].element instanceof Forest){
                this.eManager.calculateTreeBonusFromForest(c, this.matrix, true, false);
            }

            if (this.matrix[y][x].element instanceof Commercial) {
                this.eManager.changeSatisfactionInRadiusOf(c, this.matrix, -5, 10);
            }

            if (this.matrix[y][x].element instanceof FireStation) {
                this.eManager.destroyFireStationAt(c, this.matrix);
            }

            if (this.matrix[y][x].element instanceof PoliceStation) {
                this.eManager.destroyPoliceStationAt(c, this.matrix);
            }

            if (this.matrix[y][x].element!.buildSize === 4){
                let maxY=0
                let maxX=0
                this.matrix[y][x].connectedCoords.coordinates.forEach(({x, y}) => {
                    if(x>maxX){maxX = x}
                    if(y>maxY){maxY = y}
                    this.matrix[y][x].element = new Grass()
                    this.matrix[y][x].connectedCoords.coordinates = []
                })
                this.eManager.changeSatisfactionInRadiusOf({x:maxX, y:maxY}, this.matrix, -50, 50);
            }
            this.matrix[y][x].connectedCoords.coordinates = []
            this.matrix[y][x].element = new Grass()
        }
    }

    /**
     * A zóna fejlesztését lekezelő függvény
     * - a szimuláció fejlesztési függvényét is meghívja
     * - a pálya a módosítások után reagál
     * @param c jelenlegi koordináta
     */
    upgrade(c: Coordinate){
        const { x,y } = c

        if(this.matrix[y][x].element instanceof Zone){
            const zone = this.matrix[y][x].element as Zone

            this.simulation.handleUpgrade(zone)

            this.reactToAction()
        }
    }

    /**
     * A zóna visszafejlesztését lekezelő függvény
     * - a szimuláció visszafejlesztési függvényét is meghívja
     * - a pálya a módosítások után reagál
     * @param c jelenlegi koordináta
     */
    downgrade(c: Coordinate){
        const { x,y } = c

        if(this.matrix[y][x].element instanceof Zone){
            const zone = this.matrix[y][x].element as Zone

            this.simulation.handleDowngrade(zone)

            this.reactToAction()

            this.simulation.removeHomelessResidents()
        }
    }

    /**
     * Az objektum változóinak újradefiniálása egy másik GameMatrix objektum alapján
     * @param model GameMatrix objektum
     */
    set model(model: GameMatrix) {
        this.board = model.board
        this.simulation = model.simulation
        this.matrixSize = model.matrixSize
        this.rManager = model.rManager
    }

    get board() { return this.matrix }

    /**
     * Az adott pozíciójú elem fejleszthető-e, és ha igen, akkor a legalacsonyabb szintű-e
     * @param c jelenlegi koordináta
     */
    isMinLevel(c?: Coordinate){
        if(!c) return false

        const { x,y } = c

        if(!(this.matrix[y][x].element instanceof Zone)){
            return true
        }

        const zone = this.matrix[y][x].element as Zone

        return zone.currentLevel === 1
    }

    /**
     * Az adott pozíciójú elem fejleszthető-e, és ha igen, akkor a legmagasabb szintű-e
     * @param c jelenlegi koordináta
     */
    isMaxLevel(c?: Coordinate){
        if(!c) return false

        const { x,y } = c

        if(!(this.matrix[y][x].element instanceof Zone)){
            return true
        }

        const zone = this.matrix[y][x].element as Zone

        return zone.currentLevel === zone.maxLevel
    }

    // Perzisztencia

    toJSON(){
        return gameMatrixToJson(this);
    }

    fromJSON(matrix : LoadMatrix[][], simulation : Simulation){
        gameMatrixFromJson(matrix, simulation, this);
    }

    get effectManager(){
        return this.eManager;
    }
}