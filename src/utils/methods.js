import panzoom from "panzoom"; //引入缩放插件 npm install panzoom --save
import { GenNonDuplicateID } from "./unti"; //引入生成随机数

const methods = {
  //初始化jsplumb
  init() {
    //写入ready的方法在初始化后自动挂载执行，无需再次引用
    this.jsPlumb.ready(() => {
      // 导入默认配置
      this.jsPlumb.importDefaults(this.jsplumbSetting);
      //完成连线前的校验
      this.jsPlumb.bind("beforeDrop", evt => { 
        let res = () => { 
          return true;
        } //此处可以添加是否创建连接的校验， 返回 false 则不添加； 
        return res();
      })
      // 连线创建成功后，维护本地数据
      this.jsPlumb.bind("connection", evt => {
        this.addLine(evt);
      })
      //连线双击删除事件
      this.jsPlumb.bind("dblclick",(conn, originalEvent) => {
        // // console.log(1000);
        this.confirmDelLine(conn)
      })
      //连线单击事件
      this.jsPlumb.bind("click",(conn, originalEvent) => {})
     //连线变更---移动连线的操作
      this.jsPlumb.bind("connectionMoved", evt => {});
      //断开连线后，维护本地数据
      this.jsPlumb.bind("connectionDetached", evt => {
        this.deleLine(evt)
      })
      // 会使整个jsPlumb立即重绘。
      this.jsPlumb.setSuspendDrawing(false, true);
    });
    this.initPanZoom();
  },

  // 这个是给节点添加拖拽方法
  draggableNode(nodeId) {
    this.jsPlumb.draggable(nodeId, {
      containment: this.$refs.flowWrap,
      grid: this.commonGrid,
      drag: (params) => {
        this.alignForLine(nodeId, params.pos)
      },
      start: () => {
      },
      stop: (params) => {
        this.auxiliaryLine.isShowXLine = false
        this.auxiliaryLine.isShowYLine = false
        this.changeNodePosition(nodeId, params.pos)
      }
    })
  },
  //移动节点时，动态显示对齐线
  alignForLine(nodeId, position) {
    let showXLine = false, showYLine = false
    this.data.nodeList.some(el => {
      if(el.uid !== nodeId && el.left == position[0]+'px') {
        this.auxiliaryLinePos.x = position[0] + 50;
        showYLine = true
      }
      if(el.uid !== nodeId && el.top == position[1]+'px') {
        this.auxiliaryLinePos.y = position[1] + 12.5;
        showXLine = true
      }
    })
    this.auxiliaryLine.isShowYLine = showYLine
    this.auxiliaryLine.isShowXLine = showXLine
  },
  changeNodePosition(nodeId, pos) {
    this.data.nodeList.some(v => {
      if(nodeId == v.uid) {

          v.left = pos[0] +'px'
          v.top = pos[1] + 'px'

        
        return true
      }else {
        return false
      }
    })
  },

  // 左侧拖拽事件
  drag(dragData) {
    this.currentItem = dragData;
  },
  // 左侧拖拽结束事件
  drop(event) {
    const containerRect = this.$refs.flowWrap.getBoundingClientRect();
    const scale = this.getScale();
    const scrollX = window.scrollX || window.pageXOffset; // 水平滚动偏移
    const scrollY = window.scrollY || window.pageYOffset; // 垂直滚动偏移
    let left = (event.pageX - containerRect.left -50 + scrollX) / scale;
    let top = (event.pageY - containerRect.top -12.5 - scrollY) / scale;
    var temp = {
      ...this.currentItem,
      uid: GenNonDuplicateID(8),
      top: (Math.round(top/20))*20 + "px",
      left:  (Math.round(left/20))*20 + "px"
    };
    this.addNode(temp);
  },
  // 添加连线
  addLine(line) {
    let from = line.source.id;
    let to = line.target.id;
    this.data.lineList.push({
      from: from,
      to: to,
      label: "连线名称",
      uid: GenNonDuplicateID(8), //生成指定长度的唯一ID
      Remark: ""
    });
  },
  confirmDelLine(line) {
    this.$Modal.confirm({
      title: '删除连线',
      content: "<p>确认删除该连线？</p>",
      onOk: () => {
        this.jsPlumb.deleteConnection(line)
      }
    })
  },
  // 删除连线
  deleLine(line) {
    this.data.lineList.forEach((item, index) => {
      if(item.from === line.sourceId && item.to === line.targetId) {
        this.data.lineList.splice(index, 1)
      }
    })
  },
  // dragover默认事件就是不触发drag事件，取消默认事件后，才会触发drag事件
  allowDrop(event) {
    event.preventDefault();
  },
  getScale() {
    let scale1;
    if (this.jsPlumb.pan) {
      const { scale } = this.jsPlumb.pan.getTransform();
      scale1 = scale;
    } else {
      const matrix = window.getComputedStyle(this.jsPlumb.getContainer()).transform;
      // // console.log(4);
      scale1 = matrix.split(", ")[3] * 1;
    }
    this.jsPlumb.setZoom(scale1);
    return scale1;
  },
  // 添加新的节点
  addNode(temp) {
    this.data.nodeList.push(temp);
    //添加新的节点后，要重绘画布
    this.$nextTick(() => {
      this.jsPlumb.makeSource(temp.uid, this.jsplumbSourceOptions);
      this.jsPlumb.makeTarget(temp.uid, this.jsplumbTargetOptions);
      this.draggableNode(temp.uid);
    });
  },
  // 画布缩小
  initPanZoom() {
    const mainContainer = this.$refs.flowWrap;   
    const pan = panzoom(mainContainer, {
      smoothScroll: false,
      bounds: true,
      // autocenter: true,
      zoomDoubleClickSpeed: 1,
      minZoom: 0.5,
      maxZoom: 2,
      //设置滚动缩放的组合键，默认不需要组合键
      beforeWheel: (e) => { 
        let shouldIgnore = !e.ctrlKey
        return shouldIgnore
      },
      beforeMouseDown: function(e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = !e.ctrlKey;    
        return shouldIgnore;
      }
    });
    this.jsPlumb.pan = pan;
    const mainContainerWrap = mainContainer.parentNode;
  if (mainContainerWrap) {
    this.jsPlumb.mainContainerWrap = mainContainerWrap;
    // 设置鼠标样式
    mainContainerWrap.style.cursor = "default"; // 或其他适当的样式
  }
  //   // 缩放时设置jsPlumb的缩放比率
  //   pan.on("zoom", e => {
  //     const { x, y, scale } = e.getTransform();
  //     this.jsPlumb.setZoom(scale);
  //     //根据缩放比例，缩放对齐辅助线长度和位置
  //     this.auxiliaryLinePos.width = (1/scale) * 100 + '%'
  //     this.auxiliaryLinePos.height = (1/scale) * 100 + '%'
  //     this.auxiliaryLinePos.offsetX = -(x/scale)
  //     this.auxiliaryLinePos.offsetY = -(y/scale)
  //   });
  //   pan.on("panend", (e) => {
  //     const {x, y, scale} = e.getTransform();
  //     this.auxiliaryLinePos.width = (1/scale) * 100 + '%'
  //     this.auxiliaryLinePos.height = (1/scale) * 100 + '%'
  //     this.auxiliaryLinePos.offsetX = -(x/scale)
  //     this.auxiliaryLinePos.offsetY = -(y/scale)
  //   })
  //   const mainContainerWrap = mainContainer.parentNode
  //   if(mainContainerWrap)
  //   {
  //   this.jsPlumb.mainContainerWrap = mainContainerWrap;
  //   // 平移时设置鼠标样式
  //   mainContainerWrap.style.cursor = "grab";
  //   mainContainerWrap.addEventListener("mousedown", function wrapMousedown() {
  //     this.style.cursor = "grabbing";
  //     mainContainerWrap.addEventListener("mouseout", function wrapMouseout() {
  //       this.style.cursor = "grab";
  //     });
  //   });
  //   mainContainerWrap.addEventListener("mouseup", function wrapMouseup() {
  //     this.style.cursor = "grab";
  //   });
  // }
  }, 

  //删除节点
  deleteNode(node) {
    this.data.nodeList.some((v,index) => {
      if(v.uid === node.uid) {
        this.data.nodeList.splice(index, 1)
        this.jsPlumb.remove(v.uid)
        return true
      }else {
        return false
      }
    })
  },


  //更改连线状态
  changeLineState(nodeId, val) {
    // // console.log(val)
    let lines = this.jsPlumb.getAllConnections() // 这个返回当前画布内所有节点的元素
    // // console.log(lines, '元素')
    lines.forEach(line => {
      if(line.targetId === nodeId || line.sourceId === nodeId) {
        if(val) {
          line.canvas.classList.add('active')
        }else {
          line.canvas.classList.remove('active')
        }
      }
    })
  },

  //初始化节点位置  （以便对齐,居中）
  fixNodesPosition() {
    if(this.data.nodeList && this.$refs.flowWrap) {
      const nodeWidth = 100;
      const nodeHeight = 25;
      let wrapInfo = this.$refs.flowWrap.getBoundingClientRect();
      let maxLeft = 0, minLeft = wrapInfo.width, maxTop = 0, minTop = wrapInfo.height;
      let nodePoint = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
      let fixTop = 0, fixLeft = 0;
      this.data.nodeList.forEach(el => {
        let top = Number(el.top.substring(0, el.top.length -2));
        let left = Number(el.left.substring(0, el.left.length -2));
        
        maxLeft = left > maxLeft ? left : maxLeft
        minLeft = left < minLeft ? left : minLeft
        maxTop = top > maxTop ? top : maxTop
        minTop = top < minTop ? top : minTop
      })
      nodePoint.left = minLeft
      nodePoint.right = wrapInfo.width - maxLeft - nodeWidth
      nodePoint.top = minTop
      nodePoint.bottom = wrapInfo.height - maxTop - nodeHeight;

      fixTop = nodePoint.top !== nodePoint.bottom ? (nodePoint.bottom - nodePoint.top) / 2 : 0;
      fixLeft = nodePoint.left !== nodePoint.right ? (nodePoint.right - nodePoint.left) / 2 : 0;

      this.data.nodeList.map(el => {
        let top = Number(el.top.substring(0, el.top.length - 2)) + fixTop;
        let left = Number(el.left.substring(0, el.left.length - 2)) + fixLeft;
        el.top = (Math.round(top/20))* 20 + 'px'
        el.left = (Math.round(left/20))*20 + 'px'
      })
    }
  }, 
}

export default methods;