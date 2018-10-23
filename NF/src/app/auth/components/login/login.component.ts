/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthSocialLink } from '../../auth.options';
import { getDeepFromObject } from '../../helpers';

import { NbAuthService } from '../../services/auth.service';
import { NbAuthResult } from '../../services/auth-result';
import { NbUser } from '../../models/user';

@Component({
  selector: 'nb-login',
  template: `
    <nb-auth-block>
      <h2 class="title">Neural Front Sign In</h2>  
      <small class="form-text sub-title">Sign in with your Netpros E-Mail</small>

      <form (ngSubmit)="login()" #form="ngForm" autocomplete="nope">

        <div *ngIf="showMessages.error && errors && errors.length > 0 && !submitted"
             class="alert alert-danger" role="alert">
          <div *ngFor="let error of errors">{{ error }}</div>
        </div>

        <div *ngIf="showMessages.success && messages && messages.length > 0 && !submitted"
             class="alert alert-success" role="alert">
          <div><strong>Hooray!</strong></div>
          <div *ngFor="let message of messages">{{ message }}</div>
        </div>

        <div class="form-group">
          <label for="input-email" class="sr-only">Email address</label>
          <input name="email" [(ngModel)]="user.email" id="input-email" 
                 class="form-control" placeholder="Email address" #email="ngModel"
                 [class.form-control-danger]="email.invalid && email.touched" autofocus
                 [required]="getConfigValue('forms.validation.email.required')">
          <small class="form-text error" *ngIf="email.invalid && email.touched && email.errors?.required">
            Email is required!
          </small>
        </div>
      <!--
      <div class="form-group">
                <label for="input-email" class="sr-only">Email address</label>
                <input name="email" [(ngModel)]="user.email" id="input-email" pattern=".+@.+\..+"
                      class="form-control" placeholder="Email address" #email="ngModel"
                      [class.form-control-danger]="email.invalid && email.touched" autofocus
                      [required]="getConfigValue('forms.validation.email.required')">
                <small class="form-text error" *ngIf="email.invalid && email.touched && email.errors?.required">
                  Email is required!
                </small>
                <small class="form-text error"
                      *ngIf="email.invalid && email.touched && email.errors?.pattern">
                  Email should be the real one!
                </small>
              </div>
      -->
        <div class="form-group">
          <label for="input-password" class="sr-only">Password</label>
          <input name="password" [(ngModel)]="user.password" type="password" id="input-password"
                 class="form-control" placeholder="Password" #password="ngModel"
                 [class.form-control-danger]="password.invalid && password.touched"
                 [required]="getConfigValue('forms.validation.password.required')"
                 [minlength]="getConfigValue('forms.validation.password.minLength')"
                 [maxlength]="getConfigValue('forms.validation.password.maxLength')">
          <small class="form-text error" *ngIf="password.invalid && password.touched && password.errors?.required">
            Password is required!
          </small>
          <small
            class="form-text error"
            *ngIf="password.invalid && password.touched && (password.errors?.minlength || password.errors?.maxlength)">
            Password should contains
            from {{ getConfigValue('forms.validation.password.minLength') }}
            to {{ getConfigValue('forms.validation.password.maxLength') }}
            characters
          </small>
        </div>

        <div class="form-group accept-group col-sm-12">
          <nb-checkbox name="rememberMe" [(ngModel)]="user.rememberMe">Remember me</nb-checkbox>
          <a class="forgot-password" routerLink="../forgot-password">Forgot Password?</a>
        </div>

        <button [disabled]="submitted || !form.valid" class="btn btn-block btn-hero-success"
                [class.btn-pulse]="submitted">
          Sign In
        </button>
      </form>

    </nb-auth-block>
  `,
})
export class NbLoginComponent {

  redirectDelay: number = 0;
  showMessages: any = {};
  provider: string = '';

  errors: string[] = [];
  messages: string[] = [];
  user: NbUser = {};
  submitted: boolean = false;
  socialLinks: NbAuthSocialLink[] = [];

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected config = {},
    protected router: Router) {

    this.redirectDelay = this.getConfigValue('forms.login.redirectDelay');
    this.showMessages = this.getConfigValue('forms.login.showMessages');
    this.provider = this.getConfigValue('forms.login.provider');
    this.socialLinks = this.getConfigValue('forms.login.socialLinks');
  }

  login(): void {

    this.errors = this.messages = [];
    this.submitted = true;

    this.service.authenticate(this.provider, this.user).subscribe((result: NbAuthResult) => {
      this.submitted = false;
      if (result.isSuccess()) {
      } else {
        this.errors = [result.getResponse().error.data.error];
      }

      const redirect = result.getRedirect();
      if (redirect) {
        setTimeout(() => {
          return this.router.navigateByUrl(redirect);
        }, this.redirectDelay);
      }
    });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.config, key, null);
  }
}
