//requestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if(!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback /*, element*/ ) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if(!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
var speedInc = 4,
    numPanel = 8,
    panelPos = [],
    carPos = [80, 130, 180],
    carPosIdx = 0,
    gCtx, cW, cH;

function runForest(){
    var tick = 0;
    function loop () {
        tick++;
        roadAnimation(tick);
        carAnimation(tick);
        requestAnimationFrame(loop);
    }
    loop();
}
function setupGame(){
    setupGraphics();
    setupInput();
}
function setupInput(){
    $(document).on('click', function(e){
        carPosIdx++;
        carPosIdx = carPosIdx%3;
    })
}
function setupGraphics(parent){
    //setup panels
    var np = numPanel;
    while(np--){
        $('<div><img src="ace.jpg"></div>').appendTo("#roadContainer");
    }
    $('#roadContainer').children('div').each(function(idx, element){
        var yPos = -100*numPanel + idx*100;
        panelPos[idx] = yPos;
        $(this).css({
            '-webkit-transform': 'translateY('+ yPos + '%)',
            'position': 'absolute'
        });
    });
    //setup car
    cW = window.innerWidth;
    cH = window.innerHeight;
    $('#carCanvas')[0].width = cW;
    $('#carCanvas')[0].height = cH;
    gCtx = $('#carCanvas')[0].getContext("2d");
    carObj = new Image();
    carObj.onload = function(){
        runForest();
    };
    carObj.src = "car.png"
}
function roadAnimation(tick){
    var adjustPanel = false,
        pos;
    $('#roadContainer').children('div').each(function(idx, element){
        var val = panelPos[idx];
        val += speedInc;
        panelPos[idx] = val;
        $(this).css({
            '-webkit-transform': 'translateY('+ val + '%)' + 'translateZ(0)'
        });
        //far front panel
        if(idx === 0){
            if( val >= -500 ){
                adjustPanel = true;
                pos = val;
            }
        }
    });
    if(adjustPanel){
        //remove the most back-side panel
        pos = pos - 100;
        var removed = $('#roadContainer').children(':last-child').detach();
        removed.css({
            '-webkit-transform': 'translateY(' + pos.toString() + '%)' + 'translateZ(0)'
        });
        panelPos.pop();//remove the last element
        panelPos.unshift(pos);//add to the beginning
        //insert a new panel the far front panel
        removed.prependTo('#roadContainer');
    }
}
function carAnimation(tick){
    var deg = tick%15,
        pos = carPos[carPosIdx];
    gCtx.clearRect(0,0,cW,cH);
    gCtx.drawImage(carObj,pos,320,50,100);
}
$( function(){setTimeout(setupGame, 1000);} );