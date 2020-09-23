
const app = getApp()
import formatDate from "../../utils/formatDate"
import queues from "../../utils/queues"
import champions from "../../utils/champions"
import summoners from "../../utils/summoners"

Page({
    data: {
        title: "战绩详情",
        date: "",
        duration: "",
        queue: "",
        champions: champions,
        summoners: summoners,
        myBarons: "",
        myDragons: "",
        myTowers: "",
        myInhibitors: "",
        enemyBarons: "",
        enemyDragons: "",
        enemyTowers: "",
        enemyInhibitors: "",
        myResult: "",
        enemyResult: "",
        goldImage: "../../images/items.png",
        KDAImage: "../../images/score.png",
        itemImage: "http://ddragon.leagueoflegends.com/cdn/10.19.1/img/item/",
        spellImage: "http://ddragon.leagueoflegends.com/cdn/10.19.1/img/spell/",
        myTotalGold: "",
        myTotalKDA: "",
        enemyTotalGold: "",
        enemyTotalKDA: "",
        myStyle:"",
        myStyle2:"",
        enemyStyle:"",
        enemyStyle2:"",
    },
    onLoad: function (option) {
        wx.showToast({
            "title": "加载中",
            "icon": "loading",
            "duration": 1000
        });
        //console.log(option.query)
        const eventChannel = this.getOpenerEventChannel();
        var that = this;
        //eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
        //eventChannel.emit('someEvent', {data: 'test'});
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            console.log(data);
            var accountId = data.accountId;
            var participantId = "", result = "", teamId = "",
                championId = "", champLevel = "", championImage = "",
                spell1IdImage = "", spell2IdImage = "",
                participantId2 = "", summonerName = "", spell1Id = "", spell2Id = "",
                item0 = "", item1 = "", item2 = "", item3 = "", item4 = "", item5 = "", item6 = "",
                kills = 0, deaths = 0, assists = 0, gold = 0,
                myTotalKills = 0, myTotalDeaths = 0, myTotalAssists = 0, myTotalGold = 0,
                enemyTotalKills = 0, enemyTotalDeaths = 0, enemyTotalAssists = 0, enemyTotalGold = 0,
                myTeams = [], enemyTeams = [],
                myNameColor="",myNameFont="";
            var champions = Object.values(that.data.champions);
            var summoners = Object.values(that.data.summoners);

            var date = formatDate(data.gameCreation);
            var duration = Math.floor(data.gameDuration / 60) + "分钟";
            for (let k = 0; k < queues.length; k++) {
                if (queues[k].queueId === data.queueId) {
                    that.setData({
                        queue: queues[k].description,
                    })
                    break;
                }
            }
            for (let i = 0; i < data.participantIdentities.length; i++) {
                if (data.participantIdentities[i].player.accountId === accountId) {
                    participantId = data.participantIdentities[i].participantId;
                    break;
                }
            }
            for (let j = 0; j < data.participants.length; j++) {
                if (data.participants[j].participantId === participantId) {
                    result = data.participants[j].stats.win;
                    switch (result) {
                        case true: {
                            that.setData({
                                myResult: "胜",
                                enemyResult: "败",
                                myStyle:"cornflowerblue",
                                myStyle2:"cornflowerblue",
                                enemyStyle:"orangered",
                                enemyStyle2:"orangered",
                            })
                            break;
                        }
                        case false: {
                            that.setData({
                                myResult: "败",
                                enemyResult: "胜",
                                myStyle:"orangered",
                                myStyle2:"orangered",
                                enemyStyle:"cornflowerblue",
                                enemyStyle2:"cornflowerblue",
                            })
                            break;
                        }
                    }
                    teamId = data.participants[j].teamId;
                    break;
                }
            }
            for (let m = 0; m < data.teams.length; m++) {
                if (data.teams[m].teamId === teamId) {
                    that.setData({
                        myBarons: data.teams[m].baronKills,
                        myDragons: data.teams[m].dragonKills,
                        myTowers: data.teams[m].towerKills,
                        myInhibitors: data.teams[m].inhibitorKills,
                    })
                    switch (m) {
                        case 0: {
                            that.setData({
                                enemyBarons: data.teams[1].baronKills,
                                enemyDragons: data.teams[1].dragonKills,
                                enemyTowers: data.teams[1].towerKills,
                                enemyInhibitors: data.teams[1].inhibitorKills,
                            })
                            break;
                        }
                        case 1: {
                            that.setData({
                                enemyBarons: data.teams[0].baronKills,
                                enemyDragons: data.teams[0].dragonKills,
                                enemyTowers: data.teams[0].towerKills,
                                enemyInhibitors: data.teams[0].inhibitorKills,
                            })
                            break;
                        }
                    }
                    break;
                }
            }
            for (let n = 0; n < data.participants.length; n++) {
                championId = data.participants[n].championId;
                for (let p = 0; p < champions.length; p++) {
                    if (champions[p].key == championId) {
                        championImage = "http://ddragon.leagueoflegends.com/cdn/10.19.1/img/champion/" + champions[p].id + ".png";
                        break;
                    }
                }
                champLevel = data.participants[n].stats.champLevel;
                participantId2 = data.participants[n].participantId;
                if(participantId === participantId2){
                    myNameColor="green";
                    myNameFont="bold"
                }else{
                    myNameColor="";
                    myNameFont=""
                }
                for (let q = 0; q < data.participantIdentities.length; q++) {
                    if (data.participantIdentities[q].participantId === participantId2) {
                        summonerName = data.participantIdentities[q].player.summonerName;
                        break;
                    }
                }
                spell1Id = data.participants[n].spell1Id;
                for (let r = 0; r < summoners.length; r++) {
                    if (parseInt(summoners[r].key) === spell1Id) {
                        spell1IdImage = that.data.spellImage + summoners[r].image;
                        break;
                    }
                }
                spell2Id = data.participants[n].spell2Id;
                for (let s = 0; s < summoners.length; s++) {
                    if (parseInt(summoners[s].key) === spell1Id) {
                        spell2IdImage = that.data.spellImage + summoners[s].image;
                        break;
                    }
                }
                item0 = data.participants[n].stats.item0 === 0 ? '../../images/default.png' : that.data.itemImage + data.participants[n].stats.item0 + ".png";
                item1 = data.participants[n].stats.item1 === 0 ? '../../images/default.png' : that.data.itemImage + data.participants[n].stats.item1 + ".png";
                item2 = data.participants[n].stats.item2 === 0 ? '../../images/default.png' : that.data.itemImage + data.participants[n].stats.item2 + ".png";
                item3 = data.participants[n].stats.item3 === 0 ? '../../images/default.png' : that.data.itemImage + data.participants[n].stats.item3 + ".png";
                item4 = data.participants[n].stats.item4 === 0 ? '../../images/default.png' : that.data.itemImage + data.participants[n].stats.item4 + ".png";
                item5 = data.participants[n].stats.item5 === 0 ? '../../images/default.png' : that.data.itemImage + data.participants[n].stats.item5 + ".png";
                item6 = data.participants[n].stats.item6 === 0 ? '../../images/default.png' : that.data.itemImage + data.participants[n].stats.item6 + ".png";
                kills = data.participants[n].stats.kills;
                deaths = data.participants[n].stats.deaths;
                assists = data.participants[n].stats.assists;
                gold = data.participants[n].stats.goldEarned;
                if (data.participants[n].teamId === teamId) {
                    myTeams.push({
                        myNameColor:myNameColor,
                        myNameFont:myNameFont,
                        championImage: championImage,
                        champLevel: champLevel,
                        summonerName: summonerName,
                        item0: item0,
                        item1: item1,
                        item2: item2,
                        item3: item3,
                        item4: item4,
                        item5: item5,
                        item6: item6,
                        gold: (gold * 1 / 1000).toFixed(1) + "k",
                        kills: kills * 1,
                        deaths: deaths * 1,
                        assists: assists * 1,
                        KDA: kills * 1 + "/" + deaths * 1 + "/" + assists * 1,
                        spell1IdImage: spell1IdImage,
                        spell2IdImage: spell2IdImage,
                    })
                    //break;
                } else {
                    enemyTeams.push({
                        championImage: championImage,
                        champLevel: champLevel,
                        summonerName: summonerName,
                        item0: item0,
                        item1: item1,
                        item2: item2,
                        item3: item3,
                        item4: item4,
                        item5: item5,
                        item6: item6,
                        gold: (gold * 1 / 1000).toFixed(1) + "k",
                        kills: kills * 1,
                        deaths: deaths * 1,
                        assists: assists * 1,
                        KDA: kills * 1 + "/" + deaths * 1 + "/" + assists * 1,
                        spell1IdImage: spell1IdImage,
                        spell2IdImage: spell2IdImage,
                    })
                    //break;
                }
            }
            for (let t = 0; t < myTeams.length; t++) {
                myTotalKills += myTeams[t].kills * 1;
                myTotalDeaths += myTeams[t].deaths * 1;
                myTotalAssists += myTeams[t].assists * 1;
                myTotalGold += myTeams[t].gold.slice(0, myTeams[t].gold.length - 1) * 1;
            }
            for (let u = 0; u < enemyTeams.length; u++) {
                enemyTotalKills += enemyTeams[u].kills * 1;
                enemyTotalDeaths += enemyTeams[u].deaths * 1;
                enemyTotalAssists += enemyTeams[u].assists * 1;
                enemyTotalGold += parseInt(enemyTeams[u].gold.slice(0, enemyTeams[u].gold.length - 1));
            }
            that.setData({
                date: date,
                duration: duration,
                myTotalGold: myTotalGold.toFixed(1) + "k",
                myTotalKDA: myTotalKills + "/" + myTotalDeaths + "/" + myTotalAssists,
                enemyTotalGold: enemyTotalGold.toFixed(1) + "k",
                enemyTotalKDA: enemyTotalKills + "/" + enemyTotalDeaths + "/" + enemyTotalAssists,
                myTeams: myTeams,
                enemyTeams: enemyTeams,
            })
        })
    },
    //图片加载失败时
    errorMyTeamFunction: function (event) {
        var index = event.currentTarget.dataset.index
        this.data.myTeams[index] = '../../images/default.png';
    },
    errorEnemyTeamFunction: function (event) {
        var index = event.currentTarget.dataset.index
        this.data.enemyTeams[index] = '../../images/default.png';
    }
})