import { LightningElement, wire } from 'lwc';

import getImageURL from '@salesforce/apex/DishController.getImageURLByRecordId';

import { publish, subscribe, MessageContext } from 'lightning/messageService';
import DISH_SELECTED_MESSAGE from '@salesforce/messageChannel/DishSelected__c';
import ORDER_CREATED_MESSAGE from '@salesforce/messageChannel/OrderCreated__c';

import { getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Dish__c.Name';
import PRICE_FIELD from '@salesforce/schema/Dish__c.Price__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Dish__c.Description__c';

import ORDER_OBJECT from '@salesforce/schema/OrderInfo__c';
import DATE_FIELD from '@salesforce/schema/OrderInfo__c.Order_Date__c';

import DISH_ORDER_OBJECT from '@salesforce/schema/DishOrder__c';
import COMMENT_FIELD from '@salesforce/schema/DishOrder__c.Comment__c';
import DISH_ID_FIELD from '@salesforce/schema/DishOrder__c.DishId__c';
import ORDER_ID_FIELD from '@salesforce/schema/DishOrder__c.OrderId__c';
import SERVINGS_AMOUNT_FIELD from '@salesforce/schema/DishOrder__c.ServingsAmount__c';

import {
    createRecord,
} from 'lightning/uiRecordApi';

export default class DishDetails extends LightningElement {

    priceField = PRICE_FIELD;
    descriptionField = DESCRIPTION_FIELD;

    isOrderCreating = false;

    recordId;

    orderId;

    comment = '';

    dishName;

    @wire (getImageURL, {recordId : '$recordId'})
    dishPictureUrl;

    @wire(MessageContext) messageContext;
 
    dishSelectionSubscription;

    servingsAmount = 1;

    price;
    
    totalSum;

    connectedCallback() {
        this.dishSelectionSubscription = subscribe(
            this.messageContext,
            DISH_SELECTED_MESSAGE,
            (message) => this.handleDishSelected(message.dishId)
        );
    }

    handleRecordLoaded(event) {
        const { records } = event.detail;
        const recordData = records[this.recordId];
        this.dishName = getFieldValue(recordData, NAME_FIELD);
        this.price = parseInt(getFieldValue(recordData, PRICE_FIELD), 10);
    }

    handleDishSelected(dishId) {
        this.recordId = dishId;
        this.handleTotalSumChanged();
    }

    handleChangeServingsAmount(event){
        this.servingsAmount = parseInt(event.target.value, 10);
            if(this.servingsAmount <= 0 || isNaN(this.servingsAmount)){
                alert('Invalid serving amount value');
                this.servingsAmount = 1;
            }
        this.handleTotalSumChanged();
    }

    handleAddServing(){
        this.servingsAmount += 1;
        this.handleTotalSumChanged();
    }

    handleRemoveServing(){
        if(this.servingsAmount != 1){
            this.servingsAmount -= 1;
            this.handleTotalSumChanged();
        }
    }

    handleTotalSumChanged(){
        //totalSum = this.servingsAmount * price;
    }

    handleCreateOrder(){
        this.isOrderCreating = true;

        const fields = {};
        fields[DATE_FIELD.fieldApiName] = new Date("2017-02-26");

        const recordInput = {
            apiName: ORDER_OBJECT.objectApiName,
            fields
        };
        createRecord(recordInput)
        .then(order => {
            this.orderId = order.id;
            publish(this.messageContext, ORDER_CREATED_MESSAGE, {
                orderId: order.id 
            });
            //console.log(this.orderId);  
        })
        .catch(error => {
            console.log(error);
        })

        
        console.log(this.orderId);
    }

    handleAddDishToOrder(){

        const recordInput = {
            apiName: DISH_ORDER_OBJECT.objectApiName,
            fields: {
                [ORDER_ID_FIELD.fieldApiName]: this.orderId,
                [COMMENT_FIELD.fieldApiName]: 'lol',
                [DISH_ID_FIELD.fieldApiName]: this.recordId,
                [SERVINGS_AMOUNT_FIELD.fieldApiName]: this.servingsAmount

            }
        };

        createRecord(recordInput)
            .then(dishOrder => {
                alert('Ok');
            })
            .catch((e) => {
                alert('Shit');
                    console.log(e);                
            });

            
        
    }

}