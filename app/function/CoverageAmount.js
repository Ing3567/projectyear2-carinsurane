import { Discount, AddPrice } from './Calculation'; 

 function CoverageAmount(coverageAmount, price) {
    if (coverageAmount === 500000) {
        return Discount(price, 0)
    } else if (coverageAmount === 1000000) {
        return AddPrice(price, 5)
    } else if (coverageAmount === 1500000) {
        return AddPrice(price, 7)
    } else if (coverageAmount > 1500000) {
        return AddPrice(price, 10)
    }
}

export { CoverageAmount };