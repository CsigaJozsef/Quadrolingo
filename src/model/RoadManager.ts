import {Coordinate, GameElement, roadsAround} from "../types/core.model";
import {Road} from "./building/Road";
import {Grass} from "./building/Grass";

/**
 * Ez az osztály felel az:
 * - utak törléséért,
 * - utak összekötéséért
 * - illetve tartalmazza az ehhez szükséges segédfüggvényeket
 */
export class RoadManager {

    /**
     * Az összes lehelyezett út koordinátája
     * @private
     */
    private allRoadCoordinates: Coordinate[];

    constructor(){
        this.allRoadCoordinates = []
    }

    /**
     * Új út hozzáadása
     * @param c az út koordinátája
     */
    public addNewRoadToRecords(c:Coordinate):void{
        this.allRoadCoordinates.push(c);
    }

    /**
     * Az adott elem út mellett van-e
     *
     * @param buildSize mekkora az adott épület
     * @param c az aktuális koordináta
     * @param isRoad út típusú-e az elem
     * @param matrixSize a játék mögött álló mátrix mérete
     * @param matrix a játék mögött álló mátrix
     */
    isElementNextToRoad(buildSize: number, c: Coordinate, isRoad: boolean, matrixSize: number, matrix: GameElement[][]): boolean{
        const {x, y} = c
        let l = false
        if (isRoad) {
            l = true;
        } else {
            if (buildSize === 4) {

                if (x + 1 < matrixSize) {
                    if (matrix[y][x + 1].element instanceof Road) {
                        if((matrix[y][x + 1].element as Road).isConnected()) {
                            l = true;
                        }
                    }
                }

                if (y + 1 < matrixSize) {
                    if (matrix[y + 1][x].element instanceof Road) {
                        if((matrix[y + 1][x].element as Road).isConnected()){
                            l = true;
                        }
                    }
                }

                if (y + 1 < matrixSize && x - 1 >= 0) {
                    if (matrix[y + 1][x - 1].element instanceof Road) {
                        if((matrix[y + 1][x - 1].element as Road).isConnected()){
                            l = true;
                        }
                    }
                }

                if (x + 1 < matrixSize && y - 1 >= 0) {
                    if (matrix[y - 1][x + 1].element instanceof Road) {
                        if((matrix[y - 1][x + 1].element as Road).isConnected()){
                            l = true;
                        }
                    }
                }

                if (x - 2 >= 0) {
                    if (matrix[y][x - 2].element instanceof Road) {
                        if((matrix[y][x - 2].element as Road).isConnected()){
                            l = true;
                        }
                    }
                }

                if (y - 1 >= 0 && x - 2 >= 0) {
                    if (matrix[y - 1][x - 2].element instanceof Road) {
                        if((matrix[y - 1][x - 2].element as Road).isConnected()){
                            l = true;
                        }
                    }
                }

                if (y - 2 >= 0) {
                    if (matrix[y - 2][x].element instanceof Road) {
                        if ((matrix[y - 2][x].element as Road).isConnected()) {
                            l = true;
                        }
                    }
                }

                if (x - 1 >= 0 && y - 2 >= 0) {
                    if (matrix[y - 2][x - 1].element instanceof Road) {
                        if((matrix[y - 2][x - 1].element as Road).isConnected()){
                            l = true;
                        }
                    }
                }

            } else {

                let roadsAround = this.findRoadsAround({x,y}, true, matrixSize, matrix)

                if(roadsAround.up){
                    l = true;
                }

                if(roadsAround.down){
                    l = true;
                }

                if(roadsAround.right){
                    l = true;
                }

                if(roadsAround.left){
                    l = true;
                }
            }
        }

        return l;
    }

    /**
     * Útkeresés a közvetlenül kapcsolódó utakra
     *
     * @param c az aktuális koordináta
     * @param connected kapcsolódnia kell-e az útnak
     * @param matrixSize a játék mögött álló mátrix mérete
     * @param matrix a játék mögött álló mátrix
     */
    findRoadsAround(c: Coordinate, connected: boolean, matrixSize: number, matrix: GameElement[][]): roadsAround {
        const {x, y} = c
        let roadsAround: roadsAround

        let upExists = (y - 1 >= 0);
        let downExists = (y + 1 < matrixSize);
        let rightExists = (x + 1 < matrixSize);
        let leftExists = (x - 1 >= 0);

        let up = false
        let down = false
        let right = false
        let left = false

        let count = 0;

        if (upExists) {
            if (matrix[y - 1][x].element instanceof Road) {
                if(connected){
                    up = (matrix[y - 1][x].element as Road).isConnected()
                    if(up) ++count
                }else{
                    up = true
                    ++count
                }
            }
        }
        if (downExists) {
            if (matrix[y + 1][x].element instanceof Road) {
                if(connected){
                    down = (matrix[y + 1][x].element as Road).isConnected()
                    if(down) ++count
                }else{
                    down = true
                    ++count
                }
            }
        }
        if (rightExists) {
            if (matrix[y][x + 1].element instanceof Road) {
                if(connected){
                    right = (matrix[y][x + 1].element as Road).isConnected()
                    if(right) ++count
                }else{
                    right = true
                    ++count
                }
            }
        }
        if (leftExists) {
            if (matrix[y][x - 1].element instanceof Road) {
                if(connected){
                    left = (matrix[y][x - 1].element as Road).isConnected()
                    if(left) ++count
                }else{
                    left = true
                    ++count
                }
            }
        }

        roadsAround = {
            up,
            down,
            right,
            left,
            count
        }

        return roadsAround
    }

    /**
     * Egy út hozzákötése a kiinduló ponthoz, ha lehetséges
     *
     * @param y koordináta
     * @param x koordináta
     * @param matrixSize a játék mögött álló mátrix mérete
     * @param matrix a játék mögött álló mátrix
     */
    connectRoads(y:number, x:number, matrixSize:number, matrix: GameElement[][]) : void{

        let connectedRoadsAround = this.findRoadsAround({x,y},true, matrixSize, matrix)
        let roadsAround = this.findRoadsAround({x,y}, false, matrixSize, matrix)

        let atLeastOneConnected = (connectedRoadsAround.up || connectedRoadsAround.down || connectedRoadsAround.left || connectedRoadsAround.right)
        let allConnected = (connectedRoadsAround.up && connectedRoadsAround.down && connectedRoadsAround.left && connectedRoadsAround.right)

        if (atLeastOneConnected && matrix[y][x].element instanceof Road) {
            (matrix[y][x].element as Road).setConnected();
        }

        if (atLeastOneConnected && !allConnected) {
            if (roadsAround.up && !connectedRoadsAround.up) {
                this.connectRoads(y - 1, x, matrixSize, matrix);
            }
            if (roadsAround.down && !connectedRoadsAround.down) {
                this.connectRoads(y + 1, x, matrixSize, matrix);
            }
            if (roadsAround.left && !connectedRoadsAround.left) {
                this.connectRoads(y, x - 1, matrixSize, matrix);
            }
            if (roadsAround.right && !connectedRoadsAround.right) {
                this.connectRoads(y, x + 1, matrixSize, matrix);
            }
        }
    }

    /**
     * Adott részutak összekötése
     * - a sávok kirajzolásának van erre szüksége
     * - ha lehelyezünk egy utat, akkor a hozzá kapcsolódó összes utat bejárja (mondhatni annak az útnak a kontextusát)
     *
     * @param x koordináta
     * @param y koordináta
     * @param matrix a játék mögött álló mátrix
     * @param coords a már bejárt koordináták (meghíváskor felesleges megadni, csak a rekurzív bejárásban van szerepe)
     */
    connectRoadsInContext(x: number, y: number, matrix: GameElement[][], coords?: Coordinate[]){
        const localCoords: Coordinate[] = []
        if(coords){
            localCoords.push(...coords)
        }

        const index = localCoords.findIndex(
            coord => coord.x === x && coord.y === y
        )

        if(index !== -1){
            return
        }

        localCoords.push({ x,y })

        const roadsAround = this.findRoadsAround({ x,y }, false, matrix.length, matrix)

        if(roadsAround.up){
            this.connectRoadsInContext(x, y-1, matrix, localCoords)
        }

        if(roadsAround.down){
            this.connectRoadsInContext(x, y+1, matrix, localCoords)
        }

        if(roadsAround.left){
            this.connectRoadsInContext(x-1, y, matrix, localCoords)
        }

        if(roadsAround.right){
            this.connectRoadsInContext(x+1, y, matrix, localCoords)
        }

        this.determineConnection(x,y, matrix, roadsAround)
    }

    /**
     * Egy adott út lerombolását lekezelő függvény
     * @param c az adott út koordinátája
     * @param matrixSize a játék mögött álló mátrix mérete
     * @param matrix a játék mögött álló mátrix
     */
    destroyRoad(c: Coordinate, matrixSize:number, matrix: GameElement[][]):void{
        const { x, y } = c
        let road = matrix[y][x].element as Road

        if(!road.isConnected()){
            this.allRoadCoordinates.splice(this.allRoadCoordinates.findIndex(arrayElement => arrayElement.x === x && arrayElement.y === y),1);
            return
        }else{
            for(let i = 0; i < this.allRoadCoordinates.length; ++i){
                (matrix[this.allRoadCoordinates[i].y][this.allRoadCoordinates[i].x].element as Road).setDisconnected()
            }
        }

        this.allRoadCoordinates.splice(this.allRoadCoordinates.findIndex(arrayElement => arrayElement.x === x && arrayElement.y === y),1);
        matrix[y][x].element = new Grass()

        this.connectRoads(1,20, matrixSize, matrix)
        this.connectRoads(0,19, matrixSize, matrix)
        this.connectRoads(0,21, matrixSize, matrix)

        this.connectRoadsInContext(x-1, y, matrix)
        this.connectRoadsInContext(x+1, y, matrix)
        this.connectRoadsInContext(x, y-1, matrix)
        this.connectRoadsInContext(x, y+1, matrix)
    }

    /**
     * Megállapítja, hogy milyen irányban van az útnak kapcsolata
     * @param x koordináta
     * @param y koordináta
     * @param matrix a játék mögött álló mátrix
     * @param roadsAround a már megállapított, a jelenlegi elemet körülvevő utak
     * @private
     */
    private determineConnection(x: number, y:number, matrix: GameElement[][], roadsAround: roadsAround){
        if(x < 0 || y < 0 || x >= matrix.length || y >= matrix.length) return

        const element = matrix[y][x].element
        if(element instanceof Road){
            const road = element as Road

            road.connection.up = roadsAround.up || road.isEntryPoint
            road.connection.down = roadsAround.down
            road.connection.left = roadsAround.left
            road.connection.right = roadsAround.right
        }
    }
}