import { Component } from '@angular/core';
import { ItemsService } from '../../../../shared/services/items/items.service';
import { CategoryService } from '../../../../shared/services/category/category.service';
import { Router } from '@angular/router';
import { meAPIUtility } from '../../../../shared/site-variables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HttpParams } from '@angular/common/http';
import { deleteItem, distributorStock, editItem, item, updateTeamItem } from '../../../../shared/custom_dtypes/items';
import { category } from '../../../../shared/custom_dtypes/category';
import { AddItemComponent } from '../../dialog-box/add-item/add-item.component';
import { ConfirmationBoxComponent } from '../../dialog-box/confirmation-box/confirmation-box.component';
import { SuccessMsgComponent } from '../../dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../dialog-box/error-msg/error-msg.component';
import { DistributorOptionsComponent } from '../../bottom-sheet/distributor-options/distributor-options.component';
import { team } from '../../../../shared/custom_dtypes/me';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-distributor-stock',
  templateUrl: './distributor-stock.component.html',
  styleUrl: './distributor-stock.component.css'
})
export class DistributorStockComponent {
constructor(
    private itemService: ItemsService,
    private categoryService: CategoryService,
    private router: Router,
    private meUtility: meAPIUtility,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matbottomSheet: MatBottomSheet,
    private teamService: TeamManagementService,
  ) {
    this.newItem = this.formBuilder.group({
      "item_name": ['', [Validators.required]],
      "price": ['', Validators.required],
    })
   }

  public newItem: FormGroup;
  public itemSource: any[] = []
  public categoryList: any[] = []
  public itemsTableColumns = ['sl_no', 'name', 'category', 'stock', 'edit', 'delete']
  public organizationId!: number
  public userRole!: string;
  public teams: team[] = []
  public selectedTeam: number | null = null
  public newStock!: number
  
  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        this.userRole = data['role'].toLowerCase() || null
        this.organizationId = data['organization_id']
        this.fetchCategories()
        this.fetchTeams().subscribe(
          (data) => this.fetchItems()
        )
        this.itemsTableColumns = this.userRole == 'manager' ? ['sl_no', 'name', 'category','stock', 'edit'] : ['sl_no', 'name', 'category', 'price', 'stock']
      }
    )
  }

  fetchItems(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.organizationId))
    if(this.selectedTeam) httpParams = httpParams.append('team_id', String(this.selectedTeam))
    this.itemService.getItems(httpParams).subscribe(
      (data: any) => {
        data['items'].forEach((item: item) => {
          item.is_edit = false
        });
        let itemsPresent: any[] = []
        data['items'].forEach((category: category) => {
          category.items?.forEach((item: item) => {
            itemsPresent.push(item)
          }
          )
        })
        this.itemSource = itemsPresent
      },
      (error: any) => {
        console.log(error)
      }
    )
  }
  
  fetchCategories(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', String(this.organizationId))
    this.categoryService.getCategories(httpParams).subscribe(
      (data: any) => this.categoryList = data['categories'],
      (error: any) => alert('Failed to get categories')
    )
  }

  fetchTeams(){
    return new Observable((observer) => {
      let httpParams = new HttpParams()
      httpParams = httpParams.append('distributor', true)
      this.teamService.getMyTeams(httpParams).subscribe(
        (data: any) => {
         this.teams = data['teams']
         this.selectedTeam = this.teams[0].team_id
         observer.next(true)
        }
        ,
        (error: any) =>{
          console.log(error)
          observer.next(false)
        } 
      )
    })


  }

  editItem(item: item, event: Event) {
    event.stopPropagation()
    item.is_edit = !item.is_edit
    this.newStock = item.stock
  }

  submitEditItem(item: item) {
      console.log(item)
      let body: editItem = {
        item_id: item.item_id,
        item_name: item.item_name,
        price: item.price,
        category_id: item.category_id,
        stock: item.stock
      }
      console.log(body)
      this.itemService.editItems(body).subscribe(
        (data: any) => {
          item.is_edit = false
          item.category_name = this.categoryList.filter((category: any) => category.category_id == item.category_id)[0]['category_name']
        },
        (error: any) => {
          alert('Failed to update item. Please retry')
        }
      )
    
  }

    updateTeamItemInventory(item: item){
      let body: updateTeamItem = {
        team_id: Number(this.selectedTeam),
        item_id: item.item_id,
        new_stock: this.newStock
      }
      this.itemService.updateTeamItemInventory(body).subscribe(
        (data) => {
         item.is_edit = false
         item.stock = this.newStock
        },
        (error) => {
          console.log(error)
        }
      )
    }
}
