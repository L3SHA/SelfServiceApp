import { LightningElement, api, wire } from 'lwc';
import getImageURL from '@salesforce/apex/DishController.getImageURLByRecordId';

export default class DishCard extends LightningElement {
 
    _dish;
 
    @api
    get dish() {
        return this._dish;
    }
    set dish(value) {
        this._dish = value;
        this.price = value.Price__c;
        this.name = value.Name;
        this.description = value.Description__c;
        
    }

    description;
    name;
    price;
    @wire(getImageURL, {recordId : '$_dish.Id'})
    imageURL;

    handleClick() {
            
        const selectedEvent = new CustomEvent('selected', {
            detail: this._dish.Id
        });
        
        this.dispatchEvent(selectedEvent);
        
    }

}