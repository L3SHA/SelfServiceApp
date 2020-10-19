import { LightningElement, wire, track } from 'lwc';

import { subscribe, MessageContext } from 'lightning/messageService';


import ORDER_CREATED_MESSAGE from '@salesforce/messageChannel/OrderCreated__c';
import ADD_DISH_TO_ORDER_MESSAGE from '@salesforce/messageChannel/AddDishToOrder__c';

import getOrderDishes from '@salesforce/apex/OrderController.getOrderDishes';

export default class DishOrderList extends LightningElement {
    
    orderId;

    @wire(MessageContext) messageContext;
 
    orderCreationSubscription;

    dishAddSubscription;

    pageNumber = 1;

    pageSize;

    totalItemCount = 0;

    @wire(getOrderDishes, { pageNumber: '$pageNumber', orderId: '$orderId'})
    orderDishes

    connectedCallback() {
        this.orderCreationSubscription = subscribe(
            this.messageContext,
            ORDER_CREATED_MESSAGE,
            (message) => this.handleOrderCreated(message.orderId)
        );

    }

    handleOrderSave(){
        this.orderId = null;
    }

    handleOrderCreated(orderId) {
        this.orderId = orderId;
        console.log(orderId);
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }

}