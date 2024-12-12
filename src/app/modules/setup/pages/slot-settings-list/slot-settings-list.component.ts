import { Component, OnInit, ViewChild } from '@angular/core';
import { SlotSettingsService } from '../../services/slot-settings.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-slot-settings-list',
  templateUrl: './slot-settings-list.component.html',
  styleUrls: ['./slot-settings-list.component.css']
})
export class SlotSettingsListComponent implements OnInit {

  serviceSlotList: any[] = [];
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  isShowFilter: any = false;
  numberOfEntries: number;
  currentPage: number = 1;
  pageSize: number = 10;
  searchForm: FormGroup;
  searchKey: any;
  spin: boolean = false;
  hasData: boolean = false;
  filterForm: any;
  isFilter=false
  serviceSlotSettingsId: number;
  slot: any;

  constructor(
    private service:SlotSettingsService,
    private alertType: AlertTypeService,
    private fb: FormBuilder,
    private router: Router

  ) { }

  ngOnInit() {
    this.getallServiceSlotSettings();

  
  }


  createFilterForm() {
    this.filterForm = this.fb.group({
      Year: '2024',
    });
  }

  goToCreatePage() {
    this.router.navigate(['setups/slot-settings/create']);
  }
  goToEditPage(Id) {
    debugger
    this.router.navigate(['setups/slot-settings/edit/' + Id]);
  }

  filterData() {
    this.searchKey = this.searchForm.value.searchKey;
    this.pageSize = this.searchForm.value.pageSize;
    this.getallServiceSlotSettings();
  }

  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }

  getallServiceSlotSettings() {
    this.hasData = false;

    this.service.getallServiceSlotSettings().subscribe(
      (res) => {
        this.serviceSlotList = res.Data;
        this.hasData = true
        debugger
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
  resetFilterForm() {
    this.filterForm.get('Year').patchValue('2024');
  }

  triggerDelete() {
    this.service.deleteServiceSlotSettings(1).subscribe(
      (data) => {
        this.showAlert(this.alertType.deleteSuccessAlert);
        this.getallServiceSlotSettings();
      },
      (err) => {
        console.log(err);
        this.showAlert(this.alertType.errorAlert);
      }
    );
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getallServiceSlotSettings();
  }



  



  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('CommitteeCategory');
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign(
      {
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-' + style,
        },
      },
      swalOptions
    );
    // this.cdr.detectChanges();
    this.noticeSwal.fire();
  }



}
