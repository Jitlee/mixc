$.fn.extend({
	// 播放动画，并且自动归位（用于重复使用）
	animateCss: function (animationName) {
    	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    	this.addClass('animated ' + animationName).one(animationEnd, function() {
    		$(this).removeClass('animated ' + animationName)
    	})
    }
});