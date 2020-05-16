// on DOM load
$(document).ready(function () {

  var instagramURL = ["https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_3ukUTnvST/", "https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_1BdZgn0jv/", "https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_gjv_gHt52/"];

  var igOne = $("#instagramone")
  var igTwo = $("#instagramtwo")
  var igThree = $("#instagramthree")

  var instagramDiv = [igOne, igTwo, igThree];

  function setInstaFeed(count) {
    if (count == 3) { return; }
    $.ajax({
      url: instagramURL[count],
      method: "GET"
    }).then(function (response) {
      // do the thing
      console.log(response);
      console.log(response.html)
      var imgURL = response.html;
      instagramDiv[count].html(imgURL);
      window.instgrm.Embeds.process();
    }).then(setInstaFeed(count + 1));
  }
  setInstaFeed(0);

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
        var notes = p[x].note_count + " notes  ";
        var source = "Source: " + p[x].source_title;
        var id = p[x].id;
        var tagsArray = p[x].tags;
        //get the timestamp for the post:
        var ts = p[x].timestamp;
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
          var photos = p[x].photos;
          for (var j = 0; j < photos.length; j++) {
            if (photos[j].alt_sizes[0]) {
              imgURL = photos[j].alt_sizes[0].url
            }
          }
        }
        //filter content types that cause double-posting.
        if (type == "answer" || type == "text") {
          console.log(p[x].summary + ", " + id);
        } else {
          //render posts to the page
          $("#tumblr-posts").append(imgContainer + imgURL + cardSection + caption + sectionParagraph + source + tags + cardNotes + notes + timeStamp + gifRequest + socialLinks);
        }
        /* } */
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
  //end of document

  // //load new random post every time page is refreshed
  // getRandom();
  // //variable retrieves a random index number
  // var x = Math.floor((Math.random() * 49) + 1);
  // console.log(x);
  // function getRandom() {
  //   var tumblrURL = 'https://api.tumblr.com/v2/blog/animatedtext.tumblr.com/posts?api_key=6zhnqA40ToF48oXKQFOVWRNfxfSTCFpO8xAJzWqUQOY3E1NOYj';
  //   $.ajax({
  //     url: tumblrURL,
  //     data: {
  //       //50 is the maximum number of posts that can be returned by the API
  //       limit: 50
  //     },
  //     dataType: 'jsonp',
  //     success: function (results) {
  //       console.log(results);
  //       var p = results.response.posts;
  //       var type = p[x].type;
  //       var caption = p[x].caption;
  //       var notes = p[x].note_count + " notes";
  //       var source = "Source: " + p[x].source_title;
  //       var id = p[x].id;
  //       var tagsArray = p[x].tags;
  //       //create an array of tags for each post
  //       for (var k = 0; k < tagsArray.length; k++) {
  //         tagsArray[k] = " #" + tagsArray[k];
  //         tags = " " + tagsArray;
  //       }
  //       //retrieve the image associated with the post
  //       if (type == "photo") {
  //         var photos = p[x].photos;
  //         for (var j = 0; j < photos.length; j++) {
  //           if (photos[j].alt_sizes[0]) {
  //             imgURL = photos[j].alt_sizes[0].url
  //           }
  //         }
  //       }

  //       j++
  //       k++;

  //       //filter content types that cause double-posting
  //       if (type == "answer" || type == "text") {
  //         console.log(p[x].summary + ", " + id);
  //       } else {
  //         //render posts to the page
  //         $("#tumblr-posts").append(imgContainer + imgURL + cardSection + caption + source + tags + cardNotes + notes + cardBottom);
  //       }
  //     }
  //   });
  // }
  // //These variables render the post on the fly
  // var imgContainer = "<div class='grid-x grid-margin-x' style='padding:10px;'><div class='cell medium-2'></div><div class='cell medium-8 card'> <img src=";
  // //+ imgURL + //
  // var cardSection = "/><div class='card-section'><p>";
  // // + source + tags +//
  // var cardNotes = "/p><div class='grid-x grid-margin-x'><div class='cell auto'><div class='notes'>"
  // // + notes + //
  // var cardBottom = "</div></div><div class='cell auto'><div class='float-right'><button data-open='askModal'><small>request a gif! </small></button><i class='fi-mail' id='contact-me' data-open='contactModal'></i><i class='fi-share' id='share' data-open='shareModal'></i></div></div></div></div></div><div class='cell medium-2'></div></div>"

});