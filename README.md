# BCS-GroupProject-1
BootCampSpot Web Development - Group Project 1

# Animated Text

Animated Text is the creation of digital media artist Cat Frazier. Cat needs to consolidate her separate tumblr blog and e-commerce site.

## Features

-A customizable website blueprint
-E-commerce platform with store, shopping cart, and checkout functionality
-Tumblr feed 
-Contact forms


## APIs

We worked with Shopify, Tumblr, Instagram, and Foundation APIs to implement the project.

* Shopify Storefront API
    - After much research on ways to implement a frontend-only solution to fetching product on the client's shopify store,
    it was determined that Storefront API was our only option. Of all Shopify APIs, Storefront is the only one that is 
    categorized as a public API, meaning that requests made from this api will not be restricted by Shopify's CORS Policy
    (Cross-origin resource sharing). This is possible due to its use of 'Access tokens' which are harmless when compared to
    API keys and User credentials.
    - With the API, Shopify collections can be fetched with products and their respective info. These items are then displayed
    on the client's website and given the functionality to be chosen for purchase. The API allows the creation of a checkout to
    which items and shipping address to be added then sent for processing. When the checkout is sent, the customer is 
    redirected to the checkout url for payment processing on the Shopify website. This allows Shopify to handle sensitive
    information on our client's behalf. 

## Deployment

For the client's security (and due to Tumblr and Shopify restrictions) the API keys were removed. You will receive a separate .txt file with the client's API key (if you're lucky).
 
## Roadmap and Project Status
While we delivered the blueprint - or basic template - requested by the client, this was part of a longterm, scaleable project. 

In the short-term, we'll be able to upgrade the blog soon to give the client access to tumblr's posting and engagement functionalities (liking, Q&A, and reposting). Cat will provide further assets and design suggestions. 

The longterm goal is to create interactive animated "style novels." Users will have an immersive digital environment that goes far beyond the standard internet shopping experience.

## Made by Team Bigfoot:

   Kevin Choi
   Austin Lee
   Jeremy Jackson
   Kat Yeary