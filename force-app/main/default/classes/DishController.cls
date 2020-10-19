public with sharing class DishController {

    static Integer PAGE_SIZE = 9;

    public class Filters {
        @AuraEnabled
        public Decimal maxPrice { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static PageResult getDishes(Filters filters, Integer pageNumber){
        
        String  whereClause = '';
        Decimal maxPrice;
        if (filters != null) {
            maxPrice = filters.maxPrice;
            if (filters.maxPrice >= 0) {
                maxPrice = filters.maxPrice;
                whereClause = 'WHERE Price__c <= :maxPrice';
            }
        }

        Integer pageSize = DishController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PageResult result = new PageResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery(
            'SELECT count() FROM Dish__c ' + whereClause
        );

        result.records = Database.query('SELECT Id, Name, Description__c, Price__c FROM Dish__c ' +
        whereClause +
        ' WITH SECURITY_ENFORCED' +
        ' ORDER BY Name LIMIT :pageSize OFFSET :offset');

        return result;
    }

    @AuraEnabled(cacheable=true)
    public static Dish__c getDishById(Id recordId){
        return [SELECT Id, Name, Description__c, Price__c
                FROM Dish__c
                WHERE Id =: recordId];
    }

    @AuraEnabled(cacheable=true)
    public static string getImageURLByRecordId(Id recordId){
        
        List<ContentDocumentLink> contentDocumentLink = [SELECT LinkedEntityId, contentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId =: recordId];
        
        string URL = '';

        if(!contentDocumentLink.isEmpty()){
            URL = '/sfc/servlet.shepherd/document/download/' + contentDocumentLink[0].ContentDocumentId;
        }
        else{
            URL = 'https://png.pngtree.com/png-clipart/20200224/original/pngtree-food-icon-design-vector-png-image_5243044.jpg';
        }

        return URL;
    }
}