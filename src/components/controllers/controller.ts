import { ApiModel } from '../model/Api';
import { IProductItem, IOrder } from '../../types';
import { CatalogView } from '../view/CatalogView';
import { ProductDetailView } from '../view/ProductDetailView';
import { BasketView } from '../view/BasketView';
import { OrderView } from '../view/OrderView';

export class Controller {
  private api: ApiModel;
  private catalogView: CatalogView;
  private productDetailView: ProductDetailView;
  private basketView: BasketView;
  private orderView: OrderView;

  private products: IProductItem[] = [];
  private basket: IProductItem[] = [];
  private basketCounter: HTMLElement;
  private initialModal: HTMLElement | null;

  constructor(
    api: ApiModel,
    catalogView: CatalogView,
    productDetailView: ProductDetailView,
    basketView: BasketView,
    orderView: OrderView
  ) {
    this.api = api;
    this.catalogView = catalogView;
    this.productDetailView = productDetailView;
    this.basketView = basketView;
    this.orderView = orderView;
    this.basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
    this.initialModal = document.querySelector('.modal.modal_active') as HTMLElement; 

    this.init();
  }

  private async init() {
    this.products = await this.api.getProductList();
    this.catalogView.render(this.products, (product) => {
      this.showProductDetail(product);
    });

    this.productDetailView.bindCloseModal(() => this.closeModal());
    this.productDetailView.bindAddToBasket((id) => this.toggleBasketItem(id));
    this.basketView.bindRemoveItem((id) => this.removeFromBasket(id));
    this.basketView.bindOpenOrder(() => this.openOrder());
    this.basketView.bindCloseModal(() => this.closeModal());
    this.orderView.bindSubmitOrder((data) => this.submitOrder(data));
    this.orderView.bindCloseModal(() => this.closeModal());

    const basketButton = document.querySelector('.header__basket') as HTMLElement;
    basketButton.addEventListener('click', () => {
      this.basketView.render();
      this.basketView.open();
    });

    if (this.initialModal) {
      const closeButton = this.initialModal.querySelector('.modal__close') as HTMLElement;
      const addToBasketButton = this.initialModal.querySelector('.card__row .button') as HTMLElement;

      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.initialModal?.classList.remove('modal_active');
        });
      }

      if (addToBasketButton) {
        addToBasketButton.addEventListener('click', () => {
            this.basketView.render();
            this.basketView.open();
        });
      }

      this.initialModal.addEventListener('click', (event) => {
        if (event.target === this.initialModal) {
          this.initialModal?.classList.remove('modal_active');
        }
      });
    }

    this.updateBasketCounter();
  }

  private showProductDetail(product: IProductItem) {
    this.productDetailView.render(product, (id) => this.toggleBasketItem(id));
  }

  private closeModal() {
    this.productDetailView.close();
    this.basketView.close();
    this.orderView.close();
    if (this.initialModal) {
      this.initialModal.classList.remove('modal_active');
    }
  }

  private toggleBasketItem(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (!product || product.price === null) return;

    if (product.added) {
      this.basket = this.basket.filter((item) => item.id !== id);
      product.added = false;
    } else {
      this.basket.push({ ...product, added: true });
      product.added = true;
    }

    this.basketView.setItems(this.basket);
    this.orderView.setProducts(this.basket);
    this.updateBasketCounter();
    this.productDetailView.render(product, (id) => this.toggleBasketItem(id));
  }

  private removeFromBasket(id: string) {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      product.added = false;
      this.basket = this.basket.filter((item) => item.id !== id);
      this.basketView.setItems(this.basket);
      this.orderView.setProducts(this.basket);
      this.updateBasketCounter();
      this.basketView.render();
    }
  }

  private updateBasketCounter() {
    this.basketCounter.textContent = this.basket.length.toString();
  }

  private openOrder() {
    if (this.basket.length > 0) {
      this.basketView.close();
      this.orderView.render();
      this.orderView.open();
    }
  }

  private async submitOrder(data: IOrder) {
    try {
      const order = {
        payment: data.payment,
        email: data.email,
        phone: data.phone,
        address: data.address,
        total: data.total,
        items: data.items,
      };
  
      const result = await this.api.createOrder(order);
      this.showSuccess(result.total);
      this.basket = [];
      this.products.forEach((p) => (p.added = false));
      this.basketView.setItems(this.basket);
      this.orderView.setProducts(this.basket);
      this.updateBasketCounter();
    } catch (error) {
      console.error('Order submission failed:', error);
    }
  }

  private showSuccess(total: number) {
    const successModal = document.querySelector('.modal .order-success')?.closest('.modal') as HTMLElement;
    if (successModal) {
      const description = successModal.querySelector('.film__description') as HTMLElement;
      if (description) {
        description.textContent = `Списано ${total} синапсов`;
      }
      successModal.classList.add('modal_active');
      const closeButton = successModal.querySelector('.modal__close') as HTMLElement;
      closeButton.addEventListener('click', () => {
        successModal.classList.remove('modal_active');
      });
    }
  }
}