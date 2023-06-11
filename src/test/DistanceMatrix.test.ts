import {DistanceMatrix} from "../model/DistanceMatrix"

describe('Distance matrix', () => {
    const matrix = new DistanceMatrix([
        [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
        [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}],
        [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}]
    ])

    it('should give back distance', () => {
        expect(matrix.calculateFrom({x: 1, y: 1})[0][0].distance).toBe(1)
        expect(matrix.calculateFrom({x: 4, y: 4}).length).toBe(0)
    })
})