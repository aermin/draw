import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Draw extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,   //当前位置
            open: true,  //控制抽奖按钮只能点击一次
            slowTurn: false  //控制慢速转
        }
    }
    drawClick() {
        let that = this;
        if (that.state.open) {
            var i = 0;    //位置序号
            var j = 0;    
            var f = 3;    //快速转的圈数  可自定义
            var s = 1;   //慢速转的圈数  可自定义
            var x = 0;    
            var num = 2; //最终的停止位置序号，可根据后台给数据来定义 (怪不得我都抽不到奖= =)
            that.setState({
                open: false   //点击后关闭点击功能
            })
            //位置序号计算
            function count1() {
                i++;     
                rurning(i);
                //快速转的圈数累加
                if (i > 7) {
                    j = j + 1;
                    if (j > f) {  
                        clear(timer);  //停止快速转
                        that.setState({
                            slowTurn: true   //启动慢速转
                        })
                    }
                }
                i = i % 8;
                if (that.state.slowTurn) {
                    //       console.log(that.state.slowTurn)
                // 慢速转设置
                    var slowtimer = setInterval(function () {
                        count2()
                    }, 500)

                    function count2() {
                        i++;
                        rurning(i);
                        //慢速转的圈数累加
                        if (i > 7) {
                            x = x + 1;
                        }
                        if (x === s && i === num) { 
                            clear(slowtimer); //停止转动
                        }
                        i = i % 8;
                    }
                }
            }

            //快速转速度设置
            var timer = setInterval(function () {
                count1()
            }, 100)  //快速转的速度 可自定义

              //清除转动
            function clear(argument) {
                clearInterval(argument);
            } 

            function rurning() {
                console.log(i);
                that.setState({
                    step: i
                })
            }

        } else {
           alert("只能抽奖1次哦，刷新重试")
        }

    }

    render() {
        const {step} = this.state;
        return (
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
            );
    }
}

ReactDOM.render(
  <Draw />,
  document.getElementById('root')
    );