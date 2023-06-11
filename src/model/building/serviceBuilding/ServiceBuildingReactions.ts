import {PoliceStation} from "./PoliceStation";
import {Stadium} from "./Stadium";
import {FireStation} from "./FireStation";
import {Resident} from "../../resident/Resident";

/**
 * A dolgozni képes lakókkal való interakció lekezelése
 * @param {Stadium | PoliceStation | FireStation} serviceBuilding
 * @param {Resident[]} residents
 */
export const workerReaction = (serviceBuilding : Stadium | PoliceStation | FireStation, residents : Resident[]) : void =>{
    if(serviceBuilding.workerCapacity > serviceBuilding.workers.length) {
        for (const resident of residents) {
            if (serviceBuilding.workerCapacity <= serviceBuilding.workers.length)
                break

            if (resident.isPaying || !resident.hasHome) {
                continue
            }

            const index = serviceBuilding.workers.findIndex(
                r => r.equals(resident)
            )

            if (index !== -1) {
                continue;
            }

            resident.isPaying = true
            serviceBuilding.workers.push(resident)
        }
    }
}

/**
 * A vásárlókkal való interakció lekezelése
 * @param {Stadium} serviceBuilding
 * @param {Resident[]} residents
 */
export const customerReaction = (serviceBuilding : Stadium, residents : Resident[]) : void => {
    if(serviceBuilding.visitorCapacity > serviceBuilding.customers.length) {
        for (const resident of residents) {
            if (serviceBuilding.visitorCapacity <= serviceBuilding.customers.length)
                break

            if (!resident.isPaying) {
                continue
            }

            const index = serviceBuilding.customers.findIndex(
                r => r.equals(resident)
            )

            if (index !== -1) {
                continue
            }

            serviceBuilding.customers.push(resident)
        }
    }
}

/**
 * Törlésre alkalmasra teszi a kitörlendő kiszolgálóépületet
 * @param {Stadium | PoliceStation | FireStation} serviceBuilding
 */
export const handleRemove = (serviceBuilding : Stadium | PoliceStation | FireStation) : void =>{
    serviceBuilding.workers.forEach(worker => {
        worker.isPaying = false
    })
    serviceBuilding.workers = []

    if(serviceBuilding instanceof Stadium){
        serviceBuilding.customers = []
    }
}