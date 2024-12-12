import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityTicketService } from '../../services/activity-ticket.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { AvailabilityService } from 'src/app/modules/setup/services/availability.service';
import { DatePipe } from '@angular/common';
import { ActivityTypeService } from '../../services/activity-type.service';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event-activity-ticket',
  templateUrl: './event-activity-ticket.component.html',
  styleUrls: ['./event-activity-ticket.component.css']
})
export class EventActivityTicketComponent implements OnInit {
  eventActivityTicketForm: FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  @Input() eventTicketId: any;
  serviceTypeList: any;
  AvailabilityList: any;
  AvailabilityDetail: any = [];
  serviceTicketDetailArray: any;
  serviceTicketTypeList: any;

  constructor(
    private fb: FormBuilder,
    private service: ActivityTicketService,
    private availabilityService: AvailabilityService,
    private datePipe: DatePipe,
    private activityTypeService: ActivityTypeService,
    private alertType: AlertTypeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.createeventActivityTicketForm()
    this.serviceTypeBySelectedCategory(6)
    this.getAvailability()
    this.getAllServiceTicketType()
    if(this.eventTicketId){
      this.getById(this.eventTicketId)
    }
    
  }
  getById(eventTicketId){
    
    this.service.getById(eventTicketId).subscribe(
      (data)=>{
        console.log(data);
        this.setDataToForm(data.Data)
      },
      (err)=>{
        console.log(err);
      }
    )
  }

  setDataToForm(data){
    
    this.eventActivityTicketForm.patchValue({
      Id: data.Id,
      MemServiceId: data.MemServiceId,
      AvailabilityId: data.AvailabilityId,
      VatChargePercent: data.VatChargePercent,
      MemServiceTypeId: data.MemServiceTypeId,
      ServiceChargePercent: data.ServiceChargePercent,
      TicketLimit: data.TicketLimit,
      Location: data.Location,
      Description: data.Description,
      ImgFileUrl: environment.imgUrl+data.ImgFileUrl,

    });
    this.setDetailData(data.ServiceTicketDetailReqs)
    this.getAvailabilityDetail(data.AvailabilityId);

  }

  setDetailData(data) {
    var i = 0;
    data.forEach((element) => {
      
      this.createDetail();
     
        this.serviceTicketDetailArray[i].get("Id").patchValue(element.Id),
        this.serviceTicketDetailArray[i]
          .get("UnitPrice")
          .patchValue(element.UnitPrice),
        this.serviceTicketDetailArray[i]
          .get("MaxQuantity")
          .patchValue(element.MaxQuantity),
        this.serviceTicketDetailArray[i]
          .get("ServiceTicketTypeId")
          .patchValue(element.ServiceTicketTypeId)
        i++;
    });
  }

  convertTime(time: string): string {

    const [hours, minutes] = time.split(':');
    let hoursNum = +hours;
    const period = hoursNum >= 12 ? 'PM' : 'AM';
    hoursNum = hoursNum % 12 || 12;  // Convert 0 to 12 for midnight
    return `${hoursNum}:${minutes} ${period}`;
  }

  createeventActivityTicketForm() {
    this.eventActivityTicketForm = this.fb.group({
      Id: 0,
      MemServiceId: ['', Validators.required],
      AvailabilityId: null,
      VatChargePercent: null,
      MemServiceTypeId:6,
      ServiceChargePercent: null,
      TicketLimit: null,
      Location: null,
      Description: null,
      formFile:null,
      ImgFileUrl:null,
      ServiceTicketDetailReqs: this.fb.array([]),
    });

    this.eventActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray;
    if (!this.eventTicketId) {
      this.createDetail();
    }
    this.serviceTicketDetailArray = (
      this.eventActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray
    ).controls;
  }

  createDetail() {
    const now = new Date();
    var currentTime = this.datePipe.transform(now, 'HH:mm');
    const newItem = this.fb.group({
      Id: 0,
      UnitPrice: 0,
      MaxQuantity: 1,
      ServiceTicketTypeId: null
    });
    (this.eventActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray).push(newItem);
  }

  addItemDetail(i) {
    if (!this.serviceTicketDetailArray[this.serviceTicketDetailArray?.length - 1]
      .value.ServiceTicketTypeId) {
      return;
    }
    this.createDetail();
  }

  removeItem(index: number) {
    (this.eventActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray).removeAt(
      index
    );
  }

  getAvailability() {
    this.availabilityService.getAvailabilityPagination(1, 1000).subscribe(
      (data) => {
        this.AvailabilityList = data.Data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllServiceTicketType() {
    
    this.activityTypeService.getAllServiceTicketType().subscribe(
      (data) => {
        this.serviceTicketTypeList = data.Data;
        this.serviceTicketTypeList = this.serviceTicketTypeList.filter((x) => x.ServiceType == 'Event');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  triggerGetAvailabilityDetail(event){
    this.getAvailabilityDetail(event.Id)
  }


  getAvailabilityDetail(Id) {
    if (event) {
      this.availabilityService.getDetailById(Id).subscribe(
        (data) => {
          this.AvailabilityDetail = data.Data.AvailabilityDetailVms;
        },
        (err) => {
          console.log(err);
        }
      );
    }
    else {
      this.AvailabilityDetail = []
    }
  }

  serviceTypeBySelectedCategory(id: any) {
    this.service.getServiceTypeBySelectedCategory(id).subscribe(
      (data) => {
        console.log(data);
        this.serviceTypeList = data.Data;

      },
      (error: any) => {
        console.log(error);

      }
    );
  }

  handleBlur(forControl) {
    return forControl.valid || forControl.untouched;
  }

  onSubmit() {
    var eventActivityTicket = this.prepareToSave();

    this.service.createActivityTicket(eventActivityTicket).subscribe(
      (data)=>{
        this.showAlert(this.alertType.createSuccessAlert);
        this.router.navigate(['activity/ticket/list']);
        
      },
      (err)=>{
        this.showAlert(this.alertType.errorAlert);
      }
    )

  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Activity Ticket');
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

  imageChangeHandler(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    this.eventActivityTicketForm.get('formFile').patchValue(file);
    reader.onload = (e: any) => {
      this.eventActivityTicketForm.get('ImgFileUrl').patchValue(e.target.result);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
    const inputElement = event.target as HTMLInputElement;

  }

  removeImage() {
    this.eventActivityTicketForm.get('ImgFileUrl').patchValue(null);
    this.eventActivityTicketForm.get('formFile').patchValue(null);
    this.cdr.detectChanges();
  }

  prepareToSave() {
    const formData = new FormData();

    formData.append('Id', this.eventActivityTicketForm.value.Id);
    formData.append('MemServiceId', this.eventActivityTicketForm.value.MemServiceId);
    formData.append('MemServiceTypeId', this.eventActivityTicketForm.value.MemServiceTypeId);
    formData.append('AvailabilityId', this.eventActivityTicketForm.value.AvailabilityId);
    formData.append('VatChargePercent', this.eventActivityTicketForm.value.VatChargePercent);
    formData.append('ServiceChargePercent', this.eventActivityTicketForm.value.ServiceChargePercent);
    formData.append('TicketLimit', this.eventActivityTicketForm.value.TicketLimit);
    formData.append('Description', this.eventActivityTicketForm.value.Description);
    formData.append('formFile', this.eventActivityTicketForm.value.formFile);
    formData.append('ImgFileUrl', this.eventActivityTicketForm.value.ImgFileUrl);
    formData.append('Location', this.eventActivityTicketForm.value.Location);

    if (this.serviceTicketDetailArray.length>0) {
      this.serviceTicketDetailArray.forEach((item, index) => {
        if (item.value.Id !== 0) {
          formData.append(`ServiceTicketDetailReqs[${index}].Id`, item.value.Id.toString());
        }
        formData.append(`ServiceTicketDetailReqs[${index}].UnitPrice`, item.value.UnitPrice.toString());
        formData.append(`ServiceTicketDetailReqs[${index}].MaxQuantity`, item.value.MaxQuantity.toString());
        formData.append(`ServiceTicketDetailReqs[${index}].ServiceTicketTypeId`, item.value.ServiceTicketTypeId.toString());
      });
    }

    return formData;

  }

}
