import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAboutComponent } from './dialog-about/dialog-about.component';


export interface IPrinter {
  name : string;
  campi : string;
  total : string;
  colorx : string;
  percent : string;
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
  campis = new Map <string, string> (
    [
      ['BADPI','C2'],
      ['BIOTÉRIO','C1'],
      ['CLIAMB','C1'],
      ['COAES','C1'],
      ['COAPF','C1'],
      ['COATL','C1'],
      ['COBIO','C1'],
      ['COCAP','C1'],
      ['V8','C3'],
      ['COCIN','C1'],
      ['COETI','C1'],
      ['COGPE','C1'],
      ['COLECOES','C2'],
      ['COPES','C1'],
      ['COSAS','C1'],
      ['COTEI','C1'],
      ['COTIN','C1'],
      ['DIR','C1'],
      ['LBA','C2'],
      ['LTBM','C2'],
      ['LTMN','C2'],
      ['SEDAB','C1'],
      ['SEMPC','C1'],
      ['SEOFI','C1'],
      ['EDITORA','C1'],
      ['DIEAR','C1'],
      ['INCUBADORA','C1']
    ]);
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

  constructor (private about : MatDialog){

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      bSort: true,
      dom: 'Bfrtip',
      paging: true,
      fixedColumns: {
        heightMatch: 'none'
      },
      language: {
        "search": "Filtrar:",
        "info": "Página _PAGE_ de _PAGES_",
        "zeroRecords": "Nada para mostrar",
        "paginate": {
          "first":      "Primeiro",
          "last":       "Último",
          "next":       "Próximo",
          "previous":   "Anterior"
        },
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

    this.onClick_reload();
    
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
          alert('ARQUIVO DE DADOS NÃO ENCONTRADO!');
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
                  corx = 'xsuccess';
                }else if (range <= 0.8){
                  corx  = 'xwarning';
                }else if ((range > 0.8) && (range <= 1.0)){
                  corx = 'xalert';
                }else if (range > 1.0){
                  corx = 'xpurple';
                }

                this.color_total += totalx;
                
              }else {
                range = (totalx/this.max_pb);
                if (range <= 0.5){
                  corx = 'xsuccess';
                }else if (range <= 0.8){
                  corx  = 'xwarning';
                }else if ((range > 0.8) && (range <= 1.0)){
                  corx = 'xalert';
                }else if (range > 1.0){
                  corx = 'xpurple';
                }

                this.pb_total += totalx;
              }

              xxx = ((range * 100).toFixed(0)).toString();

              let campi_tmp = '';

              for (let campi of this.campis.entries())
              {
                //console.log(kv[0] + ' :: ' + campi[0] + ' :: ' + campi[1]);
                if (kv[0].toLowerCase().includes(campi[0].toLowerCase())){
                  campi_tmp = campi[1];
                }
              }
              
              // let element : IPrinter  =  { name : kv[0], campi : campi_tmp, total : kv[1] + " (" + xxx + "%)", colorx : corx };
              // this.table_content.push({ name : kv[0], campi : campi_tmp, total : kv[1] + " (" + xxx + "%)", colorx : corx });
              let element : IPrinter  =  { name : kv[0], campi : campi_tmp, total : kv[1], colorx : corx, percent : xxx + "%" };
              this.table_content.push({ name : kv[0], campi : campi_tmp, total : kv[1], colorx : corx, percent : xxx + "%" });
            }
            
          }
          var tmp_range = this.pb_total/(this.max_pb * 32);
          if (tmp_range <= 0.5){
            this.pb_color = 'xsuccess';
          }else if (tmp_range <= 0.8){
            this.pb_color  = 'xwarning';
          }else if ((tmp_range > 0.8) && (tmp_range <= 1.0)){
            this.pb_color = 'xalert';
          }else if (tmp_range > 1.0){
            this.pb_color = 'xpurple';
          }

          tmp_range = this.color_total/(this.max_color * 5);
          if (tmp_range <= 0.5){
            this.color_color = 'xsuccess';
          }else if (tmp_range <= 0.8){
            this.color_color  = 'xwarning';
          }else if ((tmp_range > 0.8) && (tmp_range <= 1.0)){
            this.color_color = 'xalert';
          }else if (tmp_range > 1.0){
            this.color_color = 'xpurple';
          }

        }
      })
      .catch(function(err)
      {
       alert('ARQUIVO DE DADOS NÃO ENCONTRADO!');
      });
  }

  openAbout (){

    console.log("Opening about !!!");
    const dialogRef = this.about.open(DialogAboutComponent, {
      width: '50%',
      data: {}
    }).afterClosed().subscribe({
      
    });

  }
  
}
