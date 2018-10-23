import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class OnboardService {
  public isEmpIdGenerated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

}




