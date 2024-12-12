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
  selector: 'app-service-activity-ticket',
  templateUrl: './service-activity-ticket.component.html',
  styleUrls: ['./service-activity-ticket.component.css']
})
export class ServiceActivityTicketComponent implements OnInit {

  serviceActivityTicketForm: FormGroup;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = {};

  @Input() serviceTicketId: any;
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
    this.createserviceActivityTicketForm()
    this.serviceTypeBySelectedCategory(7)
    this.getAvailability()
    this.getAllServiceTicketType()
    if(this.serviceTicketId){
      this.getById(this.serviceTicketId)
    }
    
  }
  getById(serviceTicketId){
    
    this.service.getById(serviceTicketId).subscribe(
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
    
    this.serviceActivityTicketForm.patchValue({
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

  createserviceActivityTicketForm() {
    this.serviceActivityTicketForm = this.fb.group({
      Id: 0,
      MemServiceId: ['', Validators.required],
      AvailabilityId: null,
      VatChargePercent: null,
      MemServiceTypeId:7,
      ServiceChargePercent: null,
      TicketLimit: null,
      Location: null,
      Description: null,
      formFile:null,
      ImgFileUrl:null,
      ServiceTicketDetailReqs: this.fb.array([]),
    });

    this.serviceActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray;
    if (!this.serviceTicketId) {
      this.createDetail();
    }
    this.serviceTicketDetailArray = (
      this.serviceActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray
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
    (this.serviceActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray).push(newItem);
  }

  addItemDetail(i) {
    if (!this.serviceTicketDetailArray[this.serviceTicketDetailArray?.length - 1]
      .value.ServiceTicketTypeId) {
      return;
    }
    this.createDetail();
  }

  removeItem(index: number) {
    (this.serviceActivityTicketForm.get("ServiceTicketDetailReqs") as FormArray).removeAt(
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
        this.serviceTicketTypeList = this.serviceTicketTypeList.filter((x) => x.ServiceType == 'Service');
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
    var serviceActivityTicket = this.prepareToSave();

    this.service.createActivityTicket(serviceActivityTicket).subscribe(
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

  imageChangeHandler(service: any) {
    const file = service.target.files[0];
    const reader = new FileReader();
    this.serviceActivityTicketForm.get('formFile').patchValue(file);
    reader.onload = (e: any) => {
      this.serviceActivityTicketForm.get('ImgFileUrl').patchValue(e.target.result);
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
    const inputElement = service.target as HTMLInputElement;

  }

  removeImage() {
    this.serviceActivityTicketForm.get('ImgFileUrl').patchValue(null);
    this.serviceActivityTicketForm.get('formFile').patchValue(null);
    this.cdr.detectChanges();
  }

  prepareToSave() {
    const formData = new FormData();

    formData.append('Id', this.serviceActivityTicketForm.value.Id);
    formData.append('MemServiceId', this.serviceActivityTicketForm.value.MemServiceId);
    formData.append('MemServiceTypeId', this.serviceActivityTicketForm.value.MemServiceTypeId);
    formData.append('AvailabilityId', this.serviceActivityTicketForm.value.AvailabilityId);
    formData.append('VatChargePercent', this.serviceActivityTicketForm.value.VatChargePercent);
    formData.append('ServiceChargePercent', this.serviceActivityTicketForm.value.ServiceChargePercent);
    formData.append('TicketLimit', this.serviceActivityTicketForm.value.TicketLimit);
    formData.append('Description', this.serviceActivityTicketForm.value.Description);
    formData.append('formFile', this.serviceActivityTicketForm.value.formFile);
    formData.append('ImgFileUrl', this.serviceActivityTicketForm.value.ImgFileUrl);
    formData.append('Location', this.serviceActivityTicketForm.value.Location);

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
