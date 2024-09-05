import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatIcon } from '@angular/material/icon';
import { MapViewComponent } from '../dialog-box/map-view/map-view.component';
import { SafePipe } from '../../../shared/pipe/safe.pipe';
import { ItemsComponent } from '../items/items.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AddCustomerComponent } from '../../manager-view/dialog-box/add-customer/add-customer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmationBoxComponent } from '../dialog-box/confirmation-box/confirmation-box.component';
import { AddItemComponent } from '../dialog-box/add-item/add-item.component';
import { ProfileComponent } from '../profile/profile.component';
import { PopUpMsgComponent } from '../pop-up-msg/pop-up-msg.component';
import { ViewCalendarComponent } from '../bottom-sheet/view-calendar/view-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDividerModule } from '@angular/material/divider';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AddCategoryComponent } from '../bottom-sheet/add-category/add-category.component';
import { AddSaleComponent } from '../dialog-box/add-sale/add-sale.component';
import { ViewMoreSalesInfoComponent } from '../dialog-box/view-more-sales-info/view-more-sales-info.component';
import { EditSalesInfoComponent } from '../dialog-box/edit-sales-info/edit-sales-info.component';
import { AddItemsToSaleComponent } from '../dialog-box/add-items-to-sale/add-items-to-sale.component';
import { CategoryComponent } from '../category/category.component';
import { SalesMoreInfoComponent } from '../dialog-box/sales-more-info/sales-more-info.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AddVisitComponent } from '../dialog-box/add-visit/add-visit.component';
import { EditVisitsInfoComponent } from '../dialog-box/edit-visits-info/edit-visits-info.component';
import { AddLocalityComponent } from '../bottom-sheet/add-locality/add-locality.component';
import { LocalityComponent } from '../locality/locality.component';
import { SharedModulesRoutingModule } from './shared-modules-routing.module';
import { HomeComponent } from '../home/home.component';
import { PayLumpsumComponent } from '../bottom-sheet/pay-lumpsum/pay-lumpsum.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    MapViewComponent,
    PopUpMsgComponent,
    ItemsComponent,
    CategoryComponent,
    LocalityComponent,
    ConfirmationBoxComponent,
    AddItemComponent,
    ViewCalendarComponent,
    AddCategoryComponent,
    AddLocalityComponent,
    PayLumpsumComponent,
    AddSaleComponent,
    AddVisitComponent,
    EditSalesInfoComponent,
    EditVisitsInfoComponent,
    ViewMoreSalesInfoComponent,
    AddItemsToSaleComponent,
    SalesMoreInfoComponent,
    PageNotFoundComponent,
    SafePipe,
    HomeComponent
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
    MatSelectModule,
    SharedModulesRoutingModule
  ],
  exports: [HeaderComponent, FooterComponent]
})
export class SharedModulesModule { }
