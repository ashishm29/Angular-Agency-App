import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
})
export class DeleteConfirmationDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { billNumber: string; delete: string }
  ) {}

  ngOnInit(): void {
  }

  onYesClick(): void {
    this.data.delete = AppConstant.YES_ACTION;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.data.delete = AppConstant.NO_ACTION;
    this.dialogRef.close(this.data);
  }
}
