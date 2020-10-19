import { LightningElement, wire } from 'lwc';

// Ligthning Message Service and a message channel
import { publish, MessageContext } from 'lightning/messageService';
import PRODUCTS_FILTERED_MESSAGE from '@salesforce/messageChannel/DishesFiltered__c';

// The delay used when debouncing event handlers before firing the event
const DELAY = 350;

/**
 * Displays a filter panel to search for Product__c[].
 */
export default class ProductFilter extends LightningElement {

    maxPrice = 1000;

    filters = {
        maxPrice: 1000
    };

    @wire(MessageContext)
    messageContext;

    handleMaxPriceChange(event) {
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }

    delayedFireFilterChangeEvent() {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            // Published ProductsFiltered message
            publish(this.messageContext, PRODUCTS_FILTERED_MESSAGE, {
                filters: this.filters
            });
        }, DELAY);
    }
}