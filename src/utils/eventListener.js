var passiveSupported = false;
try {
  var options = Object.defineProperty({}, 'passive', {
    get: function() {
      passiveSupported = true;
    },
  });
  window.addEventListener('test', null, options);
} catch (err) {
}

const eventListenerThirdParam= passiveSupported ? { passive: true } : false

export {eventListenerThirdParam}