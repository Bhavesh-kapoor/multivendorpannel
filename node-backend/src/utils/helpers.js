import handlebars from 'handlebars';
handlebars.registerHelper('add', function (a, b) {
    return a + b;
})

handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});
