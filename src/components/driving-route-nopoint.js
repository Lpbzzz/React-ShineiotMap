/**
 * @file 驾车途径点组件组件
 * @author kyle(hinikai@gmail.com)
 */

import Component from './component';

export default class App extends Component {

    constructor(args) {
        super(args);
        this.state = {
        };
    }

    /**
     * 设置默认的props属性
     */
    static get defaultProps() {
        return {
        }
    }

    componentDidUpdate(prevProps) {
        this.initialize();
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        this.driving && this.driving.clearResults();
        this.driving = null;
    }

    initialize() {

        var map = this.props.map;
        if (!map) {
            return;
        }

        this.destroy();
        var markers = this.props.pointers;
        var pointList=[]
        for (var i=0;i<markers.length;i++){
            pointList.push(new BMap.Point(markers[i].lng,markers[i].lat))
        }

        var  group = Math.floor( pointList.length /11 ) ;
        var mode = pointList.length %11 ;
        // var startIcon=new BMap.Icon('http://img1.imgtn.bdimg.com/it/u=3044191397,2911599132&fm=27&gp=0.jpg', new BMap.Size(23,38));
        // var endIcon=new BMap.Icon('http://img1.imgtn.bdimg.com/it/u=3044191397,2911599132&fm=27&gp=0.jpg', new BMap.Size(23,38));
        // var wayPointIconHtml='<div style="position: absolute; margin: 0px; padding: 0px; width: 36px; height: 40px; overflow: hidden;"><img src="http://api0.map.bdimg.com/images/way-points.png" style="display: none; border:none;margin-left:-11px; margin-top:-35px; "></div>';

        if (!this.driving) {
            // var driving = this.driving = new BMap.DrivingRoute(map, {renderOptions:{
            //         map: map,
            //         policy: this.props.policy || BMAP_DRIVING_POLICY_LEAST_TIME,
            //         autoViewport: true,
            //
            //     }, onMarkersSet:function(res) {    //标注点完成回调
            //         console.info('res',res);
            //         //移除所有的标注点
            //         //var myStart = new BMap.Marker(start,{icon:startIcon});
            //         // map.removeOverlay(res[0].marker); //删除起点
            //         // // map.addOverlay(myStart);
            //         //
            //         // if(res.length>2){
            //         //     for (var i = 1; i < res.length-1; i++) {
            //         //         var wayPointIconHtml='<div style="position: absolute; margin: 0px; padding: 0px; width: 36px; height: 40px; overflow: hidden;"></div>'
            //         //         res[i].Om.Bc.innerHTML=wayPointIconHtml;
            //         //     }
            //         // }
            //         //
            //         // // var myEnd = new BMap.Marker(end,{icon:endIcon});
            //         // map.removeOverlay(res[res.length-1].marker);//删除终点
            //         // map.addOverlay(myEnd);
            //
            //
            //     },onSearchComplete:function(results) {
            //         // console.log("results",results);
            //         // console.log("this.driving",driving);
            //         if (driving.getStatus()==BMAP_STATUS_SUCCESS) {
            //             console.log("results",results);
            //             // var plan = this.driving.getResults().getPlan(0);
            //             // var num = plan.getNumRoutes();
            //             // for(var j =0;j<num ;j++){
            //             //     var pts= plan.getRoute(j).getPath();//通过驾车实例，获得一系列点的数组
            //             //     console.log("pts",pts)
            //             //     // var polyline = new BMap.Polyline(pts);
            //             //     // map.addOverlay(polyline);
            //             // }
            //         }
            // }},
            //
            // );
            var driving=this.driving = new BMap.DrivingRoute( map, {onSearchComplete: function(results){
                    if (driving.getStatus() == BMAP_STATUS_SUCCESS){
                        var plan = driving.getResults().getPlan(0);
                        var  num = plan.getNumRoutes();
                        for(var j =0;j<num ;j++){
                            var pts= plan.getRoute(j).getPath();
                            var polyline = new BMap.Polyline(pts);
                            map.addOverlay(polyline);
                        }
                    }
                }});
        }
        for(var i =0;i<group;i++){
            var waypoints = pointList.slice(i*11+1,(i+1)*11);
            this.driving.search(pointList[i*11], pointList[(i+1)*11-1],{waypoints:waypoints});//waypoints表示途经点
        }
        if( mode != 0){
            var waypoints = pointList.slice(group*11,pointList.length-1);//多出的一段单独进行search
            this.driving.search(pointList[group*11],pointList[pointList.length-1],{waypoints:waypoints});
        }

    }

}
