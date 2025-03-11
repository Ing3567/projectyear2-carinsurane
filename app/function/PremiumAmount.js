import { PrismaClient } from '@prisma/client'
import { Discount, AddPrice } from './Calculation'; 
import {CoverageAmount} from './CoverageAmount'
import {Deductible} from './Deductible'
import {GarageType} from './GarageType'
import {TypeOfUse} from './TypeOfUse'
import {YearOfCar} from './YearOfCar'
import {Dashcam} from './Dashcam'
import {PolicyType} from './PolicyType'
const prisma = new PrismaClient()

async function CountClaim(customerID,price){
  const claimCount = await prisma.claim.count({
    where: {
        policy: {
            CustomerID: customerID, 
        },
        ClaimStatus: 1,  
    },
});
console.log(claimCount);
      switch(claimCount){
        case 0: return Discount(price,5); 
        case 1: return Discount(price,4); 
        case 2: return Discount(price,0); 
        case 3: return AddPrice(price,5); 
        case 4: return AddPrice(price,7); 
        case 5: return AddPrice(price,10); 
        case 6: return AddPrice(price,15); 
        default: return AddPrice(price,22); 
      }
}

async function PremiumAmountforRenew({ Customer }) {
  const data = Customer;
  console.log(data)
  const firstprice = await prisma.model.findFirst({
    where:{
      Model: data.Model,
      Brand: data.Brand,
    },
    select:{
      Price:true,
    }
  })
  let price = firstprice.Price
  
  if(data.RenewOrNew === "Renew"){
  price = await CountClaim(data.customerID,price);
  }


  price = CoverageAmount(Number(data.CoverageAmount),price)
 
  price = Deductible(Number(data.Deductible),price)
  
  price = GarageType(data.GarageType,price)
 
  price = TypeOfUse(data.TypeOfUse,price)
 
  price = YearOfCar(data.Registration,price)
  
  price = Dashcam(data.CarDashCam,price)
  
  price = PolicyType(data.PolicyType,price)
  

  return parseFloat(price.toFixed(2));
}

export { PremiumAmountforRenew };