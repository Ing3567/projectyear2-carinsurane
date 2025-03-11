import { Discount, AddPrice } from './Calculation'; 

function YearOfCar(YearOfCar,price){
    const Year = new Date().getFullYear() - YearOfCar;
    if(Year <= 5 ){
        return Discount(price,2);
    } else if(5 < Year <= 10){
        return Discount(price,1);
    } else if(Year > 10 ){
        return AddPrice(price,5);
    }
}

export { YearOfCar };