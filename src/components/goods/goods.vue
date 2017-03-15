<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index, $event)">
					<span class="text">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
							<div class="icon">
								<img :src="food.icon" width="57" height="57">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="new-price">￥{{food.price}}</span><span class="old-price" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<v-cartcontrol :food="food" @cartadd="_drop"></v-cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<v-shopcart :delivery-price = "seller.deliveryPrice" :min-price = "seller.minPrice" :select-foods ="selectFoods" ref="shopCart"></v-shopcart>
		<v-food :food="selectedFood" ref="showfood"></v-food>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import shopcart from 'components/shopcart/shopcart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import food from 'components/food/food';

	const ERR_OK = 0;

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				goods:[],
				listHeight:[],
				scrollY:0,
				selectedFood:{}
			};
		},
		computed: {
			currentIndex() {
				for (var i = 0; i < this.listHeight.length; i++) {
					var height1 = this.listHeight[i];
					var height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY < height2 && this.scrollY >= height1)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				var foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if (food.count) {
							foods.push(food);// 找到所有被选择的food
						}
					});
				});
				return foods;
			}
		},
		created() {
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					// console.log(this.goods);
					this.$nextTick(() => {
						this._initScroll();
						this._caculateHeight();
					});
				}
			});
			this.classMap = ['decrease', 'decrease', 'special', 'invoice', 'guarantee'];
		},
		methods: {
			selectMenu(index, event) {
				if (!event._constructed) {
					return;// 当使用better-scroll派发事件的时候。_constructed为true
				}
				var foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				var el = foodList[index];
				this.foodsScroll.scrollToElement(el, 300);
			},
			selectFood(food, event) {
				if (!event._constructed) {
					return;// 当使用better-scroll派发事件的时候。_constructed为true
				}
				this.selectedFood = food;
				this.$refs.showfood.show();
			},
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					click:true
				});
				// 移动端需要设置click才能让点击生效
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					probeType:3,
					click:true
				});
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			_caculateHeight() {
				var foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				var height = 0;
				this.listHeight.push(height);
				for (var i = 0; i < foodList.length; i++) {
					var item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			_drop(target) {
				// 优化体验，异步执行下落动画
				this.$nextTick(() => {
					this.$refs.shopCart.drop(target);
				});
			}
		},
		components: {
			'v-shopcart': shopcart,
			'v-cartcontrol': cartcontrol,
			'v-food': food
		}
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl";

	.goods
		display:flex
		position:absolute
		top:174px
		bottom:48px
		width:100%
		overflow:hidden
		.menu-wrapper
			flex:0 0 80px
			width:80px
			background:#f3f5f7
			.menu-item
				display:table
				padding:0 12px
				height:54px
				line-height:14px
				&.current
					position:relative
					z-index:10
					margin-top:-1px
					background:#fff
					.text
						border-none()
						font-weight:700
				.icon
					display:inline-block
					margin-right:2px
					width:12px
					height:12px
					background-size:12px 12px
					background-repeat:no-repeat
					vertical-align:middle
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display:table-cell
					width:56px
					vertical-align:middle
					border-1px(rgba(7,17,27,0.1))
					font-size:12px
					color:rgb(7,17,27)
		.foods-wrapper
			flex:1
			.title
				padding-left:14px
				height:26px
				line-height:26px
				border-left: 2px solid #d9dde1
				font-size:12px
				color:rgb(147,153,159)
				background-color:#f3f5f7
			.food-item
				display:flex
				margin: 18px
				padding-bottom:18px
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
					margin-bottom:0
				.icon
					flex:0 0 57px
					margin-right:10px
				.content
					flex:1
					.name
						margin:2px 0 8px 0
						height:14px
						line-height:14px
						font-size:14px
						color:rgb(7,17,27)
					.desc,.extra
						margin-bottom:8px
						font-size:10px
						line-height:12px
						color:rgb(147,153,159)
					.extra
						.count
							margin-right:12px
					.price
						font-weight:700
						line-height:24px
						.new-price
							margin-right:8px
							font-size:14px
							color:rgb(240,20,20)
						.old-price
							font-size:10px
							color:rgb(147,153,159)
							text-decoration:line-through
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:12px
</style>
