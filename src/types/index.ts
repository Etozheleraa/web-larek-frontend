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
    total_price: string | number;
  }
  
  export interface IOrder {
    // Массив купленных товаров
    products: string[];
    // Способ оплаты
    payment: string;
    // Сумма заказа
    total_price: number;
    address: string;
    email: string;
    phone: string;
  }
  
  export interface IOrderResult {
    id: string;
    total_price: number;
  }
  
  // тип ошибки формы
  export type FormErrors = Partial<Record<keyof IOrderForm, string>>;