import Ember from 'ember';

const { set, get } = Ember;

export default Ember.Controller.extend({
  animation: null,

  animationLoopCount: 0,
  animationSpeed: 1,
  animationDirection: 1,

  isLoading: true,
  isDataFailed: false,
  isAnimationReady: false,

  actions: {
    onDataSuccess () {
        console.log('Data loaded'); // eslint-disable-line
        this.toggleProperty('isLoading');
    },

    onDataError () {
      console.log('Data loading failed'); // eslint-disable-line
      this.toggleProperty('isDataFailed');
    },

    animationLoaded(animation) {
      console.log('animation ready'); // eslint-disable-line
      set(this, 'animation', animation);
      this.toggleProperty('isAnimationReady');
    },

    stopAnimation() {
      get(this, 'animation').stop();
    },

    pauseAnimation() {
      get(this, 'animation').pause();
    },

    playAnimation() {
      get(this, 'animation').play();
    },

    changeAnimationDirection () {
      let direction = get(this, 'animationDirection');
      let changedDirection = (direction === 1) ? -1 : 1;
      set(this, 'animationDirection', changedDirection);
      get(this, 'animation').setDirection(changedDirection);
    },

    changeSpeed() {
      get(this, 'animation').setSpeed(get(this, 'animationSpeed'))
    },

    loopCompleted() {
      set(this, 'animationLoopCount', get(this, 'animationLoopCount') + 1);
    }

  }
});
