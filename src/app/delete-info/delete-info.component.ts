import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-info',
  templateUrl: './delete-info.component.html',
  styleUrls: ['./delete-info.component.scss'],
})
export class DeleteInfoComponent implements OnInit {
  constructor(public router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  onSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);

    if (selecetdValue) {
      if (selecetdValue === 'store') {
        this.router.navigate(['store'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'route') {
        this.router.navigate(['route'], {
          relativeTo: this.activatedRoute,
        });
      } else if (selecetdValue === 'recovery') {
        this.router.navigate(['recovery'], {
          relativeTo: this.activatedRoute,
        });
      }
    }
  }
}
