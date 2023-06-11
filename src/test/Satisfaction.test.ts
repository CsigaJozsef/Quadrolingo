import {Satisfaction} from "../model/resident/Satisfaction"

describe('Satisfaction', () => {
    const sat = new Satisfaction()

    it('should change satisfaction', () => {
        sat.changeSatisfaction = 75
        expect(sat.getSatisfaction).toBe(75)

        sat.changeSatisfaction = 101
        expect(sat.getSatisfaction).toBe(75)
    })

    it('should give if satisfied', () => {
        expect(sat.isSatisfied()).toBe(true)

        sat.changeSatisfaction = 24
        expect(sat.isSatisfied()).toBe(false)
    })
})