import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YearMonth } from './models/year-month';

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

  constructor (){

    const today = new Date()
    this.fmonth =  this.months[ today.getMonth()];
    this.fyear  =  today.getFullYear;

    console.log (this.fyear);
    console.log (this.fmonth);

  }

  ngOnInit(): void {
    
  }

  public onClick_reload(){
    console.log("Reloading data...");
    console.log (this.fyear);
    console.log (this.fmonth);
  }
  
}
