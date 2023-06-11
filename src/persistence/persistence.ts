import {GameMatrix} from "../model/GameMatrix";
import {Simulation} from "../model/Simulation";
import {LoadMatrix, LoadSimulation} from "../types/core.model";

export class Persistence {

    /**
     * Creates a JSON save from the current game state
     * @param {gameMatrix} gameMatrix
     * @param {string} cityName
     */
    public save(gameMatrix : GameMatrix, cityName : string): void {
        const json = {
            city_name : cityName,
            ...gameMatrix.toJSON(),
        }
        this.download(json);
    }

    /**
     * Loads JSON data into the current game state
     * @param {Blob} blob
     * @param callback
     */
    public load(blob :Blob, callback: (gameMatrix: GameMatrix, cityName: string) => void) : void{
        const gameMatrix = new GameMatrix(100);
        const simulation = new Simulation();
        const fs = new FileReader();
        fs.readAsText(blob,'UTF-8');
        fs.onload = e =>{
            let jsonString = ''
            if(!e.target?.result) return;
            if(typeof e.target?.result === 'string'){
                jsonString = e.target?.result
            }else{
                jsonString = Buffer.from(e.target?.result).toString();
            }
            const parsed = JSON.parse(jsonString)

            if(!(parsed && parsed.city_name
                && parsed.game_area
                && parsed.simulation
                && this.gameFileValidator(parsed.game_area, parsed.simulation))) return;

            simulation.fromJSON(JSON.parse(parsed.simulation))
            gameMatrix.fromJSON(parsed.game_area, simulation)
            callback(gameMatrix, parsed.city_name)
        }
    }

    /**
     * Validates the JSON file's integrity
     * @param {LoadMatrix} matrix
     * @param {LoadMatrix} simulation
     * @returns {boolean}
     */
    gameFileValidator(matrix : LoadMatrix, simulation : LoadSimulation) : boolean{
        for (let row in matrix) {
            if(!row) return false;
            for(let element in JSON.parse(row)){
                if(!element) return false;
                const parsedElement = JSON.parse(element);
                if(!parsedElement.coord
                    || !parsedElement.connectedCoords
                    || !parsedElement.appliedEffects
                ){
                    return false;
                }
            }
        }
        for (const data in simulation) {
            if(!data) return false;
        }
        for (const resident in simulation.residents) {
            if(!resident) return false;
        }
        return true;
    }

    /**
     * Creates a link which triggers the browser to download the JSON file that stores the current state of the game
     * @param {object} json
     */
    download(json : object){
        const jsonBlob = new Blob([JSON.stringify(json)], {
            type: "application/json",
        });

        const url = URL.createObjectURL(jsonBlob);
        const link = document.createElement("a");
        link.download = "savegame";
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}