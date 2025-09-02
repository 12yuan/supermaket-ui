Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t * t + b;
  }
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
var requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

/**
 * 平滑滚动到指定位置
 * @param {number} to - 目标滚动位置
 * @param {number} duration - 滚动动画持续时间，单位毫秒
 * @param {Function} callback - 滚动完成后的回调函数
 */
export function scrollTo(to, duration, callback) {
  const element = document.documentElement;
  const start = element.scrollTop;
  const change = to - start;
  const startTime = performance.now();
  let animating = true;
  let lastPos = null;

  const animateScroll = function() {
    if (!animating) return;
    requestAnimFrame(animateScroll);
    const now = performance.now();
    const time = Math.min(1, (now - startTime) / duration);
    const timeFunction = Math.easeInOutQuad(time, 0, 1, 1);
    const pos = Math.floor(start + change * timeFunction);

    if (lastPos === pos) {
      animating = false;
    } else {
      lastPos = pos;
      element.scrollTop = pos;
    }

    if (!animating) {
      if (callback) callback();
    }
  };
  requestAnimFrame(animateScroll);
}