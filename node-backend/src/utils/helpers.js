import handlebars from 'handlebars';
handlebars.registerHelper('add', function (a, b) {
    return a + b;
})

handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});

// Register the isAdmin helper globally
handlebars.registerHelper('isAdmin', function(user) {
    return user && user.is_admin === 1; // Ensure to check if user exists
});

handlebars.registerHelper('uppercase',function(string){
    return string.toUpperCase();
})



