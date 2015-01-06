var nodes = [];
var padding = 25;

$( document ).ready( function(){
  
  var width = $("#skills").width(),
  height = 800;
  format = d3.format(",d"),
  color = d3.scale.category20c();

  var svg = d3.select("#skills").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "bubble");

  d3.json("res/skills.json", function(error, root) {
    nodes=root.skills;
    $.each(nodes, function(i, d){
      d.cx =width/2;
      d.cy = height/2;
      d.range=d.value/1.5;
    })
    var force = d3.layout.force()
    .nodes(nodes)
    .size([width-padding, height-padding])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();  
    var circle = svg.selectAll("circle")
    .data(force.nodes())
    .enter().append("circle")
    .attr("r", function (d) {
      return d.range;
    })
    .style("fill", function (d) {
      return color(('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6));
    })
    .call(force.drag);

    circle.on('mouseover', function() {
      d3.select(this).transition().attr('r', function(d) {
        return d.range*1.2;
      });
    });
    circle.on('mouseout', function() {
      d3.select(this).transition().attr('r', function(d) {
        return d.range;
      });
    });
  
    var text = svg.selectAll("text")
    .data(force.nodes())
    .enter().append("text")
    .attr("x", 0)
    .attr("y", ".31em")
    .text(function(d) { return d.name; })

  
    //circle.append("title")
    //.text(function(d) { return d.name; });

    /*node.append("circle")
    .attr("r", function(d) { return d.value; })
    .style("fill", function(d) { return color(('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)); })
    .style("opacity", 0.8);*/
 
    circle.append("text")
    //.attr("dy", ".3em")
    //.style("text-anchor", "middle")
    .style("fill", "black")
    .text(function(d) {  return d.name; });
 
  });
    
  /*var node = svg.selectAll(".node")
  .data(root.skills)
  .enter().append("g")
  .attr("transform", function(d) { 
  console.log(d);
  d.x = Math.random()*width;
  d.y = Math.random()*height;
  d.r = d.value;
  while (d.x - d.r <0 || d.x + d.r > (width)){
  d.x = Math.random()*width;
  } 
  while (d.y - d.r <0 || d.y + d.r > (height)){
  d.y = Math.random()*width;
  } 
      
  console.log(d);
  return "translate(" + d.x + "," + d.y+ ")"; 
  }
  );*/


  function tick(e) {
    var circle = svg.selectAll("circle");
    circle.each(gravity(0.1 * e.alpha))
    .each(collide(0.1))
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .append("text")

    .style("fill", "black")
    .text(function(d) {  return d.name; });
    var text = svg.selectAll("text");
    text.attr("transform", function (d){
      return "translate(" + (d.x -this.getBBox().width/2) + "," + d.y + ")";
    });
  
  }


  // Move nodes toward cluster focus.
  function gravity(alpha) {
    return function (d) {
      d.y += (d.cy - d.y) * alpha;
      d.x += (d.cx - d.x) * alpha;
    };
  }

  // Resolve collisions between nodes.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
      var r = d.range +padding,
      nx1 = d.x - r,
      nx2 = d.x + r,
      ny1 = d.y - r,
      ny2 = d.y + r;
      quadtree.visit(function (quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
          y = d.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = d.range + quad.point.range + (d.name !== quad.point.name) * padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }


  //d3.select(self.frameElement).style("height", height + "px");
});

