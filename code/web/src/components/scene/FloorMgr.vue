<template>
	<el-tabs style="width: 100%">
		<el-tab-pane label="店铺房间管理" name="room">
			<mixc-room :p-floor-id="floorId"></mixc-room>
		</el-tab-pane>
	    <el-tab-pane label="公共设施管理" name="poi">
	    		<mixc-poi :p-floor-id="floorId"></mixc-poi>
	    </el-tab-pane>
	</el-tabs>
</template>

<script>
	import Vue from 'vue'
	import Room from './Room.vue'
	import Poi from './Poi.vue'
	
	export default {
		data() {
			let floorId = Number(this.$route.params.floorId)
			return {
				floorId: floorId
			}
		},
		created() {
			
		},
		components: {
			'mixc-room': Room,
			'mixc-poi': Poi
		},
		methods: {
			
		}
	}
</script>