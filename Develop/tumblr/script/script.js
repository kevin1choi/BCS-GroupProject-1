$(document).ready(function () {
    $(document).foundation();
    __foundationRun = true;
    //load posts on browser open
    getPosts();


    //Variable tells the browser where (what "page") load new posts from the JSON object.
    var page = 0;
    function getPosts() {
        var queryURL = 'https://api.tumblr.com/v2/blog/animatedtext.tumblr.com/posts?api_key=6zhnqA40ToF48oXKQFOVWRNfxfSTCFpO8xAJzWqUQOY3E1NOYj';
        $.ajax({
            url: queryURL,
            data: {
                //Offset is for pagination. First 20 posts load on open, every time the user scrolls to end-of-page (h), offset increase by 20.
                offset: 20 * page
            },
            dataType: 'jsonp',
            //Build your tumblr post
            success: function (results) {
                console.log(results);
                var i = 0;
                var p = results.response.posts;
                //Retrieve posts as an array and retrieve data from each. 
                while (i < p.length) {
                    var type = p[i].type;
                    var caption = p[i].caption;
                    var notes = p[i].note_count + " notes  ";
                    var source = "Source: " + p[i].source_title;
                    var id = p[i].id;
                    var tagsArray = p[i].tags;
                    //get the timestamp for the post:
                    var ts = p[i].timestamp;
                        var dt = new Date(ts * 1000);
                            dt.toISOString();
                            dt.toISOString().split('T')[0];
                            dt.toISOString().replace('-', '/').split('T')[0].replace('-', '/');
                    var timeStamp = "<small style='font-weight:normal;'>  " + (dt.toLocaleString().split(',')[0]) + "</small>";
                    //create an array of tags for each post
                    for (var k = 0; k < tagsArray.length; k++) {
                        tagsArray[k] = " #" + tagsArray[k];
                        tags = " " + tagsArray;
                    }
                    //retrieve the image associate with the post
                    if (type == "photo") {
                        var photos = p[i].photos;
                        for (var j = 0; j < photos.length; j++) {
                            if (photos[j].alt_sizes[0]) {
                                imgURL = photos[j].alt_sizes[0].url
                            }
                        }
                    }
                    i++;
                    //filter content types that cause double-posting.
                    if (type == "answer" || type == "text") {
                        console.log(p[i].summary + ", " + id);
                    } else {
                        //render posts to the page
                        $("#tumblr-posts").append(imgContainer + imgURL + cardSection + caption + sectionParagraph + source + tags + cardNotes + notes + timeStamp + gifRequest + socialLinks);
                    }

                }
            }
        });
    }


    //These variables store the on-the-fly html for building the post feed
    var imgContainer = "<div class='grid-x grid-margin-x' style='padding:10px;'><div class='cell medium-3'></div><div class='cell medium-6 card'><img src='";
   /*  imageURL goes here */
    var cardSection = "'><div class='card-section'><p>";
    /* caption goes here */
    var sectionParagraph = "</p><p>";
    /*  source and tags go here */
    var cardNotes = "</p><div class='grid-x grid-margin-x'><div class='cell auto'><div class='notes'>";    
    /*  notes go  here */
    /*  timestamp  goes here */
    /*  this contains the button that triggers the gif request form and tumblr button */
    var gifRequest = "</div></div><div class='cell auto'><div class='float-right'><button id='gif-request' data-open='askModal'><small>request a gif!</small></button><i class='fi-social-tumblr' id='tumblr' data-toggle='tumblr-hover'> </i>";
    /* this contains the contact and share link, ends the array */
    var socialLinks = "<i class='fi-mail' id='contact-me' data-open='contactModal'> </i><i class='fi-share' id='share' data-toggle='social-media'> </i></div></div></div></div></div><div class='cell medium-3'></div></div>";
    
    
    //Scroll to bottom of the page and load the next post-array
    $(window).scroll(function () {
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            //increase offset by 20
            page++
            //render the posts
            getPosts();
        }
    });

    //get values from contact/request forms and sent to client email
    $('.class').on('click', function(e) {
        subject = $('#user-email').val();
        body = $('#body').val();
        //using my email as a dummy for now
        window.location = "mailto:katyeary@gmail.com?subject=" + subject + "&body=" + body;
        
        $("#contactModal").foundation('reveal', 'close');
        $("#askModal").foundation('reveal', close);
    });

    

    //end of document
});





