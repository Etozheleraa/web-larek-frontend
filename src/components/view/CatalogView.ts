import { IProductItem } from '../../types';

export class CatalogView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.template = document.querySelector('#card-catalog') as HTMLTemplateElement;
  }

  render(products: IProductItem[], onClick: (item: IProductItem) => void): void {
    this.container.innerHTML = '';  

    products.forEach((product) => {
      const card = this.createCard(product, onClick);
      this.container.appendChild(card);  
    });
  }

  private createCard(product: IProductItem, onClick: (item: IProductItem) => void): HTMLElement {
    const fragment = this.template.content.cloneNode(true) as DocumentFragment;
  
    const card = fragment.querySelector('button.card');
    if (!(card instanceof HTMLElement)) {
      throw new Error('Card element not found or is not an HTMLElement');
    }
  
    const title = card.querySelector('.card__title') as HTMLElement;
    const image = card.querySelector('.card__image') as HTMLImageElement;
    const price = card.querySelector('.card__price') as HTMLElement;
    const category = card.querySelector('.card__category') as HTMLElement;
  
    if (title) title.textContent = product.title;
    if (image) {
      image.src = product.image;
      image.alt = product.title;
    }
    if (price) price.textContent = product.price ? `${product.price} ₽` : 'Цена по запросу';
    if (category) category.textContent = product.category;
  
    card.addEventListener('click', () => onClick(product));
  
    return card;
  }  
}
