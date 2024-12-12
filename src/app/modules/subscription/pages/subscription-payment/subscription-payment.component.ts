import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SubscriptionService } from '../../services/subscription.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionPaymentService } from '../../services/subscription-payment.service';
import Swal from 'sweetalert2';
import { MemberService } from 'src/app/modules/member/services/member.service';

@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.css']
})
export class SubscriptionPaymentComponent implements OnInit {

  memberSubscriptionPaymentInfoSearchForm:FormGroup;
  member: any;
  paymentDetail: boolean;
  totalSubscriptionFee: number;
  titleText: string;
  dataList: any[];
  memberSubPaidList: any;
  paymentTypeText: string;
  actionText: string;
  memberSubFeeDueList: any;
  memberSubAdvancedList: any;
  paymentInformation: any;
  subscriptionPayment: {};
  pdfSrc: Uint8Array;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private service: SubscriptionService,
    private _modalService: NgbModal,
    private subscriptionPaymentService: SubscriptionPaymentService,
    private memberService: MemberService,
  ) { }

  ngOnInit() {
    this.creatememberSubscriptionPaymentInfoSearchForm()
  }

  creatememberSubscriptionPaymentInfoSearchForm() {
    
    this.memberSubscriptionPaymentInfoSearchForm = this.fb.group({
      MemberShipNo: null,
    });
  }

  showMemberInfo() {
    
    if (this.memberSubscriptionPaymentInfoSearchForm.value.MemberShipNo) {
      const memberShipNo = this.memberSubscriptionPaymentInfoSearchForm.value.MemberShipNo.padStart(5, '0');
      this.service.getMemberInfoByMemberShipNo(memberShipNo).subscribe((res) => {
        if (!res.HasError) {
          this.member = res;
          this.member.ImgFileUrl = environment.apiUrl + '/' + this.member.ImgFileUrl;
          this.cdr.detectChanges()
          // console.log(res);
          if (!this.member.HasSubscription) {
            this.paymentDetail = false;
            // console.log(this.member.HasSubscription);
          } else {
            this.paymentDetail = true;
            this.loadAllPaidUpto();
            this.loadAllDueList();
          }
        }
        (error: any) => {
          error.Messages.forEach((element: string) => {
            // this._alertService.error(element);
          });
        };
      });
    }
  }

  
  loadAllPaidUpto() {
    this.totalSubscriptionFee = 0;
    this.titleText = 'Subscription Paid List';
    this.dataList = [];
    if (this.member.Id) {
      this.service.getSubscriptionPaymentPaidUpTo(this.member.Id).subscribe((res) => {
        if (res.HasError) {
          res.Messages.forEach((element: string) => {
            // this._alertService.error(element);
          });
        } else {
          this.memberSubPaidList = res.DataList;
          this.cdr.detectChanges()
        }
      });
    }
  }

  loadAllDueList() {
    this.totalSubscriptionFee = 0;
    this.titleText = 'Subscription Due List';
    this.paymentTypeText = 'due';
    this.dataList = [];
    if (this.member.Id) {
      this.service.getSubscriptionPaymentDueList(this.member.Id).subscribe((res) => {
        if (res.HasError) {
          res.Messages.forEach((element) => {
            // this._alertService.error(element);
          });
        } else {
          this.actionText = 'Due Payment';
          this.memberSubFeeDueList = res.DataList;
          
          if (this.memberSubFeeDueList?.length < 1) {
            this.loadAllAdvanced();
          }
          this.cdr.detectChanges()
        }
      });
    }
  }

  loadAllAdvanced() {
    this.totalSubscriptionFee = 0;
    this.titleText = 'Subscription Advanced List';
    this.paymentTypeText = '';
    this.dataList = [];
    if (this.member.Id) {
      this.service.getSubscriptionPaymentAdvancedList(this.member.Id).subscribe((res) => {
        
        if (res.HasError) {
          res.Messages.forEach((element) => {
            // this._alertService.error(element);
          });
        } else {
          this.actionText = 'Advanced Payment';
          this.memberSubAdvancedList = res.DataList;
          this.cdr.detectChanges()
        }
      });
    }
  }

  saveOrTopup(paymentModal: any, pdfViewerModal) {
    Swal.fire({
      // title: ' ',
      text: 'Are you sure you want to Subscription Payment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4255b5',
      cancelButtonColor: '#333',
      width: '20rem',
      confirmButtonText: 'Confirm',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.paymentTypeText === 'due') {
          var checkedList = this.memberSubFeeDueList
            .filter((x) => x.IsChecked)
            .sort((a, b) => new Date(a.PaymentDate).getTime() - new Date(b.PaymentDate).getTime());
          var uncheckedList = this.memberSubFeeDueList
            .filter((x) => !x.IsChecked)
            .sort((a, b) => new Date(a.PaymentDate).getTime() - new Date(b.PaymentDate).getTime());

          for (let i = 0; i < checkedList.length; i++) {
            if (checkedList[i]?.PaymentDate > uncheckedList[0]?.PaymentDate) {
              // this._alertService.error('Please select previous dues first!');
              return;
            }
          }
        } else {
          if (this.memberSubFeeDueList.length > 0) {
            // this._alertService.error('Please payment previous due first!');
            return;
          }
          var checkedList = this.memberSubAdvancedList
            .filter((x) => x.IsChecked)
            .sort((a, b) => new Date(a.PaymentDate).getTime() - new Date(b.PaymentDate).getTime());
          var uncheckedList = this.memberSubAdvancedList
            .filter((x) => !x.IsChecked)
            .sort((a, b) => new Date(a.PaymentDate).getTime() - new Date(b.PaymentDate).getTime());

          for (let i = 0; i < checkedList.length; i++) {
            if (checkedList[i]?.PaymentDate > uncheckedList[0]?.PaymentDate) {
              // this._alertService.error('Please select previous first!');
              return;
            }
          }
        }

        if (this.member.CurrentBalance < this.totalSubscriptionFee) {
          this._modalService.open(paymentModal);
          this.paymentInformation.Amount = Number((this.totalSubscriptionFee - this.member.CurrentBalance).toFixed(2));
        } else {
          if (this.paymentTypeText === 'due') {
            this.dueSubPayment(pdfViewerModal);
          } else {
            this.advancedSubPayment(pdfViewerModal);
          }
        }
      }
    });

    this._modalService.dismissAll();
  }

  dueSubPayment(content) {
    const has = this.memberSubFeeDueList.find((x) => x.IsChecked == true);
    if (!has) {
      // this._alertService.warning('Please select one!');
      return;
    }

    this.subscriptionPaymentService.savedueSubPayment(this.memberSubFeeDueList, this.member.Id).subscribe((res) => {
      ;
      if (res.HasError) {
        res.Messages.forEach((element) => {
          // this._alertService.error(element);
        });
      } else {
        // this._alertService.success('Subscription Due Payment Successfully');
        this.resetAll();

        this.subscriptionPaymentService.getSubscriptionPaymentReport(res.DataList[0].PaymentNo).subscribe((data) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            (this.pdfSrc = new Uint8Array(reader.result as ArrayBuffer)), toString();
            this._modalService.open(content, { size: 'lg', centered: true });
          };
          reader.readAsArrayBuffer(data);
        });
      }
    });
  }

  advancedSubPayment(pdfViewerModal) {
    ;
    const has = this.memberSubAdvancedList.find((x) => x.IsChecked == true);
    if (!has) {
      // this._alertService.warning('Please select one!');
      return;
    }
    this.memberService.saveAdvancedSubPayment(this.memberSubAdvancedList, this.member.Id).subscribe((res) => {
      if (res.HasError) {
        res.Messages.forEach((element) => {
          // this._alertService.error(element);
        });
      } else {
        // this._alertService.success('Subscription Advanced Payment Successfully');
        // this.loadAllAdvanced();
        this.resetAll();

        this.subscriptionPaymentService.getSubscriptionPaymentReport(res.DataList[0].PaymentNo).subscribe((data) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            (this.pdfSrc = new Uint8Array(reader.result as ArrayBuffer)), toString();
            this._modalService.open(pdfViewerModal, { size: 'lg', centered: true });
          };
          reader.readAsArrayBuffer(data);
        });
      }
    });
  }



  resetAll() {
    this.memberSubFeeDueList = [];
    this.memberSubAdvancedList = [];
    this.member = {}
    // this.subscriptionPayment = {}
    this.paymentInformation = {}


    this.memberSubPaidList = [];
  }

}
