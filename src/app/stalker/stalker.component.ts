import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {NgForOf, CommonModule} from '@angular/common';

@Component({
  selector: 'app-stalker',
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    CommonModule
  ],
  templateUrl: './stalker.component.html'
})
export class StalkerComponent {
  lines: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {
    this.lines = (data.message ?? '').split('\n');
  }
}
