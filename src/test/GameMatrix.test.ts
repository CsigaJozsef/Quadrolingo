import {GameMatrix} from "../model/GameMatrix";
import {Road} from "../model/building/Road";
import {Forest} from "../model/building/Forest";
import {Stadium} from "../model/building/serviceBuilding/Stadium";
import {Grass} from "../model/building/Grass";

describe("GameMatrix model test", () => {
    const gameMatrix = new GameMatrix(100)
    const road = gameMatrix.board[0][20]


    it("should generate a starting road", function () {
        expect(road.element instanceof Road).toBe(true)
    })

    it('should not replace another element', function () {
        expect(gameMatrix.place(road.coord, new Forest())).toBe(false)
        expect(road.element instanceof Road).toBe(true)
    });

    it('should not place anything when element is not specified', function () {
        expect(gameMatrix.place(road.coord)).toBe(false)
    });

    it('should place an element', function () {


        let [ x,y ] = [ 21, 0 ]

        gameMatrix.board[y][x].element = new Grass()

        expect(gameMatrix.place({ x, y }, new Forest())).toBe(true)
        expect(gameMatrix.place({ x, y }, new Forest())).toBe(false)
        expect(!!gameMatrix.board[y][x].element).toBe(true)

    });

    it('should not place a stadium', function () {
        let { x, y } = road.coord

        expect(gameMatrix.place(road.coord, new Stadium())).toBe(false)
        expect(gameMatrix.board[y][x].element instanceof Road).toBe(true)

        x++; y++

        expect(gameMatrix.place({ x, y }, new Stadium())).toBe(false)
        expect(gameMatrix.board[y-1][x-1].element instanceof Road).toBe(true)

        y--

        expect(gameMatrix.place({ x, y }, new Stadium())).toBe(false)
        expect(gameMatrix.board[y][x-1].element instanceof Road).toBe(true)

        x++

        expect(gameMatrix.place({ x, y }, new Stadium())).toBe(false)
        expect(gameMatrix.board[y][x-2].element instanceof Road).toBe(true)

        expect(gameMatrix.place({ x:0, y:0 }, new Stadium())).toBe(false)
        expect(gameMatrix.place({ x:1, y:0 }, new Stadium())).toBe(false)
        expect(gameMatrix.place({ x:0, y:1 }, new Stadium())).toBe(false)
    });

    it('should place a stadium', function () {
        gameMatrix.board[0][19].element = new Grass()
        gameMatrix.board[0][18].element = new Grass()
        gameMatrix.board[1][19].element = new Grass()
        gameMatrix.board[1][18].element = new Grass()

        expect(gameMatrix.place({ x: 19, y: 1 }, new Stadium())).toBe(true)
    });

    it('should return the matrix', function () {
        expect(typeof gameMatrix.board).toBe("object")
    });

    it('should return the coordinates for an element', function () {
        expect(gameMatrix.getCoordinates({ x:5, y:5 }, new Road()).length).toBe(1)
        expect(gameMatrix.getCoordinates({ x:5, y:5 }, new Stadium()).length).toBe(4)
    });

    it('should modify the board', function () {
        gameMatrix.board = []
        expect(gameMatrix.board.length).toBe(0)
    });
})