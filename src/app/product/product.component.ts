import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IProduct } from '../models/product';
import { ProductService } from './product.service';
import { EntityService } from '../core/entity.service';
import { CartService } from '../cart/cart.service';
// import { CanComponentDeactivate } from '../core/can-deactivate-guard.service';
import { Subscription } from 'rxjs';

const cartKey = 'qiqocart';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit, OnDestroy {
  public pageTitle = 'Product Details';
  public product: IProduct;
  public editProduct: IProduct = <IProduct>{};
  public errMessage: string;
  private sub: Subscription;

  constructor(private _productService: ProductService,
    private route: ActivatedRoute,
    private _router: Router,
    private _cartService: CartService,
    private _entityService: EntityService
  ) {
  }

  canDeactivate() {
    return true; // !this.product || !this._isDirty();
  }

  cancel(showToast = true) {
    // this.editProduct = this._entityService.clone(this.product);
    if (showToast) {
      // this._toastService.activate(`Cancelled changes to ${this.product.productName}`);
    }
    this._gotoProducts();
  }

  ngOnInit() {
    console.log('Trying to get param and call getProduct');
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id']; // (+) converts string 'id' to a number
      this.pageTitle += `: ${id}`;
      console.log('Account id from the params: ' + id);
      this._productService.getProduct(id)
        .subscribe(
        product => this._setEditProduct(product),
        error => this.errMessage = <any>error
        );
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addProduct() {
    console.log('addProduct in the product.component');
    this._productService.addProduct(this.product)
      .subscribe(
      product => this.product = product,
      error => this.errMessage = <any>error
      );
  }

  updateProduct() {
    const product = this.product = this._entityService.merge(this.product, this.editProduct);
    console.log('updateProduct in the product.component');
    console.log(product);
    this._productService.updateProduct(product)
      .subscribe(prod => {
        this._setEditProduct(prod);
        // this._toastService.activate(`Successfully updated ${prod.accountName}`);
        this._gotoProducts();
      });
  }

  isAddMode() {
    this.sub = this.route.params.subscribe(params => {
      const id = +params['id']; // (+) converts string 'id' to a number
      this.pageTitle += `: ${id}`;
      return isNaN(id);
    });
  }

  deleteProduct() {
    console.log('deleteProduct in the product.component');
    console.log(this.product);
    this._productService.deleteProduct(this.product.productKey);
  }

  addToCart(product: IProduct, quantity = 1, price = 30) {
    this._cartService.addCartItem(cartKey, product, quantity, price);
    console.log('Item added to cart sucessfully!');
    this._gotoCart();
  }

  onBack(): void {
    this._router.navigate(['/products']);
  }

  // private _isDirty() {
  //   return this._entityService.propertiesDiffer(this.product, this.editProduct);
  // }

  private _setEditProduct(product: IProduct) {
    if (product) {
      this.product = product;
      this.editProduct = this._entityService.clone(this.product);
    } else {
      this._gotoProducts();
    }
  }

  private _gotoProducts() {
    // const id = this.product ? this.product.productKey : null;
    const route = ['/products']; // , id
    this._router.navigate(route);
  }

  private _gotoCart() {
    const route = ['/cart'];
    this._router.navigate(route);
  }
}
