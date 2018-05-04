The SuperController is potentially confusing for those who've not dealt with abstract classes before--and even those that have.

The SuperController is an abstract class that provides the methods for getting an item by its ObjectId and getting items with simple filtering with a Map of key-value pairs. It is not able to be instantiated directly, as it is an abstract class. 

Other, more specific methods are defined in individual controllers that extend SuperController. Methods such as getJournals() do not need to be defined in individual controllers, because they already exist with getItem() and getItems(). 

Methods such as addNewJournal() DO need to be defined in individual controllers because SuperController does not provide functionality for adding items itself--that must be defined individually. This is not defined in SuperController because there may be things specific to the controller that must be done. For example, Journals might have a subject, but Emotions might not. Therefore, this must be individually implemented in each controller that looks at that information and puts it in the appropriate collection. 

Any new query parameter keys that need to be filtered by would need to be put into the getItems() method of the SuperController. For example, if one wants to filter by date, one must include an if statement in the getItems method that checks for the presence of a date key, then adds the key and its value to the filter document if there is. 
