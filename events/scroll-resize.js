// polyfill - if animationFrame is undefined, requestAnimationFrame is added to the global object
import animationFrame from '../../helpers/environment/request-animation-frame';
import throttle from '../../helpers/animation/throttle';

export default class ScrollResize {

	get scrollUpdateStack() {
		this._scrollUpdateStack = this._scrollUpdateStack || [];
		return this._scrollUpdateStack;
	}

	get scrollRenderStack() {
		this._scrollRenderStack = this._scrollRenderStack || [];
		return this._scrollRenderStack;
	}

	get resizeUpdateStack() {
		this._resizeUpdateStack = this._resizeUpdateStack || [];
		return this._resizeUpdateStack;
	}

	get resizeRenderStack() {
		this._resizeRenderStack = this._resizeRenderStack || [];
		return this._resizeRenderStack;
	}

	startScrollListener(options={}) {
		this.scrollOptions = Object.assign({}, this.options || {}, options);

		this.scrollHandler = this.onScroll.bind(this);

		window.addEventListener('scroll', this.scrollHandler);
	}

	stopScrollListener() {
		window.removeEventListener('scroll', this.scrollHandler);
		this.scrollHandler = null;
	}

	/**
	 * @todo needs performance test
	 */
	onScroll() {
		this.scrollStackUpdate();
		throttle(this.scrollStackRender, this.scrollOptions.delay, this);
	}

	startResizeListener(options={}) {
		this.resizeOptions = Object.assign({}, this.options || {}, options);

		this.resizeHandler = this.onResize.bind(this);

		window.addEventListener('resize', this.resizeHandler);
	}

	stopResizeListener() {
		window.removeEventListener('resize', this.scrollHandler);
		this.resizeHandler = null;
	}

	/**
	 * @todo needs performance test
	 */
	onResize() {
		this.resizeStackUpdate();
		throttle(this.resizeStackRender, this.resizeOptions.delay, this);
	}

	scrollStackUpdate() {
		this.scrollUpdateStack.forEach(scrollUpdateCallback => {
			scrollUpdateCallback.apply(scrollUpdateCallback, arguments);
		});
		return this;
	}

	scrollStackRender(timeFrame) {
		this.scrollRenderStack.forEach(scrollRenderCallback => {
			scrollRenderCallback.apply(scrollRenderCallback, arguments);
		});
		return this;		
	}

	resizeStackUpdate() {
		this.resizeUpdateStack.forEach(resizeUpdateCallback => {
			resizeUpdateCallback.apply(resizeUpdateCallback, arguments);
		});
		return this;
	}

	resizeStackRender(timeFrame) {
		this.resizeRenderStack.forEach(resizeRenderCallback => {
			resizeRenderCallback.apply(resizeRenderCallback, arguments);
		});
		return this;
	}
}