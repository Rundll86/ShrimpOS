(()=>{var e={914:e=>{e.exports=window.ShrimpIF}},r={};function n(t){var o=r[t];if(void 0!==o)return o.exports;var l=r[t]={exports:{}};return e[t](l,l.exports,n),l.exports}(()=>{const e=n(914);console.log(e);var r=new e.UI.QuickElements.PanelBox,t=new e.UI.QuickElements.ProgressBar,o=new e.UI.QuickElements.ButtonBox;o.Text="+10",o.AfterClick=()=>{t.Forward(10),t.FlushElement()};var l=new e.UI.QuickElements.ButtonBox;l.Text="-10",l.AfterClick=()=>{t.Forward(-10),t.FlushElement()},t.Schedule=0,r.Append(t),r.Append(o),r.Append(l),e.UI.Rendering("#controlbar",r)})()})();