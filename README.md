vanillaGallery
==============

A vanilla JS gallery. Simply putting items into a grid and calculate how many items should be next to each other. Up to 24 columns wide.

## Markup

```html
<!-- outside gallery with hidden overflow for negative margin -->
<div class="gallery" data-gallery>
    <!-- Negative margin flex container holding the items -->
    <div class="gallery__items">
        <!-- Item with margin to separate items from each other -->
        <div class="gallery__item">
            <!-- Actual content container -->
            <div class="gallery__content">...</div>
        </div>
    </div>
</div>
```

## Initiate
```html
<script>
    vanillaGallery.init();
</script>
```

## Options
```html
<div class="gallery" data-gallery data-gallery-itemwidth="300">
```