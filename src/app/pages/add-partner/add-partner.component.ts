import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

type MainStep = 1 | 2 | 3;
type SubStep = 'information-general' | 'information-business' | 'package-duration' | 'package-type';

interface PartnerStep {
  title: string;
  icon: string;
  substeps: Array<{
    id: SubStep;
    label: string;
  }>;
}

interface PricingFeature {
  label: string;
  enabled: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  suffix?: string;
  description: string;
  image: string;
  features: PricingFeature[];
}

@Component({
  selector: 'app-add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnDestroy {
  currentMainStep: MainStep = 1;
  currentSubStep: SubStep = 'information-general';
  completedSubSteps: SubStep[] = [];
  selectedPackageId = 'basic';
  selectedBillingCycle = 'month';
  isFieldPickerOpen = false;
  private readonly subscriptions = new Subscription();

  readonly steps: PartnerStep[] = [
    {
      title: 'Tạo thông tin đối tác',
      icon: 'person',
      substeps: [
        { id: 'information-general', label: 'Thông tin chung' },
        { id: 'information-business', label: 'Thông tin doanh nghiệp' }
      ]
    },
    {
      title: 'Chọn gói dịch vụ',
      icon: 'card',
      substeps: [
        { id: 'package-duration', label: 'Thời hạn' },
        { id: 'package-type', label: 'Loại gói dịch vụ' }
      ]
    },
    {
      title: 'Hoàn thành',
      icon: 'check',
      substeps: []
    }
  ];

  readonly billingCycles = [
    { id: 'month', label: 'Tháng' },
    { id: 'six-months', label: '6 tháng' },
    { id: 'year', label: 'Năm' }
  ];

  readonly businessTypes = ['Công ty cổ phần', 'Công ty TNHH', 'Hộ kinh doanh', 'Doanh nghiệp tư nhân'];
  readonly fields = ['Sản phẩm điện tử', 'Kinh doanh online', 'Bán lẻ', 'Giáo dục', 'Dịch vụ'];
  readonly cities = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'];
  readonly districts = ['Quận/Huyện', 'Quận 1', 'Quận Cầu Giấy', 'Quận Hải Châu'];
  readonly wards = ['Phường/Xã', 'Phường Bến Nghé', 'Phường Dịch Vọng', 'Phường Hải Châu I'];

  readonly pricingPlans: PricingPlan[] = [
    {
      id: 'trial',
      name: 'Trải nghiệm',
      price: 'Miễn phí',
      description: 'Miễn phí sử dụng các tính năng cơ bản với thời hạn 1 tháng',
      image: 'assets/images/add-partner/Group 18257.png',
      features: [
        { label: 'Tích hợp đa nền tảng', enabled: true },
        { label: 'Lập lịch chăm sóc', enabled: true },
        { label: 'Quảng cáo facebook', enabled: true },
        { label: 'Giới hạn 5 ứng dụng', enabled: false },
        { label: 'Giới hạn 15 nhân viên', enabled: false }
      ]
    },
    {
      id: 'basic',
      name: 'Cơ bản',
      price: '500.000',
      suffix: 'VNĐ',
      description: 'Quản lý khách hàng một cách dễ dàng và nhiều tính năng mở rộng',
      image: 'assets/images/add-partner/Group 18257.png',
      features: [
        { label: 'Tích hợp đa nền tảng', enabled: true },
        { label: 'Lập lịch chăm sóc', enabled: true },
        { label: 'Quảng cáo facebook', enabled: true },
        { label: 'Quảng cáo facebook', enabled: true },
        { label: 'Giới hạn 15 ứng dụng', enabled: false },
        { label: 'Giới hạn 50 nhân viên', enabled: false }
      ]
    },
    {
      id: 'standard',
      name: 'Tiêu chuẩn',
      price: '2.000.000',
      suffix: 'VNĐ',
      description: 'Mở rộng báo cáo, cung cấp nhiều tính năng nội bộ',
      image: 'assets/images/add-partner/Group 18257.png',
      features: [
        { label: 'Chatbot marketing', enabled: true },
        { label: 'Tự động đề xuất sản phẩm', enabled: true },
        { label: 'Quy trình nội bộ tự động', enabled: true },
        { label: 'Tạo đánh giá sau mua hàng', enabled: true },
        { label: 'Quản lý khách hàng tập trung và thông minh theo đặc thù ngành nghề', enabled: false },
        { label: 'Giới hạn 50 ứng dụng', enabled: false },
        { label: 'Giới hạn 150 nhân viên', enabled: false }
      ]
    },
    {
      id: 'advanced',
      name: 'Nâng cao',
      price: '5.000.000',
      suffix: 'VNĐ',
      description: 'Mở khóa toàn bộ tính năng của ứng dụng',
      image: 'assets/images/add-partner/Group 18256.png',
      features: [
        { label: 'Không giới hạn page', enabled: true },
        { label: 'Không giới hạn ứng dụng', enabled: true },
        { label: 'Không giới hạn khách hàng', enabled: true },
        { label: 'Tích hợp hệ thống doanh nghiệp', enabled: true },
        { label: 'Không giới hạn nhân viên', enabled: true }
      ]
    }
  ];

  readonly partnerForm = this.formBuilder.group({
    partnerName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    businessType: ['', Validators.required],
    industries: [[], Validators.required],
    city: [''],
    district: [''],
    ward: [''],
    address: ['']
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router
  ) {
    this.subscriptions.add(
      this.partnerForm.valueChanges.subscribe(() => this.updateSubStepByForm())
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get selectedFields(): string[] {
    return this.partnerForm.get('industries')?.value ?? [];
  }

  goNext(): void {
    if (this.currentMainStep === 1 && this.partnerForm.invalid) {
      this.partnerForm.markAllAsTouched();
      this.updateSubStepByForm();
      return;
    }

    this.isFieldPickerOpen = false;
    this.currentMainStep = 2;
    this.currentSubStep = 'package-type';
    this.completedSubSteps = ['information-general', 'information-business', 'package-duration'];
  }

  goBack(): void {
    if (this.currentMainStep === 2) {
      this.currentMainStep = 1;
      this.updateSubStepByForm();
      return;
    }

    this.router.navigate(['/partners']);
  }

  goToStep(stepNumber: number): void {
    if (stepNumber > this.currentMainStep) {
      return;
    }

    if (stepNumber === 1) {
      this.currentMainStep = 1;
      this.updateSubStepByForm();
      return;
    }

    if (stepNumber === 2 && this.partnerForm.valid) {
      this.currentMainStep = 2;
      this.currentSubStep = 'package-type';
      this.completedSubSteps = ['information-general', 'information-business', 'package-duration'];
    }
  }

  selectPackage(planId: string): void {
    this.selectedPackageId = planId;
    this.currentSubStep = 'package-type';
  }

  selectBillingCycle(cycleId: string): void {
    this.selectedBillingCycle = cycleId;
  }

  toggleFieldPicker(): void {
    this.isFieldPickerOpen = !this.isFieldPickerOpen;
  }

  closeFieldPicker(): void {
    this.isFieldPickerOpen = false;
  }

  isFieldSelected(field: string): boolean {
    return this.selectedFields.includes(field);
  }

  isControlInvalid(controlName: string): boolean {
    const control: AbstractControl | null = this.partnerForm.get(controlName);

    return Boolean(control && control.invalid && (control.dirty || control.touched));
  }

  hasControlValue(controlName: string): boolean {
    const value = this.partnerForm.get(controlName)?.value;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return typeof value === 'string' ? value.trim().length > 0 : Boolean(value);
  }

  toggleField(field: string): void {
    const nextFields = this.isFieldSelected(field)
      ? this.selectedFields.filter((item) => item !== field)
      : [...this.selectedFields, field];

    this.partnerForm.get('industries')?.setValue(nextFields);
    this.partnerForm.get('industries')?.markAsDirty();
    this.partnerForm.get('industries')?.markAsTouched();
  }

  removeField(field: string): void {
    const nextFields = this.selectedFields.filter((item) => item !== field);
    this.partnerForm.get('industries')?.setValue(nextFields);
    this.partnerForm.get('industries')?.markAsDirty();
    this.partnerForm.get('industries')?.markAsTouched();
  }

  submitForm(): void {
    if (this.partnerForm.invalid) {
      this.partnerForm.markAllAsTouched();
      this.currentMainStep = 1;
      this.updateSubStepByForm();
      return;
    }

    this.currentMainStep = 3;
    this.router.navigate(['/partners']);
  }

  cancel(): void {
    this.router.navigate(['/partners']);
  }

  isStepActive(stepNumber: number): boolean {
    return this.currentMainStep >= stepNumber;
  }

  isCurrentStep(stepNumber: number): boolean {
    return this.currentMainStep === stepNumber;
  }

  isSubStepActive(substep: string): boolean {
    return this.currentSubStep === substep;
  }

  isSubStepCompleted(substep: string): boolean {
    return this.completedSubSteps.includes(substep as SubStep);
  }

  trackByPlanId(_: number, plan: PricingPlan): string {
    return plan.id;
  }

  private updateSubStepByForm(): void {
    if (this.currentMainStep !== 1) {
      return;
    }

    const hasGeneralInfo =
      Boolean(this.partnerForm.get('partnerName')?.valid) &&
      Boolean(this.partnerForm.get('phone')?.valid) &&
      Boolean(this.partnerForm.get('email')?.valid);

    this.completedSubSteps = hasGeneralInfo ? ['information-general'] : [];
    this.currentSubStep = hasGeneralInfo ? 'information-business' : 'information-general';
  }
}
