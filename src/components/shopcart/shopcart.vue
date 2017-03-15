<template>
	<div class="shopcart" >
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
					</div>
					<div v-show="totalCount>0" class="number" :class="{'highlight':totalCount>0}">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" :class="payClass" @click.stop="pay">
				<div class="pay">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball-container">
			<div v-for="ball in balls">
				<transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
					<div v-show="ball.show" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
		</div>
		<transition name="slide">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food border-1px" v-for="food in selectFoods">
							<span class="name">{{food.name}}</span>
							<div class="price">￥{{food.price * food.count}}</div>
							<div class="cartcontrol-wrapper">
								<v-cartcontrol :food="food"></v-cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="mask">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
	
</template>

<script>
	import BScroll from 'better-scroll';
	import cartcontrol from 'components/cartcontrol/cartcontrol';

	export default {
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			},
			deliveryPrice: {
				type: Number,
				default:0
			},
			minPrice: {
				type: Number,
				default:0
			}
		},
		data() {
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],
				fold: true
			};
		},
		computed: {
			totalPrice() {
				var total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount() {
				var count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return '￥' + this.minPrice + '起送';
				} else if (this.totalPrice < this.minPrice) {
					return '还差￥' + (this.minPrice - this.totalPrice) + '起送';
				} else {
					return '去结算';
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				var show = !this.fold;
				if (show) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click:true
							});
						} else {
							this.scroll.refresh();
						}
					});
				}
				return show;
			}
		},
		methods: {
			drop(el) {
				for (var i = 0; i < this.balls.length; i++) {
					var ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						return;
					}
				}
			},
			beforeEnter(el) {
				var count = this.balls.length;
				while (count--) {
					var ball = this.balls[count];
					if (ball.show) {
						var rect = ball.el.getBoundingClientRect();// 获得元素相对于视口的位置
						var x = rect.left - 32;
						var y = -(window.innerHeight - rect.top - 22);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
						el.style.transform = `translate3d(0, ${y}px, 0)`;
						var inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
						inner.style.transform = `translate3d(${x}px, 0, 0)`;
						console.log(inner);
					}
				}
			},
			enter(el) {
				/* eslint-disable no-unused-vars */
				var rf = el.offsetHeight;
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0, 0, 0)';
					el.style.transform = 'translate3d(0, 0, 0)';
					var inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0, 0, 0)';
					inner.style.transform = 'translate3d(0, 0, 0)';
				});
			},
			afterEnter(el) {
				var ball = this.dropBalls.shift();
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList() {
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			hideList() {
				this.fold = true;
			},
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			pay() {
				if (this.totalPrice < this.minPrice) {
					return;
				} else {
					window.alert(`支付${this.totalPrice}元`);
				}
			}
		},
		components: {
			'v-cartcontrol': cartcontrol
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin.styl';
	.shopcart
		position:fixed
		left:0
		bottom:0
		z-index:100
		width:100%
		height:48px
		.content
			display:flex
			background:#141d27
			font-size:0
			.content-left
				flex:1
				.logo-wrapper,.price,.desc
					display:inline-block
					vertical-align:top
				.logo-wrapper
					position:relative
					top:-10px
					margin:0 12px
					padding: 6px
					width:56px
					height:56px
					box-sizing:border-box
					border-radius:50%
					background:#141d27
					.logo
						width:100%
						height:100%
						border-radius:50%
						background:#2b343c
						text-align:center
						&.highlight
							background:rgb(0,160,220)
						.icon-shopping_cart
							line-height:44px
							color:#80858a
							font-size:24px
							&.highlight
								color:rgb(255,255,255)
					.number
						position:absolute
						top:0
						right:0
						width:24px
						height:16px
						line-height:16px
						text-align:center
						border-radius:8px
						font-size:9px
						font-weight:700
						color:rgb(255,255,255)
						background:rgb(240,20,20)
						box-shadow:0px 4px 8px 0px rgba(0,0,0,0.4)
						&.highlight
							color:rgb(255,255,255)
				.price
					line-height:24px
					box-sizing:border-box
					margin-top:12px
					padding-right:12px
					font-size:16px
					font-weight:700
					color:rgba(255,255,255,0.4)
					border-right:1px solid rgba(255,255,255,0.1)
					&.highlight
						color:rgb(255,255,255)
				.desc
					margin:12px
					line-height:24px
					font-size:10px
					font-weight:700
					color:rgba(255,255,255,0.4)
			.content-right
				flex:0 0 105px
				width:105px
				background:#2b333b
				opacity:0.4
				.pay
					margin-top:12px
					padding:0 8px
					line-height:24px
					text-align:center
					font-size:12px
					font-weight:700
					color:rgb(255,255,255)
				&.not-enough
					background:#2b333b
				&.enough
					background:#00b43c
					color:#fff
					opacity:1
		.ball-container
			.ball
				position:fixed
				left:32px
				bottom:22px
				z-index:200
				transition:all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
				.inner
					width:16px
					height:16px
					border-radius:50%
					background:rgb(0,160,220)
					transition:all 0.5s linear
		.shopcart-list
			position:absolute
			bottom:48px
			left:0
			z-index:-4
			width:100%
			padding-bottom:22px
			background:#fff
			transition:all 0.4s linear
			&.slide-enter,&.slide-leave-active
				opacity:0
			&.slide-enter-active,,&.slide-leave-active
				transform:translate3d(0, 100%, 0)
				transition:all 0.2s linear
			.list-header
				height:40px
				line-height:40px
				padding:0 18px
				background:#f3f5f7
				border-bottom:1px solid rgba(7,17,27,0.1)
				.title
					float:left
					font-size:14px
					color:rgb(7,17,27)
				.empty
					float:right
					font-size:12px
					color:rgb(0,160,220)
			.list-content
				max-height:217px
				padding:0 18px
				background:#fff
				overflow:hidden
				.food
					position:relative
					height:24px
					padding:12px 0
					border-1px(rgba(7,17,27,0.1))
					.name
						font-size:14px
						line-height:24px
						color:rgb(7,17,27)
					.price
						position:absolute
						right:90px
						bottom:12px
						line-height:24px
						font-size:14px
						font-weight:700
						color:rgb(240,20,20)
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:6px
		.list-mask
			position:fixed
			top:0
			left:0
			width:100%
			height:100%
			z-index:-5
			background:rgba(7,17,27,0.6)
			backdrop-filter:blur(10px)
			transition:all 0.3s linear
			&.mask-enter,&.mask-leave-active
				opacity:0
			&.mask-enter-active,&.mask-leave-active
				transition:transform3d(0,100%,0)
</style>
