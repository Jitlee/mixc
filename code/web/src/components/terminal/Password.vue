<template>
	<section style="text-align: left;position: relative"  v-loading.body="loading">
		<label>设置所有客户端密码：</label>
		<el-row style="width: 300px;margin:20px 0">
		  <el-col :span="6" v-for="(p,index) in passwords"><div class="password-bord" :class="{ active: activeIndex == index }">{{ p }}</div></el-col>
		</el-row>
		<div class="keyboard">
			数字键盘：
			<el-row>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(1)">1</div></el-col>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(2)">2</div></el-col>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(3)">3</div></el-col>
			</el-row>
			<el-row>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(4)">4</div></el-col>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(5)">5</div></el-col>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(6)">6</div></el-col>
			</el-row>
			<el-row>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(7)">7</div></el-col>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(8)">8</div></el-col>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(9)">9</div></el-col>
			</el-row>
			<el-row>
			  <el-col :span="16"><div class="key span" @click.navtive="handleKey(0)">0</div></el-col>
			  <el-col :span="8"><div class="key" @click.navtive="handleKey(-1)"><i class="el-icon-circle-cross"></i></div></el-col>
			</el-row>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click.native="formSubmit" :disabled="formEnabled" :loading="formLoading">保存</el-button>
		</div>
	</section>
</template>

<style scoped>
	.password-bord {
		width: 50px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		border-radius: 5px;
		border: solid 1px #999;
		box-sizing: border-box;
		font-size: 1.5em;
		font-weight: bold;
		color:#333;
		transition: all 0.1s ease-in-out;
	}
	
	.password-bord.active {
		border-color:#333;
		border-width: 2px;
	}
	
	.keyboard {
		position:absolute;
		left: 400px;
		top: 20px;
		background-color: #f0f0f0;
		padding: 5px;
	}
	
	.keyboard .key {
		cursor: pointer;
		height: 50px;
		width: 50px;
		line-height: 50px;
		text-align: center;
		background-color: #ccc;
		color:#fff;
		margin:5px;
		
	}
	
	.keyboard .key.span {
		width: 110px;
	}
</style>

<script>
	export default {
		data() {
			const clientId = this.$store.state.client.clientId
			return {
				clientId: clientId,
				activeIndex: 0,
				passwords: ['', '', '', ''],
				
				formLoading: false,
				formEnabled: true,
				
				loading: false,
			};
		},
		
		created() {
			this.loadDefault()	
		},
		methods: {
			loadDefault() {
				let url = ["/api/scene/getdefault", this.clientId].join("/");
				this.loading = true;
				this.$http.get(url).then((response) => {
					if(response.nice) {
						let rst = response.data.rst
						if(rst && rst.password && rst.password.length == 4) {
							this.passwords = rst.password.split('')
							this.activeIndex = 3
							this.formEnabled = false
						}
					}
				});	
			},
			handleKey(key) {
				if(key == -1) {
					this.passwords[this.activeIndex] = ''
					this.passwords.splice(this.activeIndex, 1, '')
					if(this.activeIndex > 0) {
						this.activeIndex--;
						this.formEnabled = true;
					}
				} else {
					this.passwords.splice(this.activeIndex, 1, key)
					if(this.activeIndex < this.passwords.length -1) {
						this.activeIndex++;
					}
					if(this.passwords.join('').length == this.passwords.length) {
						this.formEnabled = false;
					}
				}
			},
			formSubmit() {
				this.formLoading = true
				let url = ["/api/scene/setpassword", this.clientId, this.passwords.join('')].join("/");
				
				this.$http.patch(url).then((response) => {
					if(response.nice) {
						this.activeIndex = 0
						this.passwords = ['', '', '', '']
						this.formEnabled = true
					}
				});
			}
		}
	}
</script>