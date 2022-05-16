export class Printerx {
    name !: string;
    campi !: string;
    total !: string;
  
    constructor (n : string = '', c : string, t : string  = ''){
      this.name = n;
      this.campi = c;
      this.total  = t;
    }
}