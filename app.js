(function(){
var items=[],cur="all",view=[],idx=0;
var $=function(s){return document.querySelector(s)};
var TABS=[["all","全部"],["A","深色萌宠"],["B","梦幻花卉"],["C","治愈风景"]];
function ds(d){var t=new Date();t.setHours(0,0,0,0);var p=d.split("-"),x=new Date(+p[0],p[1]-1,+p[2]);
 var n=Math.round((t-x)/864e5);if(n===0)return["今天",d];if(n===1)return["昨天",d];return[(x.getMonth()+1)+"月"+x.getDate()+"日",d]}
function tabs(){var h="";TABS.forEach(function(t){h+='<button data-k="'+t[0]+'" class="'+(t[0]===cur?"on":"")+'">'+t[1]+'</button>'});
 $("#tabs").innerHTML=h}
function render(){
 view=items.filter(function(i){return cur==="all"||i.group===cur});
 var days={},order=[];view.forEach(function(i){if(!days[i.date]){days[i.date]=[];order.push(i.date)}days[i.date].push(i)});
 order.sort().reverse();
 var h="";if(!view.length)h='<div class="empty">暂无内容</div>';
 order.forEach(function(d){var s=ds(d);h+='<section><div class="day">'+s[0]+'<small>'+(s[0]===s[1]?"":s[1])+' · '+days[d].length+'张</small></div><div class="grid">';
  days[d].forEach(function(i){h+='<button class="card" data-id="'+i.id+'"><img loading="lazy" alt="'+i.title+'" src="'+i.thumb+'"><span class="cap">'+i.title+'</span></button>'});
  h+='</div></section>'});
 $("#list").innerHTML=h;
 [].forEach.call(document.querySelectorAll(".card img"),function(m){m.onload=function(){m.className="ok"};if(m.complete)m.className="ok"});
}
function openV(id){
 idx=view.findIndex(function(i){return i.id===id});if(idx<0)return;
 var h="";view.forEach(function(i,k){h+='<div class="slide">'+(Math.abs(k-idx)<=1?'<img alt="'+i.title+'" src="'+i.file+'">':'<img alt="'+i.title+'" data-src="'+i.file+'">')+'</div>'});
 var tr=$("#track");tr.innerHTML=h;$("#viewer").hidden=false;document.body.style.overflow="hidden";
 tr.scrollLeft=idx*tr.clientWidth;upd();
 history.pushState({v:1},"");
}
function upd(){var i=view[idx];if(!i)return;
 $("#vcount").textContent=(idx+1)+" / "+view.length;$("#vtitle").textContent=i.title+" · "+i.groupName;
 var a=$("#vsave");a.href=i.file;a.setAttribute("download",i.title+"_"+i.id+".jpg");
 var s=document.querySelectorAll(".slide img");[idx-1,idx,idx+1].forEach(function(k){var m=s[k];if(m&&m.dataset.src){m.src=m.dataset.src;m.removeAttribute("data-src")}})}
function closeV(){$("#viewer").hidden=true;document.body.style.overflow="";$("#track").innerHTML=""}
$("#track").addEventListener("scroll",function(){var t=this,n=Math.round(t.scrollLeft/t.clientWidth);if(n!==idx&&n>=0&&n<view.length){idx=n;upd()}});
$("#vclose").onclick=function(){if(history.state&&history.state.v)history.back();else closeV()};
window.addEventListener("popstate",function(){if(!$("#viewer").hidden)closeV()});
document.addEventListener("keydown",function(e){if($("#viewer").hidden)return;var t=$("#track");
 if(e.key==="Escape")$("#vclose").click();if(e.key==="ArrowRight")t.scrollBy({left:t.clientWidth,behavior:"smooth"});if(e.key==="ArrowLeft")t.scrollBy({left:-t.clientWidth,behavior:"smooth"})});
$("#tabs").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;cur=b.dataset.k;tabs();render()});
$("#list").addEventListener("click",function(e){var c=e.target.closest(".card");if(c)openV(c.dataset.id)});
fetch("manifest.json?t="+Date.now()).then(function(r){return r.json()}).then(function(m){
 items=m.items;items.sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:(a.id<b.id?-1:1)});tabs();render();
 var q=location.hash.slice(1);if(q)openV(q)}).catch(function(){$("#list").innerHTML='<div class="empty">加载失败,请刷新</div>'});
})();
