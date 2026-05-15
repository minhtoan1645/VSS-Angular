import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

type ProfileStatus = 'Hoạt động' | 'Đang bận' | 'Tạm khóa';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title = '';
  @Input() iconSrc = 'assets/images/icons/tag-user.png';

  isProfileMenuOpen = false;
  isLogoutModalOpen = false;
  isStatusMenuOpen = false;
  selectedProfileStatus: ProfileStatus = 'Hoạt động';
  readonly profileStatuses: ProfileStatus[] = ['Hoạt động', 'Đang bận', 'Tạm khóa'];

  readonly profile = {
    name: 'Lê Văn Đạo',
    role: 'Quản lý'
  };

  constructor(private readonly router: Router) {}

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isStatusMenuOpen = false;
  }

  openLogoutModal(): void {
    this.isProfileMenuOpen = false;
    this.isStatusMenuOpen = false;
    this.isLogoutModalOpen = true;
  }

  toggleStatusMenu(): void {
    this.isStatusMenuOpen = !this.isStatusMenuOpen;
  }

  setProfileStatus(status: ProfileStatus): void {
    this.selectedProfileStatus = status;
    this.isStatusMenuOpen = false;
  }

  getProfileStatusClass(): string {
    return `profile-menu__status ${this.getProfileStatusToneClass(this.selectedProfileStatus)}`;
  }

  getAvatarStatusClass(): string {
    return `dashboard-header__avatar-status ${this.getAvatarStatusToneClass()}`;
  }

  getProfileStatusToneClass(status: ProfileStatus): string {
    if (status === 'Đang bận') {
      return 'profile-menu__status--busy';
    }

    if (status === 'Tạm khóa') {
      return 'profile-menu__status--locked';
    }

    return 'profile-menu__status--active';
  }

  private getAvatarStatusToneClass(): string {
    if (this.selectedProfileStatus === 'Đang bận') {
      return 'dashboard-header__avatar-status--busy';
    }

    if (this.selectedProfileStatus === 'Tạm khóa') {
      return 'dashboard-header__avatar-status--locked';
    }

    return 'dashboard-header__avatar-status--active';
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  confirmLogout(): void {
    this.isLogoutModalOpen = false;
    this.router.navigate(['/login']);
  }
}
