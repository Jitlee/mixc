<template>
	<div class="panel">
		<nav style="position: fixed;width: 100%;z-index: 99;">
			<el-menu theme="dark" :default-active="primaryIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
				<li class="el-menu-band">导航平台</li>
				<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
					<el-menu-item :index="index+''"><i class="iconfont" :class="item.icon"></i>&nbsp;{{item.name}}</el-menu-item>
				</template>
			</el-menu>
			<p class="welcome">
				欢迎光临<span>{{ $store.state.user.displayName }}</span>, 
				<el-button type="text" @click="handlerLogout">退出</el-button>
			</p>
		</nav>
		<article>
			<aside>
				<el-menu :default-active="minorIndex" class="el-menu-vertical-demo" style="text-align: left" ref="submenu" @select="handleSubSelect">
					<template v-for="(item,index) in menus" v-if="!item.hidden">
						<el-menu-item :index="index+''"><i class="iconfont" :class="item.icon"></i>&nbsp;{{item.name}}</el-menu-item>
					</template>
				</el>
			</aside>
			<section class="body">
				<el-breadcrumb separator="/">
					<el-breadcrumb-item v-if="currentPathNameParent!=''">{{currentPathNameParent}}</el-breadcrumb-item>
					<el-breadcrumb-item v-if="currentPathName!=''">{{currentPathName}}</el-breadcrumb-item>
				</el-breadcrumb>
				<section class="content">
					<transition name="fade" mode="out-in">
						<router-view></router-view>
					</transition>
				</content>
			</section>
		</article>
	</div>
</template>

<script>
	import { mapActions } from 'vuex'
	export default {
		data() {
			return {
				menus: [],
				currentPathName: '统计报表',
				currentPathNameParent: '主页',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				
				primaryIndex: "0",
				minorIndex: "0",
			}
		},
		watch: {
			'$route' (to, from) {//监听路由改变
				this.currentPathName=to.name;
				this.currentPathNameParent=to.matched[0].name;
			}
		},
		created() {
			this.primaryIndex = this.setPrimaryIndex();
			this.minorIndex = this.setMinorIndex();
		},
		computed: {
		},
		methods: {
			setPrimaryIndex() {
				const current = this.$router.currentRoute;
				const routes = this.$router.options.routes;
				const path = current.matched.length > 0 ? current.matched[0].path : current.path;
				const parentPath = current.matched[0].path;
				let [parentIndex, parentHideCount] = this.indexOf(routes, parentPath);
				const index = parentIndex - parentHideCount;
				if(parentIndex > -1) {
					this.menus = routes[parentIndex].children || [];
				}
				return String(index + parentHideCount);
			},
			setMinorIndex() {
				const current = this.$router.currentRoute;
				const routes = this.$router.options.routes;
				var index = 0;
				if(current.matched.length > 1) {
					const parentPath = current.matched[0].path;
					const [parentIndex, parentHideCount] = this.indexOf(routes, parentPath);
					if(parentIndex > -1) {
						const parent = routes[parentIndex];
						if(parent.children) {
							const [currentIndex, currentHideCount ] = this.indexOf(parent.children, current.path);
							index = currentIndex;
						}
					}
				}
				return String(index);
			},
			handleSelect(index) {
				let i = Number(index);
				let menu = this.$router.options.routes[i];
				this.menus = menu.children || [];
				this.minorIndex = "0";
			},
			handleSubSelect(index) {
				let i = Number(index);
				this.$router.replace(this.menus[i].path);
			},
			indexOf(routes, path) {
				var hideCount = 0;
				for(let i = 0, len = routes.length; i < len; i++) {
					if(routes[i].hidden == true) {
						hideCount++;
						continue;
					}
					if(routes[i].path == path) {
						return [i, hideCount]
					}
				}
				return [-1, 0];
			},
			...mapActions(['setPassport']),
			handlerLogout() {
				this.setPassport()
				this.$router.replace('/login');
			}
		}
	}
</script>

<style scope>
	.fade-enter-active, .fade-leave-active {
		  transition: opacity .5s
		}
		.fade-enter, .fade-leave-active {
		  opacity: 0
		}
	
	.welcome {
		height:60px;
		line-height:60px;
		padding: 0;
		margin: 0;
		position: absolute;
		top: 0px;
		right: 20px;
		color: #f0f0f0;
		font-size: 14px;
	}
	
	.welcome>span {
		color: #F7BA2A;
	}

	.el-menu .el-menu-band {
		padding: 0 20px;
		float: left;
		height: 60px;
		line-height: 60px;
		color: #c0ccda;
		font-size: 24px;
		cursor: default;
	}
	
	article {
		padding-left: 220px;
		padding-right: 20px;
		padding-top: 20px;
		padding-bottom: 20px;
	}
	
	aside {
		width: 200px;
		background-color: #eff2f7;
		position: fixed;
		padding-top: 20px;
		left: 0;
		top: 60px;
		bottom: 0;
	}
	
	section.body {
		background-color: #fff;
	}
	
	section.content {
		padding: 10px 0;
	}
</style>