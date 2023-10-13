import { Injectable } from '@angular/core';
import { ValidationDialogComponent } from '../dialog/validation-dialog/validation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ValidationDialogService {
  constructor(public dialog: MatDialog) {}

  openValidationDialog(displayMessage: string): void {
    const dialogRef = this.dialog.open(ValidationDialogComponent, {
      data: { message: displayMessage },
    });

    dialogRef.afterClosed().subscribe(() => {});
  }
}
