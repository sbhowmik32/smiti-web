import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { LayoutService } from '../../../core/layout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit, AfterViewInit {
  private authLocalStorageToken = `currentBgclUser`;
  menues: any;
  spin = false;
  constructor(
    private layoutService: LayoutService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.getMenu();
  }
  getMenu() {
    this.spin = true;
    // var user = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
    // todo fix
    this.layoutService.getNavs().subscribe(
      (data) => {
        this.menues = data;
        this.cdr.detectChanges();
        this.spin = false;
      },
      (err) => {
        console.log(err);
        this.spin = false;
      }
    );
  }
}
