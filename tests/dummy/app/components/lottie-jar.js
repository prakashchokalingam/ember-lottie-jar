import Ember from 'ember';
import layout from '../templates/components/lottie-jar';

import Lottie from 'lottie';

const { getProperties, get, set, computed, getOwner } = Ember;

const EVENTS = ['complete', 'loopComplete', 'enterFrame', 'segmentStart', 'config_ready', 'data_ready', 'data_failed', 'loaded_images', 'DOMLoaded', 'destroy'];

const component = Ember.Component.extend({
  layout,

  isLoading: true,

  // body movin options
  el: null,

  renderer: 'svg',
  loop: true,
  autoplay: true,
  rendererSettings: null,

  events: EVENTS,

  animationDataPath: computed(function() {
    let factory = getOwner(this).factoryFor('config:environment');
    let config = factory.class;
    let basePath = (get(config, 'lottieAnimation')) ? get(config.lottieAnimation, 'basePath') : 'animation-data';
    return `${basePath}/${get(this, 'path')}.json`;
  }),


  didInsertElement () {
    this._super(...arguments);
    if (!get(this, 'el')) {
      set(this, 'el', this.element);
    }
    this._renderAnimation();
  },

  _renderAnimation () {
    let settings = getProperties(this, 'el', 'renderer', 'loop', 'autoplay', 'rendererSettings');

    this._fetchJSON().then((animationData) => {
      let properties = Object.assign({}, settings, {
        animationData,
        container: get(settings, 'el')
      });

      let animation = Lottie.loadAnimation(properties);

      // registering events
      for (let event of get(this, 'events')) {
        animation.addEventListener(event, () => {
          this.sendAction(event, animation);
          if (event === 'DOMLoaded' && get(this, 'isLoading')) {
            this._complete();
          }
        });
      }
    })
  },

  _fetchJSON () {
    try {
      return fetch(get(this, 'animationDataPath')).then((data) => {
        let json = data.json()
        this.sendAction('onDataSuccess', json);
        return json;
      });
    }
    catch(err) {
      this.sendAction('onDataError', err);
    }
  },

  _complete () {
    this.toggleProperty('isLoading');
  }
});

component.reopenClass({
  positionalParams: ['path'],
});

export default component;
