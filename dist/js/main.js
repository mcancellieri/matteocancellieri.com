function showHideBar(t){last_scroll_position=window.scrollY,last_scroll_position<400?(header.classList.remove("slideDown"),header.classList.add("slideUp")):(header.classList.remove("slideUp"),header.classList.add("slideDown")),new_scroll_position=last_scroll_position}var nodes=[],padding=18,new_scroll_position=0,last_scroll_position,header=document.getElementById("bar");window.addEventListener("scroll",showHideBar),showHideBar(null),window.onload=function(){function t(t){o.selectAll("circle").each(e(.1*t.alpha)).each(n(.1)).attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y}).append("text").style("fill","#333").text(function(t){return t.name}),o.selectAll("text").attr("transform",function(t){return"translate("+(t.x-this.getBBox().width/2)+","+t.y+")"})}function e(t){return function(e){e.y+=(e.cy-e.y)*t,e.x+=(e.cx-e.x)*t*.3}}function n(t){var e=d3.geom.quadtree(nodes);return function(n){var r=n.range+padding,o=n.x-r,a=n.x+r,i=n.y-r,l=n.y+r;e.visit(function(e,r,s,d,c){if(e.point&&e.point!==n){var u=n.x-e.point.x,p=n.y-e.point.y,f=Math.sqrt(u*u+p*p),x=n.range+e.point.range+(n.name!==e.point.name)*padding;f<x&&(f=(f-x)/f*t,n.x-=u*=f,n.y-=p*=f,e.point.x+=u,e.point.y+=p)}return r>a||d<o||s>l||c<i})}}var r=document.getElementById("skills").clientWidth;format=d3.format(",d"),color=d3.scale.category20();var o=d3.select("#skills").append("svg").attr("width",r).attr("height",600).attr("class","bubble");d3.json("js/skills.json",function(e,n){nodes=n.skills,nodes.forEach(function(t){t.cx=r/2,t.cy=300,t.range=t.value/1.5});var a=d3.layout.force().nodes(nodes).size([r-padding,600-padding]).gravity(0).charge(0).on("tick",t).start(),i=o.selectAll("circle").data(a.nodes()).enter().append("circle").attr("r",function(t){return t.range}).style("fill",function(t){return color(("00000"+(Math.random()*(1<<24)|0).toString(16)).slice(-6))}).call(a.drag);o.selectAll("text").data(a.nodes()).enter().append("text").attr("x",0).attr("y",".31em").text(function(t){return t.name});i.append("text").style("fill","#333").text(function(t){return t.name})})};