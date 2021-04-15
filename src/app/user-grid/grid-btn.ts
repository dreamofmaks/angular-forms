import { Component, DoCheck, Injectable, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { NbDialogService } from '@nebular/theme';
import { Subscription } from "rxjs";
import { UserService } from '../services/user-service';
import  User  from '../models/user-model';
import { IDatasource, IGetRowsParams, IServerSideDatasource } from "ag-grid-community";

@Component({
    selector: 'btn-cell-renderer',
    template: `
          <ng-template *ngIf="!isDeleting" #myPopup let-ref="dialogRef">
          <nb-card>
            <nb-card-header>Attention!!!</nb-card-header>
              <nb-card-body>This record will be deleted!</nb-card-body>
                <nb-card-footer>
                    <div  style="text-align: center;">
                        <button nbButton (click)="ref.close()">Ok</button>
                    </div>
                </nb-card-footer>
          </nb-card>
        </ng-template>
      <button nbButton status="danger" (click) ="open(myPopup, $event)">Delete</button>
    `,
  })
  @Injectable()
  export class BtnCellRenderer implements ICellRendererAngularComp, OnInit { 
    constructor(private userService: UserService, private dialogService: NbDialogService) {}

    @ViewChild('myPopup') myPopup

    private params: any;
    refresh;

    isDeleting: boolean = false;

    sub: Subscription

    agInit(params: any): void {
      this.params = params;
    }

    ngOnInit() {
    }

    open(dialog: TemplateRef<any>, event: MouseEvent) {
        this.dialogService.open(dialog).onClose.subscribe((val) => {
            const user: User = this.params.node.data;
            const dataSource: IServerSideDatasource = {
              getRows: (params) => {
                const sortModel = params.request.sortModel[0];
                const lastRow = params.request.endRow >= this.userService.countOfUsers$.value ? this.userService.countOfUsers$.value : null;
                this.userService.getLimitedUsers(params.request.startRow, params.request.endRow, sortModel?.colId, sortModel?.sort).subscribe((data) => {
                  params.success({
                    rowData: data,
                    rowCount: lastRow
                  })
                });
              }
            };   
            this.sub = this.userService.removeUser(user).subscribe(() => {
                this.params.api.setServerSideDatasource(dataSource);
                this.userService.getCountOfUsers().subscribe();
            })
        });
      }
}

