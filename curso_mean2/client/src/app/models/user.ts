// Nos permite usar e importar la clase User en otros ficheros
export class User{  
    constructor(
        public _id: string,
        public name:string,
        public surname:string,
        public email:string,
        public password:string,
        public role:string,
        public image:string
    ){}
}