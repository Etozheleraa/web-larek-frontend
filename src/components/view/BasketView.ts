import { IProductItem } from '../../types';

export class BasketView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;
  private items: IProductItem[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.template = document.querySelector('#basket') as HTMLTemplateElement;
  }

  setItems(items: IProductItem[]) {
    this.items = items;
  }

  render() {
    const contentContainer = this.container.querySelector('.modal__content') as HTMLElement;
    if (!contentContainer) {
      throw new Error('Modal content container not found');
    }

    const fragment = this.template.content.cloneNode(true) as DocumentFragment;
    const basket = fragment.querySelector('.basket') as HTMLElement;
    if (!basket) {
      throw new Error('Basket template not found');
    }

    const list = basket.querySelector('.basket__list') as HTMLElement;
    const total = basket.querySelector('.basket__price') as HTMLElement;
    const orderButton = basket.querySelector('.basket__button') as HTMLButtonElement;

    list.innerHTML = '';

    if (this.items.length === 0) {
      list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
      if (orderButton) orderButton.disabled = true;
    } else {
      this.items.forEach((item, index) => {
        const el = document.createElement('li');
        el.classList.add('basket__item', 'card', 'card_compact');
        el.innerHTML = `
          <span class="basket__item-index">${index + 1}</span>
          <span class="card__title">${item.title}</span>
          <span class="card__price">${item.price} синапсов</span>
          <button class="basket__item-delete" data-id="${item.id}" aria-label="удалить"></button>
        `;
        list.appendChild(el);
      });
      if (orderButton) orderButton.disabled = false;
    }

    total.textContent = `${this.getTotalPrice()} синапсов`;

    contentContainer.innerHTML = '';
    contentContainer.appendChild(basket);

    this.container.classList.add('modal_active');
  }

  bindRemoveItem(handler: (id: string) => void) {
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('basket__item-delete')) {
        const id = target.dataset.id;
        if (id) handler(id);
      }
    });
  }

  bindOpenOrder(handler: () => void) {
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('basket__button')) {
        handler();
      }
    });
  }

  bindCloseModal(handler: () => void): void {
    const closeButton = this.container.querySelector('.modal__close') as HTMLElement;
    if (closeButton) {
      closeButton.addEventListener('click', handler);
    }
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }

  private getTotalPrice(): number {
    let sum = 0
    for (let item of this.items) {
      sum += item.price || 0
    }
    return sum
  }
}