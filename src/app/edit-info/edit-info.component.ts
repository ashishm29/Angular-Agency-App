import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss'],
})
export class EditInfoComponent implements OnInit {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  onSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);

    if (selecetdValue) {
      if (selecetdValue === 'store') {
        this.router.navigate(['editstore'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'route') {
        this.router.navigate(['editroute'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'bill') {
        this.router.navigate(['editbill'], {
          relativeTo: this.activatedRoute,
        });
      }
    }
  }
}
