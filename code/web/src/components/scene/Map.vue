<template>
	<section>
		<div style="border: solid 1px #cecece;margin: auto; width: 800px;height: 600px;" v-loading.body="loading">
			<canvas ref="canvas" style="width: 800px;" width="800" height="600"></canvas>
		</div>
	</section>
</template>

<script>
	import { fabric } from 'fabric'
	fabric.Object.prototype.originX = 'center'
	fabric.Object.prototype.originY = 'center'
	
	export default {
		name: 'mixc-map',
		componentName: 'mixc-map',
		
		props: {
			pFloorId: {
				type: Number,
				default: 0
			}
		},
		
		data() {
			let floorId = this.pFloorId > 0 ? this.pFloorId : this.$route.params.floorId
			let clientId = this.$store.state.client.clientId
			return {
				loading: true,
				floorId: floorId,
				clientId: clientId,
				floor: {},
				
				canvas: null,
				
				zoom: 1,
			};
		},
		created() {
			this.$bus.on('floor-map', this.loadData.bind(this))
		},
		
		mounted() {
			const roomElement = this.$refs.canvas;
			
			const canvas = this.canvas = new fabric.Canvas(roomElement, {
			    hoverCursor: 'pointer',
			    selection: false,
			    perPixelTargetFind: true,
			    targetFindTolerance: 5
			})
			
			canvas.hoverCursor = 'pointer';
			canvas.on('object:modified', this.moved.bind(this))
			
//			function animate(e, dir) {
//			    if (e.target && e.target.selectable) {
//			      fabric.util.animate({
//			        startValue: e.target.get('angle'),
//			        endValue: e.target.get('angle') + (dir ? 10 : -10),
//			        duration: 100,
//			        onChange: function(value) {
//			          e.target.setAngle(value);
//			          canvas.renderAll();
//			        },
//			        onComplete: function() {
//			          e.target.setCoords();
//			        }
//			      });
//			      fabric.util.animate({
//			        startValue: e.target.get('scaleX'),
//			        endValue: e.target.get('scaleX') + (dir ? 0.2 : -0.2),
//			        duration: 100,
//			        onChange: function(value) {
//			          e.target.scale(value);
//			          canvas.renderAll();
//			        },
//			        onComplete: function() {
//			          e.target.setCoords();
//			        }
//			      });
//			    }
//			  }
//			  canvas.on('mouse:down', function(e) { animate(e, 1); });
//			  canvas.on('mouse:up', function(e) { animate(e, 0); });
		  
		},
		methods: {
			loadData() {
				this.loading = true
				this.$http.get(["/api/floor/get", this.floorId].join("/")).then((response) => {
					if(response.nice) {
						this.canvas.clear()
						this.floor = response.data.rst
						this.layoutBackground()
						this.layoutRooms()
						this.layoutPois()
					}
				})
			},
			layoutBackground() {
				const canvas = this.canvas
				const center = this.canvas.getCenter()
				const backgroundImageSize = this.getAjustSize()
				this.zoom = (this.floor.fileWidth / backgroundImageSize.width) || 1	
				
				fabric.Image.fromURL(this.floor.navFilePath, function(oImg) {
					oImg.set({
						width: backgroundImageSize.width,
						height: backgroundImageSize.height,
						left: center.left,
						top: center.top,
						selectable: false,
					})
  					canvas.insertAt(oImg, 0)
				});
			},
			layoutRooms() {
				const rooms = this.floor.rooms
				const center = this.canvas.getCenter()
				const canvas = this.canvas
				const zoom = this.zoom || 1
				if(rooms && rooms.length > 0) {
					rooms.forEach(s => {
						const rect = new fabric.Rect({
							width: 80,
    							height: 20,
    							left: s.x / zoom + center.left, top: s.y / zoom + center.top,
    							fill: '#aac'
						})
						const text = new fabric.Text(s.roomName, {
							hasControls: false,
							padding: 5,
							fontSize: 15,
							left: s.x / zoom + center.left, top: s.y / zoom + center.top,
							shadow: 'rgba(0,0,0,0.2) 0 0 5px',
							fill: 'white',
						})
//						canvas.add(text)
						const group = new fabric.Group([rect, text], {
							room: s,
							hasControls: false,
							padding: 5,
						})
						canvas.add(group)
					})
				}
			},
			
			layoutPois() {
				const pois = this.floor.pois
				if(pois && pois.length > 0) {
					pois.forEach(this.layoutPoi, this)
				}
			},
			
			layoutPoi(poi) {
				const canvas = this.canvas
				const center = this.canvas.getCenter()
				const zoom = this.zoom || 1
				
				fabric.Image.fromURL(poi.poiIcon, function(oImg) {
					oImg.set({
						poi: poi,
						width: 30,
						height: 30,
						left: poi.x / zoom + center.left, top: poi.y / zoom + center.top,
						hasControls: false,
						padding: 5,
						originY: 'bottom',
					})
  					canvas.add(oImg)
				});
			},
			
			getAjustSize() {
				if(this.floor.fileWidth > 0 && this.floor.fileHeight > 0) {
					if(this.canvas.width / this.canvas.height > this.floor.fileWidth / this.floor.fileHeight) {
						return { width: this.floor.fileWidth * this.canvas.height /  this.floor.fileHeight, height: this.canvas.height }
					} else {
						return { width: this.canvas.width, height: this.floor.fileHeight * this.canvas.width / this.floor.fileWidth }
					}
				}
				return this.canvas
			},
			
			moved(evt) {
				const center = this.canvas.getCenter()
				const x = Math.round((evt.target.left - center.left) * this.zoom)
				const y = Math.round((evt.target.top - center.top) * this.zoom)
				const room = evt.target.room
				const poi = evt.target.poi
				if(room) {
					this.$http.post(["/api/room/position", room.roomId, x, y].join("/")).then((response) => {}, (response) => {
						if(response.nice) {
							room.x = x
							room.y = y
						}
					})
				} else if(poi) {
					this.$http.post(["/api/poi/position", poi.poiId, x, y].join("/")).then((response) => {}, (response) => {
						if(response.nice) {
							poi.x = x
							poi.y = y
						}
					})
				}
			},
		}
	}
</script>