import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { RowNode } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BtnCellRenderer } from './grid-btn';
import User from '../models/user-model';
import { UserService } from '../services/user-service'

@Component({
  selector: 'app-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss']
})
export class UserGridComponent implements OnInit {

  constructor(private readonly userService: UserService,
              private router: Router) { }

  @ViewChild('myGrid') myGrid: AgGridAngular;

  frameworkComponents = {
    btnCellRenderer: BtnCellRenderer
  }

  date: Date;
  initSub: Subscription;

  currentUser: User;

  columnDefs = [
    {field: 'firstName', sortable: true, filter: 'agTextColumnFilter', checkboxSelection: 'true'},
    {field: 'lastName', filter: 'agTextColumnFilter'},
    {field: 'address.country.name', headerName: 'Country'},
    {field: 'address.city.name', headerName: 'City',},
    {field: 'address.street', headerName: 'Street'},
    {field: 'address.building', headerName: 'building'},
    {headerName: 'date of birth',  field: 'dateOfBirth', cellRenderer: (data) => {
      return data.value ? (new Date(data.value)).toLocaleDateString() : '';
    }},
    {field: 'Deletion', cellRenderer: 'btnCellRenderer', minWidth: 150}
  ];

  ngOnInit() {
    this.initSub = this.userService.getAllUsers().subscribe((value) => {
      this.myGrid.api.setRowData(value);
    });
  }

  getSelectedUser(value) {
    const selectedNodes: RowNode[] = this.myGrid.api.getSelectedNodes();
        const node = selectedNodes[0] 
        this.currentUser = { ...node.data };
        this.router.navigate(['userform'], {queryParams: {
          'id': this.currentUser.id
        }});
        console.log(this.currentUser);
  }

  onGridReady(params) {
    this.myGrid.api.setRowData(this.userService.fetchedUsers.value);
  }
}
