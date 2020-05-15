
// on DOM load
$( document ).ready(function() {
    $(document).foundation();

    requirejs(["../Library/index.umd.min"], function(index) {
        //This function is called when ""../Library/index.umd.min" is loaded.
        //Functions are not fired until dependencies have loaded and the index
        //argument will hold the module value for "../Library/index.umd.min".
        var client = index.buildClient({
            domain: "bcs-project1-test.myshopify.com",
            storefrontAccessToken: "3f08fc281f5bf535c6fdcaf9a57b5db9"
        });

        // client.product.fetchAll().then((products) => {
        // // Do something with the products
        // console.log(products);
        // localStorage.setItem("AnimatedTextProducts", JSON.stringify(products));
        // });

        // client.collection.fetchAllWithProducts().then((collections) => {
        //     // Do something with the collections
        //     console.log(collections);
        // });
    
    });

    function resetDisplay() {
        $("#shop").css("display", "none");
        $("#cart").css("display", "none");
        $("#blog").css("display", "none");
    }

    $("#navbar").on("click", function() {
        event.preventDefault();

        resetDisplay();
        var target = event.target.textContent;
        if (target === "Shop") {
            displayShop();
        } else if (target === "Cart") {
            displayCart();
        }
    });

    $("#collections").on("click", function() {
        event.preventDefault();

        var target = event.target.textContent;
        fillProducts(target);
    });

    // Get collections from Shopify
    var collections = [];
    var shopFilled = false;

    // requirejs code - TODO
    function displayShop() {
        if (shopFilled === false) {
            var shopNav = $("#collections");
            for (var i = 0; i < collections.length; i++) {
                var collectionName = collections[i].title;
                var linkToAdd = $("<li>");

                var buttonToAdd = $("<button>");
                buttonToAdd.addClass("button clear secondary");
                buttonToAdd.attr("type", "button");
                buttonToAdd.text(collectionName);

                linkToAdd.append(buttonToAdd);
                shopNav.append(linkToAdd);
            }

            shopFilled = true;
        } else {
            fillProducts(collections[0].title);
        }

        $("#shop").css("display", "contents");
    };

    var itemsToCheckout = [];
    var itemsProperties = [];

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

            if (event.target.textContent("&plus;")) {
                var quantity = event.target.parentElement.firstChild.firstChild;
                quantity.textContent = parseInt(quantity.textContent) + 1;

                var itemIndex = event.target.parentElement.dataset.itemIndex;
                itemsToCheckout[itemIndex].quantity += 1;
            } else if (event.target.textContent("&minus;")) {
                var itemIndex = event.target.parentElement.dataset.itemIndex;
                if (itemsToCheckout[itemIndex].quantity > 0) {
                    var quantity = event.target.parentElement.firstChild.firstChild;
                    quantity.textContent = parseInt(quantity.textContent) - 1;

                    itemsToCheckout[itemIndex].quantity -= 1;
                }
            } else if (event.target.textContent("Remove")) {
                var itemIndex = event.target.parentElement.dataset.itemIndex;
                itemsToCheckout.splice(itemIndex, 1);
                itemsProperties.splice(itemIndex, 1);

                displayCart();
            }

            localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
            localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));
        }
    });

    $("#checkoutButton").on("click", function() {
        event.preventDefault();

        $("#cart").css("display", "none");
        $("#checkout").css("display", "contents");
    });

    $("#paymentButton").on("click", function() {
        event.stopPropagation();

        var checkoutId;
        var checkoutURL;
        // client.checkout.create().then((checkout) => {
        //     // Do something with the checkout
        //     console.log(checkout);

            // get checkoutId here to use in addLineItems
            // get checkout shopify url to redirect customer to payment processing on shopify
        // });

        for (var i = 0; i < itemsToCheckout.length; i++) {
            if (itemsToCheckout[i].quantity === 0) {
                itemsToCheckout.splice(i, 1);
                itemsProperties.splice(i, 1);
                i--;
            }
        }

        // Here we pass checkoutId and itemsToCheckout array
        // client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
        //     // Do something with the updated checkout
        //     console.log(checkout.lineItems); // Array with one additional line item
        // });

        itemsToCheckout = [];
        itemsProperties = [];
        localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
        localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));

        // redirect customer to shopify for payment
        window.location.replace(checkoutURL);

    });

    function displayCart() {
        $("#cartItems").empty();

        if (itemsToCheckout.length === 0) {
            $("#cartEmpty").css("display", "contents");
            $("#checkout").css("display", "none");
        } else {
            $("#cartEmpty").css("display", "none");
            $("#checkout").css("display", "contents");

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
                quantityCell.data("itemIndex", i);
                var quantity = $("<h6>").addClass("margin-bottom-0");
                quantity.text("Quantity: ");
                var span = $("<span>").text(itemsToCheckout[i].quantity);
                quantity.append(span);
                quantityCell.append(quantity);
                quantityGrid.append(quantityCell);
                itemToAdd.append(quantityGrid);

                var plusButton = $("<button>").addClass("button primary callout margin-bottom-0 float-right");
                plusButton.text("&plus;");
                plusButton.type("button");
                var minusButton = $("<button>").addClass("button primary callout margin-bottom-0 float-right");
                minusButton.text("&minus;");
                minusButton.type("button");
                quantityCell.append(plusButton);
                quantityCell.append(minusButton);

                var removeCell = $("<div>").addClass("cell");
                var removeButton = $("<button>").addClass("button clear margin-bottom-0 float-right");
                removeButton.text("Remove");
                removeButton.type("button");
                remvoveCell.append(removeButton);
                quantityGrid.append(removeCell);

                $("#cartItems").append(itemToAdd);
            }
        }

        $("#cart").css("display", "contents");
    }

    $("#products").on("cllick", function() {
        event.preventDefault();

        if (event.target.matches("img")) {
            var index = event.target.data("mainImageIndex");
            $("#modalMainImg" + index).attr("src", event.target.attr("src"));
        } else if (event.target.matches("button")) {  // add to cart
            getCartItems();

            var ID = event.target.dataset.productID;
            for (var i = 0; i < itemsToCheckout.length; i++) {
                if (itemsToCheckout[i].variantId === ID) {
                    event.target.textContent = "Already added"
                    break;
                }

                if (i === itemsToCheckout.length - 1) {
                    itemsToCheckout.push({
                        variantId: ID,
                        quantity: 1
                    });

                    itemsProperties.push({
                        title: event.target.dataset.productTitle,
                        imgSRC: event.target.dataset.imgSRC
                    });

                    localStorage.setItem("itemsToCheckout", JSON.stringify(itemsToCheckout));
                    localStorage.setItem("itemsProperties", JSON.stringify(itemsProperties));

                    event.target.textContent = "Added"
                } 
            }
        }
    });

    function fillProducts(collectionName) {
        $("#products").empty();

        var collectionToFill = collections[collections.indexOf(collectionName)];

        var rowToAdd;
        var count = 0;
        for (var i = 0; i < collectionToFill.products.length; i++) {
            if (count === 0) { rowToAdd = $("<div>").addClass("grid-x grid-margin-x align-center"); }
            
            var columnToAdd = $("<div>").addClass("cell small-8 medium-4 large-3 auto callout");
            var cellToAdd = $("<div>").addClass("cell grid-y text-center");
            columnToAdd.append(cellToAdd);
            rowToAdd.append(columnToAdd);

            var imageButton = $("<button>").data("open", "modal" + i);
            var productImage = $("<img>").addClass("thumbnail margin-bottom-0");
            productImage.attr("src", collectionToFill.products[i].images[0].src);
            imageButton.append(productImage);
            cellToAdd.append(imageButton);

            var modalToAdd = $("<div>").addClass("large reveal");
            modalToAdd.attr("id", "modal" + i);
            modalToAdd.data("reveal", "");
            cellToAdd.append(modalToAdd);
            
            var modalGrid = $("<div>").addClass("grid-x");
            var modalGridCellLeft = $("<div>").addClass("cell small-12 medium-7");
            var modalGridCellRight = $("<div>").addClass("cell small-12 medium-5");
            var modalImageGrid = $("<div>").addClass("grid-y");
            modalGridCellLeft.append(modalImageGrid);
            modalGrid.append(modalGridCellLeft);
            modalGrid.append(modalGridCellRight);
            modalToAdd.append(modalGrid);

            var modalImageGridCell = $("<div>").addClass("cell");
            var modalMainImg = $("<img>").attr("id", "modalMainImg" + i);
            modalMainImg.attr("src", collectionToFill.products[i].images[0].src);
            modalImageGridCell.append(modalMainImg);
            modalImageGrid.append(modalImageGridCell);

            var modalImageVariantCell = $("<div>").addClass("cell");
            var modalImageVariantGrid = $("<div>").addClass("grid-x");
            modalImageVariantCell.append(modalImageVariantGrid);

            for (var j = 0; j < collectionToFill.products[i].images.length; j++) {
                if (j === 3) { break; }
                var modalImageVariant = $("<div>").addClass("cell small-4");
                var modalImageVariantButton = $("<button>");
                var modalImageVariantImage = $("<img>").addClass("width-100 display-block max-width-100");
                modalImageVariantImage.attr("src", collectionToFill.products[i].images[j].src);
                modalImageVariantImage.data("mainImageIndex", i);

                modalImageVariantButton.apppend(modalImageVariantImage);
                modalImageVariant.append(modalImageVariantButton);
                modalImageVariantGrid.append(modalImageVariant);
            }

            var modalDescriptionGrid = $("<div>").addClass("grid-y margin-top-1");
            modalGridCellRight.append(modalDescriptionGrid);
            var modalDescription = $("<div>").addClass("cell small-10 overflow-y-scroll");
            modalDescription.css("max-height", "400px");
            modalDescription.append(collectionToFill.products[i].description.Html);
            modalDescriptionGrid.append(modalDescription);

            var modalAddToCartCell = $("<div>").addClass("cell small-2 margin-top-1");
            var modalAddToCartButton = $("<button>").addClass("success button width-100");
            modalAddToCartButton.attr("type", "button");
            modalAddToCartButton.text("Add to Cart");
            modalAddToCartButton.data("productID", collectionToFill.products[i].id); // may have to use variants id here - ToConfirm
            modalAddToCartButton.data("productTitle", collectionToFill.products[i].title);
            modalAddToCartButton.data("imgSRC", collectionToFill.products[i].images[0].src);
            modalAddToCartCell.append(modalAddToCarButton);
            modalDescriptionGrid.append(modalAddToCartCell);

            var modalCloseButton = $("<button>").addClass("close-button");
            modalCloseButton.attr("type", "button");
            modalCloseButton.data("close", "");
            modalCloseButton.attr("aria-label", "close reveal");
            var modalCloseSpan = $("<span>").text("&times;");
            modalCloseSpan.attr("aria-hidden", "true");
            modalCloseSpan.append(modalCloseSpan);
            modalToAdd.append(modalCloseButton);

            var productTitle = $("<h6>").addClass("margin-top-1 margin-bottom-0");
            productTitle.text(collectionToFill.products[i].title);
            cellToAdd.append(productTitle);

            count++;
            if (count === 3 || i === collectionToFill.products.length - 1) {
                $("#products").append(rowToAdd);
                count = 0;
            }
        }
    }

    function displayBlog() {
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
            if ($(window).scrollTop() === $(document).height() - $(window).height()) {
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

    }

});