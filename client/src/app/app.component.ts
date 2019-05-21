import {Component} from '@angular/core';
import {TemperatureStatusService} from './temperature-status.service';
import {Observable} from 'rxjs';
import {TemperatureModel} from './temperature-value';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  temperatureStatus: TemperatureModel[];
  temperatureStatusToPlot: TemperatureModel[];

  set TemperatureStatus(status: TemperatureModel[]) {
    this.temperatureStatus = status;
    this.temperatureStatusToPlot = this.temperatureStatus.slice(0, 20);
  }

  constructor(private temperatureStatusSvc: TemperatureStatusService) {
  this.temperatureStatusSvc.getInitialTemperatureStatus()
    .subscribe(prices => {
      this.TemperatureStatus = prices;

      let temperatureUpdateObservable =  this.temperatureStatusSvc.getUpdates();  
      temperatureUpdateObservable.subscribe((latestStatus: TemperatureModel) => {  
        this.TemperatureStatus = [latestStatus].concat(this.temperatureStatus); 
      }); 
    });
}
}
