vanillaGallery
==============

A vanilla JS gallery. Simply putting items into a grid and calculate how many items should be next to each other. Styled by using CSS. Up to 24 columns wide.

### [Demo](https://robinpoort.github.io/vanilla-js-gallery/demo/)

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

### using data-attributes
```html
<div class="gallery" data-gallery data-gallery-itemwidth="300">
```

### using script
```html
<script>
    vanillaGallery.init({
        selector: '[data-gallery]',
        maxWidth: 240,
        beforeSetWidth: function () {},
        afterSetWidth: function () {}
    });
</script>
```