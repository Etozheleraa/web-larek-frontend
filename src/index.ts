import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';

import { ApiModel } from './components/model/Api';
import { CatalogView } from './components/view/CatalogView';
import { ProductDetailView } from './components/view/ProductDetailView';
import { BasketView } from './components/view/BasketView';
import { OrderView } from './components/view/OrderView';
import { Controller } from './components/controllers/controller';

const api = new ApiModel(CDN_URL, API_URL);

const catalogContainer = document.querySelector('.gallery') as HTMLElement | null;
const productDetailContainer = document.querySelector('#modal-container') as HTMLElement | null;
const basketContainer = document.querySelector('.modal .basket')?.closest('.modal') as HTMLElement | null;
const orderContainer = document.querySelector('.modal .form')?.closest('.modal') as HTMLElement | null;

const catalogView = new CatalogView(catalogContainer);
const productDetailView = new ProductDetailView(productDetailContainer);
const basketView = new BasketView(basketContainer);
const orderView = new OrderView(orderContainer);

const controller = new Controller(api, catalogView, productDetailView, basketView, orderView);