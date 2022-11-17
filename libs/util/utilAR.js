import GUI from './dat.gui.module.js'
import {ARjs} from  '../AR/ar.js';

let AR = null;
let renderer = null;
let imageURL = null;
let videoURL = null;
let defaultSource = null;

function checkAR()
{
   if(!AR)
   throw new Error("Error: No AR context was set. Use 'initAR' function to initialize AR content!")
}

export function initAR(inputAR, inputRenderer)
{
   renderer = inputRenderer;
   AR = inputAR;
   window.addEventListener('resize', function(){ onResize() })
}

export function setSource(type, url)
{
   checkAR();
   if(AR.source) AR.source = null

   AR.source = new ARjs.Source({	
	   sourceType : type,
      sourceUrl : url,
   })
   AR.source.init(function onReady(){
      setTimeout(() => {
         onResize()
      }, 100);
   })
   onResize()    
}

export function onResize(){
   checkAR();
	AR.source.onResizeElement()
	AR.source.copyElementSizeTo(renderer.domElement)
	if( AR.context.arController !== null ){
		AR.source.copyElementSizeTo(AR.context.arController.canvas)
	}
}

export function loadDefaultARSource()
{
   console.log(defaultSource)
   if(defaultSource === 'video')
      setSource('video', videoURL );
   else if(defaultSource === 'image')
      setSource('image', imageURL);   
   else 
      setSource('webcam', null);
}

export function createSourceChangerInterface(_imageURL, _videoURL, _defaultSource = 'webcam')
{
   checkAR();
   imageURL = _imageURL;
   videoURL = _videoURL;
   defaultSource = _defaultSource;

   var controls = new function ()
   {
      this.source = defaultSource;
      this.onChangeSource = function()
      {
        switch (this.source)
        {
           case 'image':
              setSource('image', imageURL)
              break;
           case 'video':
              setSource('video', videoURL)                       
              break;
           case 'webcam':
              setSource('webcam', null)                     
              break;
        }
      };
   };
  
   var gui = new GUI();
   gui.add(controls, 'source', ['image', 'video', 'webcam'])
   .name("Source")
   .onChange(function(e) { controls.onChangeSource(); });
}