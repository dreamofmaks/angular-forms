import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, IDatasource, IGetRowsParams, RowNode } from 'ag-grid-community';
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
              private router: Router,
              private readonly route: ActivatedRoute) { 
      
    }

  @ViewChild('myGrid') myGrid: AgGridAngular;

  frameworkComponents = {
    btnCellRenderer: BtnCellRenderer
  }
  endRow: number = 9;
  date: Date;
  initSub: Subscription;

  currentUser: User;

  columnDefs = [
    { field: 'firstName', sortable: true, filter: 'agTextColumnFilter'},
    { field: 'lastName', filter: 'agTextColumnFilter' },
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

  gridOptions ={
    rowSelection: 'multiple',
    rowModelType: 'infinite',
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
    const dataSource: IDatasource = {
      rowCount: this.userService.countOfUsers$.value,
      getRows: (params: IGetRowsParams) => {
        const sortModel = params.sortModel[0];
        this.userService.getLimitedUsers(params.startRow, params.endRow, sortModel?.colId, sortModel?.sort).subscribe(data => {
          const lastRow = params.endRow >= this.userService.countOfUsers$.value ? this.userService.countOfUsers$.value : null;
          params.successCallback(data, lastRow);
        });   
      }
    };
    this.myGrid.api.setDatasource(dataSource);
  }
}

