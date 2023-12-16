import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-expense-manager',
  templateUrl: './expense-manager.component.html',
  styleUrls: ['./expense-manager.component.scss'],
})
export class ExpenseManagerComponent implements OnInit {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  onSelectionChange(page: string) {
    if (page) {
      if (page === 'salary') {
        this.router.navigate(['salesmansalary'], {
          relativeTo: this.activatedRoute,
        });
      }
    }
  }
}
