// polyfill - animationFrame is undefined, requestAnimationFrame is added to the global object
import animationFrame from '../../helpers/environment/request-animation-frame';

export default class AnimationLoop {
	
	startCycle(options={}) {
		this.animationUpdateStack = [];
		this.animationRenderStack = [];
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
		this.animationStackRender(timeFrame);
		this.lastRender = timeFrame;
	}
	
	queueUpdates(numTicks) {
		for (let i = 0; i < numTicks; i++) {
			this.lastTick = this.lastTick + this.tickLength; //Now lastTick is this tick.
			this.animationStackUpdate(this.lastTick);
		}
	}
	
	setInitialState() {
		
		this.animationStackUpdate(this.lastTick);
		this.animationStackRender();
	}

	animationStackUpdate(lastTick) {
		this.animationUpdateStack.forEach(animationUpdateCallback => {
			animationUpdateCallback.apply(animationUpdateCallback, arguments);
		});
		return this;
	}

	animationStackRender(timeFrame) {
		this.animationRenderStack.forEach(animationRenderCallback => {
			animationRenderCallback.apply(animationRenderCallback, arguments);
		});
		return this;		
	}
}