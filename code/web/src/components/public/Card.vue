<style scope>
	.mixc-card {
		display: inline-block;
		position:relative;
		border: solid 1px #f0f0f0;
		overflow: hidden;
		margin-right: 15px;
		border-radius: 5px;
		background-position: 50% 50%;
		background-size: contain;
		background-repeat: no-repeat;
	}
	
	.mixc-card .mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0px;
		bottom: 0px;
		background-color: rgba(0,0,0,0);
		transition: background-color 0.2s ease-in-out;
		text-align: center;
	}
	
	.mixc-card:hover .mask {
		background-color: rgba(0,0,0,0.6);
	}
	
	.mixc-card .mask .center {
	    margin-top: 70px;
	    display: none;
	}
	.mixc-card .mask .btn {
		display: inline-block;
	    color: #fff;
	    font-size: 14px;
	    cursor: pointer;
	    vertical-align: middle;
	    transition: transform .3s cubic-bezier(.23,1,.32,1) .1s,opacity .3s cubic-bezier(.23,1,.32,1) .1s;
	    margin: auto;
	    width: 50px;
	}
	
	.mixc-card:hover .mask .center {
		display: block;
	}
	
	.mixc-card:hover .mask .btn span {
		opacity: 0;
    		transition: opacity .15s linear;
	}
	
	.mixc-card .mask .btn:hover {
		transform: translateY(-10px);
	}
	
	.mixc-card .mask .btn:hover span {
		opacity: 1;
	}
	
	.mixc-card .mask .btn i {
		color: #fff;
	    display: block;
	    font-size: 24px;
	    line-height: inherit;
	    margin: 0 auto 5px;
	}
	
	.mixc-thumb {
		width: 200px;
		height: 200px;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 50% 50%;
	}
	
	.mixc-thumb-title {
		position: absolute;
		bottom: -30px;
		left: 0px;
		right:0px;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
		transition: bottom  0.2s ease-in-out,background-color 0.2s ease-in-out;
	}
	
	.mixc-card:hover .mixc-thumb-title {
		bottom: 0px;
		background-color: rgba(0, 27, 160, 0.5);
	}

	.mixc-card .title, .mixc-card .subtitle  {
		padding: 0;
		margin: 0;
		text-align: center;
		overflow:hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		line-height: 30px;
		height: 30px;
	}
	
	.mixc-card .title {
		font-size: 14px;
	}
	
	.mixc-card .subtitle {
		font-size: 12px;			
	}
</style>

<template>
	<div class="mixc-card" :style="{ backgroundImage: 'url(' + url + ')' }">
		<div class="mixc-thumb"></div>
		<div class="mask">
			<div class="center">
			<span class="btn" @click="handlerMoveUp"><i class="el-icon-caret-top"></i><span>上移</span></span>
			<span class="btn" @click="handlerRemove"><i class="el-icon-delete2"></i><span>删除</span></span>
			<span class="btn" @click="handlerMoveDown"><i class="el-icon-caret-bottom"></i><span>下移</span></span>
			</div>
		</div>
		<div class="mixc-thumb-title">
			<div class="title">{{ title }}</div>
			<div class="subtitle">{{ currentTime | date }}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'mixc-card',
		componentName: 'mixc-card',
		props: {
			index: Number,
			fileKey: String,
			tile: Number,
			url: String,
			title: String
		},
		data() {
			return {
				currentTime: this.time
			}
		},
		methods: {
			handlerRemove (){
				this.$emit('remove', this.index, this.fileKey)
			},
			handlerMoveUp (){
				this.$emit('moveup', this.index, this.fileKey)
			},
			handlerMoveDown (){
				this.$emit('movedown', this.index, this.fileKey)
			},
		}
	}
</script>