import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionService } from 'src/app/modules/subscription/services/subscription.service';
import { environment } from 'src/environments/environment';
import { TopupService } from '../../services/topup.service';
import { SweetAlertOptions } from 'sweetalert2';
import { AlertTypeService } from 'src/app/shared/services/alert-type.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-topup-create',
  templateUrl: './topup-create.component.html',
  styleUrls: ['./topup-create.component.css']
})
export class TopupCreateComponent implements OnInit {
  topUpForm: FormGroup;
  member: any;
  TopUpDetailsArray: any;
  paymentMethodList: any;
  creditCardList: any;

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private service: SubscriptionService,
    private topupService: TopupService,
    private alertType: AlertTypeService
  ) { }

  ngOnInit() {
    this.createtopUpForm()
    this.loadAllPaymentMethod();
    this.getAllCreditCard();
  }

  createtopUpForm() {

    this.topUpForm = this.fb.group({
      MemberShipNo: null,
      TotalAmount: null,
      Id: 0,
      RegisterMemberId: 0,
      TopUpDate: "",
      MemberCardNo: "",
      CurrentBalance: 0,
      MemberName: "",
      CreateByName: "",
      CardNo: "",
      OnlineTopUp: true,
      TransId: "",
      Currency: "",
      OfflineTopUp: true,
      PaymentMode: "",
      Note: "",
      Status: "",
      CreatedBy: "",






      TopUpDetails: this.fb.array([]),
    });
    this.createDetail();
    this.topUpForm.get("TopUpDetails") as FormArray;
    this.TopUpDetailsArray = (
      this.topUpForm.get("TopUpDetails") as FormArray
    ).controls;
  }

  createDetail() {
    const newItem = this.fb.group({
      Id: 0,
      PaymentMethodId: [null, [Validators.required]],
      BankId: null,
      Amount: null,
      TrxNo: '',
      MachineNo: '',
      TrxCardNo: '',


      TOPUPNO: "",

      TopUpId: 0,
      PaymentMethodText: "",


      BankText: "",
      CreditCardId: 0,
      CreditCardText: "",
 


    });
    (this.topUpForm.get("TopUpDetails") as FormArray).push(newItem);
  }

  addItemDetail(i) {
    
    var PaymentMethodId =
      this.TopUpDetailsArray[this.TopUpDetailsArray.length - 1]
        .value.PaymentMethodId;


    if (!PaymentMethodId) {
      return;
    }

    this.createDetail();
  }

  removeItem(index: number) {
    (this.topUpForm.get("TopUpDetails") as FormArray).removeAt(
      index
    );
  }

  loadAllPaymentMethod() {
    
    this.topupService.getAllPaymentMethod().subscribe((res) => {
      this.paymentMethodList = res.DataList;
      this.cdr.detectChanges()
    },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllCreditCard(){
    this.topupService.getAllCreditCard().subscribe((res) => {
      this.creditCardList = res.DataList;
    },
    (err)=>{
      console.log(err);
      
    }
  );
  }

  showMemberInfo() {
    if (this.topUpForm.value.MemberShipNo) {

      this.service.getMemberInfoByMemberShipNo(this.topUpForm.value.MemberShipNo).subscribe((res) => {
        this.member = res;
        console.log(this.member);

        this.member.ImgFileUrl = environment.apiUrl + '/' + this.member.ImgFileUrl;
        this.cdr.detectChanges()
      },
        (err) => {
          console.log(err);
        });
    }
  }

  onSubmit(){
    this.topUpForm.get("TopUpDate").patchValue(new Date)
    this.topupService.createTopUp(this.topUpForm.value).subscribe(
      (data) => {
        console.log(data);
        this.showAlert(this.alertType.createSuccessAlert);
      },
      (err)=>{
        this.showAlert(this.alertType.errorAlert);
      }
    )

  }

  showAlert(swalOptions: SweetAlertOptions) {
    this.alertType.setAlertTypeText('Topup');
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
