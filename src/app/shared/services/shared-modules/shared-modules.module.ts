import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { FooterComponent } from '../../../components/shared/footer/footer.component';
import { MatIcon } from '@angular/material/icon';
import { MapViewComponent } from '../../../components/shared/dialog-box/map-view/map-view.component';
import { SafePipe } from '../../pipe/safe.pipe';
import { ItemsComponent } from '../../../components/shared/items/items.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCustomerComponent } from '../../../components/manager-view/dialog-box/add-customer/add-customer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationBoxComponent } from '../../../components/shared/dialog/confirmation-box/confirmation-box.component';
import { AddItemComponent } from '../../../components/shared/dialog/add-item/add-item.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MapViewComponent,
    SafePipe,
    ItemsComponent,
    ConfirmationBoxComponent,
    AddItemComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    MatIcon,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class SharedModulesModule { }
