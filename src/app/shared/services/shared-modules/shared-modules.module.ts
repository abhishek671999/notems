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
import { ConfirmationBoxComponent } from '../../../components/shared/dialog-box/confirmation-box/confirmation-box.component';
import { AddItemComponent } from '../../../components/shared/dialog-box/add-item/add-item.component';
import { ProfileComponent } from '../../../components/shared/profile/profile.component';
import { PopUpMsgComponent } from '../../../components/shared/pop-up-msg/pop-up-msg.component';
import { ViewCalendarComponent } from '../../../components/shared/bottom-sheet/view-calendar/view-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AddCategoryComponent } from '../../../components/shared/bottom-sheet/add-category/add-category.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    MapViewComponent,
    PopUpMsgComponent,
    ItemsComponent,
    ConfirmationBoxComponent,
    AddItemComponent,
    ViewCalendarComponent,
    AddCategoryComponent,
    SafePipe,
  ],
  imports: [
    CommonModule, 
    FormsModule,
    FullCalendarModule,
    MatIcon,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatOptionModule,
    MatSelectModule
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class SharedModulesModule { }
