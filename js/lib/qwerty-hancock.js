/* Qwerty Hancock 0.2.0 (c) 2013 Stuart Memo */
!function(a){var b=function(b){var c,d,e=b.id||"keyboard",f=b.octaves||3,g=7*f,h=b.width||600,i=b.height||150,j=b.startNote||"A3",k=j.charAt(1),l=b.whiteKeyColour||"#FFF",m=b.blackKeyColour||"#000",n=b.hoverColour||"#076cf0",o=h/g,p=b.blackKeyWidth||o/2,q=b.blackKeyHeight||i/1.5,r=b.keyboardLayout||"en",s=new Raphael(e,h,i),t=["C","D","E","F","G","A","B"],u=["A","C","D","F","G"],v=0,w=j.charAt(0),x=k,y=k,z=!1,A={},B=[],C=[],D=[];document.getElementById(e).style.fontSize="0px";for(var E=function(a){var b,c=["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];b=3===a.length?a.charAt(2):a.charAt(1);var d=c.indexOf(a.slice(0,-1));return d=3>d?d+12+12*(b-1)+1:d+12*(b-1)+1,440*Math.pow(2,(d-49)/12)},F=0;7>F;F++)if(w===t[F]){keyOffset=F;break}for(F=0;7>F;F++)D[F]=F+keyOffset>6?t[F+keyOffset-7]:t[F+keyOffset];for(F=0;g>F;F++){0===F%t.length&&(v=0);var G=D[v];"C"===G&&x++,B[F]=s.rect(o*F,0,o,i).attr({id:D[v],title:D[v]+(x-1),fill:l}).mousedown(function(){z=!0,this.attr({fill:n}),c(this.attr("title"),E(this.attrs.title))}).mouseover(function(){z&&(this.attr({fill:n}),c(this.attr("title"),E(this.attrs.title)))}).mouseup(function(){this.attr({fill:l}),z=!1,d(this.attr("title"),E(this.attrs.title))}).mouseout(function(){z&&(this.attr({fill:l}),d(this.attr("title"),E(this.attrs.title)))}),v++}for(x=k,F=0;g>F;F++){0===F%t.length&&(v=0);for(var H=0;H<u.length;H++)D[v]===u[H]&&(G=D[v]+"#","C#"===G&&x++,h>o*(F+1)&&(C[F]=s.rect(o*(F+1)-p/2,0,p,q).attr({id:D[v],title:D[v]+"#"+(x-1),fill:m}).mousedown(function(){z=!0,this.attr({fill:n}),c(this.attr("title"),E(this.attrs.title))}).mouseover(function(){z&&(this.attr({fill:n}),c(this.attr("title"),E(this.attrs.title)))}).mouseup(function(){this.attr({fill:m}),z=!1,d(this.attr("title"),E(this.attrs.title))}).mouseout(function(){z&&(this.attr({fill:m}),d(this.attr("title"),E(this.attrs.title)))})));v++}if("en"==r)var I={65:"Cl",87:"C#l",83:"Dl",69:"D#l",68:"El",70:"Fl",84:"F#l",71:"Gl",89:"G#l",72:"Al",85:"A#l",74:"Bl",75:"Cu",79:"C#u",76:"Du",80:"D#u",186:"Eu",222:"Fu",221:"F#u",220:"Gu"};else if("de"==r)var I={65:"Cl",87:"C#l",83:"Dl",69:"D#l",68:"El",70:"Fl",84:"F#l",71:"Gl",90:"G#l",72:"Al",85:"A#l",74:"Bl",75:"Cu",79:"C#u",76:"Du",80:"D#u",186:"Eu",222:"Fu",221:"F#u",220:"Gu"};var J=function(a){if(!(a.keyCode in A)){A[a.keyCode]=!0;for(var b=0;b<B.length;b++)if("undefined"!=typeof I[a.keyCode]&&"undefined"!=typeof B[b]){var d=I[a.keyCode].replace("l",y).replace("u",(parseInt(y,10)+1).toString());B[b].attrs.title===d&&(B[b].attr({fill:n}),c(B[b].attrs.title,E(B[b].attrs.title)))}for(b=0;b<C.length;b++)"undefined"!=typeof I[a.keyCode]&&"undefined"!=typeof C[b]&&(d=I[a.keyCode].replace("l",y).replace("u",(parseInt(y,10)+1).toString()),C[b].attrs.title===d&&(C[b].attr({fill:n}),c(d,E(d))))}},K=function(a){delete A[a.keyCode];for(var b=0;b<B.length;b++)if("undefined"!=typeof I[a.keyCode]&&"undefined"!=typeof B[b]){var c=I[a.keyCode].replace("l",y).replace("u",(parseInt(y,10)+1).toString());B[b].attrs.title===c&&(B[b].attr({fill:l}),d(B[b].attrs.title,E(B[b].attrs.title)))}for(b=0;b<C.length;b++)"undefined"!=typeof I[a.keyCode]&&"undefined"!=typeof C[b]&&(c=I[a.keyCode].replace("l",y).replace("u",(parseInt(y,10)+1).toString()),C[b].attrs.title===c&&(C[b].attr({fill:m}),d(c,E(c))))};a.onkeydown=J,a.onkeyup=K;var L=function(a){c=a},M=function(a){d=a};return{keyDown:L,keyUp:M}};a.qwertyHancock=b}(window);