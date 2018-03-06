// This sets up the name spacing
var com = com || {};
com.example = com.example || {};
com.example.pages = com.example.pages || {};

// the '|| {}' on each property is a check.
// If the first property is undefined, create an empty object.
// This prevents us from getting an error when we attempt to use the namespace in our class (com.example.pages.TestClass)