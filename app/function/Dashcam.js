import { Discount, AddPrice } from './Calculation'; 

 function Dashcam(Dashcam,price){
    if(Dashcam){
        return Discount(price,5);
    }else{
        return AddPrice(price,2);
    }
}

export { Dashcam };