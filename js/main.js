let restaurants,
    neighborhoods,
    cuisines
var map
var markers = []

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener( 'DOMContentLoaded', ( event ) => {
    fetchNeighborhoods();
    fetchCuisines();
} );



/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods( ( error, neighborhoods ) => {
        if ( error ) { // Got an error
            console.error( error );
        } else {
            self.neighborhoods = neighborhoods;
            fillNeighborhoodsHTML();
        }
    } );
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = ( neighborhoods = self.neighborhoods ) => {
    const select = document.getElementById( 'neighborhoods-select' );
    neighborhoods.forEach( neighborhood => {
        const option = document.createElement( 'option' );
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append( option );
    } );
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
    DBHelper.fetchCuisines( ( error, cuisines ) => {
        if ( error ) { // Got an error!
            console.error( error );
        } else {
            self.cuisines = cuisines;
            fillCuisinesHTML();
        }
    } );
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = ( cuisines = self.cuisines ) => {
    const select = document.getElementById( 'cuisines-select' );

    cuisines.forEach( cuisine => {
        const option = document.createElement( 'option' );
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append( option );
    } );
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    let loc = {
        lat: 40.722216,
        lng: -73.987501
    };
    self.map = new google.maps.Map( document.getElementById( 'map' ), {
        zoom: 12,
        center: loc,
        scrollwheel: false
    } );
    updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
    const cSelect = document.getElementById( 'cuisines-select' );
    const nSelect = document.getElementById( 'neighborhoods-select' );

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[ cIndex ].value;
    const neighborhood = nSelect[ nIndex ].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood( cuisine, neighborhood, ( error, restaurants ) => {
        if ( error ) { // Got an error!
            console.error( error );
        } else {
            resetRestaurants( restaurants );
            fillRestaurantsHTML();
        }
    } )
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = ( restaurants ) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById( 'restaurants-list' );
    ul.innerHTML = '';

    // Remove all map markers
    self.markers.forEach( m => m.setMap( null ) );
    self.markers = [];
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = ( restaurants = self.restaurants ) => {
    const ul = document.getElementById( 'restaurants-list' );
    restaurants.forEach( restaurant => {
        ul.append( createRestaurantHTML( restaurant ) );
    } );
    addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = ( restaurant ) => {

    const li = document.createElement( "li" );
    li.className = "restaurant-container";

    const imgContainer = document.createElement( "div" );
    const img = document.createElement( "img" );

    // imgContainer.className = "restaurant-";
    imgContainer.className = "restaurant-img-container";
    img.className = "restaurant-img";
    img.alt = `Image of restaurant ${restaurant.name}`;

    //gets only img with prefix small
    img.src = `${DBHelper.imageUrlForRestaurant(restaurant)}_small.jpg`;
    imgContainer.appendChild( img );
    li.append( imgContainer );

    const descriptionItems = document.createElement( "div" );
    descriptionItems.className = "descriptions";

    const name = document.createElement( "h2" );
    name.innerHTML = restaurant.name;
    descriptionItems.append( name );

    const neighborhood = document.createElement( "p" );
    neighborhood.className = "neighborhood";
    neighborhood.innerHTML = restaurant.neighborhood;
    descriptionItems.append( neighborhood );

    const address = document.createElement( "p" );
    address.className = "address";
    address.innerHTML = restaurant.address;
    descriptionItems.append( address );
    li.append( descriptionItems );

    const moreContainer = document.createElement( "span" );
    moreContainer.className = "more-container";

    const more = document.createElement( "a" );

    const moreBtnTitle = `Read ${restaurant.name}'s restaurant details`;
    more.className = "c-btn btn-default btn-small btn-more";
    more.innerHTML = "View details";
    more.setAttribute( "aria-label", moreBtnTitle );
    more.title = moreBtnTitle;
    more.href = DBHelper.urlForRestaurant( restaurant );
    moreContainer.appendChild( more );
    li.append( moreContainer );

    return li;
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = ( restaurants = self.restaurants ) => {
    restaurants.forEach( restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant( restaurant, self.map );
        google.maps.event.addListener( marker, 'click', () => {
            window.location.href = marker.url
        } );
        self.markers.push( marker );
    } );
}


/**
 * Register service worker for offline viewing of site
 */
if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register( '../sw.js' )
        .then( () => {
            console.log( `SW registered` )
        } )
        .catch( () => {
            console.log( "Registration failed" );
        } );

}