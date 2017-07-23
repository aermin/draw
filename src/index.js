import React, {
    Component
} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Draw extends Component {
    constructor(props) {
        super(props);

        this.state = {
            canClick: true, //抽奖点击次数
            nowHour: 0,
            i: 0, //位置序号
            j: 0,
            f: 3, //快速转的圈数    可自定义
            s: 1, //慢速转的圈数    可自定义
            x: 0,
            aa: false,
            num: 2, //最终的停止位置序号，可根据后台给数据来定义  (怪不得我都抽不到奖=  =)
            step: 1, //当前位置
            fastSpeed: 100, //快速转的速度
            slowSpeed: 500, //慢速转的速度
            //  open:  true,  //控制抽奖按钮只能点击一次
            slowTurn: false ,//控制慢速转
            currentZoneDate:0
        }
    }

    componentDidMount() {
        let that = this;
        var zoneOffset = 8;
        //算出时差,并转换为毫秒：
        var offset2 = new Date().getTimezoneOffset() * 60 * 1000;
        //算出现在的时间：
        var nowDate2 = new Date().getTime();
        //此时东8区的时间
        var currentZoneDate = new Date(nowDate2 + offset2 + zoneOffset * 60 * 60 * 1000);
        var timeStamp =currentZoneDate.getTime()   
        console.log(timeStamp+'东八区当前时间')
        var nowHour = currentZoneDate.getHours();
        console.log(nowHour+'当前时数')
        that.setState({
            nowHour: nowHour,
            timeStamp:timeStamp
        })
        this.refs._end.innerHTML = this.refs._begin.innerHTML;
        //    console.log(this.refs._begin);
        that.moveWord();
    }

    moveWord() {
        var speed = 30;
        let that = this; //少了这个的话  下面的this会出问题    趁此机会搞清楚this指向
        function Marquee() {
            if (that.refs._end.offsetWidth - that.refs._div.scrollLeft <= 0) {
                that.refs._div.scrollLeft -= that.refs._end.offsetWidth;
            } else {
                that.refs._div.scrollLeft++
            }
        }
        setInterval(Marquee, speed);
    }

    //点击开始
    drawClick() {
        let that = this;
        that._hasDraw()
        if (that.state.timeStamp  > localStorage.thedayZero) {
            window.localStorage.clear();
        }
    }

    //已抽奖？
    _hasDraw() {
        let that = this;
        let nowHour = that.state.nowHour;
        let canClick = that.state.canClick
        console.log(canClick + '已抽奖？')
        if (!localStorage.checkClick) {
            localStorage.setItem('checkClick', canClick)
            var checkClick = localStorage.checkClick;
            if (nowHour < 16 || nowHour >= 17) {
                localStorage.removeItem('checkClick')
                console.log('checkClick');
            }
            that._early();
            //实际运用中应使用服务器的时间戳
            let todayZero = new Date(new Date( /*serverTime*/ ).toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000; //当日零点时间戳
            console.log(todayZero + '当日零点时间戳');
            that.bbc(todayZero);

        } else {
            alert('每天只有1次抽奖机会，记得明天再来哦！')
        }
    }


    bbc(s) {
        localStorage.setItem('thedayZero', s);
    }


    //时 间早于16点？
    _early() {
        let that = this;
        let nowHour = that.state.nowHour;
        if (nowHour >= 16) {
            that._later()
        } else {
            alert('每天16点开始抽奖，不要着急哦！')
        }
    }
    //时间晚于17点？
    _later() {
        let that = this;
        let nowHour = that.state.nowHour;
        let speed = that.state.fastSpeed;
        if (nowHour < 17) {
            var timer = setInterval(function () {
                that.fastTurn(timer)
            }, speed) //快速转的速度 可自定义 
            that.fastTurn(timer);
        } else {
            alert('每天16:00-17:00开启抽奖活动，请明天记得早一点来哦！')
        }
    }

    //快速转
    fastTurn(argument) {
        let that = this;
        let i = that.state.i; //位置序号
        let j = that.state.j;
        let f = that.state.f; //快速转的圈数  可自定义
        let speed = that.state.slowSpeed;

        i++;
        that.setState({
            step: i
        })
        //快速转的圈数累加
        if (i > 7) {
            j = j + 1;
            if (j > f) {
                clearInterval(argument); //停止快速转
                that.setState({
                    slowTurn: true //启动慢速转
                })
            }
            that.setState({
                j: j
            })
        }
        i = i % 8;
        console.log(i);
        that.setState({
            i: i
        })
        if (that.state.slowTurn) {
            //       console.log(that.state.slowTurn)
            // 慢速转设置
            var slowtimer = setInterval(function () {
                that.slowTurn(slowtimer)
            }, speed)
        }
    }
    // 慢速转
    slowTurn(argument) {
        let that = this;
        let i = that.state.i; //位置序号
        let s = that.state.s; //慢速转的圈数  可自定义
        let x = that.state.x;
        let num = that.state.num; //最终的停止位置序号，可根据后台给数据来定义 (怪不得我都抽不到奖= =)
        i++;
        // console.log(i);
        that.setState({
            step: i
        })
        //慢速转的圈数累加
        if (i > 7) {
            x = x + 1;
            that.setState({
                x: x
            })
        }
        if (x === s && i === num) {
            clearInterval(argument); //停止转动
        }
        i = i % 8;
        that.setState({
            i: i
        })
    }

    render() {
            const step = this.state.step;
            return (
                <div>
    <div className="demo">
    <table>
        <tbody>   
      <tr>
        <td className={step ===1? "active":"hidden"}>1</td>
        <td className={step ===2? "active":"hidden"}>2</td>
        <td className={step ===3? "active":"hidden"}>3</td>
      </tr>
      <tr>
        <td className={step ===8? "active":"hidden"}>8</td>
        <td className="draw"><button onClick={this.drawClick.bind(this)}>点击抽奖</button></td>
        <td className={step ===4? "active":"hidden"}>4</td>
      </tr>
      <tr>
        <td className={step ===7? "active":"hidden"}>7</td>
        <td className={step ===6? "active":"hidden"}>6</td>
        <td className={step ===5? "active":"hidden"}>5</td>
      </tr>
            </tbody>
    </table>
  </div>


<div className="scroll_div"  ref="_div"> 

  <div className="scroll_begin" ref="_begin">
<span>恭喜用户 <i>24719295</i> 获得 <i>1元红包</i></span>
<span>恭喜用户 <i>25854501</i> 获得 <i>2元红包</i></span>
<span>恭喜用户 <i>24719295</i> 获得 <i>3元红包</i></span>
<span>恭喜用户 <i>25854501</i> 获得 <i>4元红包</i></span>
<span>恭喜用户 <i>24719295</i> 获得 <i>5元红包</i></span>
<span>恭喜用户 <i>25854501</i> 获得 <i>6元红包</i></span>
<span>恭喜用户 <i>24719295</i> 获得 <i>7元红包</i></span>
<span>恭喜用户 <i>25854501</i> 获得 <i>8元红包</i></span>
  </div> 

  <div className="scroll_end" ref="_end"></div>
 </div> 

  </div>
            );
    }
}

ReactDOM.render(
  <Draw />,
  document.getElementById('root')
    );