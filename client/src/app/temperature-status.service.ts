import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TemperatureModel} from './temperature-value';
import { Subject, from } from  'rxjs';
import * as socketio from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class TemperatureStatusService {

  private baseUrl =  'http://localhost:3001';
  constructor(private httpClient: HttpClient) { }

  getInitialTemperatureStatus() {
    return this.httpClient.get<TemperatureModel[]>(`${this.baseUrl}/api/test`);
  }

  getUpdates() {
    let socket = socketio(this.baseUrl);
    let tempSub = new Subject<TemperatureModel>();
    let tempSubObservable = from(tempSub);

    socket.on('temperature', (temperatureStatus: TemperatureModel) => {
      tempSub.next(temperatureStatus);
    });

    return tempSubObservable;
  }
}
