import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import User from '../user-service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() user: User;
  @Output() onDelete = new EventEmitter<User>();
  @Output() onEdit = new EventEmitter<User>();

  constructor() { }

  ngOnInit(): void {
  }


  deleteCard() {
    this.onDelete.emit(this.user);
  }

  editCard() {
    this.onEdit.emit(this.user);
  }
}
