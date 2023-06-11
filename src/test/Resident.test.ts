import {Resident} from "../model/resident/Resident"

describe('Resident', () => {
    const resident = new Resident()

    it('celebrates birthday', () => {
        if(!resident.celebrateBirthday()){
            return
        }
        expect(resident.getAge).toBe(19)
    })

    it('should work', () => {
        expect(resident.canWork()).toBe(true)

        for (let i = 0; i < 60; i++) {
            resident.celebrateBirthday()
        }

        expect(resident.canWork()).toBe(false)
    })

    it('should move', () => {
        expect(resident.willMoveOut()).toBe(false)

        resident.getSatisfaction().changeSatisfaction = 24
        expect(resident.willMoveOut()).toBe(true)

    })
})