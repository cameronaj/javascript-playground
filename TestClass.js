// Classes are named using this hierarchy to avoid duplicate class names,
// which can occur when using 3rd party classes
// (namespace set up is within Namespaces.js)
com.example.pages.TestClass = (function () {
    
    // This is the base constructor for the javascript class
    // It accepts 'options' which is an json object
    // Example 'options' structure can be seen on line 20 of TestPage.html
    function TestClass(options){
        // This forloop goes through each member of the class and 'scopes it in'
        // Allowing us to use 'this' to reference any function or property within our class 
        // (this is not always possible otherwise)
        for(var memberName in this){
            var member = this[memberName];
            
            // We ignore the constructor when scoping because we don't want to run it twice.
            // To do this we use the jQuery '$.proxy' method.
            if(member !== 'constructor' && typeof member === 'function'){
                this[memberName] = $.proxy(member, this);
            }
        }
        
        this._initialize(options);
        this._attachEvents();
    }
    
    // This is where the rest of the class lives, all properties and methods.
    TestClass.prototype = {
        
        // These are the properties of the TestClass
        // Only assign primitive types a value; everything else should be set to null by default.
        // this is because when new instances of the class are created, javascript creates new references, not a whole new object.
        // So we assign all non-primitive properties within _initialize to avoid overlap
        
        // You'll notice that most, if not all, properties and methods have an underscore (_)
        // before their name, this denotes that they are private.
        // Javascript doesn't really have a public/private but we do this so that
        // we can easily recognize when we are using a local prop/method versus a class prop/method.
        
        _isDebugging: false,
        
        // All jQuery objects have a dollar sign ($) before their name, this is done
        // so that you know, just by looking at the property what it is.
        //jQuery objects
        _$search: null,
        _$results: null,
        
        //properties
        _numResults: null,
        _types: null,
        
        // In the initialize, set up all of the class properties, passed through via 'options' json object
        _initialize: function(options){
            // If no options are sent through, assign an empty object so that js doesn't break later
            options = options || {};
            
            // For testing purposes, _isDebugging is always set to true
            this._isDebugging = (true || options.isDebugging);
            
            // Assign jQuery objects based upon a selector (provide a default if one is not provided)
            // default selectors are ('#q' and '#results')
            this._$search = $((options.searchSelector || '#q'));
            this._$results = $((options.resultSelector || '#results'));
            
            // Assign properties (provide default if one is not provided)
            this._numResults = options.numResults || 6;
            
            // Run more complicated initialization processes
            this._initializeTypes();
            this._loadResults();
        },
        
        // It's a good idea to break longer instantiations out into another method, so that it is easier to read/maintain,
        // It also makes it easier to repurpose or reuse parts of the class.
        _initializeTypes: function(){
            // Although you can structure the objects to be one line, 
            // it is easier to read/maintain when broken out to one property per line
            this._types = [
                {
                    name: 'ps',
                    formatted: 'Products & Services',
                    searchUrl: '/products/search',
                    singular: 'Product & Service'
                },
                {
                    name: 'loc',
                    formatted: 'Locations',
                    searchUrl: '/locations/search',
                    singular: 'Location'
                },
                {
                    name: 'res',
                    formatted: 'Resources',
                    searchUrl: '/resources/search',
                    singular: 'Resource'
                },
                {
                    name: 'rev',
                    formatted: 'Reviews',
                    searchUrl: '/reviews/search',
                    singular: 'Review'
                },
                {
                   name: 'ven',
                   formatted: 'Vendors',
                   searchUrl: '/vendors/search',
                   singular: 'Vendor'
                },
                {
                   name: 'ten',
                   formatted: 'Tenants',
                   searchUrl: '/tenants/search',
                   singular: 'Tenant'
                },
                {
                   name: 'pok',
                   formatted: 'Pokemon',
                   searchUrl: '/pokemon/search',
                   singular: 'Pokemon'
                }];
                
                // One example of referencing a value from a json object in a json array is:
                // this._types[0].name     // == 'ps'
                
                // If our json objects had string keys, we could index off of them instead, for example:
                // array: ['myObject': {name: 'ps', formatted: 'Products & Services', searchUrl: '/products/search', singular: 'Product & Service'}]
                // To get the same value as the first example we would do the following:
                // this._types['myObject'].name    // == 'ps'
        },
        
        // All action listeners are defined here.
        // This providers a centralized location, making it easier to find declaration
        // And increasing maintainability in the long term
        _attachEvents: function(){
            // In the below key listener, notice how there isn't a function declaraction directly in the listener declaration?
            // By breaking the event function declaration out into it's own function,
            // we increase readability, maintainability and this allows us to reuse the function in other places.
            this._$search.on('keyup', this._handleSearchChange);
            
            // Example of inline function:
            /* this._$search.on('keyup', function(event){
             *     var query = this._$search.val();
             *     this._search(query);
             * });
             */
        },
        
        // --------------------------------
        // Methods
        // --------------------------------
        
        // All non-initialization and non-handler functions go in this section.
        
        _loadResults: function(){
            // Preferred to store array length as a var 
            // instead of including it in for loop (more efficient)
            var len = this._types.length;
            
            for(var i = 0; i < len; i++){
                var type = this._itemTemplate(this._types[i]);
                this._$results.append(type);
            }
            
            // alternatively, you could use $.each to iterate through the array; however, this is less efficient.
            /* $.each(this._types, function(index, type){
             *    var template = this._itemTemplate(type);
             *    this._$results.append(template);
             *});
             */
        },
        
        _search: function(query){
            var len = this._types.length;
            for(var i = 0; i < len; i++){
                var type = this._types[i];
                if(type.formatted.toLowerCase().indexOf(query.toLowerCase()) >= 0){
                    $('#' + type.name).show();
                }else{
                    $('#' + type.name).hide();
                }
            }
        },
        
        // --------------------------------
        // Templates
        // --------------------------------
        
        _itemTemplate: function(item){
            return [
            '<li id="' + item.name + '">',
            '<a href="' + item.searchUrl + '">',
            '<label class="checkbox">',
            '<span class="">' + item.name + ' ' + item.formatted + '</span>',
            '</label>',
            '</a>',
            '</li>'].join('\n');
        },
        
        // --------------------------------
        // Event Handlers
        // --------------------------------
        
        //All Event Handlers go in this section.
        
        _handleSearchChange: function(event){
            var query = this._$search.val();
            this._search(query);
        }
    };
    
    return TestClass;
})();