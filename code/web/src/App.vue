<style lang="less" src="./assets/less/main.less"></style>
<template>
  <div id="app">
			<router-view></router-view>
  </div>	
</template>
<script>
	import { mapActions } from 'vuex'
	
	export default {
	  name: 'app',
	  components: {
	  },
		methods: {
			...mapActions(['restorePassport', 'setNavTarget'])
		},
	  created() {
	  		this.restorePassport((expired) => {
	  			let fullPath = this.$router.currentRoute.fullPath;
		  		if(expired){
		  			if(fullPath != '/login' && fullPath != '/') {
		  				this.setNavTarget(fullPath);
		  			}
		  			this.$router.replace('/login');
		  		} else if(fullPath == '/') {
		  			this.$router.replace('/scene/floor');
		  		}
	  		});
	  }
	}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
