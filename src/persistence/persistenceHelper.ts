import {FireStation} from "../model/building/serviceBuilding/FireStation";
import {PoliceStation} from "../model/building/serviceBuilding/PoliceStation";
import {Stadium} from "../model/building/serviceBuilding/Stadium";
import {Forest} from "../model/building/Forest";
import {Road} from "../model/building/Road";
import {Economy} from "../model/economy/Economy";
import {Residential} from "../model/zone/Residential";
import {Resident} from "../model/resident/Resident";
import {Satisfaction} from "../model/resident/Satisfaction";
import {Commercial} from "../model/zone/Commercial";
import {Industrial} from "../model/zone/Industrial";
import {GameMatrix} from "../model/GameMatrix";
import {GameElement, LoadMatrix, LoadSimulation} from "../types/core.model";
import {Grass} from "../model/building/Grass";
import {Simulation} from "../model/Simulation";
import {elementFactory} from "../util";
import {DateTime} from "luxon";

/**
 * Collector type for the GameElements that can be saved or load similarly
 */
export type GenericElement = FireStation | PoliceStation | Stadium | Forest | Road | Economy | Resident | Residential | Satisfaction | Commercial | Industrial;

/**
 * Exports the element's data into a JSON string
 * @param {GenericElement} element
 * @param {string} type
 * @returns {string}
 */
export const genericToJSON = (element : GenericElement, type : string): string =>{
        const obj = JSON.parse(JSON.stringify({...element}))

        obj.type = type
        delete obj.eventEmitter

        return JSON.stringify(obj)
    }
/**
 * Loads the JSON string's data into the object
 * @param {string }s
 * @param {GenericElement} element
 */
export const genericFromJSON = (s: string, element : GenericElement): void =>{
        if(element instanceof Resident) {
            Object.entries(JSON.parse(s)).forEach(([key, value]) => {
                if (key === "satisfaction") {
                    const satisfaction = new Satisfaction();
                    satisfaction.fromJSON(value+"")
                    element.setSatisfaction(satisfaction);
                } else {
                    Object.assign(element, {[key]: value})
                }
            })
        }else{
            Object.entries(JSON.parse(s)).forEach(([key, value]) => {
                Object.assign(element, {[key]: value})
            })
        }
    }

/**
 * Exports the game matrix's data into a JSON string
 * @param {GameMatrix} matrix
 * @returns {string}
 */
export const gameMatrixToJson = (matrix : GameMatrix) =>{
    return {
        game_area: matrix.board.map(row => row.map(gameElement => makeJsonFromGameElement(gameElement))),
        simulation: matrix.simulation.toJSON()
    }
}

/**
 * Makes JSON from a tile on the board
 * @param {GameElement} gameElement
 * @returns {object}
 */
const makeJsonFromGameElement = (gameElement : GameElement): object =>{
    let buildingJson : string;
    if(!gameElement.element || gameElement.element instanceof Grass){
        buildingJson = JSON.stringify('');
    }else{
        buildingJson = gameElement.element?.toJSON();
    }
    let coordJson : string = JSON.stringify(gameElement.coord);
    let connectedCoordsJson : string = JSON.stringify(gameElement.connectedCoords);

    return {
        element: buildingJson,
        coord: coordJson,
        connectedCoords: connectedCoordsJson,
    }
}

/**
 * Loads JSON data into the game matrix
 * @param {LoadMatrix} matrix
 * @param {Simulation} simulation
 * @param {GameElement} gameMatrix
 */
export const gameMatrixFromJson = (matrix : LoadMatrix[][], simulation : Simulation, gameMatrix : GameMatrix) =>{
    gameMatrix.board = matrix.map(row => row.map(element => {
        const gameElement: GameElement = {
            element: new Grass(),
            coord: {x:0,y:0},
            connectedCoords: {
                coordinates: [],
                reacted: false
            }
        };
        const parsedElement = JSON.parse(element.element)
        if(parsedElement){
            const building = elementFactory(parsedElement.type);
            if(building){
                building.fromJSON(element.element)
                gameElement.element = building
            }
        }else{
            gameElement.element = new Grass()
        }
        gameElement.coord = JSON.parse(element.coord)
        gameElement.connectedCoords = JSON.parse(element.connectedCoords)

        return gameElement;
    }))
    gameMatrix.simulation = simulation;
}

/**
 * Makes a JSON string out of the simulation class
 * @param {Simulation} simulation
 * @returns {string}
 */
export const simulationToJson = (simulation : Simulation) => {
    return JSON.stringify({
        economy: simulation.getEconomy.toJSON(),
        residents: simulation.residents.map(resident => resident.toJSON()),
        previousDate: simulation.getPreviousDate,
        date: simulation.getDate,
        currentStep: simulation.getCurrentStep,
        unsatisfied: simulation.getUnsatisfied
    });
}

/**
 * Loads JSON data into the simulation class
 * @param {LoadSimulation} simulationLoad
 * @param {Simulation} simulation
 */
export const simulationFromJson = (simulationLoad : LoadSimulation, simulation : Simulation) =>{
    simulation.getEconomy.fromJSON(simulationLoad.economy)
    simulation.residents = simulationLoad.residents.map((residentString : string) => {
        const resident = new Resident();
        resident.fromJSON(residentString);
        return resident;
    })
    simulation.setPreviousDate = DateTime.fromISO(simulationLoad.previousDate)
    simulation.setDate = DateTime.fromISO(simulationLoad.date)
    simulation.setCurrentStep = simulationLoad.currentStep
    simulation.setUnsatisfied = simulationLoad.unsatisfied
}
