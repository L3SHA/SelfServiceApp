import { LightningElement, api, wire } from 'lwc';
import getImageURL from '@salesforce/apex/DishController.getImageURLByRecordId';
import getDishById from '@salesforce/apex/DishController.getDishById';

export default class OrderDetails extends LightningElement {
    
    _orderDish;

    @api
    get orderdish() {
        return this._orderDish;
    }
    set orderdish(value) {
        this._orderDish = value;
        console.log(this._orderDish.DishId__c);
        this.comment = value.Comment__c;
        this.servingsAmount = value.ServingsAmount__c;   
    }

    name;
    totalSum;

    @wire( getDishById, {recordId : '$_orderDish.DishId__c' })
    wiredDishRecord({error, data}){
        if (data) {
            console.log(data);
            this.name = data.Name;
            this.totalSum = data.Price__c * this.servingsAmount;
        } else if (error) {
            console.log(error);
        }
    }

    comment;
    servingsAmount;
    @wire(getImageURL, {recordId : '$_orderDish.DishId__c'})
    imageURL;   

}