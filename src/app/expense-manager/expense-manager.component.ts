import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expense-manager',
  templateUrl: './expense-manager.component.html',
  styleUrls: ['./expense-manager.component.scss'],
})
export class ExpenseManagerComponent implements OnInit {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {
    this.selectedValue = new FormControl('Attendance');
  }

  selectedValue!: FormControl;
  ngOnInit(): void {
    this.router.navigate(['salesmansalary'], {
      relativeTo: this.activatedRoute,
    });
  }

  onSelectionChange(page: string) {
    if (page) {
      if (page === 'Attendance') {
        this.router.navigate(['salesmansalary'], {
          relativeTo: this.activatedRoute,
        });
      }
    }
  }
}
