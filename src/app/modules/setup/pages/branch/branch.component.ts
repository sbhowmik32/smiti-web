import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SweetAlertOptions } from 'sweetalert2';
import { TableSetupService } from '../../services/table-setup.service';
import { BranchService } from '../../services/branch.service';

@Component({
  selector: 'app-branch',
  standalone: false,
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.scss',
})
export class BranchComponent implements OnInit {
  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  numberOfEntries: number;
  currentPage: number;
  pageSize: number;
  searchForm: FormGroup;
  spin: boolean = false;
  hasData: boolean = false;
  branchs: any[] = [];
  editId: any;
  swalOptions: SweetAlertOptions = {};
  entrieCountList: any[] = [5, 10, 15, 25, 50, 100];
  isFilter = false;
  isOpenAction: number | null = null;
  shouldDropUp: boolean = false;
  branchSetupForm: FormGroup;
  isForDeleteId: number;

  constructor(
    private _service: BranchService,
    private _modalService: NgbModal,
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _alert: ToastrService,
    private _alertType: AlertTypeService
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.numberOfEntries = 0;
    this.getList();
    this.createFilterForm();
    this.createForm();
  }

  createForm() {
    this.branchSetupForm = this._fb.group({
      BranchID: 0,
      BranchName: ['', Validators.required],
      Address: [''],
      Phone: [''],
    });
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }

  closeDropdown(): void {
    this.isOpenAction = null;
  }
  createFilterForm() {
    this.searchForm = this._fb.group({
      pageSize: 10,
      searchKey: null,
    });
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getList();
  }

  onCancelButtonClick() {
    document.getElementById('close-button').click();
  }

  getList() {
    this.spin = true;
    this._service.getPagination(this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.branchs = data.Data;
        this.hasData = this.branchs?.length > 0;
        this.numberOfEntries = data.Count;
        this.cdr.detectChanges();
      },
      (err) => {
        this.spin = false;
        this.hasData = false;
      }
    );
  }

  updatePageWiseTableData(event) {
    this.currentPage = event;
    this.getList();
  }

  careateOrEditModalPopUp(createOrUpdateModal, data?) {
    if (data?.BranchID) {
      // this.editId = id;
      this.branchSetupForm.patchValue({
        BranchID: data.BranchID,
        BranchName: data.BranchName,
        Address: data.Address,
        Phone: data.Phone,
      });
    } else {
      this.branchSetupForm.get('BranchID').patchValue(0);
      this.branchSetupForm.get('BranchName').patchValue('');
      this.branchSetupForm.get('Address').patchValue(null);
      this.branchSetupForm.get('Phone').patchValue(null);
    }
    this._modalService.open(createOrUpdateModal, {
      size: 'lg',
      centered: true,
    });
  }

  reloadData() {
    this.currentPage = 1;
    this.getList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.getList();
  }

  onCancelPopUp() {
    document.getElementById('close-button').click();
  }

  filterModalPopUp(advanceFilterModal) {
    this._modalService.open(advanceFilterModal, { size: 'lg' });
  }

  onSubmit() {
    if (!this.branchSetupForm.valid) {
      this._alert.error('Please provide valid information');
      return;
    }

    this._service.create(this.branchSetupForm.value).subscribe(
      (data) => {
        console.log(data);
        if (data.HasError) {
          this.showAlert(this._alertType.errorAlert);
        } else {
          this.getList();
          this.branchSetupForm.value.Id
            ? this.showAlert(this._alertType.updateSuccessAlert)
            : this.showAlert(this._alertType.createSuccessAlert);
        }
      },
      (err) => {
        console.log(err);
        this.showAlert(this._alertType.errorAlert);
      }
    );
  }

  deleteButtonClick(id) {
    this.isForDeleteId = id;
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.showAlert(this._alertType.deleteSuccessAlert);
      }
    });
  }
  triggerDelete() {
    this._service.delete(this.isForDeleteId).subscribe(
      (data) => {
        this.showAlert(this._alertType.deleteSuccessAlert);
        this.getList();
      },
      (err) => {
        console.log(err);
        this.showAlert(this._alertType.errorAlert);
      }
    );
  }

  filterData() {
    this.pageSize = this.searchForm.value.pageSize;
    this.getList();
  }
  handleBlur(forControl) {
    return forControl.valid || forControl.untouched;
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this._alertType.setAlertTypeText('College');
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
    this.noticeSwal.fire();
  }
}
