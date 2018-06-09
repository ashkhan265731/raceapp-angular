import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { TimeConvertorPipe } from '../pipe/time-convertor.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [AlertMessageComponent,TimeConvertorPipe],
  exports: [
    AlertMessageComponent,
    TimeConvertorPipe
  ]
})
export class SharedModule { }
