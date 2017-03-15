;
(function(window){
	//创建此插件的构造函数
	var Pregnancy=function(id,obj){
		this.clientWidth=document.body.clientWidth;
		this.id=id;
		
		//设置怀孕的起始时间
		this.beginYear=obj.year;
		this.beginMonth=obj.month-1;
		this.beginDay=obj.day;
		this.beginDate=new Date();
		this.beginDate.setFullYear(this.beginYear);
		this.beginDate.setMonth(this.beginMonth);
		this.beginDate.setDate(this.beginDay);

		//设定当前的时间
		this.nowDate=new Date();
		//一天有多少的毫秒数
		this.daytimes=24*60*60*1000;
		//选择的时间
		this.pickDate=this.nowDate;
		//点击事件
		this.fn=obj.singleClickFn;

		//从第一天怀孕到今天的天数
		this.pastdays=Math.round((this.nowDate.getTime()-this.beginDate.getTime())/this.daytimes+1);
		console.log((this.nowDate.getTime()-this.beginDate.getTime())/this.daytimes);
		//当前的页数
		this.pages=Math.ceil(this.pastdays/7);

		//一共过了多少周数
		this.weeks=Math.ceil(this.pastdays/7);
		//本周未经历的天数
		this.futuredays=this.pages*7-this.pastdays;

		
		//构造html结构
		this.pregnancyStructure();
		//绑定滑动事件
		this.move();
		//绑定天数的点击事件
		this.liClick();
	}

	//构建html结构
	Pregnancy.prototype.pregnancyStructure=function(){
		//父节点部分
		var parentNode=document.getElementById(this.id);
		var parentNodeStyle={
			position:"relative",
			width:"100%",
		};
		this.addStyle(parentNode,parentNodeStyle);

		//头部部分
		this.headNode=document.createElement("div");
		var headStyle={
			"width": "100%",
			"height": "30px",
			"font": '16px/30px "微软雅黑"',
			"margin-top": "20px",
			"overflow": "hidden"
		};
		this.addStyle(this.headNode,headStyle);
		this.headNode.innerHTML='<p style="float: left; padding: 0 5px; margin-left: 5px;">第<span>'+this.weeks+'/40</span>周</p><p style="float: right; background: #59AEFF; border-radius: 15px 0px 0px 15px; padding: 0 15px; color: white;">今天</p>';
		this.headNode.lastChild.setAttribute("fanhui","fanhui");
		parentNode.appendChild(this.headNode);

		//进度条部分
		this.progressNode=document.createElement("div");
		var progressStyle={
			"width": "96%",
			"height": "10px",
			"background": "#ccc",
			"margin-top": "10px",
			"margin-left": "2%",
			"border-radius": "5px"
		};
		this.addStyle(this.progressNode,progressStyle);
		this.progressNode.innerHTML='<div style="height: 100%; background: -webkit-linear-gradient(left, #FF5EA2, #FF9351); border-radius: 5px;"></div>';
		this.progressNode.firstChild.style.width=parseInt(this.weeks/40*100)+"%";
		parentNode.appendChild(this.progressNode);

		//日期显示部分
		this.dateNode=document.createElement("div");
		this.dateNode.innerHTML=this.nowDate.getFullYear()+"-"+(this.nowDate.getMonth()+1)+"-"+this.nowDate.getDate();
		var dateStyle={
			"height": "30px",
			"width":"100%",
			"font": "bold 18px/40px ''",
			"text-align": "center",
			"color": "#999"
		}
		this.addStyle(this.dateNode,dateStyle);
		parentNode.appendChild(this.dateNode);


		//时间部分
		this.arrowContainNode=document.createElement("div");
		var arrowStyle={
			"overflow": "hidden"
		}
		this.addStyle(this.arrowContainNode,arrowStyle);
		
		var leftArrow=document.createElement("div");
		leftArrow.innerHTML="<";
		var leftStyle={
			"font": "bold 20px/80px ''",
			"float": "left",
			"width": "8%",
			"height": "100%",
			"text-align": "center"
		}
		this.addStyle(leftArrow,leftStyle);
		this.arrowContainNode.appendChild(leftArrow);

		this.containNode=document.createElement("div");
		var containStyle={
			"width": "84%",
			"height": "80px",
			"position": "relative",
			"overflow": "hidden",
			"float": "left"
		}
		this.addStyle(this.containNode,containStyle);
		this.containNode.innerHTML='<ul class="pregnancy-detail" id="pregnancy-detail" style="right: 0; top: 0;"></ul>'
		this.moveNode=this.containNode.firstChild;
		this.moveNode.style.width=this.clientWidth*0.84/7*(this.pastdays+this.futuredays)+"px";
		//过去的时间
		for(var i=this.pastdays; i>0; i--){
			var liNode=document.createElement("li");
			liNode.setAttribute("class", "pregnancy-days");
			liNode.innerHTML='<p class="pregnancy-date"></p><p class="pregnancy-zhou"></p>';
			if(i==1){
				this.changeClass(liNode,"pregnancy-active","add");
				var midDate=this.nowDate;
			}else{
				this.changeClass(liNode,"pregnancy-past","add");
				var midDate=new Date();
				midDate.setTime(this.nowDate.getTime()-this.daytimes*(i-1));
			}
			liNode.firstChild.innerHTML=midDate.getDate();
			liNode.lastChild.innerHTML=this.getWeekday(midDate.getDay());
			liNode.style.width=this.clientWidth*0.84/7+"px";
			liNode.setAttribute("timeStamp",midDate.getTime());
			
			this.moveNode.appendChild(liNode);
		}
		//将来的时间
		for(var j=0; j<this.futuredays; j++){
			var liNode=document.createElement("li");
			liNode.setAttribute("class", "pregnancy-days");
			liNode.innerHTML='<p class="pregnancy-date"></p><p class="pregnancy-zhou"></p>';
			this.changeClass(liNode,"pregnancy-future","add");
			var midDate=new Date();
			midDate.setTime(this.nowDate.getTime()+this.daytimes*(j+1));
			liNode.firstChild.innerHTML=midDate.getDate();
			liNode.lastChild.innerHTML=this.getWeekday(midDate.getDay());
			liNode.style.width=this.clientWidth*0.84/7+"px";
			

			this.moveNode.appendChild(liNode);
		}
		this.arrowContainNode.appendChild(this.containNode);

		var rightArrow=document.createElement("div");
		rightArrow.innerHTML=">";
		var rightStyle={
			"font": "bold 20px/80px ''",
			"float": "right",
			"width": "8%",
			"height": "100%",
			"text-align": "center"
		}
		this.addStyle(rightArrow,rightStyle);
		this.arrowContainNode.appendChild(rightArrow);

		parentNode.appendChild(this.arrowContainNode);
	}

	//控制时间滑动
	Pregnancy.prototype.move=function(){
		var that=this;
		//时间绑定touchstart事件
		this.moveNode.addEventListener("touchstart",moveStart,false);
		function moveStart(e){
			var e=e||window.event;
			clearInterval(this.partTime);
			that.startX=e.targetTouches[0].clientX;
			that.startY=e.targetTouches[0].clientY;
			//时间绑定touchmove事件
			that.moveNode.addEventListener("touchmove",moving,false);
			var moveBol=false;
			var moveNum=parseInt(that.moveNode.style.right);
			function moving(e){
				var e=e||window.event;
				e.preventDefault();
				moveBol=true;
				that.moveX=e.targetTouches[0].clientX;
				that.moveY=e.targetTouches[0].clientY;
				var transX=that.moveX-that.startX;
				var transY=that.moveY-that.startY;
				isScrolling = Math.abs(transX) < Math.abs(transY) ? 1:0; //isScrolling为1时，表示纵向滑动，0为横向滑动
				if(isScrolling==1){
					// e.preventDefault();
				}else{
					that.moveDis=moveNum-transX;
					// if(that.moveDis>=0){
					// 	that.moveDis=0;
					// }
					that.moveNode.style.right=that.moveDis+"px";
				}
			}
			//时间绑定touchend事件
			that.moveNode.addEventListener("touchend",moveEnd,false);
			function moveEnd(e){
				var e=e||window.event;
				that.moveNode.removeEventListener("touchmove",moving);
				that.moveNode.removeEventListener("touchend",moveEnd);
				if(moveBol){
					if(Math.abs(that.moveX-that.startX)>that.clientWidth*0.84*0.4){
						if(that.moveX>that.startX&&that.pages>1){
							that.pages-=1;
						}else if(that.moveX<that.startX&&that.pages<that.weeks){
							that.pages+=1;
						}
						that.headNode.firstChild.firstChild.nextSibling.innerHTML=that.pages+"/40";
						that.progressNode.firstChild.style.width=parseInt(that.pages/40*100)+"%";
					}
					that.movePart(that.moveDis,-(that.weeks-that.pages)*that.clientWidth*0.84,10,that.moveNode,"right");	
					that.moveDis=-(that.weeks-that.pages)*that.clientWidth*0.84;

					
				}
			}
		}
		

	}

	//添加样式属性
	Pregnancy.prototype.getWeekday=function(num){
		if(num==0){
			return "周日"
		}else if(num==1){
			return "周一"
		}else if(num==2){
			return "周二"
		}else if(num==3){
			return "周三"
		}else if(num==4){
			return "周四"
		}else if(num==5){
			return "周五"
		}else if(num==6){
			return "周六"
		}
	}

	//添加样式属性
	Pregnancy.prototype.addStyle=function(obj,style){
		for( var i in style){
		   obj.style[i]=style[i];
		};
	}

	//标签类名的增删
	Pregnancy.prototype.changeClass=function(obj,className,type,newName){
		var classVal = obj.getAttribute("class");
		if(type=="del"){
			//删除的话
			classVal = classVal.replace(className,"");
			obj.setAttribute("class",classVal );
		}else if(type=="add"){
			//添加的话
			if(classVal.indexOf(className)<0){
				classVal = classVal.concat(" "+className);
			}
			obj.setAttribute("class",classVal );
		}else if(type=="change"){
			//替换的话
			if(classVal.indexOf(className)>=0){
				classVal = classVal.replace(className,newName);
				obj.setAttribute("class",classVal );
			}
		}
	}

	//滑动停止后的局部滑动
	Pregnancy.prototype.movePart=function(start,end,stepNum,obj,attr,fn){
		var that=this;
		clearInterval(this.partTime);
		if (end!=start){
			var step = (end-start)/stepNum;
			this.partTime = setInterval(function(){
				start += step;
				if(start<=end&&step<0){
					clearInterval(that.partTime);
					start = end;
					if(fn){
						fn();
					}
				}else if(start>=end&&step>0){
					clearInterval(that.partTime);
					start = end;
					if(fn){
						fn();
					}
				}
				obj.style[attr] = start + "px";
			},20)
		}
		
	}

	//单个点击事件
	Pregnancy.prototype.liClick=function(){
		
		var that=this;
		var parentNode=document.getElementById(this.id);
		parentNode.addEventListener("click",function(e){
			var e = e || window.event;
         	var t = e.target || e.srcElement;

         	//给每个单独的日期添加点击事件
         	(function(){
         	    var target;
	         	if(t.tagName=="LI"){
	         		target=t;
	         	}else if(t.tagName=="P"){
	         		target=t.parentNode;
	         	}
	         	if(target&&target.getAttribute("timeStamp")){
	         		that.changeClass(target,"pregnancy-past","change","pregnancy-active");
	         		var nodeList=that.containNode.firstChild.childNodes;
	         		for(var i=0; i<that.pastdays; i++){
	         			var cValue=nodeList[i].getAttribute("class");
	         			if(cValue.indexOf("pregnancy-active")>=0){
	         				that.changeClass(nodeList[i],"pregnancy-active","change","pregnancy-past");
	         			}
	         		}
	         		that.changeClass(target,"pregnancy-past","change","pregnancy-active");
	         		var chooseDate=new Date();
	         		var time=parseInt(target.getAttribute("timeStamp"));
	         		chooseDate.setTime(time);
	         		if(that.nowDate.getTime()==time){
	         			that.headNode.lastChild.innerHTML="今天";
	         		}else{
	         			that.headNode.lastChild.innerHTML="返回今天";
	         		}
	         		that.dateNode.innerHTML=chooseDate.getFullYear()+"-"+(chooseDate.getMonth()+1)+"-"+chooseDate.getDate();

	         		that.pickDate=chooseDate;

	         		//触发点击事件
	         		if(that.fn){
	         			that.fn();
	         		}
	         	}     		
         	})();

         	//给返回今天添加点击事件
         	(function(){
         	     var target;
         	     if(t.getAttribute("fanhui")=="fanhui"){
         	     	target=t;
         	     }
         	     if(target&&target.innerHTML=="返回今天"){
         	     	//初始化位置
         	     	that.moveNode.style.right=0+"px";
         	 		
         	     	//初始化类名
         	     	var nodeList=that.containNode.firstChild.childNodes;
	         		for(var i=0; i<that.pastdays; i++){
	         			var cValue=nodeList[i].getAttribute("class");
	         			if(cValue.indexOf("pregnancy-active")>=0){
	         				that.changeClass(nodeList[i],"pregnancy-active","change","pregnancy-past");
	         			}
	         		}
	         		that.changeClass(nodeList[that.pastdays-1],"pregnancy-past","change","pregnancy-active");
	         		//初始化进度条
	         		that.progressNode.firstChild.style.width=parseInt(that.weeks/40*100)+"%";
	         		//初始化头部显示
	         		that.headNode.lastChild.innerHTML="今天";
	         		that.headNode.firstChild.firstChild.nextSibling.innerHTML=that.weeks+"/40";
	         		//显示的日期初始化
	         		that.dateNode.innerHTML=that.nowDate.getFullYear()+"-"+(that.nowDate.getMonth()+1)+"-"+that.nowDate.getDate();
	         		//初始化页面页数
	         		that.pages=that.weeks;
	         		//初始化选择的天数
	         		that.pickDate=that.nowDate;

	         		//触发点击事件
	         		if(that.fn){
	         			that.fn();
	         		}
         	     }
         	})();

         	// //给左右箭头添加点击事件
         	// (function(){
         	//     var target; 
         	//     console.log(t.innerHTML);
         	//     if(t.innerHTML=="&gt;"||t.innerHTML=="&lt;"){
         	//     	target=t;
         	//     }
         	//     if(target&&target.innerHTML=="&lt;"){
         	//     	that.movePart(-(that.weeks-that.pages)*that.clientWidth*0.84,-(that.weeks-that.pages+1)*that.clientWidth*0.84,10,that.moveNode,"right");
         	//     	that.pages-=1;
         	//     }  		
         	// })();


		},false)

	}

	if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		module.exports = Pregnancy;
	}

	window.Pregnancy=Pregnancy;

})(window);

