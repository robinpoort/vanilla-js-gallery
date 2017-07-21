(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define([], factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.vanillaGallery = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    var vanillaGallery = {}; // Object for public APIs
    var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
    var settings, eventTimeout, maxWidth;

    // Default settings
    var defaults = {
        selector: '[data-gallery]',
        maxWidth: 240,

        // Callbacks
        beforeSetWidth: function () {},
        afterSetWidth: function () {}
    };


    //
    // Methods
    //

    /**
     * A simple forEach() implementation for Arrays, Objects and NodeLists.
     * @private
     * @author Todd Motto
     * @link   https://github.com/toddmotto/foreach
     * @param {Array|Object|NodeList} collection Collection of items to iterate
     * @param {Function}              callback   Callback function for each iteration
     * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
     */
    var forEach = function ( collection, callback, scope ) {
        if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
            for ( var prop in collection ) {
                if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
                    callback.call( scope, collection[prop], prop, collection );
                }
            }
        } else {
            for ( var i = collection.length - 1; i >= 0; i-- ) {
                callback.call( scope, collection[i], i, collection );
            }
        }
    };

    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function () {

        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }

        return extended;

    };


    /**
     * Set the width of items
     * @public
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */

    vanillaGallery.setWidth = function(options) {

        // Merge user options with existing settings or defaults
        var localSettings = extend(settings || defaults, options || {});

        // Find gallery and return if not found
        var gallery = document.querySelectorAll(localSettings.selector);
        if ( !gallery ) return;

        forEach(gallery, function (value) {

            // Re-set gallery
            gallery = value;

            // Before set width data attribute
            localSettings.beforeSetWidth(options);

            // Calculate maxWidth
            maxWidth = document.querySelector(localSettings.selector).getAttribute('data-gallery-itemwidth') || localSettings.maxWidth;

            // Variables
            var galleryWidth = parseFloat(window.getComputedStyle(gallery).width),
                items = Math.ceil(galleryWidth / maxWidth);

            // Set attribute
            gallery.setAttribute('data-gallery-items', items);

            // After set width data attribute
            localSettings.afterSetWidth(options);
        });
    };


    /**
     * Add class to landscape images
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */

    var landscapeImages = function() {

        var images = document.querySelectorAll(settings.selector + ' img');

        if ( !images ) return;

        forEach(images, function (value) {
            var image = value;

            image.onload = function() {
                var imageStyle = window.getComputedStyle(image);
                if (parseInt(imageStyle.width, 10) > parseInt(imageStyle.height, 10)) {
                    image.classList.add('is-landscape');
                }
            }
        });
    };


    /**
     * On window scroll and resize, only run events at a rate of 15fps for better performance
     * @private
     * @param  {Function} eventTimeout Timeout function
     * @param  {Object} settings
     */
    var resizeThrottler = function () {
        if ( !eventTimeout ) {
            eventTimeout = setTimeout(function() {
                eventTimeout = null; // Reset timeout
                vanillaGallery.setWidth();
            }, 200);
        }
    };


    /**
     * Destroy the current initialization.
     * @public
     */
    vanillaGallery.destroy = function () {

        // If plugin isn't already initialized, stop
        if ( !settings ) return;

        // Remove event listeners
        document.removeEventListener('resize', resizeThrottler, false);

        // Remove data attribute
        document.querySelector(settings.selector).removeAttribute('data-gallery-items');

        // Reset variables
        settings = null;

    };


    /**
     * Initialize vanillaGallery
     * @public
     * @param {Object} options User settings
     */
    vanillaGallery.init = function ( options ) {

        // feature test
        if ( !supports ) return;

        // Destroy any existing initializations
        vanillaGallery.destroy();

        // Merge user options with defaults
        settings = extend( defaults, options || {} );

        // Listen for all click events
        root.addEventListener('resize', resizeThrottler, false);

        // Run on default
        vanillaGallery.setWidth();

        landscapeImages();

    };


    //
    // Public APIs
    //

    return vanillaGallery;

});
