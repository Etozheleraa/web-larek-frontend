import { IProductItem, IOrder } from '../../types';

export class OrderView {
  private container: HTMLElement;
  private template: HTMLTemplateElement;
  private products: IProductItem[] = [];
  private orderData: Partial<IOrder> = {}; 

  constructor(container: HTMLElement) {
    this.container = container;
    this.template = document.querySelector('#order') as HTMLTemplateElement;
  }

  setProducts(products: IProductItem[]) {
    this.products = products;
  }

  render(errors: Partial<IOrder> = {}) {
    const contentContainer = this.container.querySelector('.modal__content') as HTMLElement;
    if (!contentContainer) {
      throw new Error('Modal content container not found');
    }

    const fragment = this.template.content.cloneNode(true) as DocumentFragment;
    const form = fragment.querySelector('.form') as HTMLElement;
    if (!form) {
      throw new Error('Order form template not found');
    }

    const paymentButtons = form.querySelectorAll('.button_alt') as NodeListOf<HTMLButtonElement>;
    const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
    const nextButton = form.querySelector('.order__button') as HTMLButtonElement;
    const errorField = form.querySelector('.form__errors') as HTMLElement;

    if (this.orderData.payment) {
      const activeButton = Array.from(paymentButtons).find(
        (btn) => btn.textContent === this.orderData.payment
      );
      if (activeButton) {
        paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
        activeButton.classList.add('button_alt-active');
      }
    }
    if (this.orderData.address) {
      addressInput.value = this.orderData.address;
    }

    paymentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
        btn.classList.add('button_alt-active');
        this.orderData.payment = btn.textContent || '';
        this.validateForm(addressInput, nextButton, errorField);
      });
    });

    addressInput.addEventListener('input', () => {
      this.orderData.address = addressInput.value.trim();
      this.validateForm(addressInput, nextButton, errorField);
    });

    nextButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (!nextButton.disabled) {
        this.renderContacts();
      }
    });

    contentContainer.innerHTML = '';
    contentContainer.appendChild(form);
    this.container.classList.add('modal_active');
  }

  private renderContacts(errors: Partial<IOrder> = {}) {
    const contentContainer = this.container.querySelector('.modal__content') as HTMLElement;
    if (!contentContainer) {
      throw new Error('Modal content container not found');
    }

    const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    const fragment = contactsTemplate.content.cloneNode(true) as DocumentFragment;
    const form = fragment.querySelector('.form') as HTMLElement;
    if (!form) {
      throw new Error('Contacts form template not found');
    }

    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
    const payButton = form.querySelector('.button') as HTMLButtonElement;
    const errorField = form.querySelector('.form__errors') as HTMLElement;

    if (this.orderData.email) emailInput.value = this.orderData.email;
    if (this.orderData.phone) phoneInput.value = this.orderData.phone;

    emailInput.addEventListener('input', () => {
      this.orderData.email = emailInput.value.trim();
      this.validateContacts(emailInput, phoneInput, payButton, errorField);
    });

    phoneInput.addEventListener('input', () => {
      this.orderData.phone = phoneInput.value.trim();
      this.validateContacts(emailInput, phoneInput, payButton, errorField);
    });

    contentContainer.innerHTML = '';
    contentContainer.appendChild(form);
    this.container.classList.add('modal_active');
  }

  private validateForm(addressInput: HTMLInputElement, nextButton: HTMLButtonElement, errorField: HTMLElement) {
    const paymentSelected = this.orderData.payment !== undefined && this.orderData.payment !== '';
    const addressFilled = this.orderData.address !== undefined && this.orderData.address !== '';

    if (!paymentSelected) {
      errorField.textContent = 'Выберите способ оплаты';
      nextButton.disabled = true;
    } else if (!addressFilled) {
      errorField.textContent = 'Введите адрес доставки';
      nextButton.disabled = true;
    } else {
      errorField.textContent = '';
      nextButton.disabled = false;
    }
  }

  private validateContacts(
    emailInput: HTMLInputElement,
    phoneInput: HTMLInputElement,
    payButton: HTMLButtonElement,
    errorField: HTMLElement
  ) {
    const emailFilled = this.orderData.email !== undefined && this.orderData.email !== '';
    const phoneFilled = this.orderData.phone !== undefined && this.orderData.phone !== '';

    if (!emailFilled) {
      errorField.textContent = 'Введите email';
      payButton.disabled = true;
    } else if (!phoneFilled) {
      errorField.textContent = 'Введите телефон';
      payButton.disabled = true;
    } else {
      errorField.textContent = '';
      payButton.disabled = false;
    }
  }

  bindSubmitOrder(handler: (data: IOrder) => void) {
    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      const target = event.target as HTMLFormElement;
      if (target.name === 'contacts') {
        const payButton = target.querySelector('.button') as HTMLButtonElement;
        if (!payButton.disabled) {
          const order: IOrder = {
            items: this.products.map((product) => product.id),
            payment: this.orderData.payment || '',
            email: this.orderData.email || '',
            phone: this.orderData.phone || '',
            address: this.orderData.address || '',
            total: this.getTotalPrice(),
          };
          handler(order);
        }
      }
    });
  }

  bindCloseModal(handler: () => void): void {
    const closeButton = this.container.querySelector('.modal__close') as HTMLElement;
    if (closeButton) {
      closeButton.addEventListener('click', handler);
    }

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        handler();
      }
    });
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }

  private getTotalPrice(): number {
    let sum = 0
    for (let product of this.products) {
      sum += product.price || 0
    }
    return sum
  }
}