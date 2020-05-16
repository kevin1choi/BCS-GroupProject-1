// on DOM load
$( document ).ready(function() {
    $(document).foundation();
    
    requirejs(["../Library/index.umd.min"], function(index) {
        //This function is called when ""../Library/index.umd.min" is loaded.
        //Functions are not fired until dependencies have loaded and the index
        //argument will hold the module value for "../Library/index.umd.min".
    });

    displayHome();

    function displayHome() {
        //array to embed Instagram posts using recursive function
        var instagramURL = ["https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_3ukUTnvST/", "https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_1BdZgn0jv/", "https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_gjv_gHt52/"];

        //jQuery ID selectors for .html for the Instagram embedded posts
        var igOne = $("#instagramone")
        var igTwo = $("#instagramtwo")
        var igThree = $("#instagramthree")

        //array of the jQuery IDs to use for recursive function
        var instagramDiv = [igOne, igTwo, igThree];

        //recursive function to embed Instagram posts
        function setInstaFeed(count) {
            if (count == 3) { return; }
            $.ajax({
            url: instagramURL[count],
            method: "GET"
            }).then(function (response) {
            console.log(response);
            console.log(response.html)
            var imgURL = response.html;
            instagramDiv[count].html(imgURL);
            window.instgrm.Embeds.process();
            }).then(setInstaFeed(count + 1));
        }
        //calling the recursive function
        setInstaFeed(0);

        //load new random post every time page is refreshed
        getRandom();

        //display home
        $("#home").css("display", "contents");

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
                //retrieve the image associated with the post
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
                    $("#home-tumblr").append(imgContainer + imgURL + cardSection + caption + sectionParagraph + source + tags + cardNotes + notes + timeStamp + gifRequest + socialLinks);
                }
            }
            });
        }

        //these variables store the on-the-fly html for building the post feed
        var imgContainer = "<div class='grid-x grid-margin-x' style='padding:10px;'><div class='cell medium-3'></div><div class='cell medium-6 card'><img src='";
        /* imageURL goes here */
        var cardSection = "'><div class='card-section'><p>";
        /* caption goes here */
        var sectionParagraph = "</p><p>";
        /*  source and tags go here */
        var cardNotes = "</p><div class='grid-x grid-margin-x'><div class='cell auto'><div class='notes'>";
        /*  notes go here */
        /*  timestamp goes here */
        /*  this contains the button that triggers the gif request form and tumblr button */
        var gifRequest = "</div></div><div class='cell auto'><div class='float-right'><button id='gif-request' data-open='askModal'><small>request a gif!</small></button><i class='fi-social-tumblr' id='tumblr' data-toggle='tumblr-hover'> </i>";
        /* this contains the contact and share link, ends the array */
        var socialLinks = "<i class='fi-mail' id='contact-me' data-open='contactModal'> </i><i class='fi-share' id='share' data-toggle='social-media'> </i></div></div></div></div></div><div class='cell medium-3'></div></div>";
    }

    function resetDisplay() {
        $("#shop").css("display", "none");
        $("#cart").css("display", "none");
        $("#blog").css("display", "none");
        $("#home").css("display", "none");
    }

    $("#navbar").on("click", function() {
        event.preventDefault();

        resetDisplay();
        var target = event.target.textContent;
        if (target === "Shop") {
            displayShop();
        } else if (target === "Cart") {
            displayCart();
        } else if (target === "Blog") {
            displayBlog();
        } else if (target === "Home") {
            displayHome();
        }
    });

    $("#collections").on("click", function() {
        event.preventDefault();
        
        var target = event.target.dataset.collectionid;
        fillProducts(target);
    });

    // Get collections from Shopify
    var shopFilled = false;

    function displayShop() {
        requirejs(["../Library/index.umd.min"], function(index) {
            var client = index.buildClient({
                domain: "bcs-project1-test.myshopify.com",
                storefrontAccessToken: "3f08fc281f5bf535c6fdcaf9a57b5db9"
            });
    
            client.collection.fetchAllWithProducts().then((collections) => {
                if (shopFilled === false) {
                    var shopNav = $("#collections");
                    for (var i = 0; i < collections.length; i++) {
                        var collectionName = collections[i].title;
                        var linkToAdd = $("<li>");
        
                        var buttonToAdd = $("<button>");
                        buttonToAdd.addClass("button clear secondary");
                        buttonToAdd.attr("type", "button");
                        buttonToAdd.attr("data-collectionId", collections[i].id);
                        buttonToAdd.text(collectionName);
        
                        linkToAdd.append(buttonToAdd);
                        shopNav.append(linkToAdd);
                    }
        
                    shopFilled = true;
                } 

                fillProducts(collections[0].id);
            });
        });
    
        $("#shop").css("display", "contents");
    };

    var itemsToCheckout = [];
    var itemsProperties = [];
    localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout)); //erase
    localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));

    function getCartItems() {
        var tempItemsToCheckout = JSON.parse(localStorage.getItem("itemsToCheckout"));
        if (tempItemsToCheckout != null) { itemsToCheckout = tempItemsToCheckout; }

        var tempItemsProperties = JSON.parse(localStorage.getItem("itemsProperties"));
        if (tempItemsProperties != null) { itemsProperties = tempItemsProperties; }
    }

    // cart item quantity buttons
    $("#cartItems").on("click", function() {
        event.preventDefault();

        if (event.target.matches("button")) {
            getCartItems();

            if (event.target.textContent === "+") {
                var quantity = event.target.parentElement.firstChild.children[0];
                quantity.textContent = parseInt(quantity.textContent) + 1;

                var itemIndex = event.target.parentElement.dataset.itemindex;
                itemsToCheckout[itemIndex].quantity += 1;
            } else if (event.target.textContent === "−") {
                var itemIndex = event.target.parentElement.dataset.itemindex;
                if (itemsToCheckout[itemIndex].quantity > 0) {
                    var quantity = event.target.parentElement.firstChild.children[0];

                    quantity.textContent = parseInt(quantity.textContent) - 1;
                    itemsToCheckout[itemIndex].quantity -= 1;
                }
            } else if (event.target.textContent === "Remove") {
                var itemIndex = event.target.parentElement.parentElement.firstChild.dataset.itemindex;
                itemsToCheckout.splice(itemIndex, 1);
                itemsProperties.splice(itemIndex, 1);
            }

            localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
            localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));

            displayCart();
        }
    });

    $("#checkoutButton").on("click", function() {
        event.preventDefault();

        $("#cart").css("display", "none");
        $("#checkout").css("display", "contents");
    });

    $("#paymentButton").on("click", function() {
        event.stopPropagation();

        const shippingAddress = {
            address1: $("#address1").val(),
            address2: $("#address2").val(),
            city: $("#city").val(),
            company: $("company").val(),
            country: $("#country").val(),
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            phone: $("#phone").val(),
            province: $("#province").val(),
            zip: $("#zip").val()
        };

        for (var i = 0; i < itemsToCheckout.length; i++) {
            if (itemsToCheckout[i].quantity === 0) {
                itemsToCheckout.splice(i, 1);
                itemsProperties.splice(i, 1);
                i--;
            }
        }

        requirejs(["../Library/index.umd.min"], function(index) {
            var client = index.buildClient({
                domain: "bcs-project1-test.myshopify.com",
                storefrontAccessToken: "3f08fc281f5bf535c6fdcaf9a57b5db9"
            });
    
            client.checkout.create().then((checkout) => {
                client.checkout.updateShippingAddress(checkout.id, shippingAddress);
                client.checkout.addLineItems(checkout.id, itemsToCheckout);

                window.location.replace(checkout.webUrl);
            });
        });

        itemsToCheckout = [];
        itemsProperties = [];
        localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
        localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));
    });

    function displayCart() {
        $("#cartItems").empty();

        if (itemsToCheckout.length === 0) {
            $("#cartEmpty").css("display", "contents");
            $("#cartItems").css("display", "none");
            $("#checkoutCell").css("display", "none");
            
        } else {
            $("#cartEmpty").css("display", "none");
            $("#cartItems").css("display", "contents");
            $("#checkoutCell").css("display", "contents");

            getCartItems();
            for (var i = 0; i < itemsToCheckout.length; i++) {
                var itemToAdd = $("<div>").addClass("cell callout grid-x align-center");
                itemToAdd.css("border", "none");
                itemToAdd.css("border-bottom", "1px solid lightgray");

                var imgCell = $("<div>").addClass("cell callout margin-bottom-0 padding-0 small-12 medium-3");
                var img = $("<img>").addClass("thumbnail callout margin-bottom-0");
                img.attr("src", itemsProperties[i].imgSRC);
                imgCell.append(img);
                itemToAdd.append(imgCell);

                var titleCell = $("<div>").addClass("cell callout margin-right-1 margin-bottom-0 padding-0 border-none small-12 medium-3");
                var title = $("<h6>").addClass("margin-left-1");
                title.text(itemsProperties[i].productTitle);
                titleCell.append(title);
                itemToAdd.append(titleCell);

                var quantityGrid = $("<div>").addClass("cell grid-y align-justify callout padding-0 border-none small-12 medium-2");
                var quantityCell = $("<div>").addClass("cell text-right");
                quantityCell.attr("data-itemIndex", i);
                var quantity = $("<h6>").addClass("margin-bottom-0");
                quantity.text("Quantity: ");
                var span = $("<span>").text(itemsToCheckout[i].quantity);
                quantity.append(span);
                quantityCell.append(quantity);
                quantityGrid.append(quantityCell);
                itemToAdd.append(quantityGrid);

                var plusButton = $("<button>").addClass("button primary callout margin-bottom-0 float-right");
                plusButton.text("+");
                plusButton.attr("type", "button");
                var minusButton = $("<button>").addClass("button primary callout margin-bottom-0 float-right");
                minusButton.text("−");
                minusButton.attr("type", "button");
                quantityCell.append(plusButton);
                quantityCell.append(minusButton);

                var removeCell = $("<div>").addClass("cell");
                var removeButton = $("<button>").addClass("button clear margin-bottom-0 float-right");
                removeButton.text("Remove");
                removeButton.attr("type", "button");
                removeCell.append(removeButton);
                quantityGrid.append(removeCell);

                $("#cartItems").append(itemToAdd);
            }
        }

        $("#cart").css("display", "contents");
    }

    $(document).on("click", function() {
        if (event.target.matches("span") || event.target.className === "reveal-overlay") {
            for (var i = 0; i < $(".reveal-overlay").length; i++) {
                if ($(".reveal-overlay")[i].childElementCount === 0) {
                    $(".reveal-overlay")[i].remove();
                    i--;
                }
            }
        } else if (event.target.matches("img")) {
            var index = event.target.parentElement.parentElement.parentElement.dataset.mainimageindex;
            $("#modalMainImg" + index).attr("src", event.target.src);
        } else if (event.target.matches("button") && event.target.dataset.productid !== undefined) {  // add to cart
            getCartItems();

            var id = event.target.dataset.productid;
            if (itemsToCheckout.length === 0) {
                itemsToCheckout.push({
                    variantId: id,
                    quantity: 1
                });

                itemsProperties.push({
                    title: event.target.dataset.producttitle,
                    imgSRC: event.target.dataset.imgsrc
                });

                localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
                localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));

                event.target.textContent = "Added"
            } else {
                for (var i = 0; i < itemsToCheckout.length; i++) {
                    if (itemsToCheckout[i].variantId === id) {
                        event.target.textContent = "Already Added"
                        break;
                    }
    
                    if (i === itemsToCheckout.length - 1) {
                        itemsToCheckout.push({
                            variantId: id,
                            quantity: 1
                        });
    
                        itemsProperties.push({
                            title: event.target.dataset.producttitle,
                            imgSRC: event.target.dataset.imgsrc
                        });
    
                        localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
                        localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));
    
                        event.target.textContent = "Added"
                        break;
                    } 
                }
            }
            
        }
    })

    $("#products").on("click", function() {
        event.preventDefault();

        if (event.target.matches("img")) {
            var modalToReveal = $("#" + event.target.parentElement.dataset.open);
            new Foundation.Reveal(modalToReveal); 
        } 
    });

    function fillProducts(collectionId) {
        requirejs(["../Library/index.umd.min"], function(index) {
            var client = index.buildClient({
                domain: "bcs-project1-test.myshopify.com",
                storefrontAccessToken: "3f08fc281f5bf535c6fdcaf9a57b5db9"
            });

            client.collection.fetchWithProducts(collectionId, {productsFirst: 10}).then((collection) => {
                $("#products").empty();
                $(".reveal-overlay").remove();

                var rowToAdd;
                var count = 0;
                for (var i = 0; i < collection.products.length; i++) {
                    if (count === 0) { rowToAdd = $("<div>").addClass("grid-x grid-margin-x align-center"); }
                    
                    var columnToAdd = $("<div>").addClass("cell small-8 medium-4 large-3 auto callout");
                    var cellToAdd = $("<div>").addClass("cell grid-y text-center");
                    columnToAdd.append(cellToAdd);
                    rowToAdd.append(columnToAdd);

                    var imageButton = $("<a>").attr("data-open", "modal" + i);
                    var productImage = $("<img>").addClass("thumbnail margin-bottom-0");
                    productImage.attr("src", collection.products[i].images[0].src);
                    imageButton.append(productImage);
                    cellToAdd.append(imageButton);

                    var modalToAdd = $("<div>").addClass("large reveal");
                    modalToAdd.attr("id", "modal" + i);
                    modalToAdd.attr("data-reveal", "");
                    cellToAdd.append(modalToAdd);
                    
                    var modalGrid = $("<div>").addClass("grid-x grid-margin-x");
                    var modalGridCellLeft = $("<div>").addClass("cell small-12 medium-7");
                    var modalGridCellRight = $("<div>").addClass("cell small-12 medium-5");
                    var modalImageGrid = $("<div>").addClass("grid-y");
                    modalGridCellLeft.append(modalImageGrid);
                    modalGrid.append(modalGridCellLeft);
                    modalGrid.append(modalGridCellRight);
                    modalToAdd.append(modalGrid);

                    var modalImageGridCell = $("<div>").addClass("cell");
                    var modalMainImg = $("<img>").attr("id", "modalMainImg" + i);
                    modalMainImg.attr("src", collection.products[i].images[0].src);
                    modalImageGridCell.append(modalMainImg);
                    modalImageGrid.append(modalImageGridCell);

                    var modalImageVariantCell = $("<div>").addClass("cell margin-top-1");
                    var modalImageVariantGrid = $("<div>").addClass("grid-x grid-margin-x");
                    modalImageVariantGrid.attr("data-mainImageIndex", i);
                    modalImageVariantCell.append(modalImageVariantGrid);
                    modalImageGrid.append(modalImageVariantCell);

                    for (var j = 0; j < collection.products[i].images.length; j++) {
                        if (j === 3) { break; }
                        var modalImageVariant = $("<div>").addClass("cell small-4");
                        var modalImageVariantButton = $("<button>");
                        var modalImageVariantImage = $("<img>").addClass("width-100 display-block max-width-100");

                        modalImageVariantImage.attr("src", collection.products[i].images[j].src);
                        modalImageVariantButton.append(modalImageVariantImage);
                        modalImageVariant.append(modalImageVariantButton);
                        modalImageVariantGrid.append(modalImageVariant);
                    }

                    var modalDescriptionGrid = $("<div>").addClass("grid-y margin-top-1");
                    modalGridCellRight.append(modalDescriptionGrid);
                    var modalDescription = $("<div>").addClass("cell small-10 overflow-y-scroll");
                    modalDescription.css("max-height", "400px");
                    modalDescription.append(collection.products[i].descriptionHtml);
                    modalDescriptionGrid.append(modalDescription);

                    var modalAddToCartCell = $("<div>").addClass("cell small-2 margin-top-1");
                    var modalAddToCartButton = $("<button>").addClass("success button width-100");
                    modalAddToCartButton.attr("type", "button");
                    modalAddToCartButton.text("Add to Cart");
                    modalAddToCartButton.attr("data-productID", collection.products[i].id); // may have to use variants id here - ToConfirm
                    modalAddToCartButton.attr("data-productTitle", collection.products[i].title);
                    modalAddToCartButton.attr("data-imgSRC", collection.products[i].images[0].src);
                    modalAddToCartCell.append(modalAddToCartButton);
                    modalDescriptionGrid.append(modalAddToCartCell);

                    var modalCloseButton = $("<button>").addClass("close-button");
                    modalCloseButton.attr("type", "button");
                    modalCloseButton.attr("data-close", "");
                    modalCloseButton.attr("aria-label", "close reveal");
                    var modalCloseSpan = $("<span>").text("×");
                    modalCloseSpan.attr("aria-hidden", "true");
                    modalCloseButton.append(modalCloseSpan);
                    modalToAdd.append(modalCloseButton);

                    var productTitle = $("<h6>").addClass("margin-top-1 margin-bottom-0 text-bottom");
                    productTitle.text(collection.products[i].title);
                    cellToAdd.append(productTitle);

                    count++;
                    if (count === 3 || i === collection.products.length - 1) {
                        $("#products").append(rowToAdd);
                        count = 0;
                    }
                }
            });

            $(document).foundation();
        });
    }

    function displayBlog() {
        $("#blog").css("display", "contents");
        getPosts();


        //Variable tells the browser where (what "page") to grab new posts from the JSON object.
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
                    //console.log(results);
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
                        if (type === "photo") {
                            var photos = p[i].photos;
                            for (var j = 0; j < photos.length; j++) {
                                if (photos[j].alt_sizes[0]) {
                                    imgURL = photos[j].alt_sizes[0].url
                                }
                            }
                        }
                        i++;
                        //filter content types that cause double-posting.
                        if (type === "answer" || type === "text") {
                            // console.log(p[i].summary + ", " + id);
                        } else {
                            //render posts to the page
                            $("#tumblr-posts").append(imgContainer + imgURL + cardSection + caption + sectionParagraph + source + tagsArray + cardNotes + notes + timeStamp + gifRequest + socialLinks);
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
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
                //increase offset by 20
                page++
                //render the posts
                getPosts();
            }
        });
    
        //get values from contact/request forms and sent to client email
        $('.send').on('click', function(e) {
            subject = $('#user-email').val();
            body = $('#body').val();
            //using my email as a dummy for now
            window.location = "mailto:katyeary@gmail.com?subject=" + subject + "&body=" + body;
            
            $("#contactModal").foundation('reveal', 'close');
            $("#askModal").foundation('reveal', close);
        });
    }
});
