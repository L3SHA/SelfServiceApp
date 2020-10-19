public with sharing class OrderController {
    
    static Integer PAGE_SIZE = 9;

    @AuraEnabled(cacheable=true)
    public static PageResult getOrderDishes(Integer pageNumber, Id orderId){

        Integer pageSize = OrderController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PageResult result = new PageResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = [SELECT count() FROM DishOrder__c WHERE OrderId__c =: orderId];

        result.records = [SELECT Id, Name, Comment__c, OrderId__c, DishId__c, ServingsAmount__c FROM DishOrder__c WHERE OrderId__c =: orderId WITH SECURITY_ENFORCED ORDER BY Name LIMIT :pageSize OFFSET :offset];

        return result;
    }

}
