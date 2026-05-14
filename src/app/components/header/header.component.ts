import { Component, Input } from '@angular/core';

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

  readonly profile = {
    name: 'Nguyễn Minh Anh',
    role: 'Quản trị viên',
    initials: 'MA'
  };

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  openLogoutModal(): void {
    this.isProfileMenuOpen = false;
    this.isLogoutModalOpen = true;
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  confirmLogout(): void {
    this.isLogoutModalOpen = false;
  }
}
