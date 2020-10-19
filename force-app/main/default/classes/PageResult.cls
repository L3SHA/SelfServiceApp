public with sharing class PageResult {
    @AuraEnabled
    public Integer pageSize { get; set; }

    @AuraEnabled
    public Integer pageNumber { get; set; }

    @AuraEnabled
    public Integer totalItemCount { get; set; }

    /**
     * Object type is used to reuse this object
    */
    @AuraEnabled
    public Object[] records { get; set; }
}