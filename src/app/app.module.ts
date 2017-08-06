/*--------- Angular Modules ---------*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

/*--------- Vendor Modules ---------*/
/* Datepicker module 'mydatepicker', source: https://github.com/kekeh/mydatepicker */
import { MyDatePickerModule } from 'mydatepicker'; 

/*--------- Components ---------*/
import { AppComponent } from './components/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ErrorComponent } from './components/error/error.component';

/*--------- Services ---------*/
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { HttpService } from './services/http.service';
import { LoginGuard } from './services/login.guard';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MyDatePickerModule
  ],
  providers: [
    HttpService,
    // {
    //   provide: Http,
    //   useFactory: (backend: XHRBackend, options: RequestOptions) => new HttpService(backend, options),
    //   deps: [XHRBackend, RequestOptions]
    // },
    { provide: Http, useClass: HttpService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
