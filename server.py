import flask, os, flask_cors, json, ctypes, msvcrt, subprocess

app = flask.Flask(__name__)
flask_cors.CORS(app)


def getfile(path, writable=False):
    return open(path, "w" if writable else "r", encoding="utf8")


def reload():
    global userinfo, programlist, rundir, appdata
    rundir = os.path.dirname(__file__)
    os.chdir(rundir)
    userinfo = json.load(getfile("user/info.json"))
    programlist = json.load(getfile("user/program.json"))
    appdata = os.path.join(
        os.environ["appdata"], "Microsoft\Windows\Start Menu\Programs"
    )


reload()


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
        targetpath = os.path.dirname(programlist[name])
        targetfile = os.path.basename(programlist[name])
        os.chdir(targetpath)
        os.startfile(targetfile)
        reload()
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
    targetpath = os.path.dirname(flask.request.form["target"])
    os.chdir(targetpath)
    os.startfile(flask.request.form["target"])
    reload()
    return "ok"


@app.route("/getPlugins")
def getplugins():
    return json.load(getfile("user/plugin.json"))


@app.route("/ping")
def ping():
    return "ok"


app.run("0.0.0.0", 25565)
