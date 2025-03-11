function Discount(price, discount) {
    return price * ((100 - discount) / 100)
}

function AddPrice(price, addprice) {
    return price * ((100 + addprice) / 100)
}

export { Discount, AddPrice };