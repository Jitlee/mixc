(()=>{
	// 模版
	const template = `
		<div class="activity clear">
			<mixc-public-header title="精彩活动" sub-title="ACTIVITY CENTER"></mixc-public-header>
			<div class="imgs">
				<img v-for="(activity, index) in activities" @click="handleSelect(index)" :src="activity.activityFilePath.substr(1)"/>
			</div>
			<div class="img">
				<img :src="currentActivity.activityFilePath.substr(1)"/>
			</div>
		</div>
	`
	
	// 注册组件
	Vue.component('mixc-activity', {
		template: template,
		data() {
			const activityId = this.$route.params.activityId || 0;
			return {
				activityId: activityId,
				currentActivity: { activityFilePath: "" },
				activities: []
			}
		},
		created() {
			this.getActivities(activities => {
				this.activities = activities;
				if(activities.length > 0) {
					this.currentActivity = activities[0];
					
					if(!(this.activityId > 0)) {
						return
					}
					
					const activityId = this.activityId;
					
					for(let i = 0, len = activities.length; i < len; i++) {
						if(activities[i].activityId == activityId) {
							this.handleSelect(i);
							break;
						}
					}
				}
			})
		}, 
		methods: {
			handleSelect(index) {
				this.currentActivity = this.activities[index]
			},
			
			// 获取所有活动
			getActivities(callback) {
				if(this.$store.state.activities.length > 0) {
					callback(this.$store.state.activities)
				} else {
					PROXY.getJSON('data/activity.json', (rst) => {
						if(rst && rst.length > 0) {
							this.$store.state.activities = rst
							callback(rst)
						}
					})
				}
			},
		}
	})
})()
