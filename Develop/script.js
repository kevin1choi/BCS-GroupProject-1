// on DOM load
$( document ).ready(function() {
    $(document).foundation();

    // empty loading the module before use seems to help responsiveness on chrome
    // no noticeable changes on mozilla
    requirejs(["../Library/index.umd.min"], function(index) {
        //This function is called when ""../Library/index.umd.min" is loaded.
        //Functions are not fired until dependencies have loaded and the index
        //argument will hold the module value for "../Library/index.umd.min".
    });

    // display home on start
    displayHome();

    function displayHome() {
        //array to embed Instagram posts using recursive function
        var instagramURL = ["https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_3ukUTnvST/",
                            "https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_1BdZgn0jv/",
                            "https://api.instagram.com/oembed?url=https://www.instagram.com/p/B_gjv_gHt52/"];

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
            // console.log(response);
            // console.log(response.html)
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
        //console.log(x);
        function getRandom() {
            var queryURL = 'https://api.tumblr.com/v2/blog/animatedtext.tumblr.com/posts?api_key=';
            $.ajax({
            url: queryURL,
            data: {
                //50 is the maximum number of posts that can be returned by the API
                limit: 50
            },
            dataType: 'jsonp',
            success: function (results) {
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
                    //console.log(p[x].summary + ", " + id);
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

    // set all secitons display none
    function resetDisplay() {
        $("#shop").css("display", "none");
        $("#cart").css("display", "none");
        $("#blog").css("display", "none");
        $("#home").css("display", "none");
        $("#checkout").css("display", "none");
        $("#about").css("display", "none");
    }

    // navbar links
    $("#navbar").on("click", function() {
        event.preventDefault();

        resetDisplay();   // reset display
        var target = event.target.textContent;  // get target text content & call respective section
        if (target === "Shop") {
            displayShop();
        } else if (target === "Cart") {
            displayCart();
        } else if (target === "Blog") {
            displayBlog();
        } else if (target === "Home") {
            displayHome();
        } else if (target === "About") {
            displayAbout();
        }
    });

    // display about section
    function displayAbout() {
        $("#about").css("display", "contents");
    }

    // collections navbar
    $("#collections").on("click", function() {
        event.preventDefault();
        
        var target = event.target.dataset.collectionid;  // get id from dataset
        fillProducts(target);   // fill by products by collection id
    });

    // display shop
    var shopFilled = false;    // to determine if collections navbar was set
    function displayShop() {
        $("#products").empty();  // empty products first to account for delay

        requirejs(["../Library/index.umd.min"], function(index) {   // load module
            var client = index.buildClient({      // get client's shop
                domain: "bcs-project1-test.myshopify.com",
                storefrontAccessToken: "3f08fc281f5bf535c6fdcaf9a57b5db9"
            });
    
            client.collection.fetchAllWithProducts().then((collections) => {  // fetch all collection & create collections navbar
                if (shopFilled === false) {
                    var shopNav = $("#collections");
                    for (var i = 0; i < collections.length; i++) {
                        var collectionName = collections[i].title;
                        var linkToAdd = $("<li>");
        
                        var buttonToAdd = $("<button>");    // navbar button
                        buttonToAdd.addClass("button clear secondary");
                        buttonToAdd.attr("type", "button");
                        buttonToAdd.attr("data-collectionId", collections[i].id);  // add id to dataset for fillproducts here
                        buttonToAdd.text(collectionName);
        
                        linkToAdd.append(buttonToAdd);
                        shopNav.append(linkToAdd);
                    }
        
                    shopFilled = true;   // collections navbar has been set
                } 

                fillProducts(collections[0].id);    // fill with first collection on shop open
            });
        });
    
        $("#shop").css("display", "contents");  // display shop
    };

    // cart items array
    var itemsToCheckout = [];
    var itemsProperties = [];

    // get current cart items
    function getCartItems() {
        var tempItemsToCheckout = JSON.parse(localStorage.getItem("itemsToCheckout"));
        if (tempItemsToCheckout != null) { itemsToCheckout = tempItemsToCheckout; }

        var tempItemsProperties = JSON.parse(localStorage.getItem("itemsProperties"));
        if (tempItemsProperties != null) { itemsProperties = tempItemsProperties; }
    }

    // cart item quantity buttons - also update items arrays here
    $("#cartItems").on("click", function() {
        event.preventDefault();

        if (event.target.matches("button")) {
            getCartItems();   // get cart items

            if (event.target.textContent === "+") {   // add quantity
                var quantity = event.target.parentElement.firstChild.children[0];
                quantity.textContent = parseInt(quantity.textContent) + 1;

                var itemIndex = event.target.parentElement.dataset.itemindex;
                itemsToCheckout[itemIndex].quantity += 1;
            } else if (event.target.textContent === "−") {   // subtract quantity
                var itemIndex = event.target.parentElement.dataset.itemindex;
                if (itemsToCheckout[itemIndex].quantity > 0) {
                    var quantity = event.target.parentElement.firstChild.children[0];

                    quantity.textContent = parseInt(quantity.textContent) - 1;
                    itemsToCheckout[itemIndex].quantity -= 1;
                }
            } else if (event.target.textContent === "Remove") {  // remove item
                var itemIndex = event.target.parentElement.parentElement.firstChild.dataset.itemindex;
                itemsToCheckout.splice(itemIndex, 1);
                itemsProperties.splice(itemIndex, 1);
            }

            localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
            localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));

            displayCart();  // redisplay cart section
        }
    });

    // checkout button to proceed to shipping address
    $("#checkoutButton").on("click", function() {
        event.preventDefault();

        $("#cart").css("display", "none");
        $("#checkout").css("display", "contents");
    });

    // payment button after entering shipping address
    $("#paymentButton").on("click", function() {
        event.stopPropagation();

        const shippingAddress = {    // get shipping info
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

        for (var i = 0; i < itemsToCheckout.length; i++) {   // revise cart items
            if (itemsToCheckout[i].quantity === 0) {
                itemsToCheckout.splice(i, 1);
                itemsProperties.splice(i, 1);
                i--;
            }
        }

        requirejs(["../Library/index.umd.min"], function(index) {    // checkout
            var client = index.buildClient({
                domain: "bcs-project1-test.myshopify.com",
                storefrontAccessToken: "3f08fc281f5bf535c6fdcaf9a57b5db9"
            });
    
            client.checkout.create().then((checkout) => {    // create checkout
                client.checkout.updateShippingAddress(checkout.id, shippingAddress);   // update address
                client.checkout.addLineItems(checkout.id, itemsToCheckout);    // add items to checkout

                window.location.replace(checkout.webUrl);         // redirect customer to shopify url
            });
        });

        itemsToCheckout = [];   // reset items array
        itemsProperties = [];
        localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
        localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));
    });

    // display cart
    function displayCart() {
        $("#cartItems").empty();  // empty cart

        if (itemsToCheckout.length === 0) {    // if no items, display empty message
            $("#cartEmpty").css("display", "contents");
            $("#cartItems").css("display", "none");
            $("#checkoutCell").css("display", "none");
            
        } else {  // else display cart items
            $("#cartEmpty").css("display", "none");
            $("#cartItems").css("display", "contents");
            $("#checkoutCell").css("display", "contents");

            getCartItems();   // get items arrays
            for (var i = 0; i < itemsToCheckout.length; i++) {    // create cart items
                var itemToAdd = $("<div>").addClass("cell callout grid-x align-center");
                itemToAdd.css("border", "none");
                itemToAdd.css("border-bottom", "1px solid lightgray");

                var imgCell = $("<div>").addClass("cell callout margin-bottom-0 padding-0 small-12 medium-3");  // item img
                var img = $("<img>").addClass("thumbnail callout margin-bottom-0");
                img.attr("src", itemsProperties[i].imgSRC);
                imgCell.append(img);
                itemToAdd.append(imgCell);

                var titleCell = $("<div>").addClass("cell callout margin-right-1 margin-bottom-0 padding-0 border-none small-12 medium-3");
                var title = $("<h6>").addClass("margin-left-1");    // item title
                title.text(itemsProperties[i].productTitle);
                titleCell.append(title);
                itemToAdd.append(titleCell);

                var quantityGrid = $("<div>").addClass("cell grid-y align-justify callout padding-0 border-none small-12 medium-2");
                var quantityCell = $("<div>").addClass("cell text-right");   // item quantity
                quantityCell.attr("data-itemIndex", i);
                var quantity = $("<h6>").addClass("margin-bottom-0");
                quantity.text("Quantity: ");
                var span = $("<span>").text(itemsToCheckout[i].quantity);
                quantity.append(span);
                quantityCell.append(quantity);
                quantityGrid.append(quantityCell);
                itemToAdd.append(quantityGrid);

                var plusButton = $("<button>").addClass("button primary callout margin-bottom-0 float-right");
                plusButton.text("+");       // add quantity button
                plusButton.attr("type", "button");
                var minusButton = $("<button>").addClass("button primary callout margin-bottom-0 float-right");
                minusButton.text("−");      // minus quantity button
                minusButton.attr("type", "button");
                quantityCell.append(plusButton);
                quantityCell.append(minusButton);

                var removeCell = $("<div>").addClass("cell");    // remove button
                var removeButton = $("<button>").addClass("button clear margin-bottom-0 float-right");
                removeButton.text("Remove");
                removeButton.attr("type", "button");
                removeCell.append(removeButton);
                quantityGrid.append(removeCell);

                $("#cartItems").append(itemToAdd);   // append item to cart
            }
        }

        $("#cart").css("display", "contents");    // display contents
    }

    // modal functionality
    $(document).on("click", function() {
        if (event.target.matches("span") || event.target.className === "reveal-overlay") { // when exiting modal
            for (var i = 0; i < $(".reveal-overlay").length; i++) {   // remove duplicate overlays
                if ($(".reveal-overlay")[i].childElementCount === 0) {
                    $(".reveal-overlay")[i].remove();
                    i--;
                }
            }
        } else if (event.target.matches("img")) {    // alternate images button
            var index = event.target.parentElement.parentElement.parentElement.dataset.mainimageindex;
            $("#modalMainImg" + index).attr("src", event.target.src);
        } else if (event.target.matches("button") && event.target.dataset.productid !== undefined) {  // add to cart
            getCartItems();  // get cart items

            var id = event.target.dataset.productid;
            if (itemsToCheckout.length === 0) {   // if first item 
                itemsToCheckout.push({   // add item
                    variantId: id,
                    quantity: 1
                });

                itemsProperties.push({   // add item properties
                    title: event.target.dataset.producttitle,
                    imgSRC: event.target.dataset.imgsrc
                });

                localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));  // store items
                localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));

                event.target.textContent = "Added";  // change add to cart to added
            } else {
                for (var i = 0; i < itemsToCheckout.length; i++) {  // check if item exists
                    if (itemsToCheckout[i].variantId === id) {    // if items exists
                        event.target.textContent = "Already Added";  // change to already added
                        break;
                    }
    
                    if (i === itemsToCheckout.length - 1) {    // if item doesn't exist, add item to arrays
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

    // products img modal functionality
    $("#products").on("click", function() {
        event.preventDefault();

        if (event.target.matches("img")) {
            var modalToReveal = $("#" + event.target.parentElement.dataset.open);  // get modal id to reveal
            new Foundation.Reveal(modalToReveal);    // dynamically generated modals require this line
        } 
    });

    // fill shop products 
    function fillProducts(collectionId) {   // takes collection id as argument
        requirejs(["../Library/index.umd.min"], function(index) {
            var client = index.buildClient({
                domain: "bcs-project1-test.myshopify.com",
                storefrontAccessToken: "3f08fc281f5bf535c6fdcaf9a57b5db9"
            });

            client.collection.fetchWithProducts(collectionId, {productsFirst: 10}).then((collection) => {  // fetch collection
                $("#products").empty();  // empty products
                $(".reveal-overlay").remove();  // empty modals

                var rowToAdd;   // row of products to be added, holds 3 items
                var count = 0;   // keep count for 3 products per row
                for (var i = 0; i < collection.products.length; i++) {
                    if (count === 0) { rowToAdd = $("<div>").addClass("grid-x grid-margin-x align-center"); }  // if first item, start new row
                    
                    var columnToAdd = $("<div>").addClass("cell small-8 medium-4 large-3 auto callout");  // item cell
                    var cellToAdd = $("<div>").addClass("cell grid-y text-center");
                    columnToAdd.append(cellToAdd);
                    rowToAdd.append(columnToAdd);

                    var imageButton = $("<a>").attr("data-open", "modal" + i);   // item image
                    var productImage = $("<img>").addClass("thumbnail margin-bottom-0");
                    productImage.attr("src", collection.products[i].images[0].src);
                    imageButton.append(productImage);
                    cellToAdd.append(imageButton);

                    var modalToAdd = $("<div>").addClass("large reveal");   // item modal
                    modalToAdd.attr("id", "modal" + i);
                    modalToAdd.attr("data-reveal", "");
                    cellToAdd.append(modalToAdd);
                    
                    var modalGrid = $("<div>").addClass("grid-x grid-margin-x");    // modal grid
                    var modalGridCellLeft = $("<div>").addClass("cell small-12 medium-7");
                    var modalGridCellRight = $("<div>").addClass("cell small-12 medium-5");
                    var modalImageGrid = $("<div>").addClass("grid-y");
                    modalGridCellLeft.append(modalImageGrid);
                    modalGrid.append(modalGridCellLeft);
                    modalGrid.append(modalGridCellRight);
                    modalToAdd.append(modalGrid);

                    var modalImageGridCell = $("<div>").addClass("cell");    // modal img
                    var modalMainImg = $("<img>").attr("id", "modalMainImg" + i);
                    modalMainImg.attr("src", collection.products[i].images[0].src);
                    modalImageGridCell.append(modalMainImg);
                    modalImageGrid.append(modalImageGridCell);

                    var modalImageVariantCell = $("<div>").addClass("cell margin-top-1"); // modal alternate img grid
                    var modalImageVariantGrid = $("<div>").addClass("grid-x grid-margin-x");
                    modalImageVariantGrid.attr("data-mainImageIndex", i);
                    modalImageVariantCell.append(modalImageVariantGrid);
                    modalImageGrid.append(modalImageVariantCell);

                    for (var j = 0; j < collection.products[i].images.length; j++) {  // modal alternate imgs
                        if (j === 3) { break; }
                        var modalImageVariant = $("<div>").addClass("cell small-4");
                        var modalImageVariantButton = $("<button>");
                        var modalImageVariantImage = $("<img>").addClass("width-100 display-block max-width-100");

                        modalImageVariantImage.attr("src", collection.products[i].images[j].src);
                        modalImageVariantButton.append(modalImageVariantImage);
                        modalImageVariant.append(modalImageVariantButton);
                        modalImageVariantGrid.append(modalImageVariant);
                    }

                    var modalDescriptionGrid = $("<div>").addClass("grid-y margin-top-1");  // modal description grid
                    modalGridCellRight.append(modalDescriptionGrid);
                    var modalDescription = $("<div>").addClass("cell small-10 overflow-y-scroll");
                    modalDescription.css("max-height", "400px");
                    modalDescription.append(collection.products[i].descriptionHtml);
                    modalDescriptionGrid.append(modalDescription);

                    var modalAddToCartCell = $("<div>").addClass("cell small-2 margin-top-1");  // add to cart button
                    var modalAddToCartButton = $("<button>").addClass("success button width-100");
                    modalAddToCartButton.attr("type", "button");
                    modalAddToCartButton.text("Add to Cart");
                    modalAddToCartButton.attr("data-productID", collection.products[i].id); // may have to use variants id here - ToConfirm
                    modalAddToCartButton.attr("data-productTitle", collection.products[i].title);
                    modalAddToCartButton.attr("data-imgSRC", collection.products[i].images[0].src);
                    modalAddToCartCell.append(modalAddToCartButton);
                    modalDescriptionGrid.append(modalAddToCartCell);

                    var modalCloseButton = $("<button>").addClass("close-button");  // close modal - remove if issues with overlay persist
                    modalCloseButton.attr("type", "button");
                    modalCloseButton.attr("data-close", "");
                    modalCloseButton.attr("aria-label", "close reveal");   
                    var modalCloseSpan = $("<span>").text("×");
                    modalCloseSpan.attr("aria-hidden", "true");
                    modalCloseButton.append(modalCloseSpan);
                    modalToAdd.append(modalCloseButton);

                    var productTitle = $("<h6>").addClass("margin-top-1 margin-bottom-0 text-bottom");  // product title
                    productTitle.text(collection.products[i].title);
                    cellToAdd.append(productTitle);

                    count++;
                    if (count === 3 || i === collection.products.length - 1) {
                        $("#products").append(rowToAdd);
                        count = 0;
                    }
                }
            });
        });
    }

    function displayBlog() {
        $("#blog").css("display", "contents");
        getPosts();


        //Variable tells the browser where (what "page") to grab new posts from the JSON object.
        var page = 0;
        function getPosts() {
            var queryURL = 'https://api.tumblr.com/v2/blog/animatedtext.tumblr.com/posts?api_key=';
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
                            //console.log(p[i].summary + ", " + id);
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