  $( document ).ready( function(){
  
  	var c = $('#bubbles');
    var ct = c.get(0).getContext('2d');
    var container = $(c).parent();

    //Run function when browser resizes
    $(window).resize( respondCanvas );

    function respondCanvas(){ 
        c.attr('width', $("#w").width() ); //max width
        c.attr('height', $(container).height()-100 ); //max height

        //Call a function to redraw other content (texts, images etc)
    }

    //Initial call 
    respondCanvas();
  
      getSkillAndDraw();
    });
    
    function getSkillAndDraw(){
      $.getJSON("res/skills.json", {})
      .done(function(res){
                    var data=res;
                    draw(data);
                  })
      .fail(function( jqxhr, textStatus, error ) {
                    //alert(error);
      }) 
    }

    
    
    function draw(data) {        
      var canvas = document.getElementById('bubbles');
      var ctx = canvas.getContext('2d'); 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var maxSize=canvas.width*0.1;
      var maxX=canvas.width;
      var maxY=canvas.height;
      data.forEach(function(d, index) {     
        ctx.save();        
        ctx.globalAlpha = 0.5;        
        ctx.beginPath(); 
        var size=maxSize*d.value/100;
        var x=(Math.random()*maxX)%maxX;
        var y=(Math.random()*maxY)%maxY;
        while (x < size || x + size > maxX){
          x=(Math.random()*maxX)%maxX;  
        }
        while (y < size || y + size > maxY-10){
          y=(Math.random()*maxY)%maxY;  
        }
        ctx.fillStyle = ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6);    
        ctx.arc(x,y,size,0,Math.PI*2); 
        ctx.fill();    
        ctx.fillStyle = "black"; 
        ctx.textBaseline = "top";
        var font = "bold ";
        ctx.font = font;
        ctx.globalAlpha = 1;        
        var width = ctx.measureText(d.name).width;
        var height = ctx.measureText("w").width; // this is a GUESS of height
        ctx.fillText(d.name, x - (width/2) ,y + size  );
        ctx.restore();    
      });    
    }
