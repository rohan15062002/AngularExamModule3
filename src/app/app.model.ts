export interface User {
    username:string,
    email:string,
    phone:number |null,
    address:string|null,
    pinCode:string|null,
    role: 'admin' | 'customer';
}

export interface Product {
    id?:string,
    name:string,
    description:string,
    quantity:number,
    status:string,
    timestamp?:string;
    userEmail?:string;
    userName?:string;
}

export interface NewProduct {
    name:string,
    description:string,
    quantity:number,
    status:string,
    timestamp?:string;
    userEmail?:string;
    userName?:string;
}


