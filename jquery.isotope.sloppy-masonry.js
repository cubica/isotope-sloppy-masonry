/*
 * Isotope custom layout mode that extends masonry in order to work with percentage-sized columns
 */

(function(window, $) {
	$.extend($.Isotope.prototype, {
		_sloppyMasonryReset : function() {
			// layout-specific props
			var containerSize = this.element.width(),
				segmentSize = this.options.sloppyMasonry && this.options.sloppyMasonry.columnWidth ||
				// or use the size of the first item, i.e. outerWidth
				this.$filteredAtoms.outerWidth(true) ||
				// if there's no items, use size of container
				containerSize;
			this.sloppyMasonry = {
				cols : Math.round(containerSize / segmentSize),
				columnWidth : segmentSize
			};
			var i = this.sloppyMasonry.cols;
			this.sloppyMasonry.colYs = [];
			while (i--) {
				this.sloppyMasonry.colYs.push(0);
			}
		},
		_sloppyMasonryLayout : function($elems) {
			var instance = this, props = instance.sloppyMasonry;
			$elems.each(function() {
				var $this = $(this),
				// how many columns does this brick span
				colSpan = Math.round($this.outerWidth(true) / props.columnWidth);
				colSpan = Math.min(colSpan, props.cols);
				if (colSpan === 1) {
					// if brick spans only one column,
					// just like singleMode
					instance._sloppyMasonryPlaceBrick($this, props.colYs);
				} else {
					// brick spans more than one column
					// how many different places could
					// this brick fit horizontally
					var groupCount = props.cols + 1 - colSpan, groupY = [], groupColY, i;

					// for each group potential
					// horizontal position
					for (i = 0; i < groupCount; i++) {
						// make an array of colY values
						// for that one group
						groupColY = props.colYs.slice(i, i + colSpan);
						// and get the max value of the
						// array
						groupY[i] = Math.max.apply(Math, groupColY);
					}

					instance._sloppyMasonryPlaceBrick($this, groupY);
				}
			});
		},
		_sloppyMasonryPlaceBrick : function($brick, setY) {
			// get the minimum Y value from the columns
			var minimumY = Math.min.apply(Math, setY), shortCol = 0;

			// Find index of short column, the first from the left
			for ( var i = 0, len = setY.length; i < len; i++) {
				if (setY[i] === minimumY) {
					shortCol = i;
					break;
				}
			}

			// position the brick
			var x = this.sloppyMasonry.columnWidth * shortCol, y = minimumY;
			this._pushPosition($brick, x, y);

			// apply setHeight to necessary columns
			var setHeight = minimumY + $brick.outerHeight(true), setSpan = this.sloppyMasonry.cols + 1 - len;
			for (i = 0; i < setSpan; i++) {
				this.sloppyMasonry.colYs[shortCol + i] = setHeight;
			}

		},
		_sloppyMasonryGetContainerSize : function() {
			var containerHeight = Math.max.apply(Math, this.sloppyMasonry.colYs);
			return {
				height : containerHeight
			};
		},
		_sloppyMasonryResizeChanged : function() {
			return true;
		}
	});
})(this, this.jQuery);