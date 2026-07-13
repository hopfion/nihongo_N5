var CACHE="nikki-v11";
var ASSETS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-512-maskable.png","./apple-touch-icon.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(ASSETS.map(function(u){
      return fetch(new Request(u,{cache:"reload"})).then(function(res){return c.put(u,res);});
    }));
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(function(r){
      if(r)return r;
      return fetch(e.request).then(function(res){
        var copy=res.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,copy);});
        return res;
      }).catch(function(){
        if(e.request.mode==="navigate")return caches.match("./index.html");
      });
    })
  );
});
