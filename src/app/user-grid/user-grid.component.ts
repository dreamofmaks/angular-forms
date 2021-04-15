import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams, IServerSideDatasource, RowNode } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { BtnCellRenderer } from './grid-btn';
import User from '../models/user-model';
import { UserService } from '../services/user-service'
import "ag-grid-enterprise";

@Component({
  selector: 'app-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.scss']
})
export class UserGridComponent implements OnInit {

  constructor(private readonly userService: UserService,
              private router: Router) { 
      
    }

  @ViewChild('myGrid') myGrid: AgGridAngular;

  frameworkComponents = {
    btnCellRenderer: BtnCellRenderer
  }
  date: Date;
  defaultColDef = {
    floatingFilter: true,
    resizable: true
  }
  initSub: Subscription;

  currentUser: User;

  columnDefs = [
    { field: 'firstName', sortable: true, filter: 'agTextColumnFilter'},
    { field: 'lastName', sortable: true, filter: 'agTextColumnFilter' },
    { field: 'address.country.name', headerName: 'Country' },
    { field: 'address.city.name', headerName: 'City', },
    { field: 'address.street', headerName: 'Street' },
    { field: 'address.building', headerName: 'building' },
    {
      headerName: 'date of birth', field: 'dateOfBirth', cellRenderer: (data) => {
        return data.value ? (new Date(data.value)).toLocaleDateString() : '';
      }
    },
    { field: 'Deletion', cellRenderer: 'btnCellRenderer', minWidth: 100 }
  ];

  ngOnInit() {
    this.userService.getCountOfUsers().subscribe();
  }

  gridOptions : GridOptions ={
    rowSelection: 'multiple',
    rowModelType: 'serverSide',
    rowBuffer: 0,
    paginationPageSize: 9,
    cacheBlockSize: 9,
    cacheOverflowSize: 2,
    maxConcurrentDatasourceRequests: 1,
    maxBlocksInCache: 9,
    infiniteInitialRowCount: 5,
    animateRows: true,
  }

  getSelectedUser(value) {
    const selectedNodes: RowNode[] = this.myGrid.api.getSelectedNodes();
    const node = selectedNodes[0];
    this.currentUser = { ...node.data };
    console.log(this.currentUser);
    this.router.navigate(['userform'], {
      queryParams: {
        'id': this.currentUser.id
      }
    });
  }

  onGridReady(params) {
    this.myGrid.api.sizeColumnsToFit();
    const dataSource: IServerSideDatasource = {
      getRows: (params) => {
        const filterModel = params.request.filterModel.firstName;
        const sortModel = params.request.sortModel[0];
        this.userService.getLimitedUsers(params.request.startRow, params.request.endRow, sortModel?.colId, sortModel?.sort, filterModel?.filter).subscribe((data) => {
          const lastRow = params.request.endRow >= this.userService.countOfUsers$.value ? this.userService.countOfUsers$.value : null;
          params.success({
            rowData: data,
            rowCount: lastRow
          })
        });
      }
    };   
    this.myGrid.api.setServerSideDatasource(dataSource);
  }
}