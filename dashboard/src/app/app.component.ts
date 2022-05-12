import { Component, OnInit } from '@angular/core';
import { Printerx } from './models/year-month';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'dashboard - contagem de impressões mensais por setor';

  years : string [] = ["2022", "2023"];
  months : string [] = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 
                        'JULHO', 'AGOSTO','SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  fyear !: any;
  fmonth !: any;
  table_content : Printerx [] = [];
  csv_content : string [] = [];
  dtOptions: any = {};

  constructor (){

    this.dtOptions = {
      pagingType: 'full_numbers',
      paging: true,
      pageLength: 50,
      bSort: false,
      dom: 'Bfrtip',
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
    console.log("Reloading data...");
    console.log (this.fyear);
    console.log (this.fmonth);
    this.openFile(this.fmonth.toLowerCase(), this.fyear);
  }

  openFile (m : string, y : string){

    console.log ('/assets/bases/'+m+'-'+y+'.csv');
    this.csv_content.splice(0);
    this.table_content.splice(0);
    fetch('/assets/bases/'+m+'-'+y+'.csv').then(res => res.text())
      .then(result => {
        let all_lines = result.split(/\n/);
        for (var line of all_lines){
          console.log(line);
          this.csv_content.push(line);
          let kv = line.split(',');
          console.log (kv[0] + " :: " + kv[1]);
          this.table_content.push(new Printerx(kv[0], kv[1]));
        }
    });
  }

  



  
}
