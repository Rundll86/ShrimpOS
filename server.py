import flask, os, flask_cors, json

app = flask.Flask(__name__)
flask_cors.CORS(app)


def getfile(path, writable=False):
    return open(path, "w" if writable else "r", encoding="utf8")


def runExe(path):
    targetpath = os.path.dirname(path)
    targetfile = os.path.basename(path)
    os.chdir(targetpath)
    os.startfile(targetfile)


@app.before_request
def reload():
    global userinfo, programlist, rundir, appdata, desktoplist
    rundir = os.path.dirname(__file__)
    os.chdir(rundir)
    userinfo = json.load(getfile("user/info.json"))
    programlist = json.load(getfile("user/program.json"))
    appdata = os.path.join(
        os.environ["appdata"], "Microsoft\Windows\Start Menu\Programs"
    )
    desktoplist = json.load(getfile("user/desktop.json"))


@app.route("/cmd/<cmd>")
def cmdpath(cmd: str):
    os.system(cmd.replace("-", "/"))
    return "ok"


@app.route("/getuser/<key>")
def getuser(key):
    if key == "avatar":
        return flask.send_file(os.path.join(os.getcwd(), "user", userinfo["avatar"]))
    if key == "name":
        return userinfo["name"]


@app.route("/run/<name>")
def runprogram(name):
    if name in programlist.keys():
        runExe(programlist[name])
        return "ok"
    else:
        return "not found"


@app.route("/getstartmenu")
def getstartmenu():
    result = []
    for root, dirs, files in os.walk(appdata):
        for i in files:
            result.append(
                [os.path.basename(os.path.splitext(i)[0]), os.path.join(root, i)]
            )
    return result


@app.route("/runAtStartMenu", methods=["post"])
def runatstartmenu():
    runExe(flask.request.form["target"])
    return "ok"


@app.route("/getPlugins")
def getplugins():
    res = []
    for root, _, files in os.walk("plugins"):
        for j in files:
            if os.path.splitext(j)[1].upper() == ".JS":
                res.append(os.path.join(root, j))
    ans = []
    for i in res:
        ans.append(getfile(i).read())
    return ans


@app.route("/getDesktop")
def getdesktop():
    res = []
    for i in desktoplist:
        res.append(i[1])
    return res


@app.route("/runDesktop/<name>")
def rundesktop(name):
    for i in desktoplist:
        if i[1] == name:
            runExe(i[0])
    return "ok"


@app.route("/getIcon/<name>")
def geticon(name):
    for i in desktoplist:
        if i[1] == name:
            return flask.send_file(i[2])


@app.route("/ping")
def ping():
    return "ok"


app.run("0.0.0.0", 25565)
