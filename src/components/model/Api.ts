import { ApiListResponse, Api } from '../base/api'
import { IOrder, IOrderResult, IProductItem } from '../../types';

export interface IApiModel {
  cdn: string;
  items: IProductItem[];
  getProductList: () => Promise<IProductItem[]>;
  createOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class ApiModel extends Api {
  cdn: string;
  items: IProductItem[];

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProductList(): Promise<IProductItem[]> {
    return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post(`/order`, order).then((data: IOrderResult) => data);
  }
}