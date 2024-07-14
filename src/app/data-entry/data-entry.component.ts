import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss'],
})
export class DataEntryComponent implements OnInit {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  onSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);

    if (selecetdValue) {
      if (selecetdValue === 'store') {
        this.router.navigate(['storedataentry'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'route') {
        this.router.navigate(['routedataentry'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'bill') {
        this.router.navigate(['billdataentry'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'salesman') {
        this.router.navigate(['salesmandataentry'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'product') {
        this.router.navigate(['productdataentry'], {
          relativeTo: this.activatedRoute,
        });
      }
    }
  }
}
