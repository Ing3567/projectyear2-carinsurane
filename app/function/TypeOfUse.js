import { Discount, AddPrice } from './Calculation'; 

function TypeOfUse(typeOfUse,price){
    switch(typeOfUse)
    {
        case 'รย1' :return Discount(price,0);
        case 'รย2' :return Discount(price,0);
        case 'รย3' :return Discount(price,0);
        case 'รย4' :return Discount(price,0);
        case 'รย5' :return AddPrice(price,10);
        case 'รย6' :return AddPrice(price,10);
        case 'รย7' :return AddPrice(price,10);
        case 'รย8' :return AddPrice(price,10);
        case 'รย9' :return AddPrice(price,10);
        case 'รย10' :return AddPrice(price,10);
        case 'รย11' :return AddPrice(price,10);
        case 'รย12' :return Discount(price,0);
        default : throw new Error('There is a problem in typeOfUse')
    }
}

export { TypeOfUse };