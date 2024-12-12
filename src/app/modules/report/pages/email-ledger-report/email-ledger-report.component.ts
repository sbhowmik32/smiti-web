import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DateConverter } from 'src/app/_metronic/kt/_utils/DateConverter';
import { MemberLedgerReportService } from '../../services/member-ledger-report.service';
import { EmailLedgerReportService } from '../../services/email-ledger-report.service';

@Component({
  selector: 'app-email-ledger-report',
  standalone: false,
  templateUrl: './email-ledger-report.component.html',
  styleUrl: './email-ledger-report.component.scss',
})
export class EmailLedgerReportComponent implements OnInit {
  pdfSrc: any;
  filterForm: FormGroup;
  spin: boolean = false;
  IsAllMember: boolean = true;
  member: any = null;
  constructor(
    private _service: EmailLedgerReportService,
    private formBuilder: FormBuilder,
    private _alert: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createFilterForm();
  }

  createFilterForm() {
    const today = new Date();
    const currentDate: NgbDateStruct = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
    };
    this.filterForm = this.formBuilder.group({
      fromDate: currentDate,
      toDate: currentDate,
      memberNo: '',
    });
  }
  url: any;
  viewPdfReport() {
    if (
      !this.IsAllMember &&
      (this.filterForm.value.memberNo == null ||
        this.filterForm.value.memberNo.trim() == '')
    ) {
      this.pdfSrc = null;
      this._alert.error('Please Provide a member number');
      return;
    }
    if (this.filterForm.value.memberNo) {
      this.getMemberByMemberNo(this.filterForm.value.memberNo);
    }

    var reportType = 'PDF';
    this.pdfSrc = null;
    if (this.filterForm.value.fromDate) {
      this.filterForm.value.fromDate = new DateConverter().dateModal(
        this.filterForm.value.fromDate
      );
    }
    if (this.filterForm.value.toDate) {
      this.filterForm.value.toDate = new DateConverter().dateModal(
        this.filterForm.value.toDate
      );
    }

    this._service
      .getMemberLedgerDetailReport(
        this.filterForm.value.fromDate,
        this.filterForm.value.toDate,
        this.filterForm.value.memberNo
      )
      .subscribe(
        (blobData: Blob) => {
          let documentBlob = new Blob([blobData], {
            type: reportType == 'PDF' ? 'application/pdf' : '',
          });
          this.url = URL.createObjectURL(documentBlob);
          this.spin = false;
          this.cdr.detectChanges();
        },
        (err) => {
          this.spin = false;
        }
      );
  }

  getMemberByMemberNo(memberNo) {
    this.spin = true;
    this._service.getMemberInfoByMemberShipNo(memberNo).subscribe(
      (data) => {
        this.member = data;
        this.cdr.detectChanges();
        this.spin = false;
      },
      (err) => {
        this.spin = false;
      }
    );
  }
  setStatusCriteria(value) {
    this.filterForm.get('memberNo').patchValue(null);
    this.IsAllMember = value;
  }
  sendMail() {
    this._service.sendMail(this.member.Id).subscribe(
      (data) => {
        console.log(data);
        this._alert.success('Email sent successfully');
      },
      (err) => {
        console.log(err);
        this._alert.error('Failed to send email');
      }
    );
  }
  resetForm() {
    this.filterForm.reset();
  }
}
