<template>
	<div class="cartcontrol">
		<transition name="move">
			<div v-show="food.count>0" class="cart-decrease" @click.stop.prevent="decreaseCart">
				<transition name="inner1">
					<span class="icon-remove_circle_outline inner"></span>
				</transition>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script>
	import Vue from 'vue';

	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods:{
			addCart(event) {
				console.log('clicked');
				if (!event._constructed) {
					return;// 当使用better-scroll派发事件的时候。_constructed为true
				}
				if (!this.food.count) {
					Vue.set(this.food, 'count', 1);
					this.food.count = 1;
				} else {
					this.food.count++;
				}
				this.$emit('cartadd', event.target);
			},
			decreaseCart() {
				console.log('clicked');
				if (!event._constructed) {
					return;// 当使用better-scroll派发事件的时候。_constructed为true
				}
				if (this.food.count > 0) {
					this.food.count--;
				}
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size:0
		.cart-decrease,.cart-count,.cart-add
			display:inline-block
		.cart-decrease
			padding:6px
			&.move-enter,&.move-leave-active
				opacity:0
				transform:translateX(24px)
			&.move-enter-active,&.move-leave-active
				transition:all 0.4s linear
			.inner
				display:inline-block
				font-size:24px
				line-height:24px
				color:rgb(0,160,220)
				&.inner1-enter, &.inner1-leave-active
					opacity:0
					transform:rotate(180deg)
				&.inner1-enter-active, &.inner1-leave-active
					transition:all 0.4s linear
					transform:rotate(0)
		.cart-count
			width:12px
			padding:6px 0
			text-align:center
			font-size:10px
			line-height:24px
			color:rgb(147,153,159)
			vertical-align:top
		.cart-add
			padding:6px
			font-size:24px
			line-height:24px
			color:rgb(0,160,220)
</style>
