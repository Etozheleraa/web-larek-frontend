export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    // был данный товар добавлен в корзину или нет
    added: boolean;
  }
  
  // интерфейс формы заказа
  export interface IOrderForm {
    payment: string;
    address: string;
    phone: string;
    email: string;
    total: number;
    items: string[];
  }
  
  export interface IOrder {
    // Массив купленных товаров
    items: string[];
    // Способ оплаты
    payment: string;
    // Сумма заказа
    total: number;
    address: string;
    email: string;
    phone: string;
  }
  
  export interface IOrderResult {
    id: string;
    total: number;
  }
  
  // тип ошибки формы
  export type FormErrors = Partial<Record<keyof IOrderForm, string>>;