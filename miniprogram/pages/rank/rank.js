const app = getApp()
import apiKey from "../../utils/apiKey"
import {services,servicesArray }from "../../utils/services"
import tiers from "../../utils/tiers"

Page({
    data: {
        tableHidden:true,
        apiKey:apiKey,
        region: "KR",
        tier:"CHALLENGER",
        page:1,
        queue:"RANKED_SOLO_5x5",
        services:services,
        tiers:tiers,
        listData:[],
        array: servicesArray,
        objectArray: services,
        index: 0,
    },
    bindPickerChange: function (e) {
        var that = this;
        this.setData({
            region: that.data.objectArray[e.detail.value].value,
            index: e.detail.value,
        })
        console.log(this.data.region);
    },
    search: function () {
        var that = this;
        wx.showToast({
            "title": "加载中",
            "icon": "loading",
            "duration": 2000
        });
        var apiKey = this.data.apiKey; //api
        console.log(apiKey);
        var url = "https://"+this.data.region.toLowerCase()+".api.riotgames.com/lol/league-exp/v4/entries/"+this.data.queue+"/"+this.data.tier+"/I?page="+this.data.page+"&api_key="+apiKey;
        wx.request({
            url: url,
            header:{
                "Content-Type": "application/json,application/json",
                "X-Riot-Token": apiKey,
            },
            success: function(res) {
                console.log(res);
                var subjects = res.data;
                if(subjects.length < 1 ) {
                    wx.showToast({
                        "title": "暂无数据",
                        "icon": "none",
                        "duration": 2000
                    });
                    that.setData({
                        listData: [],
                        tableHidden:true,
                    });
                     return;
                }
                for(let i=0;i<subjects.length;i++){
                    let total = parseInt(subjects[i].losses) + parseInt(subjects[i].wins);
                    let winRate = ((parseInt(subjects[i].wins)/total)*100).toFixed(0)+"%";
                    subjects[i].index = i+1;
                    subjects[i].winRate = winRate;
                }
                that.setData({
                    listData: subjects,
                    tableHidden:false,
                });
            }
        })
    },
    onLoad() {
        },
    })
