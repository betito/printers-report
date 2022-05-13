import { Component, OnInit } from '@angular/core';
import { Printerx } from './models/year-month';


export interface IPrinter {
  name : string;
  total : string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'dashboard - contagem de impressões mensais por setor';

  displayedColumns: string[] = ['name', 'total'];

  years : string [] = ["2022", "2023"];
  months : string [] = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 
                        'JULHO', 'AGOSTO','SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  fyear !: any;
  fmonth !: any;
  table_content : IPrinter [] = [];
  dtOptions: any = {};

  constructor (){

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      bSort: false,
      dom: 'Bfrtip',
      paging: false,
      fixedColumns: {
        heightMatch: 'none'
      },
      buttons: [
        'copy',
        'print',
        'excel'
      ]
    };

    const today = new Date()
    this.fmonth =  this.months[today.getMonth()];
    this.fyear  =  today.getFullYear();

    console.log (this.fyear);
    console.log (this.fmonth);

  }

  ngOnInit(): void {
    
  }

  public onClick_reload(){
    // console.log("Reloading data...");
    // console.log (this.fyear);
    // console.log (this.fmonth);
    this.openFile(this.fmonth.toLowerCase(), this.fyear);
  }

  onChange(valueD : any){
    this.openFile(this.fmonth.toLowerCase(), this.fyear);
    // console.log("Caiu no updateData :: " + valueD);
  }


  openFile (m : string, y : string){

    console.log ('./assets/bases/'+m+'-'+y+'.csv');
    this.table_content.splice(0);
    fetch('./assets/bases/'+m+'-'+y+'.csv').then(res => res.text())
      .then(result => {
        // console.log("RESULT :: " + result);
        if (result.includes("<!DOCTYPE") == true){
          alert('Fetch Error : NOT FOUND!');
        }else{
          let all_lines = result.split(/\n/);
          for (var line of all_lines){

            // console.log(line);
            let kv = line.split(',');
            // console.log (kv[0] + " :: " + kv[1]);
            let element : IPrinter  =  { name : kv[0], total : kv[1] };
            this.table_content.push({ name : kv[0], total : kv[1] });
            
          }
        }
      })
      .catch(function(err)
      {
       alert('Fetch Error : NOT FOUND!');
      });
  }

  



  
}
