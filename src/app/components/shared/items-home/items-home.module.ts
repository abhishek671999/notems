import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsHomeRoutingModule } from './items-home-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ItemsHomeComponent } from './items-home.component';


@NgModule({
  declarations: [ItemsHomeComponent],
  imports: [
    CommonModule,
    ItemsHomeRoutingModule,
    MatTabsModule
  ]
})
export class ItemsHomeModule { }
