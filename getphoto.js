var exports = module.exports = {};

exports.search = function (searchTerm, searchResult) {
    var k = 'tKEptrWhHXKeIXMlHyWyEK8VCYosx5qdUQ4m5tXk';
    var API500px = require('500px');
    var api500px = new API500px(k);

    return api500px.photos.searchByTerm(searchTerm, {'sort': 'created_at', 'rpp': '100'}, function(error, results) {
        var photoResponse = {};

        if (error) {
            console.log("Error! " + error);
        }

        if(results) {
            if(results.photos) {
                var random = Math.floor((Math.random() * (results.photos.length-1)) + 0);
                var photo = results.photos[random];
                var randomPhotoPage = 'https://500px.com' + photo.url;
                var randomPhotoUrl = photo.image_url;
                photoResponse = {
                    pageUrl: randomPhotoPage,
                    imageUrl: randomPhotoUrl
                };
            }
        }

        searchResult(photoResponse);
    });
};
