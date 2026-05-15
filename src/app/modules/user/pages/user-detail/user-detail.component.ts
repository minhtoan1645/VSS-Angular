import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: User | undefined;
  private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            const id = Number(params.get('id'));
            return this.userService.getUserById(id);
          })
        )
        .subscribe((user) => {
          this.user = user;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  getStatusClass(status: User['status']): string {
    return status === 'Đang sử dụng' ? 'status-badge status-badge--active' : 'status-badge status-badge--paused';
  }

  getRoleBadgeClass(role: User['role']): string {
    if (role === 'Admin') {
      return 'badge badge--soft-danger';
    }

    if (role === 'Manager') {
      return 'badge badge--soft-info';
    }

    return 'badge badge--soft-success';
  }
}
