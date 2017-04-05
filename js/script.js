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
    var $city = $('#city'); // washington dc
    var $street = $('#street'); // 1600 pennsylvania avenu
    var cityStr = $city.val();
    var streetStr = $street.val();
    var location = streetStr + ' ' + cityStr;
    var imgDom = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + location + '">';
    $body.append(imgDom);
    $greeting.text(cityStr + '  ' + streetStr);

    // NY Times AJAX request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=8b5b831bc6c3420bbfaef228c2292cbd';
    $.getJSON(nytimesUrl, function(data) {
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

    // Wikipedia AJAX request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' +
        cityStr + '&format=json&callback=wikiCallback';
    console.log(wikiUrl);

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('failed to get wikipedia resources');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        jsonp: 'callback',
        success: function(response) {
            console.log(11);
            console.log(response);
            var articleList = response[1];
            for (var i = 0; i < articleList.length; i++) {
                var articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);

// ["washington dc", ["Washington, D.C.", "Washington D.C. Temple", "Washington, DC Metropolitan Area Special Flight Rules Area", "Washington D.C. Area Film Critics Association", "Washington D.C. Touchdown Club", "Washington D.C. Slayers", "Washington, D.C. hardcore", "Washington DC politics", "Washington DC area", "Washington-DCA"],
//     ["Washington, D.C., formally the District of Columbia and commonly referred to as \"Washington\", \"the District\", or simply \"D.C.\", is the capital of the United States.", "The Washington D.C. Temple (formerly the Washington Temple) is the 18th constructed and 16th operating temple of The Church of Jesus Christ of Latter-day Saints (LDS Church).", "An Air Defense Identification Zone (ADIZ) has existed since February 10, 2003, around the Baltimore-Washington Metropolitan Area to restrict air traffic near Washington, D.C.", "The Washington D.C. Area Film Critics Association (WAFCA) is a group of film critics based in Washington, D.C.", "The Washington D.C. Touchdown Club was started in 1935 with a passion for charity and sports. In the ensuing years the Club has benefited many local charities as well as providing scholarships to deserving student/athletes.", "The Washington D.C. Slayers are a rugby league football team based in Washington, D.C. They currently play in the USA Rugby League.", "Washington, D.C. hardcore, commonly referred to as DC hardcore, and sometimes shortened to harDCore, is the hardcore punk scene of Washington, D.C.", "", "", ""],
//     ["https://en.wikipedia.org/wiki/Washington,_D.C.", "https://en.wikipedia.org/wiki/Washington_D.C._Temple", "https://en.wikipedia.org/wiki/Washington,_DC_Metropolitan_Area_Special_Flight_Rules_Area", "https://en.wikipedia.org/wiki/Washington_D.C._Area_Film_Critics_Association", "https://en.wikipedia.org/wiki/Washington_D.C._Touchdown_Club", "https://en.wikipedia.org/wiki/Washington_D.C._Slayers", "https://en.wikipedia.org/wiki/Washington,_D.C._hardcore", "https://en.wikipedia.org/wiki/Washington_DC_politics", "https://en.wikipedia.org/wiki/Washington_DC_area", "https://en.wikipedia.org/wiki/Washington-DCA"]
// ]
