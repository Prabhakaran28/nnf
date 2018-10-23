import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { LoaderService } from '../service/loader.service';
import { LoaderState } from '../modal/loader.interface';
@Component({
    selector: 'angular-loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.scss']
})
export class LoaderComponent implements OnInit {
show = false;
private subscription: Subscription;
constructor(
        private loaderService: LoaderService
    ) { }
ngOnInit() { 
        this.subscription = this.loaderService.loaderState
            .subscribe((state: LoaderState) => {
                console.log("inside progress bar");
                this.show = state.show;
                
            });
    }
ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}