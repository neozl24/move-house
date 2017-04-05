/*jshint unused: false, undef: false*/
function loadData() {
    'use strict';
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var $city = $('#city');         // washington dc
    var $street = $('#street');     // 1600 pennsylvania avenu
    var cityStr = $city.val();
    var streetStr = $street.val();
    var location = streetStr + ' ' + cityStr;
    var imgDom = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + location + '">';
    $body.append(imgDom);
    $greeting.text(cityStr + ', ' + streetStr);

    // NY Times AJAX request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=8b5b831bc6c3420bbfaef228c2292cbd';
    $.getJSON(nytimesUrl, function(data){
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        var articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                '<p>' + article.snippet + '</p>' +
            '</li>');
        }
    }).error(function() {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });


    return false;
}

$('#form-container').submit(loadData);
