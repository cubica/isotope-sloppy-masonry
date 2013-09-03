This [Isotope](http://isotope.metafizzy.co/) plugin provides a modified version of the Masonry layout mode that is compatible with percentage-sized columns.
Just include this script after the Isotope script, then use it as a layout mode:

```
$blocksContainer.isotope({
    layoutMode: 'sloppyMasonry',
	itemSelector: '.block-class'
});
```

Licensed under the [MIT License](http://opensource.org/licenses/MIT).