import { LightningElement, wire } from 'lwc';

import { publish, subscribe, MessageContext } from 'lightning/messageService';
import DISHES_FILTERED_MESSAGE from '@salesforce/messageChannel/DishesFiltered__c';
import DISH_SELECTED_MESSAGE from '@salesforce/messageChannel/DishSelected__c';
import getDishes from '@salesforce/apex/DishController.getDishes';

export default class DishList extends LightningElement {

    pageNumber = 1;

    pageSize;

    totalItemCount = 0;

    filters = {};

    @wire(MessageContext) messageContext;
 
    dishFilterSubscription;

    @wire(getDishes, { filters: '$filters', pageNumber: '$pageNumber' })
    dishes;


    handleDishSelected(event) {

        publish(this.messageContext, DISH_SELECTED_MESSAGE, {
            dishId: event.detail
        });

    }

    connectedCallback() {
        this.dishFilterSubscription = subscribe(
            this.messageContext,
            DISHES_FILTERED_MESSAGE,
            (message) => this.handleFilterChange(message)
        );
    }

    handleFilterChange(message) {
        this.filters = { ...message.filters };
        this.pageNumber = 1;
    }

    handlePreviousPage() {
        this.pageNumber = this.pageNumber - 1;
    }

    handleNextPage() {
        this.pageNumber = this.pageNumber + 1;
    }

}