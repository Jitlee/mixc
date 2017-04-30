<template>
	<el-tabs style="width: 100%">
		<el-tab-pane label="店铺信息" name="info">
			<el-form :model="formData" :rules="formRules" ref="formData" label-width="100px">
				<div style="position: relative">
					<mixc-upload :clientId="formData.clientId" :type="1" v-model="formData.shopIcon" :path="shopIconPath" title="单击上传LOGO"></mixc-upload>
					<el-form-item label="店铺名称" prop="shopName" class="el-form-item-left">
						<el-input v-model="formData.shopName" auto-complete="off" placeholder="请输入店铺名称" :maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="英文名称" prop="shopEnName" class="el-form-item-left">
						<el-input v-model="formData.shopEnName" auto-complete="off" placeholder="请输入店铺英文名称" :maxlength="30"></el-input>
					</el-form-item>
					<el-form-item label="搜索索引" prop="shopEnName" class="el-form-item-left">
						<el-input v-model="formData.shopIndex" auto-complete="off" placeholder="请输入店铺索引(字母A-Z|数字0-9)" :maxlength="1"></el-input>
					</el-form-item>
				</div>
				<hr /> 
				<div style="position: relative;height: 160px;">
					<mixc-upload :clientId="formData.clientId" :type="9" v-model="formData.shopImage" :path="shopImagePath" title="单击上传店铺图片"></mixc-upload>
					<el-form-item label="店铺类型" prop="shopType" class="el-form-item-left">
						<el-select v-model="formData.shopType" placeholder="请选择">
						    	<el-option-group v-for="group in shopTypeGroups" :label="group.dictValue">
						      <el-option v-for="item in group.children" :label="item.dictValue" :value="item.dictId"></el-option>
						    	</el-option-group>
					  	</el-select>
					</el-form-item>
					<el-form-item label="店铺特色" class="el-form-item-left" v-if="false">
						<el-input v-model="formData.shopDesc" auto-complete="off" placeholder="请输入店铺特色" :maxlength="100"></el-input>
					</el-form-item>
				</div>
				<hr /> 
				<div style="position: relative;height: 160px;">
					<mixc-upload :clientId="formData.clientId" :type="13" v-model="formData.shopNavKey" :path="shopNavPath" title="单击上传楼层导航图片"></mixc-upload>
					<el-form-item label="店铺电话" class="el-form-item-left" style="position: relative">
						<el-input v-model="formData.shopTel" auto-complete="off" placeholder="请输入店铺电话" :maxlength="20"></el-input>
					</el-form-item>
					<el-form-item label="店铺网址" class="el-form-item-left">
						<el-input v-model="formData.shopUrl" type="url" auto-complete="off" placeholder="请输入店铺网址 http://" :maxlength="100"></el-input>
					</el-form-item>
					<el-form-item label="服务时间" class="el-form-item-left">
						<el-col :span="11">
							<el-time-select placeholder="起始时间" v-model="serviceStartTime" :picker-options="{ start: '06:00', step: '00:30', end: '23:30' }"></el-time-select>
			    			</el-col>
			    			<el-col class="line" :span="2">-</el-col>
			    			<el-col :span="11">
			      			<el-time-select placeholder="结束时间" v-model="serviceEndTime" :picker-options="{ start: '06:00', step: '00:30', end: '23:30', minTime: serviceStartTime }"></el-time-select>
			    			</el-col>
					</el-form-item>
				</div>
				<hr /> 
				<div style="position: relative; height: 200px;">
					<mixc-upload :clientId="formData.clientId" :type="2" v-model="formData.shopQRCode" :path="shopQRCodePath" title="单击上传二维码"></mixc-upload>
					<el-form-item label="店铺简介" class="el-form-item-left">
						<el-input type="textarea" v-model="formData.shopIntroduction" placeholder="请输入店铺简介" :maxlength="400" :rows="8"></el-input>
					</el-form-item>
				</div>
				<el-form-item>
					<el-button type="primary" @click.native="formSubmit" :loading="formLoading">保存</el-button>
					<el-button @click="handleCancel">取消</el-button>
				</el-form-item>
			</el-form>
		</el-tab-pane>
	    <el-tab-pane label="店铺相册" name="album" :disabled="shopId == 0">
	    		<mixc-album :client-id="clientId" :obj-id="shopId" album-type="shop"></mixc-album>
	    </el-tab-pane>
	</el-tabs>
</template>

<script>
	export default {
		data() {
			let clientId = this.$store.state.client.clientId;
			let shopId = Number(this.$route.params.shopId || 0);
			return {
				currentTime: new Date().getTime,
				shopTypeGroups: [],
				loading: true,
				formLoading: false,
				shopIconPath: "/static/img/shop.png",
				shopQRCodePath: "/static/img/qrcode.png",
				shopImagePath: "/static/img/shop-image.png",
				shopNavPath: "/static/img/floor_nav.png",
				serviceStartTime: "10:00",
				serviceEndTime: "22:00",
				clientId: clientId,
				shopId: shopId,
				formData: {
					shopId: 0,
					clientId: clientId,
					shopName: "",
					shopEnName: "",
					shopIndex: "",
					shopIcon: "default_shop_icon",
					
					shopImage: "default_shop_image",
					shopNavKey: "default_shop_nav",
					shopType: "",
					shopDesc: "",
					shopTel: "",
					shopUrl: "",
					serviceStartTime: 600,
					serviceEndTime: 1320,
					shopQRCode: "default_shop_qr_code",
					shopIntroduction: ""
				},
				formRules: {
					shopName: [{
						required: true,
						message: '请输入店铺名称',
						trigger: 'blur',
						length: 20
					}],
					shopIndex: [{
						required: true,
						message: '请输入店铺索引(字母A-Z|数字0-9)',
						trigger: 'blur',
						length: 1
					}]
				},
			};
		},
		created() {
			this.loadData(this.shopId);
			this.loadShopTypeGroup();
		},
		methods: {
			loadData(shopId) {
				if(!(shopId > 0)) {
					this.loading = false;
					return;
				}
				this.$http.get("/api/shop/info/" + shopId).then((response) => {
					this.loading = false;
					if(response.data && response.data.code == 200) {
						var rst = response.data.rst
						if(rst) {
							this.shopIconPath = rst.shopIconPath;
							this.shopQRCodePath = rst.shopQRCodePath;
							this.shopImagePath = rst.shopImagePath;
							this.shopNavPath = rst.shopNavPath;
							delete rst.shopIconPath;
							delete rst.shopQRCodePath;
							delete rst.shopImagePath;
							delete rst.shopNavPath;
							this.serviceStartTime = this.timeStringWithMinutes(rst.serviceStartTime);
							this.serviceEndTime = this.timeStringWithMinutes(rst.serviceEndTime);
							this.formData = rst;
							return;
						}
					}
					this.$message.error('加载失败');
				}, () => {
					this.loading = false;
					this.$message.error('加载失败，网络异常，请稍后再试');
				});
			},
			loadShopTypeGroup() {
				let url = ['/api/dict/group', this.clientId, -1].join("/");
				this.$http.get(url).then((response) => {
					if(response.data && response.data.code == 200) {
						if(response.data.rst && response.data.rst.length > 0) {
							this.shopTypeGroups = response.data.rst;
						}
					}
				});
			},
			formSubmit() {
				this.$refs.formData.validate((valid) => {
					if(!valid) {
						return
					}
					
					if(!(this.formData.shopType > 0)) {
						this.$message.error('请选择店铺类型');
						reutrn
					}
					
					this.formLoading = true;
					this.$http.post('/api/shop/save', this.formData).then((response) => {
						if(response.nice) {
							this.$router.go(-1);
						}
					});
				});
			},
			handleCancel() {
				this.$router.go(-1);
			},
			timeStringWithMinutes(minutes) {
				let hour = Math.floor(minutes / 60);
				let minute = minutes%60;
				return [hour < 10 ? ("0" + hour) : hour, minute < 10 ? ("0" + minute) : minute].join(":");
			},
			minutesWithTimeString(timeString) {
				let matches = timeString.match(/^0?(\d+):0?(\d+)$/);
				if(matches && matches.length == 3) {
					return Number(matches[1]) * 60 + Number(matches[2]);
				}
				return 0;
			}
		},
		watch: {
			'serviceStartTime'(val) {
				this.formData.serviceStartTime = this.minutesWithTimeString(val);
			},
			'serviceEndTime'(val) {
				this.formData.serviceEndTime = this.minutesWithTimeString(val);
			},
		}
	}
</script>