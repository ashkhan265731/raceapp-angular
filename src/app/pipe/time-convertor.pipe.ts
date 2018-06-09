import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeConvertor'
})
export class TimeConvertorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value)
    if(value.hour<=12){
      return value.hour+' : '+value.minute+' AM';
    }else{
      return (value.hour-12)+' : '+value.minute+' PM';
    }
  }

}
