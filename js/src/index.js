const infobar = document.getElementById("infobar");
const loadingtext = document.getElementById("loadingtext");
const controlbar = document.getElementById("controlbar");
const usernamelabel = document.getElementById("username");
const ttglabel = document.getElementById("timetogood");
const nowtime = new Date();
const nowhour = nowtime.getHours();
const avatarimg = document.getElementById("avatarimg");
const msgc = document.getElementById("msgc");
const msginbox = document.getElementById("aiaskinput");
const quotanum = document.getElementById("quotanum");
const proglist = document.getElementById("proglist");
const progbar = document.getElementById("progbar");
const loadingtextsmall = document.getElementById("loadingtext-small");
var lastaskend = true;
const ShrimpIF = require("./ShrimpIF.js");
const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js");
const $ = require("jquery");
require("highlight.js/styles/vs2015.css");
require("jquery-easing");
window["MDIt"] = MarkdownIt;
ShrimpIF.AI.SetApiKey("sk-2a5326672dca3070cc132303d90fd7e67597969e5b61a6c27b6fffe1bf93f3a7");
var shrimpAI = new ShrimpIF.AI(true);
function exposetowindow(obj, name) {
    window[name] = obj;
};
function sendCmd(Cmd, callback = (data) => { }) {
    $.ajax({
        url: "http://localhost:25565/cmd/" + Cmd.replaceAll(" ", "%20"),
        type: "get",
        success: callback
    })
};
function shutdown() {
    sendCmd("shutdown -s -t 0");
};
function restart() {
    sendCmd("shutdown -r -t 0");
};
async function reloadQuota(callback) {
    try {
        quotanum.innerText = (await ShrimpIF.AI.GetQuota()).toFixed(2);
        callback();
    }
    catch {
        //reloadQuota();
    };
};
function reloadHighlight() {
    document.querySelectorAll("pre code").forEach(
        (e) => {
            hljs.highlightElement(e);
        }
    );
};
function askAI(msg) {
    let msgmeboxc = document.createElement("div");
    let msgaiboxc = document.createElement("div");
    msgmeboxc.classList.add("msgboxc", "right");
    msgaiboxc.classList.add("msgboxc", "left");
    let msgmebox = document.createElement("div");
    let msgaibox = document.createElement("div");
    msgmebox.classList.add("msgbox");
    msgmebox.innerText = msg;
    msgaibox.classList.add("msgbox", "ai");
    msgaibox.innerText = "";
    let avatarme = document.createElement("img");
    avatarme.classList.add("avatarimg");
    avatarme.src = avatarimg["src"];
    let avatarai = document.createElement("img");
    avatarai.classList.add("avatarimg");
    avatarai.src = "./img/ai.png";
    msgmeboxc.appendChild(avatarme);
    msgmeboxc.appendChild(document.createElement("br"));
    msgmeboxc.appendChild(msgmebox);
    msgaiboxc.appendChild(avatarai);
    msgaiboxc.appendChild(document.createElement("br"));
    msgaiboxc.appendChild(msgaibox);
    msgc.appendChild(msgmeboxc);
    msgc.appendChild(msgaiboxc);
    requestAnimationFrame(() => {
        msgmeboxc.style.transform = "scale(1)";
        msgaiboxc.style.transform = "scale(1)";
    });
    shrimpAI.Send(msg, (res, end) => {
        msgaibox.innerText += res;
        lastaskend = end;
        if (lastaskend) {
            reloadQuota();
            msgaibox.innerHTML = new MarkdownIt().render(msgaibox.innerText.replaceAll("\n", "  \n"));
            reloadHighlight();
            msgaibox.classList.remove("ai");
        };
    });
};
function runProgram(name) {
    $.ajax({
        url: "http://localhost:25565/run/" + name,
        type: "get"
    })
};
function runAtSM(path) {
    $.ajax({
        url: "http://localhost:25565/runAtStartMenu",
        type: "post",
        data: {
            target: path
        }
    });
};
function generateProgramBox(data, path) {
    let result = document.createElement("button");
    result.classList.add("dirBox", "hoverPlus", "hoverButBlock");
    result.addEventListener("dblclick", () => runAtSM(path));
    let icon = document.createElement("span");
    icon.classList.add("fa", "fa-folder");
    let nameBox = document.createElement("span");
    nameBox.classList.add("progName");
    nameBox.innerText = data;
    result.appendChild(icon);
    result.appendChild(nameBox);
    return result;
};
exposetowindow(shutdown, "shutdown");
exposetowindow(restart, "restart");
exposetowindow(askAI, "askAI");
exposetowindow(runProgram, "runProgram");
exposetowindow($, "jquery");
exposetowindow(generateProgramBox, "generateProgramBox");
exposetowindow(runAtSM, "runAtSM");
msginbox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && lastaskend) {
        askAI(msginbox["value"]);
        msginbox["value"] = "";
    };
});
var posX = 0;
var speedY = 0;
var mouseDown = false;
var progMouseDown = false;
console.log(progboxlist);
window.addEventListener("mousedown", () => {
    mouseDown = true;
});
window.addEventListener("mouseup", () => {
    mouseDown = false;
    progMouseDown = false;
});
proglist.addEventListener("mousedown", () => {
    progMouseDown = true;
});
window.addEventListener("mousemove", (e) => {
    e.preventDefault();
    if (mouseDown) {
        if (e.movementY < -50) {
            progbar.style.transform = "translateY(-300px) scale(1,1)";
            progbar.style.opacity = "1";
            controlbar.style.transform = "scale(1,0)";
            controlbar.style.opacity = "0";
            infobar.style.opacity = 0;
            progboxlist.forEach((e) => {
                e.style.height = "175px";
                e.style.margin = "10px";
            });
            loadprogress.target += 5;
        };
        if (e.movementY > 50) {
            progbar.style.transform = "translateY(0px) scale(1,0)";
            progbar.style.opacity = "0";
            controlbar.style.transform = "scale(1,1)";
            controlbar.style.opacity = "1";
            infobar.style.opacity = 1;
            progboxlist.forEach((e) => {
                e.style.height = "0px";
                e.style.margin = "0px";
            });
            loadprogress.finish = loadprogress.target;
        };
        posX += e.movementX * 2;
    };
    let scalefunc;
    if (loadprogress.onFinished) {
        scalefunc = "scale(1,1)";
    } else {
        scalefunc = "scale(1,0)";
    };
    controlbar.style.transform = `translateX(${posX}px) ${scalefunc}`;
});
proglist.addEventListener("mousemove", (e) => {
    if (progMouseDown) {
        mouseDown = false;
        speedY += e.movementY * 1.5;
    };
});
function keepWheel() {
    if (!lastaskend) {
        msgc.scrollTop = msgc.scrollHeight;
    };
    proglist.scrollTop -= speedY;
    speedY *= 0.7;
    requestAnimationFrame(keepWheel);
};
requestAnimationFrame(keepWheel);
function pingAPI(callback = (status) => { }) {
    $.ajax({
        url: "http://localhost:25565/ping",
        type: "get",
        success: () => callback(true),
        error: () => callback(false)
    });
};
var loadprogress = {
    finish: 0,
    target: 5,
    get schedule() { return this.finish / this.target * 100; },
    get onFinished() { return this.finish >= this.target; }
};
var progboxlist;
exposetowindow(loadprogress, "loadprogress");
function connectAndInit() {
    pingAPI((status) => {
        if (status) {
            loadprogress.finish++;
            loadingtextsmall.innerHTML = "正在加载ChatNio";
            reloadQuota(() => {
                loadprogress.finish++;
                loadingtextsmall.innerHTML = "正在下载程序列表";
                $.ajax({
                    url: "http://localhost:25565/getstartmenu",
                    type: "get",
                    success(data) {
                        for (let i = 0; i < data.length; i++) {
                            let data0 = data[i];
                            proglist.appendChild(generateProgramBox(data0[0], data0[1]));
                        };
                        loadprogress.finish++;
                        $.ajax({
                            url: "http://localhost:25565/getuser/name",
                            type: "get",
                            success(data) {
                                usernamelabel.innerText = data;
                                loadprogress.finish++;
                                loadingtextsmall.innerHTML = "正在加载插件";
                                $.ajax({
                                    url: "http://localhost:25565/getPlugins",
                                    type: "get",
                                    success(data) {
                                        try { var data = JSON.parse(data); } catch { };
                                        loadprogress.finish += data.length;
                                        for (let i = 0; i < data.length; i++) {
                                            eval(data[i]);
                                            ShrimpIF.PluginList.__onlyone__ = false;
                                            loadprogress.finish++;
                                        };
                                        loadingtextsmall.innerHTML = "正在下载桌面配置";
                                        $.ajax({
                                            url: "http://localhost:25565/getDesktop",
                                            type: "get",
                                            success(data) {
                                                for (let i = 0; i < data.length; i++) {
                                                    let progcontainer = document.createElement("div");
                                                    progcontainer.classList.add("progbox");
                                                    let progicon = document.createElement("img");
                                                    progicon.classList.add("progicon");
                                                    progicon.src = "http://localhost:25565/getIcon/" + data[i];
                                                    let progtitle = document.createElement("span");
                                                    progtitle.innerText = data[i];
                                                    progcontainer.appendChild(progicon);
                                                    progcontainer.appendChild(document.createElement("br"));
                                                    progcontainer.appendChild(progtitle);
                                                    progbar.appendChild(progcontainer);
                                                };
                                                progboxlist = document.querySelectorAll(".progbox");
                                                loadingtextsmall.innerHTML = "正在下载用户数据";
                                                avatarimg["src"] = "http://localhost:25565/getuser/avatar";
                                                avatarimg.addEventListener("load", () => {
                                                    loadprogress.finish++;
                                                    loadingtextsmall.innerHTML = "最后清理";
                                                    if (nowhour > 6 && nowhour < 12) {
                                                        ttglabel.innerText = "早上";
                                                    }
                                                    else if (nowhour === 12) {
                                                        ttglabel.innerText = "中午";
                                                    }
                                                    else if (nowhour > 12 && nowhour < 18) {
                                                        ttglabel.innerText = "下午";
                                                    }
                                                    else {
                                                        ttglabel.innerText = "晚上";
                                                    };
                                                    loadingtextsmall.style.color = "transparent";
                                                    infobar.style.transform = "translateY(-1vw) scale(0.6)";
                                                    loadingtext.innerText = "- 准备就绪 -";
                                                    controlbar.style.transform = "scale(1,1)";
                                                    controlbar.style.opacity = "1";
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
        else {
            connectAndInit();
        };
    });
};
const ReqFrame = window.requestAnimationFrame
window["ReqFrame"] = ReqFrame;
var Stage = document.getElementById("starStage");
var Context = Stage["getContext"]("2d");
var StarNum = 2000;
var StarRadius = '0.' + Math.floor(Math.random() * 10) + 1;
var HalfAStage = Stage["width"] * 2;
var Warp = 0;
var CenterX, CenterY;
var StarList = [], CurrentStar;
var i;
var Animatable = true;
Init();
function StartPlay() {
    if (Animatable)
        ReqFrame(StartPlay);
    NextFrame();
    DrawFrame();
};
function Init() {
    CenterX = Stage["width"] / 2;
    CenterY = Stage["height"] / 2;
    StarList = [];
    for (i = 0; i < StarNum; i++) {
        CurrentStar = {
            x: Math.random() * Stage["width"],
            y: Math.random() * Stage["height"],
            z: Math.random() * Stage["width"],
            o: '0.' + Math.floor(Math.random() * 99) + 1
        };
        StarList.push(CurrentStar);
    };
};
function NextFrame() {
    for (i = 0; i < StarNum; i++) {
        CurrentStar = StarList[i];
        CurrentStar.z--;
        if (CurrentStar.z <= 0) {
            CurrentStar.z = Stage["width"];
        };
    };
};
function DrawFrame() {
    var pixelX, pixelY, pixelRadius;
    if (Stage["width"] != window.innerWidth || Stage["width"] != window.innerWidth) {
        Stage["width"] = window.innerWidth;
        Stage["height"] = window.innerHeight;
        Init();
    };
    if (Warp == 0) {
        Context.clearRect(0, 0, Stage["width"], Stage["height"]);
    };
    Context.fillStyle = "rgba(209, 255, 255, " + StarRadius + ")";
    for (i = 0; i < StarNum; i++) {
        CurrentStar = StarList[i];
        pixelX = (CurrentStar.x - CenterX) * (HalfAStage / CurrentStar.z);
        pixelX += CenterX;
        pixelY = (CurrentStar.y - CenterY) * (HalfAStage / CurrentStar.z);
        pixelY += CenterY;
        pixelRadius = 1 * (HalfAStage / CurrentStar.z);
        Context.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        Context.fillStyle = "rgba(209, 255, 255, " + CurrentStar.o + ")";
    };
};
StartPlay();
connectAndInit();
require("./require.js");