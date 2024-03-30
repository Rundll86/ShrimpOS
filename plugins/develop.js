const ShrimpIF = require("../js/src/ShrimpIF.js");
var panel = new ShrimpIF.UI.QuickElements.PanelBox;
var progressbar = new ShrimpIF.UI.QuickElements.ProgressBar;
progressbar.Schedule = 100;
panel.Append(progressbar);
var renderer = ShrimpIF.UI.Rendering("#controlbar", panel);