#ifndef SUMO_ANIMATOR_JS
#define SUMO_ANIMATOR_JS

#include "lib/api_adapter.js"

function SumoAnimator(item) {
    this.item = item;

    this.standState = 0;
    this.walkState = 1;
    this.pushState = 2;
    this.jumpState = 3;
    this.stunnedState = 4;
    
    this.currentAnimState = 0;
}

SumoAnimator.prototype.tryResumeWalking = function() {
    if (this.currentAnimState == this.standState) {
        this.setAnim(this.walkState);
    }
}
SumoAnimator.prototype.stopWalking = function(active) {
    if (this.currentAnimState == this.walkState) {
        this.setAnim(this.standState);
    }
    if(active && this.currentAnimState < this.pushState) {
        //----------this.item.animateToState("Walk");
        //this.item.animateToStateContinuous("Walk");
    }
}

SumoAnimator.prototype.setAnim = function(anim) {
    var that = this;
    if(that.currentAnimState != anim && (that.currentAnimState  < that.pushState || anim == that.standState)) {
        that.currentAnimState = anim;
        switch (anim) {
            case that.standState:
                //that.item.setAnimationState("Walk");
                that.item.setAnimationStateContinuous("Walk");
                that.standAnim();
                break;
            case that.walkState:
                that.item.setAnimationState("Walk");
                that.walkAnim();
                break;
            case that.pushState:
                that.item.setAnimationState("Push");
                that.pushAnim();
                break;
            case that.jumpState:
                that.item.setAnimationState("Jump");
                that.jumpAnim();
                break;
            case that.stunnedState:
                that.item.setAnimationState("Stunned");
                that.stunAnim();
                break;
        }
    }
}

SumoAnimator.prototype.walkAnim = function() {
    var classThis = this;
    //--------------------classThis.item.playIdleAnimation("Walk");
    classThis.item.animateToState("Walk");
    classThis.item.onFinishAnimation(function () {
        classThis.setAnim(classThis.standState);
    });
}

SumoAnimator.prototype.standAnim = function() {

}

SumoAnimator.prototype.jumpAnim = function() {
    var classThis = this;
    if(classThis.item != null) {
        classThis.item.animateToState("Jump");
    }
    classThis.item.onFinishAnimation(function () {
        classThis.setAnim(classThis.standState);
    });
}

SumoAnimator.prototype.stunAnim = function() {
    var classThis = this;
    if(classThis.item != null) {
        classThis.item.animateToState("Stunned");
    }
    classThis.item.onFinishAnimation(function () {
        classThis.setAnim(classThis.standState);
    });
}

SumoAnimator.prototype.pushAnim = function() {
    var classThis = this;
    if(classThis.item != null) {
        classThis.item.animateToState("Push");
    }
    classThis.item.onFinishAnimation(function () {
        classThis.setAnim(classThis.standState);
    });
}

#endif