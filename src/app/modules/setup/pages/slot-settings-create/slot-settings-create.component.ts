import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SlotSettingsService } from '../../services/slot-settings.service';
import { WeekDays } from '../../models/WeekDays';
import { DatePipe } from '@angular/common';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';

@Component({
  selector: 'app-slot-settings-create',
  templateUrl: './slot-settings-create.component.html',
  styleUrls: ['./slot-settings-create.component.css']
})
export class SlotSettingsCreateComponent implements OnInit {

  isInsertMode = false;
  isLoading = false;
  itemId: number;
  serviceSlotSettingsForm: FormGroup;
  serviceSlotSettingsArray: any;
  SlotListArray: any;
  weekDaysEnum: any;
  slotList: any[] = [];
  slot: any;
  serviceList: any[] = [];
  swalOptions: SweetAlertOptions = {};
  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  serviceSlotSettingsId: number;
  constructor(
    private fb: FormBuilder,
    private service: SlotSettingsService,
    private router: Router,
    private route: ActivatedRoute,
    // private alert: AlertService,
    private datePipe: DatePipe,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getallServiceSlotSettings();
    this.getAllMemService();
    this.createForm()
    this.activateRoute.paramMap.subscribe((params) => {
      this.serviceSlotSettingsId = +params.get('id');
      if (this.serviceSlotSettingsId) {
        this.getSlotSettingsById(this.serviceSlotSettingsId)
      }
    });
  }
  getAllMemService() {
    this.isLoading = true;
    this.service.getAllServiceOnly(1, 10000).subscribe(
      (data) => {
        this.serviceList = data.Data;

        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }


  getSlotSettingsById(id){
    this.service.getServiceSlotSettingsById(id).subscribe(
      (res) => {
        this.slot = res.Data;
        this.serviceSlotSettingsForm = this.fb.group({
          Id: this.slot?.Id,
          ServiceId: this.slot?.ServiceId,
          ServiceText: this.slot?.ServiceText,
          SlotList: this.fb.array([]),
        });
        this.serviceSlotSettingsForm.get('SlotList') as FormArray;
        this.serviceSlotSettingsArray = (this.serviceSlotSettingsForm.get('SlotList') as FormArray).controls;

        const enumKeys = Object.keys(WeekDays);

        this.weekDaysEnum = enumKeys.filter((key) => isNaN(Number(key)));

        this.weekDaysEnum.forEach((element) => {
          var dailySlot = this.slot?.SlotList.filter((c) => c.DayText == element);
          var i = 0;

          this.loadDay(dailySlot);
          i++;
        });
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }


  getallServiceSlotSettings() {
    this.isLoading = true;
    this.isInsertMode = false;
    this.service.getallServiceSlotSettings().subscribe(
      (res) => {
        this.slotList = res.Data;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  getServiceSlotSettingsById(id) {
    this.isLoading = true;
    this.service.getServiceSlotSettingsById(id).subscribe(
      (res) => {
        this.slot = res.Data;
        console.log(this.slot);
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  bindItem(event) {
    this.isLoading = true;

    this.service.getServiceSlotSettingsByServiceId(event.Id).subscribe(
      (res) => {
        this.slot = res.Data;
        if (this.slot?.Id === 0) {
          this.isLoading = false;
          this.createForm();
          this.serviceSlotSettingsForm.get('ServiceId').setValue(event.Id);
          this.serviceSlotSettingsForm.get('ServiceText').setValue(event.Title);

          return;
        }
        this.serviceSlotSettingsForm = this.fb.group({
          Id: this.slot?.Id,
          ServiceId: this.slot?.ServiceId,
          ServiceText: this.slot?.ServiceText,
          SlotList: this.fb.array([]),
        });
        this.serviceSlotSettingsForm.get('SlotList') as FormArray;
        this.serviceSlotSettingsArray = (this.serviceSlotSettingsForm.get('SlotList') as FormArray).controls;

        const enumKeys = Object.keys(WeekDays);

        this.weekDaysEnum = enumKeys.filter((key) => isNaN(Number(key)));

        this.weekDaysEnum.forEach((element) => {
          var dailySlot = this.slot?.SlotList.filter((c) => c.DayText == element);
          var i = 0;

          this.loadDay(dailySlot);
          i++;
        });
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  editButtonClick(id) {
    this.isInsertMode = true;
    this.isLoading = true;
    this.service.getServiceSlotSettingsById(id).subscribe(
      (res) => {
        this.slot = res.Data;
        this.serviceSlotSettingsForm = this.fb.group({
          Id: this.slot?.Id,
          ServiceId: this.slot?.ServiceId,
          ServiceText: this.slot?.ServiceText,
          SlotList: this.fb.array([]),
        });
        this.serviceSlotSettingsForm.get('SlotList') as FormArray;
        this.serviceSlotSettingsArray = (this.serviceSlotSettingsForm.get('SlotList') as FormArray).controls;

        const enumKeys = Object.keys(WeekDays);

        this.weekDaysEnum = enumKeys.filter((key) => isNaN(Number(key)));

        this.weekDaysEnum.forEach((element) => {
          var dailySlot = this.slot?.SlotList.filter((c) => c.DayText == element);
          var i = 0;

          this.loadDay(dailySlot);
          i++;
        });
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  create() {
    this.createForm();
  }
  createForm() {
    
    this.serviceSlotSettingsForm = this.fb.group({
      Id: [0, Validators.required],
      ServiceId: [0, Validators.required],
      ServiceText: [''],
      SlotList: this.fb.array([]),
    });

    this.serviceSlotSettingsArray = (this.serviceSlotSettingsForm.get('SlotList') as FormArray).controls;

    const enumKeys = Object.keys(WeekDays);
    

    this.weekDaysEnum = enumKeys.filter((key) => isNaN(Number(key)));
    this.weekDaysEnum.forEach((element) => {
      this.addDay(element);
    });
  }

  //////////////////////////////////// On Edit Mode ////////////////////////////////

  loadDay(dailySlot): void {
    const ServiceSlotSettingsList = this.serviceSlotSettingsForm.get('SlotList') as FormArray;
    ServiceSlotSettingsList.push(this.loadNewDay(dailySlot));
  }
  loadNewDay(dailySlot): FormGroup {
    return this.fb.group({
      Id: [dailySlot[0].Id],
      SlotMasterId: [dailySlot[0].SlotMasterId],
      DayText: [dailySlot[0].DayText, Validators.required],
      SlotList: this.fb.array(dailySlot.map((slot) => this.loadNewSlot(slot))),
    });
  }
  loadNewSlot(slot): FormGroup {
    ;
    return this.fb.group({
      Id: [slot.Id],
      SlotMasterId: [slot.SlotMasterId],
      StartTime: [slot.StartTime],
      EndTime: [slot.EndTime],
      DayText: [slot.DayText],
      IsWholeDay: [slot.IsWholeDay],
    });
  }

  //////////////////////////////////// On Edit Mode ////////////////////////////////

  ////////////////////////////// from Form Create /////////////////////////////////////

  addDay(day): void {
    
    const ServiceSlotSettingsList = this.serviceSlotSettingsForm.get('SlotList') as FormArray;
    ServiceSlotSettingsList.push(this.createNewDay(day));
  }
  createNewDay(day): FormGroup {
    return this.fb.group({
      Id: 0,
      SlotMasterId: null,
      DayText: [day, Validators.required],
      SlotList: this.fb.array([this.createSlot(day)]),
    });
  }

  createSlot(day): FormGroup {
    const now = new Date();
    var currentTime = this.datePipe.transform(now, 'HH:mm');
    return this.fb.group({
      Id: 0,
      SlotMasterId: null,
      StartTime: [currentTime],
      EndTime: [currentTime],
      DayText: [day, Validators.required],
      IsWholeDay: [true, Validators.required],
    });
  }

  ////////////////////////////// from Form Create /////////////////////////////////////

  //////////////////////////////////////// on button clink ///////////////////////////

  addSlot(index: number, day): void {
    const table = (this.serviceSlotSettingsForm.get('SlotList') as FormArray).at(index) as FormGroup;
    const SlotList = table.get('SlotList') as FormArray;
    SlotList.push(this.createNewSlot(SlotList.value.length, day));
  }

  createNewSlot(index, day): FormGroup {
    const now = new Date();
    var currentTime = this.datePipe.transform(now, 'HH:mm');
    return this.fb.group({
      StartTime: [currentTime, Validators.required],
      EndTime: [currentTime, Validators.required],
      DayText: [day, Validators.required],
      IsWholeDay: [false, Validators.required],
    });
  }
  ///////////////////////////////////// on button clink ///////////////////////////

  removeTable(index: number): void {
    const ServiceSlotSettingsList = this.serviceSlotSettingsForm.get('SlotList') as FormArray;
    ServiceSlotSettingsList.removeAt(index);
  }

  removeSlot(index: number, slotIndex: number): void {
    const table = (this.serviceSlotSettingsForm.get('SlotList') as FormArray).at(index) as FormGroup;
    const SlotList = table.get('SlotList') as FormArray;
    SlotList.removeAt(slotIndex);
  }

  onSubmit() {
    var isTableReturn = false;
    var isSlotReturn = false;

    this.serviceSlotSettingsArray.forEach((element) => {
      if (this.serviceSlotSettingsArray.filter((c) => c.value.DayText == element.value.Day).length > 1) {
        isTableReturn = true;
      }
      element.value.SlotList.forEach((slot) => {
        if (element.value.SlotList.filter((c) => c.Slot == slot.Slot).length > 1) {
          isSlotReturn = true;
        }
      });
    });

    if (!this.serviceSlotSettingsForm.valid) {
      // this.alert.error('Please provide valid information');
      return;
    }
    else{
      this.service.saveSlotSettings(this.serviceSlotSettingsForm.value).subscribe(
        (data) => {
          this.isInsertMode = false;
          this.isLoading = false;
          // this.getallServiceSlotSettings();
          this.showAlert(this.alertType.createSuccessAlert);
        this.router.navigate(['setups/slot-settings/list']);
        },
        (err) => {
          console.log(err);
          this.showAlert(this.alertType.errorAlert);
          this.isLoading = false;
        }
      );
    }
 
  }

  handleBlur(formControl) {
    return formControl.valid || formControl.untouched;
  }

  getColor(index) {
    const lightness = 90 - ((index * 2) % 90); // Ensure hue stays within 0-360 range
    return `hsl(0, 0%, ${lightness}%)`;
  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Activity');
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
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
  

}
