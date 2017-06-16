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

        // Before set width data attribute
        localSettings.beforeSetWidth(options);

        // Calculate maxWidth
        maxWidth = document.querySelector(localSettings.selector).getAttribute('data-gallery-itemwidth') || localSettings.maxWidth;

        // Variables
        var gallery = document.querySelector(localSettings.selector);
        var galleryWidth = parseFloat(window.getComputedStyle(gallery).width),
            items = Math.ceil(galleryWidth / maxWidth);

        // Set attribute
        gallery.setAttribute('data-gallery-items', items);

        // After set width data attribute
        localSettings.afterSetWidth(options);
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

    };


    //
    // Public APIs
    //

    return vanillaGallery;

});
