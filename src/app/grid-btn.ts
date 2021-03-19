import { Component, Injectable, OnDestroy, TemplateRef, ViewChild } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { AgGridAngular, ICellRendererAngularComp } from "ag-grid-angular";
import { NbDialogService } from '@nebular/theme';
import { Subscription } from "rxjs";
import { UserService } from './user-service';
import  User  from './models/user-model';




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
      <button nbButton status="danger" (click) ="open(myPopup)">Delete</button>
    `,
  })
  @Injectable()
  export class BtnCellRenderer implements ICellRendererAngularComp, OnDestroy {
      constructor(private userService: UserService, private dialogService: NbDialogService) {}


    @ViewChild('myPopup') myPopup

    private params: any;
    refresh;

    isDeleting: boolean = false;

    sub: Subscription

    agInit(params: any): void {
      this.params = params;
    }

    open(dialog: TemplateRef<any>) {
      console.log(this.params);
        this.dialogService.open(dialog).onClose.subscribe(() => {
            const user: User = this.params.data;
            this.sub = this.userService.removeUser(user).subscribe(() => {
                this.params.api.setRowData(this.userService.fetchedUsers.getValue());
            })
        });
      }

      ngOnDestroy() {
      }
}

