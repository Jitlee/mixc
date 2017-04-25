<template>
	<div>
		<el-row style="margin-bottom: 10px;">
			<el-col :span="24">
				<div class="grid-content" align="left">
					楼层：{{ floorName }} - 店铺管理
				</div>
			</el-col>
		</el-row>
		<el-tabs style="width: 100%" @tab-click="handleClick">
			<el-tab-pane label="店铺房间管理" name="room">
				<mixc-room :p-floor-id="floorId"></mixc-room>
			</el-tab-pane>
		    <el-tab-pane label="公共设施管理" name="poi">
		    		<mixc-poi :p-floor-id="floorId"></mixc-poi>
		    </el-tab-pane>
		    <el-tab-pane label="导航图配置" name="map">
		    		<mixc-map :p-floor-id="floorId"></mixc-map>
		    </el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Room from './Room.vue'
	import Poi from './Poi.vue'
	import Map from './Map.vue'
	
	export default {
		data() {
			const floorId = Number(this.$route.params.floorId)
			const floorName = this.$route.params.floorName
			return {
				floorId: floorId,
				floorName: floorName,
				
				tabIndex: 'room'
			}
		},
		created() {
			
		},
		components: {
			'mixc-room': Room,
			'mixc-poi': Poi,
			'mixc-map': Map,
		},
		methods: {
			handleClick(tab, event) {
				if(tab.index == this.tabIndex) {
					return
				}
				this.tabIndex = tab.index
				switch(tab.index) {
					case 'room':
				        this.$bus.emit('floor-room')
				        break
				    case 'poi':
				    		this.$bus.emit('floor-poi')
				        break
				    	case 'map':
				    		this.$bus.emit('floor-map')
				        break
				    default:
				    		break
				}
		    }
		}
	}
</script>