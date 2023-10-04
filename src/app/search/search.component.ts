import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  constructor(
    public router: Router,
    private routers: Router,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  onSelectionChange(selectedSearch: undefined) {
    if (selectedSearch == 'route') {
      this.router.navigate(['searchbyroute'], {
        relativeTo: this.activatedRouter,
      });
    } else if (selectedSearch == 'store') {
      this.router.navigate(['searchbystore'], {
        relativeTo: this.activatedRouter,
      });
    }
  }
}
