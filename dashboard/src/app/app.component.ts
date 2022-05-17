import { Component, OnInit } from '@angular/core';
import { Printerx } from './models/year-month';


export interface IPrinter {
  name : string;
  campi : string;
  total : string;
  colorx : string;
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

  pb_total : number = 0;
  color_total : number = 0;
  pb_color : string  = '';
  color_color : string  = '';

  max_color : number = 600;
  max_pb : number = 2500;

  constructor (){

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      bSort: true,
      dom: 'Bfrtip',
      paging: true,
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
          
          this.pb_total = 0;
          this.color_total = 0;

          let all_lines = result.split(/\n/);
          for (var line of all_lines){

            if(line  != ''){

              // console.log(line);
              let kv = line.split(',');
              // console.log (kv[0] + " :: " + kv[1]);
              kv[0] = kv[0].replace(/#38;/,'');
              var totalx : number = +kv[1];
              var corx : string = '';
              // console.log(':: COR :: ' + kv[0]);
              var range : number = 0;
              var xxx : string;
              if (kv[0].toLowerCase().includes("color")){
                range = (totalx/this.max_color);
                // console.log('*********     TOTAL   **********');
                // console.log(totalx);
                // console.log(range);
                if (range <= 0.5){
                  corx = 'success';
                }else if (range <= 0.8){
                  corx  = 'warning';
                }else if ((range > 0.8) && (range <= 1.0)){
                  corx = 'alert';
                }else if (range > 1.0){
                  corx = 'purple';
                }

                this.color_total += totalx;
              }else {
                range = (totalx/this.max_pb);
                if (range <= 0.5){
                  corx = 'success';
                }else if (range <= 0.8){
                  corx  = 'warning';
                }else if ((range > 0.8) && (range <= 1.0)){
                  corx = 'alert';
                }else if (range > 1.0){
                  corx = 'purple';
                }

                this.pb_total += totalx;
              }

              xxx = ((range * 100).toFixed(0)).toString();

              let element : IPrinter  =  { name : kv[0], campi : kv[2], total : kv[1] + " (" + xxx + "%)", colorx : corx };
              this.table_content.push({ name : kv[0], campi : kv[2], total : kv[1] + " (" + xxx + "%)", colorx : corx });
            }
            
          }
          var tmp_range = this.pb_total/(this.max_pb * 32);
          if (tmp_range <= 0.5){
            this.pb_color = 'success';
          }else if (tmp_range <= 0.8){
            this.pb_color  = 'warning';
          }else if ((tmp_range > 0.8) && (tmp_range <= 1.0)){
            this.pb_color = 'alert';
          }else if (tmp_range > 1.0){
            this.pb_color = 'purple';
          }

          tmp_range = this.color_total/(this.max_color * 5);
          if (tmp_range <= 0.5){
            this.color_color = 'success';
          }else if (tmp_range <= 0.8){
            this.color_color  = 'warning';
          }else if ((tmp_range > 0.8) && (tmp_range <= 1.0)){
            this.color_color = 'alert';
          }else if (tmp_range > 1.0){
            this.color_color = 'purple';
          }

        }
      })
      .catch(function(err)
      {
       alert('Fetch Error : NOT FOUND!');
      });
  }
  
}
