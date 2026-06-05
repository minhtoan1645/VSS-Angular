import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../../user/models/user.model';
import { UserService } from '../../../user/services/user.service';
import { Partner } from '../../models/partner.model';
import { PartnerService } from '../../services/partner.service';
import { HasPermissionDirective } from '../../../../shared/directives/has-permission.directive';

@Component({
    selector: 'app-partner-detail',
    templateUrl: './partner-detail.component.html',
    styleUrls: ['./partner-detail.component.scss'],
    imports: [HasPermissionDirective, ReactiveFormsModule]
})
export class PartnerDetailComponent implements OnInit, OnDestroy {
  partner: Partner | undefined;
  relatedUsers: User[] = [];
  readonly userPageSize = 3;
  userCurrentPage = 1;
  editingUser: User | null = null;
  editingPartner: Partner | null = null;
  deletingUser: User | null = null;

  readonly cityOptions = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ'];
  readonly districtOptions = ['Quận Thanh Xuân', 'Quận Cầu Giấy', 'Quận 1', 'Quận Hải Châu'];
  readonly wardOptions = ['Phường Khương Trung', 'Phường Dịch Vọng', 'Phường Bến Nghé', 'Phường Hải Châu I'];

  readonly editUserForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required]
  });

  readonly editPartnerForm = this.formBuilder.group({
    partnerName: ['', Validators.required],
    city: ['', Validators.required],
    district: ['', Validators.required],
    ward: ['', Validators.required],
    address: ['', Validators.required]
  });

  private users: User[] = [];
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly partnerService: PartnerService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return combineLatest([
            this.partnerService.getPartnerById(id),
            this.userService.getUsers()
          ]);
        })
      ).subscribe(([partner, users]) => {
        this.partner = partner;
        this.users = users;
        this.updateRelatedUsers();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/partners']);
  }

  getStatusClass(status: Partner['status']): string {
    return status === 'Đang sử dụng' ? 'status-badge status-badge--active' : 'status-badge status-badge--paused';
  }

  getUserStatusClass(status: User['status']): string {
    return status === 'Đang sử dụng' ? 'status-badge status-badge--active' : 'status-badge status-badge--paused';
  }

  getPackageToneClass(packageName: Partner['packageName']): string {
    if (packageName === 'Trải nghiệm') {
      return 'partner-package-name partner-package-name--trial';
    }
    if (packageName === 'Cơ bản') {
      return 'partner-package-name partner-package-name--basic';
    }
    return 'partner-package-name partner-package-name--advanced';
  }

  trackByUserId(_: number, user: User): number {
    return user.id;
  }

  get visibleUsers(): User[] {
    const startIndex = (this.userCurrentPage - 1) * this.userPageSize;
    return this.relatedUsers.slice(startIndex, startIndex + this.userPageSize);
  }

  get userTotalPages(): number {
    return Math.max(Math.ceil(this.relatedUsers.length / this.userPageSize), 1);
  }

  get userPages(): number[] {
    return Array.from({ length: this.userTotalPages }, (_, index) => index + 1);
  }

  get userStartRecord(): number {
    return this.relatedUsers.length === 0 ? 0 : (this.userCurrentPage - 1) * this.userPageSize + 1;
  }

  get userEndRecord(): number {
    return Math.min(this.userCurrentPage * this.userPageSize, this.relatedUsers.length);
  }

  setUserPage(page: number): void {
    this.userCurrentPage = Math.min(Math.max(page, 1), this.userTotalPages);
  }

  openEditPartnerModal(partner: Partner): void {
    this.editingPartner = partner;
    this.editPartnerForm.setValue({
      partnerName: partner.name,
      city: this.cityOptions[0],
      district: this.districtOptions[0],
      ward: this.wardOptions[0],
      address: partner.address
    });
  }

  closeEditPartnerModal(): void {
    this.editingPartner = null;
    this.editPartnerForm.reset({ partnerName: '', city: '', district: '', ward: '', address: '' });
  }

  savePartnerEdit(): void {
    if (!this.editingPartner || this.editPartnerForm.invalid) {
      this.editPartnerForm.markAllAsTouched();
      return;
    }
    const { partnerName, address } = this.editPartnerForm.getRawValue();
    this.subscriptions.add(
      this.partnerService.updatePartner(this.editingPartner.id, {
        name: partnerName?.trim(),
        address: address?.trim()
      }).subscribe(() => this.closeEditPartnerModal())
    );
  }

  openEditUserModal(user: User): void {
    this.editingUser = user;
    this.editUserForm.setValue({ name: user.name, email: user.email, phone: user.phone });
  }

  closeEditUserModal(): void {
    this.editingUser = null;
    this.editUserForm.reset({ name: '', email: '', phone: '' });
  }

  saveUserEdit(): void {
    if (!this.editingUser || this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      return;
    }
    const { name, email, phone } = this.editUserForm.getRawValue();
    this.subscriptions.add(
      this.userService.updateUser(this.editingUser.id, {
        name: name?.trim(),
        email: email?.trim(),
        phone: phone?.trim()
      }).subscribe(() => this.closeEditUserModal())
    );
  }

  openDeleteUserModal(user: User): void {
    this.deletingUser = user;
  }

  closeDeleteUserModal(): void {
    this.deletingUser = null;
  }

  confirmDeleteUser(): void {
    if (!this.deletingUser) {
      return;
    }
    const idToDelete = this.deletingUser.id;
    if (this.editingUser?.id === idToDelete) {
      this.closeEditUserModal();
    }
    this.subscriptions.add(
      this.userService.deleteUser(idToDelete).subscribe(() => this.closeDeleteUserModal())
    );
  }

  private updateRelatedUsers(): void {
    if (!this.partner || this.users.length === 0) {
      this.relatedUsers = [];
      this.userCurrentPage = 1;
      return;
    }
    const startIndex = ((this.partner.id - 1) * 20) % this.users.length;
    const orderedUsers = [...this.users.slice(startIndex), ...this.users.slice(0, startIndex)];
    this.relatedUsers = orderedUsers.slice(0, 20);
    this.userCurrentPage = 1;
  }
}
