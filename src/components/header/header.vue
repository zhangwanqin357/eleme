<template>
  <div class="header">
    <div class="content-wrapper">
    	<div class="avatar">
    		<img width="64" height="64" :src="seller.avatar">
    	</div>
    	<div class="content">
    		<div class="title">
    			<span class="brand"></span>
    			<span class="name">{{seller.name}}</span>
    		</div>
    		<div class="description">
    			{{seller.description}}/{{seller.deliveryTime}}分钟送达
    		</div>
    		<div v-if="seller.supports" class="support">
    			<span class="icon" :class="classMap[seller.supports[0].type]"></span>
				<span class="text">{{seller.supports[0].description}}</span>
    		</div>
    	</div>
		<div v-if="seller.supports" class="support-count">
			<span class="count" @click="showDetail">{{seller.supports.length}}个</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
    	<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span><span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="bg">
    	<img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name='fade'>
		<div v-show="detailShow" class="detail">	
			<div class="detail-wrapper clearfix">
				<div class="detail-main">
					<h1 class="name">{{seller.name}}</h1>
					<div class="star-wrapper">
						<star :size="24" :score="seller.score"></star>
					</div>
					<div class="title">
						<div class="line"></div>
						<div class="text">优惠信息</div>
						<div class="line"></div>
					</div>
					<ul v-if="seller.supports" class="support">
						<li class="support-item" v-for="item in seller.supports">
							<span class="icon" :class="classMap[item.type]"></span><span class="text">{{item.description}}</span>
						</li>
					</ul>
					<div class="title">
						<div class="line"></div>
						<div class="text">商家公告</div>
						<div class="line"></div>
					</div>
					<div v-if="seller.bulletin" class="bulletin">
						<div class="text">{{seller.bulletin}}</div>
					</div>
				</div>
			</div>
			<div class="detail-close" @click="closeDetail">
				<i class="icon-close"></i>
			</div>
		</div>
	</transition>
  </div>
</template>

<script>
	import star from 'components/star/star.vue';
    export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				detailShow: false
			};
		},
		created() {
			this.classMap = ['decrease', 'decrease', 'special', 'invoice', 'guarantee'];
		},
		components: {
			star:star
		},
		methods:{
			showDetail: function () {
				this.detailShow = true;
			},
			closeDetail: function () {
				this.detailShow = false;
			}
		}
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl";
	.header
		position:relative
		overflow:hidden
		color: #fff
		background-color:rgba(7,17,27,0.5)
		.content-wrapper
			position:relative
			padding:24px 12px 18px 24px
			font-size:0
			.avatar
				display:inline-block
				vertical-align:top
				img
					border-radius:2px
			.content
				display:inline-block
				margin-left:16px
				font-size:14px
				.title
					margin: 2px 0 8px 0
					.brand
						vertical-align:top
						width:30px
						height:18px
						display:inline-block
						bg-image('brand')
						background-size:30px 18px
						background-repeat:no-repeat
					.name
						margin-left6px
						font-size:16px
						line-height:18px
						font-weight:bold
				.description
					margin-bottom:10px
					line-height:12px
					font-size:12px
				.support
					.icon
						display:inline-block
						margin-right:4px
						width:12px
						height:12px
						background-size:12px 12px
						background-repeat:no-repeat
						vertical-align:middle
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')
					.text
						font-size:10px
						line-height:12px
			.support-count
				position:absolute
				right:12px
				bottom:12px
				padding:0 8px
				height:24px
				line-height:24px
				border-radius:14px
				background-color:rgba(0,0,0,0.2)
				text-align:center
				font-size:10px
				color:rgb(255,255,255)
				.count
					vertical-align:top
				.icon-keyboard_arrow_right
					margin-left:2px
					line-height:24px
		.bulletin-wrapper
			position:relative
			height:28px
			line-height:28px
			padding:0 22px 0 12px
			white-space:nowrap
			overflow:hidden
			text-overflow:ellipsis
			font-size:10px
			.bulletin-title
				display:inline-block
				width:22px
				height:12px
				bg-image('bulletin')
				background-size:22px 12px
				background-repeat:no-repeat
				vertical-align:middle
			.bulletin-text
				margin:0 4px
				vertical-align:middle
			.icon-keyboard_arrow_right
				position:absolute
				right:12px
				top:9px
		.bg
			position:absolute
			top:0
			left:0
			width:100%
			height:100%
			z-index:-1
			filter:blur(10px)
		.detail
			position:fixed
			z-index:1000
			top:0
			left:0
			width:100%
			height:100%
			overflow:auto
			backdrop-filter:blur(10px)
			.detail-wrapper
				width:100%
				min-height:100%
				background:rgba(7,17,27,0.8)
				.detail-main
					margin-top:64px
					padding-bottom:64px
					.name
						line-height:16px
						text-align:center
						font-size:16px
						font-weight:700
					.star-wrapper
						margin-top:18px
						padding:2px 0
						text-align:center
					.title
						display:flex
						width:80%
						margin:28px auto 24px auto
						.line
							flex:1
							position:relative
							top:-6px
							border-bottom:1px solid rgba(255,255,255,0.2)
						.text
							padding:0 12px
							font-size:14px
							font-weight:700
					.support
						margin:0 auto
						width:80%
						line-height:16px
						font-size:12px
						.support-item
							margin-bottom:12px
							padding:0 12px
							&:last-child
								margin-bottom:0
							.icon
								display:inline-block
								margin-right:6px
								width:16px
								height:16px
								vertical-align:top
								background-size:16px 16px
								&.decrease
									bg-image('decrease_1')
								&.discount
									bg-image('discount_1')
								&.guarantee
									bg-image('guarantee_1')
								&.invoice
									bg-image('invoice_1')
								&.special
									bg-image('special_1')
					.bulletin
						margin:0 auto
						width:80%
						.text
							padding:0 12px
							text-align:left
							font-size:12px
							line-height:24px
			.detail-close
				position:relative
				width:32px
				height:32px
				margin:-64px auto 0 auto
				clear:both
				font-size:32px
		.fade-enter,.fade-leave-active
			opacity:0
		.fade-enter-active,.fade-leave-active
			transition:all 0.5s
			
</style>
