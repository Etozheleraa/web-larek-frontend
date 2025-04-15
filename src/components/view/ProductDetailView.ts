import { IProductItem } from '../../types';

export class ProductDetailView {
  private modal: HTMLElement;
  private template: HTMLTemplateElement;

  constructor(modal: HTMLElement) {
    this.modal = modal;
    this.template = document.querySelector('#card-preview') as HTMLTemplateElement;
  }

  render(product: IProductItem, addToBasketHandler?: (id: string) => void): void {
    const contentContainer = this.modal.querySelector('.modal__content');
    if (!contentContainer) {
      throw new Error('Modal content container not found');
    }
    contentContainer.innerHTML = '';

    const fragment = this.template.content.cloneNode(true) as DocumentFragment;
    const card = fragment.querySelector('.card.card_full');
    if (!card) {
      throw new Error('Card template not found');
    }

    const title = card.querySelector('.card__title') as HTMLElement;
    const image = card.querySelector('.card__image') as HTMLImageElement;
    const description = card.querySelector('.card__text') as HTMLElement;
    const price = card.querySelector('.card__price') as HTMLElement;
    const category = card.querySelector('.card__category') as HTMLElement;
    const button = card.querySelector('.card__button') as HTMLButtonElement;

    if (title) title.textContent = product.title;
    if (image) {
      image.src = product.image;
      image.alt = product.title;
    }
    if (description) description.textContent = product.description;
    if (price) price.textContent = product.price ? `${product.price} синапсов` : 'Цена по запросу';
    if (category) category.textContent = product.category || 'другое';
    if (button) {
      button.textContent = product.added ? 'Удалить из корзины' : 'В корзину';
      button.disabled = product.price === null;
      button.dataset.id = product.id;

      if (addToBasketHandler) {
        button.addEventListener('click', () => {
          const id = button.dataset.id;
          if (id) {
            addToBasketHandler(id);
          }
        });
      }
    }

    contentContainer.appendChild(card);

    this.modal.classList.add('modal_active');
  }

  bindCloseModal(handler: () => void): void {
    const closeButton = this.modal.querySelector('.modal__close') as HTMLElement;
    if (closeButton) {
      closeButton.addEventListener('click', handler);
    }

    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        handler();
      }
    });
  }

  bindAddToBasket(handler: (id: string) => void): void {
    const button = this.modal.querySelector('.card__button') as HTMLButtonElement;
    if (button) {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        if (id) {
          handler(id);
        }
      });
    }
  }

  close(): void {
    this.modal.classList.remove('modal_active');
  }
}