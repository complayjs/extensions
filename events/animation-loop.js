// polyfill - animationFrame is undefined, requestAnimationFrame is added to the global object
import animationFrame from '../../helpers/environment/request-animation-frame';

export default class AnimationLoop {
	
	startCycle(options={}) {

		this.update = this.update || this.abstractUpdate;
		this.render = this.render || this.abstractRender;
		this.onWindowResize = this.onWindowResize || this.abstractOnWindowResize;
		this.onScroll = this.onScroll || this.abstractOnScroll;

		this.options = this.options || options;
		this.lastTick = performance.now();
		this.lastRender = this.lastTick; //Pretend the first draw was on first update.
		this.tickLength = this.options.tickLength || 30; //This sets your animation to run at 20Hz (50ms)
		
		this.setInitialState();
		this.main(performance.now()); // Start the cycle 
	}

	stopCycle() {
		cancelAnimationFrame(this.stopMain);
		this.stopMain = null;
	}
	
	main(timeFrame) {
		this.stopMain = requestAnimationFrame(this.main.bind(this));
		let nextTick = this.lastTick + this.tickLength;
		let numTicks = 0;

		if (timeFrame > nextTick) {
			let timeSinceTick = timeFrame - this.lastTick;
			numTicks = Math.floor(timeSinceTick / this.tickLength);
		}

		this.queueUpdates(numTicks);
		this.render(timeFrame);
		this.lastRender = timeFrame;
		
		window.onResize = this.onWindowResize.bind(this);
	}
	
	queueUpdates(numTicks) {
		for (let i = 0; i < numTicks; i++) {
			this.lastTick = this.lastTick + this.tickLength; //Now lastTick is this tick.
			this.update(this.lastTick);
		}
	}
	
	setInitialState() {
		
		this.update(this.lastTick);
		this.render();
	}

	abstractOnWindowResize(evt) {
		
	}

	abstractOnScroll(evt) {
		
	}	

	abstractUpdate(lastTick) {
				
		return this;
	}

	abstractRender(timeFrame) {
		
		return this;		
	}
}