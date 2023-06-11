import {Coordinate, DistanceCoordinate} from "../types/core.model";


/**
 * Ez az osztály kiszámít egy távolság mátrixot
 * egy kiindulási pontból, és képes szűkíteni is azt
 *
 */
export class DistanceMatrix {
    constructor(private matrix: Coordinate[][]) {
    }

    private exists(coord: Coordinate) {
        const index = this.matrix.findIndex(
            vector => {
                const coordIndex = vector.findIndex(
                    c => c.x === coord.x && c.y === coord.y
                )
                return coordIndex !== -1
            }
        )
        return index !== -1
    }

    getCoordinates(){
        return this.matrix;
    }

    /**
     *
     * Kiválogatja a kapott mátrixból, a maxDistance-től kisebb,
     * vagy egyenlő értékeket
     *
     */
    private filterMatrix(distanceCoordinateMatrix: DistanceCoordinate[][], maxDistance: number){
        const temp: DistanceCoordinate[][] = []

        distanceCoordinateMatrix.forEach(vector => {
            const t = vector.filter(elem => elem.distance <= maxDistance)

            if(t.length !== 0)
                temp.push(t)
        })

        return temp
    }

    /**
     * @param coord - egy adott koordináta. Ha nem szerepel a konstruktorban meghatározott mátrixban,
     * akkor üres tömböt kapunk vissza
     *
     * @param maxDistance - opcionális paraméter, ami akkor fontos, ha szeretnénk
     * kiválogatni elemeket. Minden olyan elemet visszakapunk, ami kisebb vagy egyenlő ettől az értéktől.
     * Ha nincs megadva, akkor a teljes távolság mátrixot visszakapjuk
     *
     * @description Egy adott koordinátától számítva kiszámítja,
     * hogy melyik koordináta milyen messze van tőle,
     * és visszaadja ezt a mátrixot
     *
     */
    calculateFrom(coord: Coordinate, maxDistance?: number): DistanceCoordinate[][] {
        if (!this.exists(coord)) {
            return []
        }

        let distanceCoords: DistanceCoordinate[][] = []

        this.matrix.forEach(
            vector => {
                const distanceCoordsVector : DistanceCoordinate[] = []
                vector.forEach(
                    c => {
                        const D = Math.sqrt(
                            Math.pow(c.x - coord.x, 2)
                            +
                            Math.pow(c.y - coord.y, 2)
                        )
                        distanceCoordsVector.push({coordinate:c,distance:Math.round(D)})
                    })
                distanceCoords.push(distanceCoordsVector)
            }
        )

        if(maxDistance !== undefined){
            distanceCoords = this.filterMatrix(distanceCoords, maxDistance)
        }

        return distanceCoords
    }
}