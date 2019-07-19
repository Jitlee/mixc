package com.
{
	import flash.geom.Point;
	
	/** 几何帮助类 */
	public final class MathHelper
	{
		/**
		 * 获取两条直线的焦点
		 * @param p1 线段1的端点1
		 * @param p2 线段1的端点2
		 * @param p3 线段2的端点1
		 * @param p4 线段2的端点2
		 */
		public static function getIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point {
			return getIntersection1(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
		}
		
		/**
		 * 获取两条直线的焦点
		 * @param x1 线段1的端点1的x坐标
		 * @param y1 线段1的端点1的y坐标
		 * @param x2 线段1的端点2的x坐标
		 * @param y2 线段1的端点2的y坐标
		 * @param x3 线段2的端点1的x坐标
		 * @param y3 线段2的端点1的y坐标
		 * @param x4 线段2的端点2的x坐标
		 * @param y4 线段2的端点2的y坐标
		 */
		public static function getIntersection1(x1: Number, y1: Number, x2: Number, y2: Number, x3: Number, y3: Number, x4: Number, y4: Number): Point {
			var ua: Number = 0; 
			var ub:Number = 0;
			var denom: Number = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);
		    if (denom == 0) {
		        return null;
		    }
		    ua = ((x4 - x3)*(y1 - y3) - (y4 - y3)*(x1 - x3))/denom;
		    ub = ((x2 - x1)*(y1 - y3) - (y2 - y1)*(x1 - x3))/denom;
			return new Point(x1 + ua*(x2 - x1), y1 + ua*(y2 - y1));
		}
		
		/** 
		 * 计算三点之间的弧度
		 * @param p 中间点，求此点角度
		 * @param p1 端点1
		 * @param p2 端点2
		 */
		public static function radian(p: Point, p1: Point, p2: Point): Number {    
			var cosfi: Number = 0, fi: Number = 0, norm: Number = 0;    
			var dsx: Number = p1.x - p.x;    
			var dsy: Number = p1.y - p.y;    
			var dex: Number = p2.x - p.x;    
			var dey: Number = p2.y - p.y;    
			
			cosfi = dsx * dex + dsy * dey;    
			norm = (dsx * dsx + dsy * dsy) * (dex * dex + dey * dey);    
			cosfi /= Math.sqrt(norm);    
			
			if (cosfi >= 1.0) return 0;    
			if (cosfi <= -1.0) return Math.PI;    
			fi = Math.acos(cosfi);    
			
			if (fi < Math.PI) {    
				return fi;   
			} 
			return 2.0 * Math.PI - fi;    
		}
		
		/** 
		 * 计算三点之间的角度
		 * @param p 中间点，求此点角度
		 * @param p1 端点1
		 * @param p2 端点2
		 */
		public static function angle1(p: Point, p1: Point, p2: Point): Number {    
			return 180 * radian(p, p1, p2) / Math.PI;   
		}
		
		/**
		 * 判断两条直线是否相交
		 * @param p1 线段1端点1
		 * @param p2 线段1端点2
		 * @param p3 线段2端点1
		 * @param p4 线段2端点2
		 * @return 如果相交返回true
		 */ 
		public static function isCorss(p1: Point, p2: Point, p3: Point, p4: Point): Boolean {
			return isCorss1(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
		}
		
		/**
		 * 判断两条直线是否相交
		 * @param p1 线段1端点1
		 * @param p2 线段1端点2
		 * @param p3 线段2端点1
		 * @param p4 线段2端点2
		 * @return 如果相交返回true
		 */ 
		public static function isCorss1(x1: Number, y1: Number, x2: Number, y2: Number, x3: Number, y3: Number, x4: Number, y4: Number): Boolean {
			var cm1: Number = crossMul1(x1 - x3, y1 - y3, x4 - x3, y4 - y3);
			var cm2: Number = crossMul1(x2 - x3, y2 - y3, x4 - x3, y4 - y3);
			var cm3: Number = crossMul1(x3 - x1, y3 - y1, x2 - x1, y2 - y1);
			var cm4: Number = crossMul1(x4 - x1, y4 - y1, x2 - x1, y2 - y1);
			return cm1 * cm2 <= 0 && cm3 * cm4 <= 0;
		}
		
		/**
		 * 判断两条线段是否相交
		 * @param p1 线段1端点1
		 * @param p2 线段1端点2
		 * @param p3 线段2端点1
		 * @param p4 线段2端点2
		 * @return 如果相交返回true
		 */ 
		public static function isSegumentCorss(p1: Point, p2: Point, p3: Point, p4: Point): Boolean {
			if(isCorss(p1, p2, p3, p4)) {
				if(isParallel(p1, p2, p3, p4) && !isSegmentOverlaySegment(p1, p2, p3, p4)) {
					return false;
				}
				return true;
			}
			return false;
		}
		
		/**
		 * 判断两条线段是否相交
		 * @param p1 线段1端点1
		 * @param p2 线段1端点2
		 * @param p3 线段2端点1
		 * @param p4 线段2端点2
		 * @return 如果相交返回true
		 */ 
		public static function isSegumentCorss1(x1: Number, y1: Number, x2: Number, y2: Number, x3: Number, y3: Number, x4: Number, y4: Number): Boolean {
			if(isCorss1(x1, y1, x2, y2, x3, y3, x4, y4)) {
				if(isParallel1(x1, y1, x2, y2, x3, y3, x4, y4) && !isSegmentOverlaySegment1(x1, y1, x2, y2, x3, y3, x4, y4)) {
					return false;
				}
				return true;
			}
			return false;
		}
		
		/**
		 * 向量的叉乘
		 */ 
		private static function crossMul(p1: Point, p2: Point): Number {
			return crossMul1(p1.x, p1.y, p2.x, p2.y);
		}
		
		/**
		 * 向量的叉乘
		 */ 
		private static function crossMul1(x1: Number, y1: Number, x2: Number, y2: Number): Number {
			return x1 * y2 - x2 * y1;
		}
		
		/**
		* 判断两条线是否平行
		* @param p1 线段1端点1
		* @param p2 线段1端点2
		* @param p3 线段2端点1
		* @param p4 线段2端点2
		* @return 如果平行返回true
		*/ 
		public static function isParallel(p1: Point, p2: Point, p3: Point, p4: Point): Boolean {
			return (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x) == 0;
		}
		
		/**
		 * 判断两条线是否平行
		 * @param p1 线段1端点1
		 * @param p2 线段1端点2
		 * @param p3 线段2端点1
		 * @param p4 线段2端点2
		 * @return 如果平行返回true
		 */ 
		public static function isParallel1(x1: Number, y1: Number, x2: Number, y2: Number, x3: Number, y3: Number, x4: Number, y4: Number): Boolean {
			return (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4) == 0;
		}
		
		/**
		 * 线段与线段是否重合
		 * @param p1 线段1端点1
		 * @param p2 线段1端点2
		 * @param p3 线段2端点1
		 * @param p4 线段2端点2
		 * @return 如果重合返回true
		 */ 
		public static function isSegmentOverlaySegment(p1: Point, p2: Point, p3: Point, p4: Point): Boolean {
			if(isParallel(p1, p2, p3, p4)) {
				if(segmentContainsPoint(p1, p2, p3, false)) {
					return true;
				} else if(segmentContainsPoint(p1, p2, p4, false)) {
					return true;
				} else if(segmentContainsPoint(p3, p4, p1, false)) {
					return true;
				} else if(segmentContainsPoint(p3, p4, p2, false)) {
					return true;
				}
			}
			return false;
		}
		
		/**
		 * 线段与线段是否重合
		 * @param p1 线段1端点1
		 * @param p2 线段1端点2
		 * @param p3 线段2端点1
		 * @param p4 线段2端点2
		 * @return 如果重合返回true
		 */ 
		public static function isSegmentOverlaySegment1(x1: Number, y1: Number, x2: Number, y2: Number, x3: Number, y3: Number, x4: Number, y4: Number): Boolean {
			if(isParallel1(x1, y1, x2, y2, x3, y3, x4, y4)) {
				if(segmentContainsPoint1(x1, y1, x2, y2, x3, y3, false)) {
					return true;
				} else if(segmentContainsPoint1(x1, y1, x2, y2, x4, y4, false)) {
					return true;
				} else if(segmentContainsPoint1(x3, y3, x4, y4, x1, y1, false)) {
					return true;
				} else if(segmentContainsPoint1(x3, y3, x4, y4, x2, y2, false)) {
					return true;
				}
			}
			return false;
		}
		
		/**
		 * 点是否在线段上
		 * @param p1 线段端点1
		 * @param p2 线段端点2
		 * @param p 点
		 * @param hasEndPoint 是否包含端点
		 * @return 如果在线上则返回
		 */ 
		public static function segmentContainsPoint(p1: Point , p2: Point, p: Point, hasEndPoint: Boolean = true): Boolean {  
			return  segmentContainsPoint1(p1.x, p1.y, p2.x, p2.y, p.x, p.y, hasEndPoint);
		}
		
		
		/**
		 * 点是否在线段上
		 * @param x1 线段端点1的x坐标
		 * @param y1 线段端点1的x坐标
		 * @param x2 线段端点2的x坐标
		 * @param y2 线段端点2的x坐标
		 * @param x 点的x坐标
		 * @param y 点的y坐标
		 * @param hasEndPoint 是否包含端点
		 * @return 如果在线上则返回
		 */ 
		private static function segmentContainsPoint1(x1: Number, y1: Number, x2: Number, y2: Number, x: Number, y: Number, hasEndPoint: Boolean = true): Boolean {
//			if((x - x1) * (y2 - y1) == (x2 - x1) * (y - y1)
//				&&  Math.min(x1 , x2) <= x && x <= Math.max(x1 , x2)
//				&&  Math.min(y1 , y2) <= y && y <= Math.max(y1 , y2)) {
//				if(!hasEndPoint) {
//					return !((equal(x, x1) && equal(y, y1)) || (equal(x, x2) && equal(y, y2)))
//				}
//				return true;
//			}
//			return false;
			
			if(MathHelper.distancePointWithLine1(x, y, x1, y1, x2, y2) < 0.1) {
				if(!hasEndPoint) {
					if(MathHelper.distancePointWithPoint1(x, y, x1, y1) > 0.1
						&& MathHelper.distancePointWithPoint1(x, y, x2, y2) > 0.1) {
						return true;
					}
				}
				return true;
			}
			return false;
		}
		
		/**
		 * 点到点的距离
		 * @param p1 线段端点1
		 * @param p2 线段端点2
		 * @return 距离
		 */ 
		public static function distancePointWithPoint(p1: Point, p2: Point): Number {
			var x1: Number = p1.x;
			var y1: Number = p1.y;
			var x2: Number = p2.x;
			var y2: Number = p2.y;
			return distancePointWithPoint1(x1, y1, x2, y2);
		}
		
		/**
		 * 点到线段的距离
		 * @param x1 点1的x坐标
		 * @param y1 点1的x坐标
		 * @param x2 点2的x坐标
		 * @param y2 点2的x坐标
		 * @return 距离
		 */ 
		public static function distancePointWithPoint1(x1: Number,y1: Number,x2: Number,y2: Number): Number {
			return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
		}
		
		/**
		 * 点到线段的距离
		 * @param p 点
		 * @param p1 线段端点1
		 * @param p2 线段端点2
		 * @return 最近的距离
		 */ 
		public static function distancePointWithLine(p: Point, p1: Point, p2: Point): Number { 
			var x: Number = p.x;
			var y: Number = p.y;
			var x1: Number = p1.x;
			var y1: Number = p1.y;
			var x2: Number = p2.x;
			var y2: Number = p2.y;
			return distancePointWithLine1(x, y, x1, y1, x2, y2);
		}
		
		/**
		 * 点到线段的距离
		 * @param x 点的x坐标
		 * @param y 点的y坐标
		 * @param x1 线段端点1的x坐标
		 * @param y1 线段端点1的x坐标
		 * @param x2 线段端点2的x坐标
		 * @param y2 线段端点2的x坐标
		 * @return 最近的距离
		 */ 
		public static function distancePointWithLine1(x: Number,y: Number, x1: Number,y1: Number, x2: Number,y2: Number): Number { 
			var cross: Number;
			var d2: Number;
			var r: Number;
			var px: Number;
			var py: Number;
			cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);  
			if (cross <= 0) return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));  
			
			d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);  
			if (cross >= d2) return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));  
			
			r = cross / d2;  
			px = x1 + (x2 - x1) * r;  
			py = y1 + (y2 - y1) * r;  
			return Math.sqrt((x - px) * (x - px) + (py - y) * (py - y));  
		}
		
		/**
		 * 多边形是否包含在多边形内
		 * @param parent 多边形1的点
		 * @param child 多边形2的点
		 * @return 如果包含则返回true
		 */ 
		public static function polygonContainsPolygon(parent: Vector.<Point>, child: Vector.<Point>): Boolean {  
			return polygonContainsPoint(parent, child[0]);
		}
		
		/**
		 * 点是否包含在多边形内
		 * @param polygonPoints 多边形的点
		 * @param checkPoint 检测点
		 * @return 如果包含则返回true
		 */ 
		public static function polygonContainsPoint(polygonPoints: Vector.<Point>, checkPoint: Point): Boolean {  
			var inside: Boolean = false;  
			var pointCount: int = polygonPoints.length;  
			var p1: Point, p2: Point;  
			var i: int;
			var j: int
			//第一个点和最后一个点作为第一条线，之后是第一个点和第二个点作为第二条线，之后是第二个点与第三个点，第三个点与第四个点...
			for (i = 0, j = pointCount - 1; i < pointCount; j = i, i++) {  
				p1 = polygonPoints[i]; 
				p2 = polygonPoints[j];  
				if (checkPoint.y < p2.y) {//p2在射线之上  
					if (p1.y <= checkPoint.y) { //p1正好在射线中或者射线下方  
						if ((checkPoint.y - p1.y) * (p2.x - p1.x) > (checkPoint.x - p1.x) * (p2.y - p1.y)) {//斜率判断,在P1和P2之间且在P1P2右侧  
							//射线与多边形交点为奇数时则在多边形之内，若为偶数个交点时则在多边形之外。  
							//由于inside初始值为false，即交点数为零。所以当有第一个交点时，则必为奇数，则在内部，此时为inside=(!inside)  
							//所以当有第二个交点时，则必为偶数，则在外部，此时为inside=(!inside)  
							inside = (!inside);  
						}  
					}  
				} else if (checkPoint.y < p1.y) {  
					//p2正好在射线中或者在射线下方，p1在射线上  
					if ((checkPoint.y - p1.y) * (p2.x - p1.x) < (checkPoint.x - p1.x) * (p2.y - p1.y)) { //斜率判断,在P1和P2之间且在P1P2右侧  
						inside = (!inside);  
					}  
				}  
			}
			return inside;  
		}
		
		/** 求面积（有正负） **/
		private static function _calcArea(points: Vector.<Point>): Number {
			var total:Number = 0;
			var addX: Number = 0;
			var addY: Number = 0;
			var subX:Number = 0;
			var subY: Number = 0;
			var len: uint = points.length;
			var i: uint = 0;
			for (i = 0; i < len; i++) {
				addX = points[i].x;
				addY = points[i == len - 1 ? 0 : i + 1].y;
				subX = points[i == len - 1 ? 0 : i + 1].x;
				subY = points[i].y;
				
				total += (addX * addY * 0.5);
				total -= (subX * subY * 0.5);
			}
			return total;
		}
		
		/**
		 * 计算多边形面积
		 * @param points 顶点集合
		 */
		public static function calcArea(points: Vector.<Point>): Number {
			return Math.abs(_calcArea(points));
		}
		
		/**
		 * 计算多边形是否顺时针
		 * @param points 顶点集合
		 */
		public static function isClockwise(points: Vector.<Point>): Boolean {
			return _calcArea(points) < 0;
		}
		
		/**
		 * 3点矢量行列式
		 */ 
		private static function matrix3Point(pt1: Point, pt2: Point, pt3: Point): Number {
			return ( pt1.x * pt2.y - pt1.x * pt3.y - pt2.x * pt1.y + pt2.x * pt3.y + pt3.x * pt1.y - pt3.x * pt2.y ) * 0.5 ;
		}
		
		/**
		 * 计算线段的弧度(0~2 * PI)
		 * @param startPoint 端点1
		 * @param endPoint 端点2
		 */
		public static function calcLineRadian(startPoint: Point, endPoint: Point): Number {
			return calcLineRadian1(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
		}
		
		/**
		 * 计算线段的弧度(0~2 * PI)
		 * @param startPoint 端点1
		 * @param endPoint 端点2
		 */
		public static function calcLineRadian1(x1: Number, y1: Number, x2: Number, y2: Number): Number {
			var dy: Number = y2 - y1;
			var dx: Number = x2 - x1;
			var theta:Number = Math.atan2(dy, dx); // range (-PI, PI]
			return theta;
		}
		
		/**
		 * 计算线段的角度(0~360)
		 * @param startPoint 端点1
		 * @param endPoint 端点2
		 */
		public static function calcLineAngle(startPoint: Point, endPoint: Point): Number {
			return calcLineAngle1(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
		}
		
		/**
		 * 计算线段的角度(0~360)
		 * @param startPoint 端点1
		 * @param endPoint 端点2
		 */
		public static function calcLineAngle1(x1: Number, y1: Number, x2: Number, y2: Number): Number {
			var theta:Number = calcLineRadian1(x1, y1, x2, y2); // range (-PI, PI]
			theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
			if (theta < 0) theta = 360 + theta; // range [0, 360)
			return theta;
		}
		
		/**
		 * 平移线段
		 * @param startPoint 端点1 （平移后实例会被修改，需提前clone）
		 * @param endPoint 端点2 （平移后实例会被修改，需提前clone）
		 * @param offset 偏移距离(正数向右，负数向左) 
		 */
		public static function translateLine(startPoint: Point, endPoint: Point, offset: Number): void {
			var dx: Number = startPoint.y - endPoint.y;
			var dy: Number = endPoint.x - startPoint.x;
			var len:Number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			if(len > 0) {
				dx /= len;
				dy /= len;
			}
			dx *= offset;
			dy *= offset;
			
			startPoint.x += dx;
			startPoint.y += dy;
			endPoint.x += dx;
			endPoint.y += dy;
		}
		
		/** 三点是否成一线 **/
		public static function isOnLine(p1: Point, p2: Point, p3: Point, deviation: Number = 0.1): Boolean {
			return isOnLine1(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, deviation);
		}
		
		/** 三点是否成一线 **/
		public static function isOnLine1(x1: Number, y1: Number, x2: Number, y2: Number, x3: Number, y3: Number, deviation: Number = 0.1): Boolean {
			return Math.abs((y3 - y1) * (x2 - x1) - (y2 - y1) * (x3 - x1)) < deviation;
		}
		
		/** 获取多边形的质点 */
		public static function centeroid(points: Vector.<Point>): Point {
			var numsPoint: Number = points.length;
			var point: Point = null;
			var center: Point = new Point();
			for each(point in points) {
				center.x += point.x;
				center.y += point.y;
			}
			
			center.x /= numsPoint;
			center.y /= numsPoint;
			
			return center;
		}
		
		/** 获取多边形内部任意一点 */
		public static function insidePoint(points: Vector.<Point>): Point {
			var numsPoint: Number = points.length;
			var center: Point = new Point();
			var prevPoint: Point = null;
			var currentPoint: Point = null;
			var i: uint = 1;
			var iCount: uint = points.length;
			var founded: Boolean = false;
			if(iCount > 0) {
				for(i = 1; i < iCount; i++) {
					prevPoint = points[i-1];
					currentPoint = points[i];
					center.x = 	0.5 * (prevPoint.x + currentPoint.x);
					center.y = 	0.5 * (prevPoint.y + currentPoint.y);
					if(polygonContainsPoint(points, center)) {
						return center;
					}
				}
				
				return points[0];
			}
			return new Point(0, 0);
		}
		
		/** 判断两个数是否相等 */
		public static function equal(a: Number, b: Number, deviation: Number = 0.1): Boolean {
			return Math.abs(a - b) < deviation;
		}
		
		/**
		 * 获取曲线上的点的坐标
		 * @param startPoint 起始点坐标
		 * @param endPoint 终点坐标
		 * @param controlPoint 控制点坐标
		 * @percent 路径的比例(0~1)
		 * @return 返回曲线对应的点顶坐标
		 */
		public static function bezierFor3Point(startPoint: Point, endPoint: Point, controlPoint: Point, percent:Number): Point {
			return bezierFor3Point1(startPoint.x, startPoint.y, endPoint.x, endPoint.y, controlPoint.x, controlPoint.y, percent);
		}
		
		/**
		 * 重新计算曲线上的点的坐标
		 * @param x1 起点x坐标
		 * @param y1 起点y坐标
		 * @param x2 终点x坐标
		 * @param y2 终点y坐标
		 * @param px 控制点x坐标
		 * @param py 控制点y坐标
		 * @percent 路径的比例(0~1)
		 * @return 返回曲线对应的点顶坐标
		 */
		public static function bezierFor3Point1(x1: Number, y1: Number, x2: Number, y2: Number, px: Number, py: Number, percent:Number): Point {
			var bezierPoint:Point = new Point(0.0,0.0);
			percent = Math.max(Math.min(percent,1),0);
			var oneMinusPercent:Number = 1 - percent;
			bezierPoint.x = oneMinusPercent * oneMinusPercent * x1 +
				oneMinusPercent * percent * px * 2 +
				percent * percent * x2;
			bezierPoint.y = oneMinusPercent * oneMinusPercent * y1+
				oneMinusPercent * percent * py * 2 +
				percent * percent * y2;
			return bezierPoint;
		}
		
		/** 根据三点获取外接圆中心点 */
		public static function getCircleCenter(startPoint: Point, endPoint: Point, controlPoint: Point): Point {
			return getCircleCenter1(startPoint.x, startPoint.y, endPoint.x, endPoint.y, controlPoint.x, controlPoint.y);
		}
		
		/**
		 * 重新计算曲线上的点的坐标
		 * @param x1 起点x坐标
		 * @param y1 起点y坐标
		 * @param x2 终点x坐标
		 * @param y2 终点y坐标
		 * @param px 控制点x坐标
		 * @param py 控制点y坐标
		 * @return 返回圆的中心点
		 */
		public static function getCircleCenter1(x1: Number, y1: Number, x2: Number, y2: Number, px: Number, py: Number): Point {
			// 一条边垂直中分线
			var centerX1: Number = (x1 + x2) * 0.5;
			var centerY1: Number = (y1 + y2) * 0.5;
			var centerPoint1: Point = rotateLine1(centerX1, centerY1, x1, y1, Math.PI * 0.5);
			
			// 另一条边垂直中分线
			var centerX2: Number = (x1 + px) * 0.5;
			var centerY2: Number = (y1 + py) * 0.5;
			var centerPoint2: Point = rotateLine1(centerX2, centerY2, x1, y1, Math.PI * 0.5);
			
			// 两条垂线取交点
			var center: Point = getIntersection1(centerX1, centerY1, centerPoint1.x, centerPoint1.y, centerX2, centerY2, centerPoint2.x, centerPoint2.y);
			return center;
		}
		
		/**
		 * 根据两点加控制点生成圆弧
		 * @param startPoint 起点
		 * @param endPoint 终点
		 * @param controlPoint 控制点
		 * @param numsSection 段数
		 * @return 返回曲线对应的点顶坐标集合(不包含起始点)
		 */
		public static function arc(startPoint: Point, endPoint: Point, controlPoint: Point, numsSection:Number): Vector.<Point> {
			return arc1(startPoint.x, startPoint.y, endPoint.x, endPoint.y, controlPoint.x, controlPoint.y, numsSection);
		}
		
		/**
		 * 根据两点加控制点生成圆弧
		 * @param x1 起点x坐标
		 * @param y1 起点y坐标
		 * @param x2 终点x坐标
		 * @param y2 终点y坐标
		 * @param px 控制点x坐标
		 * @param py 控制点y坐标
		 * @param numsSection 段数
		 * @return 返回曲线对应的点顶坐标集合(不包含起始点)
		 */
		public static function arc1(x1: Number, y1: Number, x2: Number, y2: Number, px: Number, py: Number, numsSection:Number): Vector.<Point> {
			var points: Vector.<Point> = new Vector.<Point>();
			// 两条垂线取交点			
			var center: Point = getCircleCenter1(x1, y1, x2, y2, px, py);
			
			var percent: Number = 0;
			var startAngle: Number = 0;
			var endAngle: Number = 0;
			var offsetAngle: Number = 0;
			var pAngle: Number = 0;
			var i: Number = 0;
			
			if(null == center) { // 三点不能形成圆
				for(i = 0; i < numsSection; i++) {
					percent = i / numsSection;
					points.push(new Point(x1 + (x2 - x1) * percent, y1 + (y2 - y1) * percent));
				}
			} else {
				startAngle = MathHelper.calcLineAngle1(center.x, center.y, x1, y1);
				endAngle = MathHelper.calcLineAngle1(center.x, center.y, x2, y2);
				pAngle = MathHelper.calcLineAngle1(center.x, center.y, px, py);
					
				for(i = 1; i < numsSection; i++) {
					percent = i / numsSection;
					if(pAngle < startAngle && endAngle < pAngle){
						offsetAngle = (endAngle - startAngle) * percent;
					} else if(pAngle > startAngle && endAngle > pAngle) {
						offsetAngle = (endAngle - startAngle) * percent;
					} else if((pAngle > startAngle || pAngle < endAngle) && startAngle > endAngle) {
						offsetAngle = (360 - (startAngle - endAngle)) * percent;
					} else if((pAngle > endAngle || pAngle < startAngle) && endAngle > startAngle) {
						offsetAngle = -(360 - (endAngle - startAngle)) * percent;
					}
					points.push(rotateLine1(center.x, center.y, x1, y1, offsetAngle * Math.PI / 180.0));
				}
			}
			return points;
		}
		
		/**
		 * 线段的端点2围绕端点1旋转一定的角度后，获取返回端点2
		 * @param startPoint 起始点坐标
		 * @param endPoint 终点坐标
		 * @radian 旋转的弧度
		 * @return 返回旋转后的终点
		 */
		public static function rotateLine(startPoint: Point, endPoint: Point, radian: Number): Point {
			return rotateLine1(startPoint.x, startPoint.y, endPoint.x, endPoint.y, radian);
		}
		
		/**
		 * 线段的端点2围绕端点1旋转一定的角度后，获取返回端点2
		 * @param x1 起点x坐标
		 * @param y1 起点y坐标
		 * @param x2 终点x坐标
		 * @param y2 终点y坐标
		 * @radian 旋转的弧度
		 * @return 返回旋转后的终点
		 */
		public static function rotateLine1(x1: Number, y1: Number, x2: Number, y2: Number, radian: Number): Point {
			var x: Number = x2 - x1;
			var y: Number = y2 - y1;
			var sin: Number = Math.sin(radian);
			var cos: Number = Math.cos(radian);
			var newPoint: Point = new Point();
			newPoint.x = x1 + x * cos - y * sin;
			newPoint.y = y1 + x * sin + y * cos;
			return newPoint;
		}
		
		/**
		 * 获取兴段
		 */
		public static function getPointByDistance(): Point {
			return null;
		}
		
		/** 
		 * 求点在线段上的投影
		 * @return 如果没有投影则返回null
		 */
		public static function getPointOnLine(pt: Point, pt1: Point, pt2: Point): Point {
			return getPointOnLine1(pt.x, pt.y, pt1.x, pt1.y, pt2.x, pt2.y);
		}
		
		/** 
		 * 求点在线段上的投影
		 * @return 如果没有投影则返回null
		 */
		public static function getPointOnLine1(x: Number, y: Number, x1: Number, y1: Number, x2: Number, y2: Number): Point {
			var isValid = false;
			var minx: Number = 0;
			var maxx: Number = 0;
			var miny: Number = 0;
			var maxy: Number = 0;
			var u: Number = 0;
			var udenom: Number = 0;
			var result: Point = new Point();
			
			if (x1 == x2 && y1 == y2) {
				x1 -= 0.00001
			}
			
			u = ((x - x1) * (x2 - x1)) + ((y - y1) * (y2 - y1));
			udenom = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
			
			u /= udenom;
			
			result.x = x1 + (u * (x2 - x1));
			result.y = y1 + (u * (y2 - y1));
			
			minx = Math.min(x1, x2);
			maxx = Math.max(x1, x2);
			
			miny = Math.min(y1, y2);
			maxy = Math.max(y1, y2);
			
			isValid = (result.x >= minx && result.x <= maxx) && (result.y >= miny && result.y <= maxy);
			
			return isValid ? result : null;
		}
	}
}
