import {useCallback, useEffect, useRef, useState} from "react";
import {GameMatrix} from "../model/GameMatrix";
import {Forest} from "../model/building/Forest";
import {Grass} from "../model/building/Grass";

/**
 * A szimulációt a Frontendhez kötő React Horog
 *
 * - Legfőbb feladata az idő múlásának kezelése egy intervallummal
 * - Mivel a model módosítás egy komplexebb állapot módosítással jár, ezért ez a horog ezt is lekezeli egy
 * állapot módosító "proxy"-val
 * - Itt történnek továbbá az idő múlását lekezelő frontend függvények meghívásai
 * (pl:. Játék vége, eltelt hónap kezelése...)
 */
function useSimulation(): [GameMatrix, (g: GameMatrix) => void] {

    /**
     * A model állapota
     */
    const [
        model,
        setModel
    ] = useState<GameMatrix>(new GameMatrix(100))

    const gameOverRef = useRef<boolean>(false)

    /**
     * Intervallum referencia
     */
    const intervalRef = useRef<NodeJS.Timer>()

    /**
     * A komplex állapot módosítást lekezelő "proxy" függvény
     * @param model módosult model
     */
    const setModelGuard = (model: GameMatrix) => {
        const newModel = new GameMatrix(100)
        newModel.model = model

        setModel(newModel)
    }

    /**
     * Egy adott hónap eltelését kezelő callback függvény
     * - fő feladata, hogy elvégezze a havi feladatokat, pl:. költségek kiszámolása,
     * továbbá elvégzi, hogy a játéktér reagáljon is erre
     *
     * @param isGameOver a szimuláció dönti el, hogy vége van-e a játéknak, ezt az értéket kapja paraméterül
     * a szimulációtól
     */
    const passedMonthCallback = useCallback((isGameOver: boolean) => {
        console.log("month passed")

        model.board.forEach(vector => {
            vector.forEach(tile => {
                if(tile.element instanceof Forest) {
                    let upExists = (tile.coord.y - 1 >= 0);
                    let downExists = (tile.coord.y + 1 < model.board.length);
                    let rightExists = (tile.coord.x + 1 < model.board.length);
                    let leftExists = (tile.coord.x - 1 >= 0);
                    if (upExists && model.board[tile.coord.y - 1][tile.coord.x].element instanceof Grass) {
                        if (Math.random() <= 0.05) {
                            model.board[tile.coord.y - 1][tile.coord.x].element = new Forest()
                        }
                    }

                    if (downExists && model.board[tile.coord.y + 1][tile.coord.x].element instanceof Grass) {
                        if (Math.random() <= 0.05) {
                            model.board[tile.coord.y + 1][tile.coord.x].element = new Forest()
                        }
                    }

                    if (rightExists && model.board[tile.coord.y][tile.coord.x + 1].element instanceof Grass) {
                        if (Math.random() <= 0.05) {
                            model.board[tile.coord.y][tile.coord.x + 1].element = new Forest()
                        }
                    }

                    if (leftExists && model.board[tile.coord.y][tile.coord.x - 1].element instanceof Grass) {
                        if (Math.random() <= 0.05) {
                            model.board[tile.coord.y][tile.coord.x - 1].element = new Forest()
                        }
                    }
                }
            })
        })

        if(isGameOver){
            if(!gameOverRef.current){
                alert("A játék véget ért!")
                clearInterval(intervalRef.current)

                gameOverRef.current = true
            }
        }
        model.reactToAction()
        model.simulation.handleMonthlyTasks(model.board)

        setModelGuard(model)
    }, [model])

    /**
     * Egy év eltelését kezelő callback függvény
     * - fő feladata, hogy a fák élettartalmát növelje
     */
    const passedYearCallback = useCallback(() => {
        console.log("Year passed")
        model.board.forEach(vector => {
            vector.forEach(tile => {
                if(tile.element instanceof Forest){
                    tile.element.grow()
                    model.effectManager.calculateTreeBonusFromForest(
                        tile.coord,
                        model.board,
                        false,
                        true
                    );
                }
            })
        })
        setModelGuard(model)
    }, [model])

    /**
     * Módosítások elvégzése
     */
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if(!gameOverRef.current){
                model.simulation.handleSimulation()
                model.simulation.handlePassedMonth(passedMonthCallback)

                model.simulation.handlePassedYear(passedYearCallback)
            }
        }, 1000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [model, passedMonthCallback, passedYearCallback])

    return [model, setModelGuard]
}

export default useSimulation