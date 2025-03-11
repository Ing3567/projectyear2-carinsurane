import { Discount, AddPrice } from './Calculation'; 

function GarageType(garageType,price){
    switch(garageType)
    {
        case 'ซ่อมศูนย์' :return Discount(price,2);
        case 'ซ่อมอู่' :return Discount(price,0);
        case 'ซ่อมศูนย์/ซ่อมอู่' :return AddPrice(price,5);
        default : throw new Error('There is a problem in garageType')
    }
}

export { GarageType };