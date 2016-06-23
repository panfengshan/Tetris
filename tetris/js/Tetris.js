function $(id){
	return document.getElementById(id);
}
var tetris={
	CELL_SIZE:26,//每个格子img元素的固定宽高
	RN:20,//总行数
	CN:10,//总列数
	OFFSET:15,//游戏左边和上边需要修改正的距离

	NEXTTOP:1,//备胎图形输出时的top下移行数
	NEXTLEFT:10,//备胎图形输出时的left右移列数

	shape:null,//保存正在下落的主角图形
	nextShape:null,//保存等待下落的备胎图形

	INTERVAL:1000,//每次下落的时间间隔
	timer:null,//保存当前定时器的序号

	wall:[],//墙：所有不再下落的方块组成的数组

	lines:0,//游戏删除的总行数
	score:0,//游戏的分数
	SCORES:[0,10,50,80,200],
	level:1,//游戏的等级

	state:1,//保存游戏的状态
	RUNNING:1,//运行状态
	PAUSE:2,//暂停状态
	GAMEOVER:0,//游戏结束

	linesInc:5,//每5行一级
	intervalDec:200,//每级-200毫秒

	start:function(){
		this.INTERVAL=1000;//初始化interval
		this.state=this.RUNNING;//初始化游戏状态

		//初始游戏成绩
		this.lines=0;
		this.score=0;
		this.level=1;
		//初始化方块墙二维数组:RN行*CN列
		for(var r=0;r<this.RN;r++){
			this.wall[r]=new Array(this.CN);
		}
		this.shape=this.randomShape();//创建主角图形
		this.nextShape=this.randomShape();//创建备胎图形
		this.paint();
		this.timer=setInterval(
			this.moveDown.bind(this),
			this.INTERVAL
		);
		document.onkeydown=function(e){//this->document
			e=window.event||e;
			switch(e.keyCode){
				case 37:
					this.state==this.RUNNING&&
						this.moveLeft();
					break;//左
				case 38:
					this.state==this.RUNNING&&
						this.rotateR();
					break;//顺时针旋转
				case 39:
					this.state==this.RUNNING&&	
						this.moveRight();
					break;//右
				case 40:
					this.state==this.RUNNING&&	
						this.moveDown(); 
					break;//下
				case 90:
					this.state==this.RUNNING&&	
						this.rotateL();
					break;//逆时针旋转

				case 80://暂停
					this.state==this.RUNNING&&
						this.pause();
					break;
				case 81://结束
					this.state!=this.GAMEOVER&&
						this.gameOver();
					break;
				case 67://继续
					this.state==this.PAUSE&&
						this.myContinue();
					break;
				case 83://重新开始
					this.state==this.GAMEOVER&&
						this.start();
					break;
			}
		}.bind(this);
	},
	paintState:function(){//根据状态绘制前景图片
		//如果状态不是RUNNING时
		if(this.state!=this.RUNNING){
			//实例化img对象
			var img=new Image();
			//设置img的src属性，
			//	如果状态为pause，设为pause.png
			//			否则，设为game-over.png
			img.src=this.state==this.PAUSE?
					"img/pause.png":"img/game-over.png";
			//将img追加到id为pg的元素下
			$("pg").appendChild(img);
		}
	},
	pause:function(){
		//将当前游戏状态改为pause
		this.state=this.PAUSE;
		//停止周期性定时器
		clearInterval(this.timer);
		//重绘一切
		this.paint();
	},
	gameOver:function(){
		//将当前游戏状态改为gameOver
		this.state=this.GAMEOVER;
		//停止周期性定时器
		clearInterval(this.timer);
		//重绘一切
		this.paint();
	},
	myContinue:function(){
		this.state=this.RUNNING;
		this.timer=setInterval(
			this.moveDown.bind(this),
			this.INTERVAL
		);
		this.paint();
	},
	canRotate:function(){
		//遍历当前shape中每个格
		for(var i=0;i<this.shape.cells.length;i++){
		//	将当前格保存在cell中
			var cell=this.shape.cells[i];
		//	如果cell.r>RN-1或cell.c<0或cell.c>CN-1
			if(cell.r>this.RN-1
				||cell.c<0||cell.c>this.CN-1){
				return false;//		返回false
			}else if(cell.r<this.RN
				&&this.wall[cell.r][cell.c]){
			//	否则 如果wall中和当前cell相同位置有格
				return false;//		返回false
			}
		}//(遍历结束)返回true
		return true;
	},
	rotateR:function(){//专门顺时针旋转一次
		this.shape.rotateR();//this->shape
		if(!this.canRotate()){
			this.shape.rotateL();
		}
		this.paint();
	},
	rotateL:function(){//专门逆时针旋转一次
		this.shape.rotateL();//this->shape
		if(!this.canRotate()){
			this.shape.rotateR();
		}
		this.paint();
	},
	moveLeft:function(){//左移一列
		if(this.canLeft()){ 
			this.shape.moveLeft(); 
			this.paint();
		}
	},
	canLeft:function(){//判断能否左移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==0||this.wall[cell.r][cell.c-1]){
				return false;
			}
		}
		return true;
	},
	moveRight:function(){//右移一列
		if(this.canRight()){
			this.shape.moveRight();
			this.paint();
		}
	},
	canRight:function(){//判断能否右移
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1
				||this.wall[cell.r][cell.c+1]){
				return false;
			}
		}
		return true;
	},
	randomShape:function(){//随机选择一个图形生成
		//0-2之间生成随机数n
		var n=parseInt(Math.random()*3);
		//判断n
		switch(n){
		//	如果是0，就返回T;
			case 0: return new T();break;
		//  如果是1，就返回O;
			case 1: return new O();break;
		//  如果是2，就返回I;
			case 2: return new I();break;
		}
	},
	paint:function(){//调用所有paintXXX方法，绘制一切
	    $("pg").innerHTML=//删除id为pg下的所有img元素
			$("pg").innerHTML.replace(/<img(.*?)>/g,"");
		this.paintShape();
		this.paintNext();
		this.paintWall();
		this.paintScore();
		this.paintState();
	},
	paintShape:function(){//向游戏界面中添加图形的img元素
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历主角图形的cells集合
		for(var i=0;i<this.shape.cells.length;i++){
		//  将当前格子对象，保存在变量cell中
			var cell=this.shape.cells[i];
		//	new一个Image元素,保存在img中
			var img=new Image();
		//	设置img的top：OFFSET+cell的r*CELL_SIZE
			img.style.top=
				this.OFFSET+cell.r*this.CELL_SIZE+"px";
		//  设置img的left: OFFSET+cell的c*CELL_SIZE
			img.style.left=
				this.OFFSET+cell.c*this.CELL_SIZE+"px";
		//	设置img的src: cell的img属性
			img.src=cell.img;
		//	将img追加到frag中
			frag.appendChild(img);
		}//(遍历结束后)
		//将frag追加到id为pg的元素下
		$("pg").appendChild(frag);
	},
	paintNext:function(){//绘制备胎图形
		var frag=document.createDocumentFragment();
		for(var i=0;i<this.nextShape.cells.length;i++){
			var cell=this.nextShape.cells[i];
			var img=new Image();
			img.style.top=
				this.OFFSET
				+(cell.r+this.NEXTTOP)*this.CELL_SIZE
				+"px";
			img.style.left=
				this.OFFSET
				+(cell.c+this.NEXTLEFT)*this.CELL_SIZE
				+"px";
			img.src=cell.img;
			frag.appendChild(img);
		}
		$("pg").appendChild(frag);
	},
	paintWall:function(){//午间作业：绘制墙的方法
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历wall中所有格(二维数组)
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
		//	先将当前格存在变量cell中
				var cell=this.wall[r][c];
		//	如果cell有效
				if(cell){
		//		绘制每个cell的方法同绘制shape的方法
					var img=new Image();
					img.style.top=
						this.OFFSET
						+(cell.r)*this.CELL_SIZE
						+"px";
					img.style.left=
						this.OFFSET
						+(cell.c)*this.CELL_SIZE
						+"px";
					img.src=cell.img;
					frag.appendChild(img);
				}
			}
		}//(遍历结束)将frag追加到id为pg的元素中
		$("pg").appendChild(frag);
	},
	moveDown:function(){//将图形下落一格
		if(this.canDown()){
			this.shape.moveDown();//this->shape
			this.paint();
		}else{//不能下落
			//将shape中的格，放入墙中相同位置
			this.landIntoWall();
			//删除行，同时将ls累加到总行数lines
			var ls=this.deleteRows();//返回本次消除的行数
			this.lines+=ls;
			//根据删除的行数，累加得分
			this.score+=this.SCORES[ls];

			this.levelInc();//判断并升级
			
			if(!this.isGameOver()){
				//备胎转正
				this.shape=this.nextShape;
				//生成新备胎
				this.nextShape=this.randomShape();
				this.paint();
			}else{
				this.gameOver();
			}
		}
	},
	levelInc:function(){//判断并升级，以及加速
		if(parseInt(this.lines/this.linesInc)
			>this.level-1){
			this.level++;
			this.INTERVAL-=this.intervalDec;
			clearInterval(this.timer);
			this.timer=setInterval(
				this.moveDown.bind(this),
				this.INTERVAL
			);
		}
	},
	isGameOver:function(){//专门判断游戏是否结束
		//遍历nextShape中每个格
		for(var i=0;i<this.nextShape.cells.length;i++){
		//	将当前格存在cell中
			var cell=this.nextShape.cells[i];
		//	如果wall中已经存在和当前格相同位置的格
			if(this.wall[cell.r][cell.c]){
				return true;//		返回true
			}
		}//(遍历结束)返回false
		return false;
	},
	paintScore:function(){//专门负责更新成绩
		//将id为score的span的内容设置为score
		$("score").innerHTML=this.score;
		//将id为lines的span的内容设置为lines
		$("lines").innerHTML=this.lines;
		//将id为level的span的内容设置为level
		$("level").innerHTML=this.level;
	},
	deleteRows:function(){//
		//自底向上遍历wall中每一行，同声明变量ls=0
		for(var r=this.RN-1,ls=0;r>0;r--){
			if(this.isFullRow(r)){//如果当前行满格
				this.deleteRow(r);//删除当前行
				ls++;
				r++;//***让r留在原地
				//如果ls==4，就退出循环
				if(ls==4){break;}
			}
		}//(遍历结束)返回ls 表示本次共删除ls行
		return ls;
	},
	isFullRow:function(r){//检查第r行是否满格
		//将wall中r行转为字符串，保存在str中
		//如果str中有^, 或 ,, 或 ,$，就返回false
		//否则 返回true
		return String(this.wall[r])
				.search(/^,|,,|,$/)==-1?true:false;
	},
	deleteRow:function(currR){//删除一行并下移上方剩余行
		//r从currR行开始向上遍历剩余所有行
		for(var r=currR;r>0;r--){
			//用wall中r-1行替换r行
			this.wall[r]=this.wall[r-1];
			//将r-1行设置为new Array(this.CN)
			this.wall[r-1]=new Array(this.CN);
			//遍历r行中每个格
			for(var i=0;i<this.CN;i++){
			//	如果当前格有效
			//		才将当前格的r++
				this.wall[r][i]&&this.wall[r][i].r++;
			}//(遍历结束)
			//如果r-2行无缝拼接的结果为""，就退出循环
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	landIntoWall:function(){//将shape的格放入墙中相同位置
		//遍历shape中的每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
			//	将当前cell放入wall中，相同r行c列的元素中
			this.wall[cell.r][cell.c]=cell;
		}
	},
	canDown:function(){//判断是否可以下落
		//遍历主角图形中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			var cell=this.shape.cells[i];
		//	只要当前cell的r=RN-1
		//		或墙中，shape中当前格的下一行有格
		//		就返回false
			if(cell.r==this.RN-1
				||this.wall[cell.r+1][cell.c]){
				return false;
			}
		}//(遍历结束)返回true
		return true;
	},
}
window.onload=function(){ tetris.start(); }