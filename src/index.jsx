import React,{Fragment} from "react"
import ReactDOM from "react-dom"
import Nouislider from 'react-nouislider'
import "./nonslider.css"
import "./Calendar.css"
import 'bootstrap/dist/css/bootstrap.css'
import { Z_ASCII } from "zlib"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import PlanSlider from "./PlanSlider.jsx"
import ChoiceWeek from "./ChoiceWeek.jsx"
import DragDropTable from "./DragDropTable.jsx"
import ChangeMonth from "./ChangeMonth.jsx"

//メインファイル
class Calendar extends React.Component{
    //初期化
    constructor(props){
        super(props);
        //今の年の取得
        const todayYear = new Date().getFullYear();
        //今の月の取得
        const todayMonth = new Date().getMonth() + 1;
        //今日の日付の取得
        const today = new Date().getDate()
        //表示するカレンダーの日にちを取得
        this.calendar = this.createCalender(todayYear,todayMonth);
        //現在の年月日、選択している週、予定の配列
        this.state = {
            year: todayYear,
            month: todayMonth,
            day: today,
            choiceWeek: this.calendar[Math.ceil(today/7) - 1],
            plans: [],
        };
        //bindしてthisを代入
        this.changeMonth = this.changeMonth.bind(this);
        this.changeWeekandDay = this.changeWeekandDay.bind(this);
        this.addPlanContent = this.addPlanContent.bind(this);
    }
    //表示する月日を変更するメソッド
    changeMonth(changeNum){
        //前の月か次の月かchangeNumで調整
        const nextMonth = this.state.month + changeNum;
        const nextYear = this.state.year + changeNum;
        //年が変化する場合の処理
        if(12<nextMonth){
            this.setState({month:1});
            this.setState({year: nextYear});
        } else if(nextMonth < 1){
            this.setState({month: 12});
            this.setState({year: nextYear});
        } else {
            this.setState({month: nextMonth});
        }
    }
    //カレンダーをクリックすると週の変更が行われるメソッド
    changeWeekandDay(choiceDay){
        this.calendar.map(week =>{
            console.log(choiceDay); 
            if(week.includes(parseInt(choiceDay))){

                this.setState({choiceWeek: week});
            }
        });
        this.setState({day: choiceDay});
    }
    //planをカレンダー上に入れるためのメソッド(onClick)
    addPlanContent(newPlans){
        //plansをthis.state.plansでsetState
        this.setState({
            plans: newPlans
        });
    }

    //カレンダーを作成するメソッド
    createCalender(year, month){
        //前の月の一番初めの曜日取得
        const firstDay = new Date(year, month - 1, 1).getDay();
        //今月の日数
        const lastDay = new Date(year, month, 0).getDate();
        //曜日がその月の曜日より小さい場合とその月の最後の曜日より大きい場合にカレンダーには日付を表示しない
        return [0,1,2,3,4].map(weekNum => {
            return [0,1,2,3,4,5,6].map(dayNum =>{
                const day = dayNum + 1 + weekNum * 7;
                if(day - 1 < firstDay || lastDay < day - firstDay){
                    return null;
                }else{
                    return day - firstDay;
                }
            });
        });
    }

    render(){
        //setStateした際にもう一度カレンダーを作り直す
        this.calendar = this.createCalender(this.state.year,this.state.month);
        return (
            <Fragment>
                <div className={"container1"}>   
                    <ChangeMonth
                        changeMonth={this.changeMonth}
                        year={this.state.year}
                        month={this.state.month}
                    />
                    <DragDropTable
                        calendar={this.calendar}
                        plans={this.state.plans}
                        year={this.state.year}
                        month={this.state.month}
                        day={this.state.day}
                        changeWeekandDay={this.changeWeekandDay}
                        addPlanContent={this.addPlanContent}
                    />
                </div>
                <div className={"container2"}>
                    <ChoiceWeek
                        choiceWeek={this.state.choiceWeek}
                        addPlanContent={this.addPlanContent}
                        plans={this.state.plans}
                        year={this.state.year}
                        month={this.state.month}
                    />
                    <PlanSlider
                        plans={this.state.plans}
                        year={this.state.year}
                        month={this.state.month}
                        day={this.state.day}
                        addPlanContent={this.addPlanContent}
                    />
                </div>
            </Fragment>
        );
    }
}

ReactDOM.render(<Calendar />, document.getElementById('calendar'));
