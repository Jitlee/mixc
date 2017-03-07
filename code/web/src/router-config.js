import index from './components/Index.vue'
import login from './components/login/Login.vue'
import shop from './components/shop/List.vue'
import shopedit from './components/shop/Edit.vue'

import shoptype from './components/dict/GroupList.vue'
import poiType from './components/dict/List.vue'

import scene from './components/scene/Scene.vue'
import build from './components/scene/Build.vue'
import floor from './components/scene/Floor.vue'
import floormgr from './components/scene/FloorMgr.vue'
import room from './components/scene/Room.vue'
import poi from './components/scene/Poi.vue'

import user from './components/setting/User.vue'
import password from './components/setting/Password.vue'

import activity from './components/activity/List.vue'
import terminal from './components/terminal/List.vue'
import terminalpassword from './components/terminal/Password.vue'

import articlelist from './components/article/List.vue'
import articleedit from './components/article/Edit.vue'

import ads from './components/ads/List.vue'

import release from './components/release/List.vue'

export let routes = [
	{
		path: '/login',
		component: login,
		hidden: true
	},
	{
		path: 'scene',
		icon: 'icon-louceng',
		name: '楼层管理',
		component: index,
		role: 2 + 4 + 8,
		children: [
			{
				path: '/scene/floor', icon: 'icon-1380louceng1f', name: '楼层管理', component: floor,
				children: [
					{ path: '/scene/floor/room/:floorId', icon: 'icon-shop', name: "店铺房间管理", component: room },
					{ path: '/scene/floor/poi/:floorId', icon: 'icon-shop', name: "公共设施管理", component: poi }
				]
			},
			{ path: '/scene/floor/mgr/:floorId', icon: 'icon-shop', name: "公共设施管理", component: floormgr, hidden: true },
			{ path: '/scene/poi/7/-2', icon: 'icon-xingqudian', name: '公共设施类型管理', component: poiType }
		]
	},
	{
		path: '/shop',
		icon: 'icon-dianpu',
		name: '店铺管理',
		component: index,
		children: [
			{ path: '/shop/list', icon: 'icon-dianpu', name: '店铺管理', component: shop },
			{ path: '/shop/edit/:shopId', icon: 'icon-dianpu', name: '店铺管理', component: shopedit, hidden: true },
			{ path: '/shop/type/3/-1', icon: 'icon-type', name: '店铺类型', component: shoptype }
		]
	},
	{
		path: '/terminal',
		icon: 'icon-zhongduan',
		name: '设备管理',
		component: index,
		children: [
			{ path: '/terminal/list', icon: 'icon-zhongduan', name: '客户端管理', component: terminal },
			{ path: '/terminal/password', icon: 'icon-mima', name: '客户端密码', component: terminalpassword },
		]
	},
	{
		path: '/activity',
		icon: 'icon-neirong',
		name: '内容管理',
		component: index,
		children: [
			{ path: '/activity/list', icon: 'icon-jingcaihuodong', name: '精彩活动', component: activity },
			{ path: '/article/list', icon: 'icon-bianxie', name: '文章列表', component: articlelist },
			{ path: '/article/edit/:articleId', icon: 'icon-bianxie', name: '编辑文章', component: articleedit, hidden: true },
			{ path: '/ads/list', icon: 'icon-guanggao', name: '广告管理', component: ads },
		]
	},
	{
		path: '/setting',
		icon: 'icon-shezhi1',
		name: '系统设置',
		component: index,
		children: [
			{ path: '/release/list', icon: 'icon-icon103', name: '版本发布', component: release },
			{ path: '/setting/user', icon: 'icon-10', name: '用户管理', component: user },
			{ path: '/setting/password', icon: 'icon-mima', name: '修改密码', component: password },
		]
	}
]

