// on DOM load
$(document).ready(function () {
  $(document).foundation();
  var queryURL = "https://api.instagram.com/oembed?url=https://www.instagram.com/p/B-dlmiynTdh/"
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var imgUrl = response.html;
    var instagramHome = $("#instagramhome");
    instagramHome.html(imgUrl);
    window.instgrm.Embeds.process();
  })
});

