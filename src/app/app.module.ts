import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ProductModule } from './product/product.module';
import { AccountModule } from './account/account.module';
import { WelcomeModule } from './home/welcome.module';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routes';

import { ProductService } from './product/product.service';
import { AccountService } from './account/account.service';
import { OrderService } from './orders/order.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AccountModule,
    ProductModule,
    WelcomeModule,
    routing
  ],
  providers: [ appRoutingProviders, ProductService, AccountService, OrderService ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
