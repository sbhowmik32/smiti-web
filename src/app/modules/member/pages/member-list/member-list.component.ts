import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { MemberService } from '../../services/member.service';
import { MemberTypeService } from 'src/app/modules/setup/services/member-type.service';
import { MemberActiveStatusService } from 'src/app/modules/setup/services/member-active-status.service';
import { CollegeService } from 'src/app/modules/setup/services/college.service';
import { MemberProfessionService } from 'src/app/modules/setup/services/member-profession.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss',
})
export class MemberListComponent implements OnInit {
  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  numberOfEntries: number;
  currentPage: number;
  pageSize: number;
  searchForm: FormGroup;
  searchKey: any;
  spin: boolean = false;
  hasData: boolean = false;
  members: any[] = [];
  editId: any;
  swalOptions: SweetAlertOptions = {};
  entrieCountList: any[] = [5, 10, 15, 25, 50, 100];
  isFilter = true;
  isOpenAction: number | null = null;
  shouldDropUp: boolean = false;
  memberForm: FormGroup;
  isForDeleteId: number;
  isShowFilter: any = false;
  filterForm: any;
  memberTypes: any;
  memberActiveStatus: any;
  colleges: any;
  bloodGroups: any;
  memberProfessions: any;

  constructor(
    private service: MemberService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _alert: ToastrService,
    private alertType: AlertTypeService,
    private memberTypeService: MemberTypeService,
    private memberActiveStatusService: MemberActiveStatusService,
    private collegeService: CollegeService,
    private memberProfessionService: MemberProfessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pageSize = 10;
    this.currentPage = 1;
    this.numberOfEntries = 0;
    this.createFilterForm();
    this.getMemberList();
    this.createSearchForm();

    this.creatememberForm();
    this.getMemberTypeList();
    this.getMemberActiveStatusList();
    this.getCollegeList();
    this.getBloodGroupData();
    this.getMemberProfessionList();
  }

  getMemberProfessionList() {
    this.memberProfessionService
      .getMemberProfessionPagination(1, 1000)
      .subscribe(
        (data) => {
          this.memberProfessions = data.DataList;
          this.cdr.detectChanges();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getBloodGroupData() {
    this.service.getAllBloodGroupData().subscribe(
      (res) => {
        this.bloodGroups = res.DataList;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getCollegeList() {
    this.collegeService.getCollegePagination(1, 1000).subscribe(
      (data) => {
        this.colleges = data.Data;
        this.cdr.detectChanges();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getMemberTypeList() {
    this.memberTypeService.getMemberTypePagination(1, 1000).subscribe(
      (data) => {
        this.memberTypes = data.Data;
        this.cdr.detectChanges();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getMemberActiveStatusList() {
    this.memberActiveStatusService
      .getMemberActiveStatusPagination(1, 100)
      .subscribe(
        (data) => {
          this.memberActiveStatus = data.Data;
          this.cdr.detectChanges();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  creatememberForm() {
    this.memberForm = this.fb.group({
      Id: 0,
      Title: ['', Validators.required],
    });
  }

  toggleDropdown(index: number, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click event from bubbling up
    this.isOpenAction = this.isOpenAction === index ? null : index;
  }

  closeDropdown(): void {
    this.isOpenAction = null;
  }
  createSearchForm() {
    this.searchForm = this.fb.group({
      pageSize: 10,
      searchKey: null,
    });
  }
  createFilterForm() {
    this.filterForm = this.fb.group({
      MemberShipNo: null,
      FullName: null,
      CadetName: null,
      MemberTypeId: null,
      MemberActiveStatusId: null,
      Phone: null,
      Email: null,
      CollegeId: null,
      BatchNo: null,
      BloodGroupId: null,
      MemberProfessionId: null,
      Organaization: null,
      Designation: null,
      Specialization: null,
      HscYear: null,
      CadetNo: null,
      memFullId: null,
    });
  }
  resetFilterForm() {
    this.filterForm.reset();
  }

  setNumberOfTableEntries(event: any) {
    this.pageSize = +event.target.value;
    this.getMemberList();
  }

  onCancelButtonClick() {
    document.getElementById('close-button').click();
  }
  goToCreatePage() {
    this.router.navigate(['member/create']);
  }

  getMemberList() {
    this.spin = true;
    this.service
      .getMemberPagination(
        this.currentPage,
        this.pageSize,
        this.searchKey,
        this.filterForm.value
      )
      .subscribe(
        (data) => {
          this.members = data.DataList;
          this.hasData = this.members?.length > 0;
          this.numberOfEntries = data.DataCount;
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
    this.getMemberList();
  }

  careateOrEditModalPopUp(createOrUpdateModal, data?) {
    if (data?.Id) {
      // this.editId = id;
      this.memberForm.patchValue({
        Id: data.Id,
        Title: data.Title,
      });
    } else {
      // this.editId = null;
      this.memberForm.get('Id').patchValue(0);
      this.memberForm.get('Title').patchValue(null);
    }
    this.modalService.open(createOrUpdateModal, { size: 'lg', centered: true });
  }

  reloadData() {
    this.currentPage = 1;
    this.getMemberList();
  }

  getRegionListByCriteria(event) {
    this.pageSize = Number(event.pageSize);
    this.searchKey = event.searchKey;
    this.getMemberList();
  }

  onCancelPopUp() {
    document.getElementById('close-button').click();
  }

  filterModalPopUp(advanceFilterModal) {
    this.modalService.open(advanceFilterModal, { size: 'lg' });
  }

  onSubmit() {
    if (!this.memberForm.valid) {
      this._alert.error('Please provide valid information');
      return;
    }

    this.service.createMember(this.memberForm.value).subscribe(
      (data) => {
        console.log(data);
        if (data.HasError) {
          this.showAlert(this.alertType.errorAlert);
        } else {
          this.getMemberList();

          this.memberForm.value.Id
            ? this.showAlert(this.alertType.updateSuccessAlert)
            : this.showAlert(this.alertType.createSuccessAlert);
        }
      },
      (err) => {
        console.log(err);
        this.showAlert(this.alertType.errorAlert);
      }
    );
  }

  deleteButtonClick(id) {
    this.isForDeleteId = id;
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this.showAlert(this.alertType.deleteSuccessAlert);
      }
    });
  }
  triggerDelete() {
    this.service.deleteMember(this.isForDeleteId).subscribe(
      (data) => {
        this.showAlert(this.alertType.deleteSuccessAlert);
        this.getMemberList();
      },
      (err) => {
        console.log(err);
        this.showAlert(this.alertType.errorAlert);
      }
    );
  }

  filterData() {
    this.searchKey = this.searchForm.value.searchKey;
    this.pageSize = this.searchForm.value.pageSize;
    this.getMemberList();
  }
  handleBlur(forControl) {
    return forControl.valid || forControl.untouched;
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Member');
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
  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }
  goToEdit(id) {
    this.router.navigate(['member/edit/' + id]);
  }
}
