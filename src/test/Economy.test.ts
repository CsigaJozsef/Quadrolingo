import {Economy} from "../model/economy/Economy"

describe('Economy model test', () => {
    const economy = new Economy()

    it('should modify tax', () => {
        economy.modifyTax(0.5)

        expect(economy.getZoneTax()).toBe(0.5)
    })

    it('should change income', () => {
        const income = economy.getCityIncome()

        economy.changeIncome(1000)
        expect(economy.getCityIncome()).toBe(income + 1000)
    })

    it('should give de real income', () => {
        //economy.handleIncome()
        //expect(economy.totalMoney).toBe(101000)
    })
})