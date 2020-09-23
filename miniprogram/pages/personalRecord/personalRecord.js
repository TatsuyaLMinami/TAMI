
const app = getApp()
import apiKey from "../../utils/apiKey"
import { services, servicesArray } from "../../utils/services"
import champions from "../../utils/champions"
import queues from "../../utils/queues"
Page({
    data: {
        tableHidden: true,
        apiKey: apiKey,
        champions: champions,
        queues: queues,
        summonerName: "",
        region: "KR",
        servicesArray: servicesArray,
        services: services,
        index: 0,
        date: "",
        start: "2010-01-01",
        now: "",
        listData:[],
        accountId:"",
    },
    bindDateChange: function (e) {
        var that = this;
        this.setData({
            date: e.detail.value,
        })
        console.log(this.data.date);
    },
    bindPickerChange: function (e) {
        var that = this;
        this.setData({
            region: that.data.services[e.detail.value].value,
            index: e.detail.value,
        })
        console.log(this.data.region);
    },
    bindKeyInput: function (e) {
        this.setData({
            summonerName: e.detail.value
        })
    },
    getMatchDetail: function (e) {
        var gameId = e.currentTarget.dataset.id;
        var apiKey = this.data.apiKey; //api
        var that = this;
        var url = "https://" + this.data.region.toLowerCase() + ".api.riotgames.com/lol/match/v4/matches/" + gameId;
        wx.request({
            url: url,
            header: {
                "Content-Type": "application/json,application/json",
                "X-Riot-Token": apiKey,
            },
            success: function (res) {
                var data = res;
                wx.navigateTo({
                    url:"../matchDetail/matchDetail",
                    events: {
                        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                        // acceptDataFromOpenedPage: function(data) {
                        //   console.log(data)
                        // },
                        // someEvent: function(data) {
                        //   console.log(data)
                        // }
                      },
                      success: function(res) {
                        data.data.accountId = that.data.accountId
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', data.data)
                      }
                })
            }
        })
    },
    
    search: function () {
        var that = this;
        if (that.data.summonerName.trim() === "") {
            wx.showToast({
                "title": "请输入召唤师名称！",
                "icon": "none",
            });
            return;
        }
        wx.showToast({
            "title": "加载中",
            "icon": "loading",
            "duration": 2000
        });
        var apiKey = this.data.apiKey;; //api
        var url1 = "https://" + this.data.region.toLowerCase() + ".api.riotgames.com/tft/summoner/v1/summoners/by-name/" + this.data.summonerName + "?api_key=" + apiKey;
        wx.request({
            url: url1,
            header: {
                "Content-Type": "application/json,application/json",
                "X-Riot-Token": apiKey,
            },
            success: function (res) {
                var accountId = res.data.accountId;
                that.data.accountId = accountId;
                if (!accountId) {
                    wx.showToast({
                        "title": "没有此召唤师",
                        "icon": "none",
                        "duration": 2000
                    });
                    that.data.tableHidden = true;
                    return
                }
                var endTime = new Date(that.data.date).getTime() > new Date(that.data.now).getTime() ? new Date(that.data.now).getTime() : new Date(that.data.date).getTime();
                var beginTime = (endTime - 7 * 24 * 60 * 60 * 1000) < new Date("2010-01-01").getTime() ? new Date("2010-01-01").getTime() : (endTime - 7 * 24 * 60 * 60 * 1000);
                var url2 = "https://" + that.data.region.toLowerCase() + ".api.riotgames.com/lol/match/v4/matchlists/by-account/" + accountId + "?endTime=" + endTime + "&beginTime=" + beginTime;
                wx.request({
                    url: url2,
                    header: {
                        "Content-Type": "application/json,application/json",
                        "X-Riot-Token": apiKey,
                    },
                    success: function (res) {
                        console.log(res);
                        if (!res.data.matches) {
                            wx.showToast({
                                "title": "暂无数据",
                                "icon": "none",
                                "duration": 2000
                            });
                            that.setData({
                                listData: [],
                                tableHidden: true,
                            });
                            return
                        }
                        var matches = res.data.matches;
                        if (matches.length < 1) {
                            wx.showToast({
                                "title": "此期间没有对局",
                                "icon": "none",
                                "duration": 2000
                            });
                            that.setData({
                                listData: [],
                                tableHidden: true,
                            });
                            return
                        }
                        var champions = Object.values(that.data.champions);
                        var queues = that.data.queues;
                        var date = new Date();
                        for (let i = 0; i < matches.length; i++) {
                            for (let j = 0; j < champions.length; j++) {
                                if (champions[j].key == parseInt(matches[i].champion)) {
                                    matches[i].hero = champions[j].name;
                                    matches[i].heroImage = "http://ddragon.leagueoflegends.com/cdn/10.19.1/img/champion/" + champions[j].id + ".png";
                                    break;
                                }
                            }
                            for (let k = 0; k < queues.length; k++) {
                                if (queues[k].queueId === matches[i].queue) {
                                    matches[i].type = queues[k].description;
                                    break;
                                }
                            }
                            var time = date.getTime() - matches[i].timestamp;
                            if(Math.floor(time / 1000 / 60 / 60 / 24)<1){
                                matches[i].date = Math.floor(time / 1000 / 60 / 60) + "小时前";
                            }else if(Math.floor(time / 1000 / 60 / 60 / 24)>=1 && Math.floor(time / 1000 / 60 / 60 / 24)<7){
                                matches[i].date = Math.floor(time / 1000 / 60 / 60 / 24) + "天前";
                            }else if(Math.floor(time / 1000 / 60 / 60 / 24)>=7  && Math.floor(time / 1000 / 60 / 60 / 24)<365){
                                matches[i].date = Math.floor(time / 1000 / 60 / 60 / 24/7) + "星期前";
                            }else if(Math.floor(time / 1000 / 60 / 60 / 24)>=365){
                                matches[i].date = Math.floor(time / 1000 / 60 / 60 / 24/365) + "年前";
                            }
                            switch (matches[i].role, matches[i].lane) {
                                case "DUO_CARRY", "BOTTOM":
                                    matches[i].position = "ADC";
                                    break;
                                case "DUO", "NONE":
                                    matches[i].position = "辅助";
                                    break;
                                case "SOLO", "TOP":
                                    matches[i].position = "上单";
                                    break;
                                case "SOLO", "MID":
                                    matches[i].position = "中单";
                                    break;
                                case "DUO_CARRY", "TOP":
                                    matches[i].position = "上单";
                                    break;
                                case "DUO_SUPPORT", "BOTTOM":
                                    matches[i].position = "辅助";
                                    break;
                                case "DUO_SUPPORT", "NONE":
                                    matches[i].position = "辅助";
                                    break;
                                case "NONE", "JUNGLE":
                                    matches[i].position = "打野";
                                    break;
                                case "DUO", "MID":
                                    matches[i].position = "中单";
                                    break;
                                case "DUO_SUPPORT", "TOP":
                                    matches[i].position = "辅助";
                                    break;
                            }
                        }
                        that.setData({
                            listData: matches,
                            tableHidden: false,
                        });
                        //that.getMatchResult(matches,accountId);
                    }
                })
            }
        })
    },
    // getMatchResult :function(matches,accountId){
    //     var that = this;
    //     for (let j = 0; j < matches.length; j++) {
    //         console.log(matches[j]);
    //         var url = "https://" + that.data.region.toLowerCase() + ".api.riotgames.com/lol/match/v4/matches/" + matches[j].gameId;
    //         wx.request({
    //             url: url,
    //             header: {
    //                 "Content-Type": "application/json,application/json",
    //                 "X-Riot-Token": that.data.apiKey,
    //             },
    //             success: function (res) {
    //                 console.log(res);
    //                 if (!res.data) {
    //                     matches[j].result = "";
    //                 }
    //                 var participantIdentities = res.data.participantIdentities;
    //                 var participants = res.data.participants;
    //                 var participantId;
    //                 for (let m = 0; m < participantIdentities.length; m++) {
    //                     if (participantIdentities[m].player.accountId === accountId) {
    //                         participantId = participantIdentities[m].participantId;
    //                         break;
    //                     }
    //                 }
    //                 for (let n = 0; n < participants.length; n++) {
    //                     if (participants[n].participantId === participantId) {
    //                         matches[j].result = participants[n].stats.win == true ? "胜利" : "失败";
    //                         break;
    //                     }
    //                 }
    //             },
    //         })
    //         console.log(matches[j]);
    //     }
    //     console.log(that.data.listData,matches);
    //     that.setData({
    //         listData: matches,
    //         tableHidden: false,
    //     });
    // },
    onLoad() {
        var date = new Date();
        var year = date.getFullYear();
        //月
        var month = date.getMonth() + 1;
        //日
        var day = date.getDate();
        this.setData({
            now: year + "-" + month + "-" + day,
            date: year + "-" + month + "-" + day,
        });
        console.log(this.data.now, this.data.date);
    },
})
