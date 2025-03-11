import { Discount, AddPrice } from './Calculation'; 

function Deductible(deductible,price){
    deductible = Number(deductible);
    switch(deductible)
    {
        case 0 : return AddPrice(price,10);
        case 1000 : return Discount(price,1);
        case 2000 : return Discount(price,3);
        case 3000 : return Discount(price,5);
        case 4000 : return Discount(price,7);
        case 5000 : return Discount(price,10);
        default : throw new Error('There is a problem in deductible')
    }
}

export { Deductible };