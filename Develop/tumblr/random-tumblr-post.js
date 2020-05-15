$(document).ready(function () {
    $(document).foundation();
    //load new random post every time page is refreshed
    getRandom();

    //variable retrieves a random index number
    var x = Math.floor((Math.random() * 49) + 1);
    console.log(x);


    function getRandom() {
        var queryURL = 'https://api.tumblr.com/v2/blog/animatedtext.tumblr.com/posts?api_key=6zhnqA40ToF48oXKQFOVWRNfxfSTCFpO8xAJzWqUQOY3E1NOYj';
        $.ajax({
            url: queryURL,
            data: {
                //50 is the maximum number of posts that can be returned by the API
                limit: 50
            },
            dataType: 'jsonp',
            success: function (results) {
                console.log(results);
                var p = results.response.posts;
                    var type = p[x].type;
                    var caption = p[x].caption;
                    var notes = p[x].note_count + " notes";
                    var source = "Source: " + p[i].source_title;
                    var id = p[x].id;
                    var tagsArray = p[x].tags;
                    //create an array of tags for each post
                    for (var k = 0; k < tagsArray.length; k++) {
                        tagsArray[k] = " #" + tagsArray[k];
                        tags = " " + tagsArray;
                    }
                    //retrieve the image associate with the post
                    if (type == "photo") {
                        var photos = p[x].photos;
                        for (var j = 0; j < photos.length; j++) {
                            if (photos[j].alt_sizes[0]) {
                                imgURL = photos[j].alt_sizes[0].url
                            }
                        }
                    }
                    i++;
                    //filter content types that cause double-posting
                    if (type == "answer" || type == "text") {
                        console.log(p[x].summary + ", " + id);
               } else {
                   //render posts to the page
                   $("#tumblr-posts").append(imgContainer + imgURL + cardSection + caption + sectionParagraph + source + tags + cardNotes + notes + cardBottom);
                }
            }
        });
    }

//These variables render the post on the fly
var imgContainer =   "<div class='grid-x grid-margin-x' style='padding:10px;'><div class='cell medium-2'></div><div class='cell medium-8 card'> <img src='";
//+ imgURL + //
var cardSection = "/><div class='card-section'><p>";
// + source + tags +//
var cardNotes = "/p><div class='grid-x grid-margin-x'><div class='cell auto'><div class='notes'>"
// + notes + //
var cardBottom = "</div></div><div class='cell auto'><div class='float-right'><button data-open='askModal'><small>request a gif! </small></button><i class='fi-mail' id='contact-me' data-open='contactModal'></i><i class='fi-share' id='share' data-open='shareModal'></i></div></div></div></div></div><div class='cell medium-2'></div></div>"

//end of document
});

$(document).ready(function () {
    $(document).foundation();
    //load new random post every time page is refreshed
    getRandom();

    //variable retrieves a random index number
    var x = Math.floor((Math.random() * 49) + 1);
    console.log(x);


    function getRandom() {
        var queryURL = 'https://api.tumblr.com/v2/blog/animatedtext.tumblr.com/posts?api_key=6zhnqA40ToF48oXKQFOVWRNfxfSTCFpO8xAJzWqUQOY3E1NOYj';
        $.ajax({
            url: queryURL,
            data: {
                //50 is the maximum number of posts that can be returned by the API
                limit: 50
            },
            dataType: 'jsonp',
            success: function (results) {
                console.log(results);
                var p = results.response.posts;
                    var type = p[x].type;
                    var caption = p[x].caption;
                    var notes = p[x].note_count + " notes";
                    var source = "Source: " + p[i].source_title;
                    var id = p[x].id;
                    var tagsArray = p[x].tags;
                    //create an array of tags for each post
                    for (var k = 0; k < tagsArray.length; k++) {
                        tagsArray[k] = " #" + tagsArray[k];
                        tags = " " + tagsArray;
                    }
                    //retrieve the image associate with the post
                    if (type == "photo") {
                        var photos = p[x].photos;
                        for (var j = 0; j < photos.length; j++) {
                            if (photos[j].alt_sizes[0]) {
                                imgURL = photos[j].alt_sizes[0].url
                            }
                        }
                    }
                    i++;
                    //filter content types that cause double-posting
                    if (type == "answer" || type == "text") {
                        console.log(p[x].summary + ", " + id);
               } else {
                   //render posts to the page
                   $("#tumblr-posts").append(imgContainer + imgURL + cardSection + caption + sectionParagraph + source + tags + cardNotes + notes + cardBottom);
                }
            }
        });
    }

//These variables render the post on the fly
var imgContainer =   "<div class='grid-x grid-margin-x' style='padding:10px;'><div class='cell medium-2'></div><div class='cell medium-8 card'> <img src='";
//+ imgURL + //
var cardSection = "/><div class='card-section'><p>";
// + source + tags +//
var cardNotes = "/p><div class='grid-x grid-margin-x'><div class='cell auto'><div class='notes'>"
// + notes + //
var cardBottom = "</div></div><div class='cell auto'><div class='float-right'><button data-open='askModal'><small>request a gif! </small></button><i class='fi-mail' id='contact-me' data-open='contactModal'></i><i class='fi-share' id='share' data-open='shareModal'></i></div></div></div></div></div><div class='cell medium-2'></div></div>"

//end of document
});

