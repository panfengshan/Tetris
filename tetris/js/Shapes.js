function Cell(r,c,img){//专门定义每个格子数据结构的类型
	this.r=r;//格子所在的行下标
	this.c=c;//格子所在的列下标
	this.img=img; //格子所用的图片
}
function Shape(cells,states,orgi){//专门定义所有图形的公共类型
	this.cells=cells;//保存图形对象中所有格子对象
	this.states=states;//保存图形对象的不同状态对象
	this.orgi=orgi;//保存当前图形参照格的下标
	this.statei=0;//保存当前使用状态的下标，默认都是状态0
}
//在Shape类型的原型中，集中定义所有图形共有的数据和方法
//专门保存每种图形的格子使用的图片路径
Shape.prototype.IMGS={
	I:"img/I.png",
	O:"img/O.png",
	T:"img/T.png"
};
Shape.prototype.moveDown=function(){//当前图形下落一格
	//this指当前调用moveDown方法的shape对象
	//遍历当前图形的每个格
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].r+=1;//	将每个格的r+=1
	}
};
Shape.prototype.moveLeft=function(){//当前图形左移一格
	//遍历当前图形的每个格
	//	将每个格的c-1
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c-=1;
	}
};
Shape.prototype.moveRight=function(){//当前图形右移一格
	//遍历当前图形的每个格
	//	将每个格的c+1
	for(var i=0;i<this.cells.length;i++){
		this.cells[i].c+=1;
	}
};
Shape.prototype.rotateR=function(){//shape.rotateR();
	//this->shape
	//将shape的statei+1
	this.statei+=1;
	//如果statei大于shape的states的长度-1，就让statei回0
	this.statei>this.states.length-1&&(this.statei=0);
	this.rotate();
}
Shape.prototype.rotateL=function(){//shape.rotateL();
	//this->shape
	//将shape的statei-1
	this.statei-=1;
	//如果statei小于0，就让statei回shape的states的长度-1
	this.statei<0&&(this.statei=this.states.length-1);
	this.rotate();
}
Shape.prototype.rotate=function(){
	//获得参照格对象: cells[orgi],保存在cell中
	//						        cell:{r:?, c:?}
	var cell=this.cells[this.orgi];
	//获得新状态对象: states[statei],保存在state中
	//	state:{r0:?,c0:?, r1:?,c1:?, ...}
	var state=this.states[this.statei];
	//遍历cells中所有格对象
	for(var i=0;i<this.cells.length;i++){
	//	当前格的r=cell.r+state["r"+i]
		this.cells[i].r=cell.r+state["r"+i];
	//  当前格的c=cell.c+state["c"+i]
		this.cells[i].c=cell.c+state["c"+i];
	}
}
//定义状态对象结构，描述所有状态。
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	this.r0=r0; this.r1=r1; this.r2=r2; this.r3=r3;
	this.c0=c0; this.c1=c1; this.c2=c2; this.c3=c3;
}

//创建具体图形类型,继承Shape类型结构以及原型对象：
function T(){//专门描述所有T型图形的数据结构
	Shape.call(this,[//this->正在创建的新对象
		new Cell(0,3,this.IMGS.T),//因为T类型继承了Shape
		new Cell(0,4,this.IMGS.T),
		new Cell(0,5,this.IMGS.T),
		new Cell(1,4,this.IMGS.T),
	],[
		new State(0,-1 , 0,0 , 0,+1 , +1,0),
		new State(-1,0 , 0,0 , +1,0 ,  0,-1),
	    new State(0,+1 , 0,0 , 0,-1 , -1,0),
	    new State(+1,0 , 0,0 , -1,0 , 0,+1)
	],1);
}
Object.setPrototypeOf(T.prototype,Shape.prototype);
function O(){//专门描述所有O型图形的数据结构
	Shape.call(this,[//this->正在创建的新对象
		new Cell(0,4,this.IMGS.O),//因为T类型继承了Shape
		new Cell(0,5,this.IMGS.O),
		new Cell(1,4,this.IMGS.O),
		new Cell(1,5,this.IMGS.O),
	],[
		new State(0,0 , 0,+1 , +1,0 , +1,+1)
	],0);
}
Object.setPrototypeOf(O.prototype,Shape.prototype);
function I(){//专门描述所有I型图形的数据结构
	Shape.call(this,[//this->正在创建的新对象
		new Cell(0,3,this.IMGS.I),//因为T类型继承了Shape
		new Cell(0,4,this.IMGS.I),
		new Cell(0,5,this.IMGS.I),
		new Cell(0,6,this.IMGS.I),
	],[
		new State(0,-1 , 0,0 , 0,+1 , 0,+2),
		new State(-1,0 , 0,0 , +1,0 , +2,0)
	],1);
}
Object.setPrototypeOf(I.prototype,Shape.prototype);

//J (0,3, 0,4, 0,5, 1,5)   orgi:1   4个状态
//L (0,3, 0,4, 0,5, 1,3)   orgi:1   4个状态  
//S (0,4, 0,5, 1,3, 1,4)   orgi:3   2个状态
//Z (0,3, 0,4, 1,4, 1,5)   orgi:2   2个状态