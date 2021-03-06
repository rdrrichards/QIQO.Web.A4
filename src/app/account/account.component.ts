import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './account.service';
import { IAccount } from '../models/account';
import { EntityService } from '../core/entity.service';
// import { ModalService } from '../core/modal/modal.service';
// import { ToastService } from '../core/toast/toast.service';
// import { CanComponentDeactivate } from '../core/can-deactivate-guard.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  public pageTitle = 'Account Detail';
  public account: IAccount;
  public editAccount: IAccount = <IAccount>{};
  public errMessage: string;
  private _id = 0;
  private sub: Subscription;

  constructor(private _accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    private datePipe: DatePipe) {
  }

  canDeactivate() {
    // console.log(`**canDeactivate ${this.account.accountName}`);
    // console.log(`**this.account ${this.account}`);
    // console.log(`**this._isDirty ${this._isDirty()}`);
    return true; // !this.account || !this._isDirty() || this.modalService.activate();
  }

  cancel() {
    console.log('cancel clicked');
    this._gotoAccounts();
  }

  ngOnInit() {
    // this.toastService.activate(`Loading an account...`);
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id']; // (+) converts string 'id' to a number
      this._id = id;
      this.pageTitle += `: ${id}`;
      console.log('Trying to get param and call getAccount');
      console.log('Account id from the params: ' + id);
      this._accountService.getAccount(id)
        .subscribe(
        account => this._setEditAccount(account),
        error => this.errMessage = <any>error
        );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addAccount() {
    console.log('addAccount in the account.component');
    console.log(this.account);
    this._accountService.addAccount(this.account)
      .subscribe(
      account => this.account = account,
      error => this.errMessage = <any>error
      );
  }

  updateAccount() {
    const account = this.account = this.entityService.merge(this.account, this.editAccount);
    console.log('updateAccount in the account.component');
    console.log(account);
    this._accountService.updateAccount(account)
      .subscribe(acct => {
        this._setEditAccount(acct);
        this._gotoAccounts();
      });
  }

  deleteAccount() {
    this._accountService.deleteAccount(this.account.accountKey)
      .subscribe(
        () => this.onBack(),
        error => alert(`Error deleting account ${this.account.accountName}. Error: ${error.message}`)
      );
  }

  isAddMode() {
    return isNaN(this._id);
  }

  onBack(): void {
    this.router.navigate(['/accounts']);
  }

  getAccountOpenOrders(): void {
    console.log('Account id from the params: ' + this._id);
    console.log('Attempting to route to account orders...');
    const link = ['/accounts', this._id, 'orders'];
    this.router.navigate(link);
  }

  // private _isDirty() {
  //   return this.entityService.propertiesDiffer(this.account, this.editAccount);
  // }

  private _setEditAccount(account: IAccount) {
    if (account) {
      this.account = account;
      this.editAccount = this.entityService.clone(this.account);
      this.editAccount.accountStartDate = this.formatDate(this.editAccount.accountStartDate);
      this.editAccount.accountEndDate = this.formatDate(this.editAccount.accountEndDate);
    } else {
      this._gotoAccounts();
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }

  private _gotoAccounts() {
    console.log('_gotoAccounts');
    this.router.navigate(['/accounts']);
  }

}
