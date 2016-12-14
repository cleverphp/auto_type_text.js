var Typer={
	text: null,
	accessCountimer:null,
	index:0, // current cursor position
	speed:2, // speed of the Typer
	file:"", //file, must be setted
	accessCount:0, //times alt is pressed for Access Granted
	deniedCount:0, //times caps is pressed for Access Denied
    ajax : function(){
        var xhr = new XMLHttpRequest();
        xhr.open('get',Typer.file,true);//use simualtanous
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                Typer.text = xhr.responseText;
            }
        }
        xhr.send();
    },
	init: function(){// inizialize Hacker Typer
		accessCountimer=setInterval(function(){Typer.updLstChr();},500); // inizialize timer for blinking cursor
		Typer.ajax();
        var e = new KeyboardEvent("keydown", {
						bubbles : true,
						keyCode : 81
		});
        setInterval(function(){
            
            Typer.addText(e);
            
        },200);
	},
	
	content:function(){
		return document.getElementById('console').innerHTML;// get console content
	},
	
	write:function(str){// append to console content
		document.getElementById('console').innerHTML += str;
		return false;
	},
    
    stripHtml : function(html){
        
        //parse js
        
        var reg1 = new RegExp("<","gi");
        var reg2 = new RegExp(">","gi");
        
        html = html.replace(reg1,'&lt;').replace(reg2,'&gt;');
        
        return html;
        
    },
    
	addText:function(key){//Main function to add the code
		if(Typer.text){ // otherway if text is loaded
			var cont=Typer.content(); // get the console content
			if(cont.substring(cont.length-1,cont.length)=="|") // if the last char is the blinking cursor
				document.getElementById('console').innerHTML = document.getElementById('console').innerHTML.substring(0,cont.length-1); // remove it before adding the text
			if(key.keyCode!=8){ // if key is not backspace
				Typer.index+=Typer.speed;	// add to the index the speed
			}else{
				if(Typer.index>0) // else if index is not less than 0 
					Typer.index-=Typer.speed;//	remove speed for deleting text
			}
			var text= Typer.stripHtml(Typer.text.substring(0,Typer.index));// parse the text for stripping html enities
			var rtn= new RegExp("\n", "g"); // newline regex
			var rts= new RegExp("\\s", "g"); // whitespace regex
			var rtt= new RegExp("\\t", "g"); // tab regex
			document.getElementById('console').innerHTML = text.replace(rtn,"<br/>").replace(rtt,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(rts,"&nbsp;");// replace newline chars with br, tabs with 4 space and blanks with an html blank
			window.scrollBy(0,50); // scroll to make sure bottom is always visible
		}
		if(key.preventDefault && key.keyCode != 122 ) { // prevent F11(fullscreen) from being blocked
			key.preventDefault()
		};  
		if(key.keyCode != 122){ // otherway prevent keys default behavior
			key.returnValue = false;
		}
	},
	
	updLstChr:function(){ // blinking cursor
		var cont=this.content(); // get console 
		if(cont.substring(cont.length-1,cont.length)=="|") // if last char is the cursor
			document.getElementById('console').innerHTML = document.getElementById('console').innerHTML.substring(0,cont.length-1); // remove it
		else
			this.write("|"); // else write it
	}
}
