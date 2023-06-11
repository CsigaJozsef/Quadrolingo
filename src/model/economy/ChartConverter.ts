import {ChartData, ChartDataset} from "chart.js";
import {ChartStyle, MonthlyData} from "../../types/core.model";

/**
 * Pénzügyi diagramot előállító osztály
 * - 12 hónapos lebontással tudja megjeleníteni a kiadásokat és a bevételeket
 * - minden hónapban látjuk külön ábrán a kiadásokat és a bevételeket
 */
export class ChartConverter {

    private readonly possibleMonths: string[]
    private readonly labels: string[]
    private readonly datasets: ChartDataset<"line", number[]>[]
    private monthlyIncomeData: MonthlyData[]
    private monthlyExpenseData: MonthlyData[]

    constructor() {
        this.labels = []
        this.datasets = []
        this.monthlyIncomeData = []
        this.monthlyExpenseData = []

        //Van benne egy üres string, hogy 1-től induljon az indexelés
        this.possibleMonths = [
            '', 'Január', 'Február', 'Március', 'Április',
            'Május', 'Június', 'Július', 'Augusztus',
            'Szeptember', 'Október', 'November', 'December'
        ]
    }

    /**
     * Ha több, mint 12 havi adatot jelenítenénk meg,
     * akkor a legrégebbit eltávolítjuk
     */
    popBack(){
        const incomeIndex = this.datasets.findIndex(
            data => data.label === "Bevételek"
        )
        const expenseIndex = this.datasets.findIndex(
            data => data.label === "Kiadások"
        )

        if(incomeIndex !== -1){
            if(this.labels.length > 12){
                this.datasets[incomeIndex].data.shift()
                this.labels.shift()
            }
        }

        if(expenseIndex !== -1){
            if(this.labels.length > 12){
                this.datasets[incomeIndex].data.shift()
                this.labels.shift()
            }
        }
    }

    /**
     * Egy adott hónapban növeljük a bevételi adatokat
     * - le van kezelve, ha a hónap nincs [1;12] intervallumban
     * - ha nem létezik az adott hónapban adat, akkor újat hozunk létre
     * - ha létezik, akkor hozzáadjuk
     * @param month jelenlegi hónap
     * @param data az adat, amit rögzítenénk
     */
    appendToIncome(month: number, data: number){
        if(month > 12 || month < 1) return

        const currentMonth = this.possibleMonths[month]

        const index = this.monthlyIncomeData.findIndex(elem => elem.month === currentMonth)

        if(index === -1){
            this.monthlyIncomeData.push({
                month: currentMonth,
                data
            })

            return
        }

        this.monthlyIncomeData[index].data += data
    }

    /**
     * Egy adott hónapban növeljük a kiadási adatokat
     * - le van kezelve, ha a hónap nincs [1;12] intervallumban
     * - ha nem létezik az adott hónapban adat, akkor újat hozunk létre
     * - ha létezik, akkor hozzáadjuk
     * @param month jelenlegi hónap
     * @param data az adat, amit rögzítenénk
     */
    appendToExpense(month: number, data: number){
        if(month > 12 || month < 1) return

        const currentMonth = this.possibleMonths[month]

        const index = this.monthlyExpenseData.findIndex(elem => elem.month === currentMonth)

        if(index === -1){
            this.monthlyExpenseData.push({
                month: currentMonth,
                data
            })

            return
        }

        this.monthlyExpenseData[index].data += data
    }

    /**
     * Az eddig tárolt bevételi adatok vizuális megjelenítése
     */
    appendIncome() {
        this.append("Bevételek", this.monthlyIncomeData, {
            borderColor: "rgb(96, 245, 66)",
            backgroundColor: "rgba(96, 245, 66, 0.5)"
        })
    }

    /**
     * Az eddig tárolt kiadási adatok vizuális megjelenítése
     */
    appendExpense() {
        this.append("Kiadások", this.monthlyExpenseData)
    }

    /**
     * Általános diagramhoz adás feladatának elvégzése
     * - le van kezelve, ha nincs adat
     * - ha nincs adott címkéjű adat, akkor újat hozunk létre
     * - ha már van, akkor hozzáfűzzük
     * @param label az adott adat milyen címkével jelenjen meg
     * @param data az adat, amit meg akarunk jeleníteni
     * @param style milyen legyen az adott reprezentáció stílusa
     * @private
     */
    private append(label:string, data: MonthlyData[], style?: ChartStyle){
        const current = data.shift()

        if(!current) return

        if(!this.labels.includes(current.month)){
            this.labels.push(current.month)
        }

        const index = this.datasets.findIndex(
            ds => ds.label === label
        )

        if(index === -1){
            this.datasets.push({
                label,
                data: [current.data],
                borderColor: style ? style.borderColor : 'rgb(255, 99, 132)',
                backgroundColor: style ? style.backgroundColor : 'rgba(255, 99, 132, 0.5)',
            })
            return
        }

        this.datasets[index].data.push(current.data)
    }

    /**
     * Megjelenítendő adatok visszaadása
     */
    get chartData(): ChartData<"line", number[], string> {
        return {
            labels: this.labels,
            datasets: this.datasets
        }
    }

    /**
     * Általános chart beállítások visszaadása
     */
    get options() {
        return {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: 'Bevételek & Kiadások',
                },
            },
        }
    }
}