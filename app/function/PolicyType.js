import { Discount, AddPrice } from './Calculation'; 

function PolicyType(PolicyType,price){
    switch(PolicyType)
    {
        case '1' :return AddPrice(price,10);
        case '2+' :return AddPrice(price,5);
        case '2' :return AddPrice(price,0);
        case '3+' :return Discount(price,3);
        case '3' :return Discount(price,5);
        default : throw new Error('There is a problem in garageType')
    }
}

export { PolicyType };