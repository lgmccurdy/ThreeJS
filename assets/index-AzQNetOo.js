import*as i from"https://cdn.skypack.dev/three@0.128.0/build/three.module.js";import{OrbitControls as p}from"https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js";import{GLTFLoader as m}from"https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js";(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))u(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&u(a)}).observe(document,{childList:!0,subtree:!0});function f(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function u(n){if(n.ep)return;n.ep=!0;const o=f(n);fetch(n.href,o)}})();const t=new i.Scene,r=new i.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);r.fov=10;r.updateProjectionMatrix();const s=new i.WebGLRenderer({canvas:document.querySelector("#bg")});s.render(t,r);s.setPixelRatio(window.devicePixelRatio);s.setSize(window.innerWidth,window.innerHeight);s.toneMappingExposure=2;s.outputEncoding=i.sRGBEncoding;r.position.set(40,40,100);const w=new i.AmbientLight(16777215,.4);t.add(w);const g=new i.PointLight(16777215,.6);r.add(g);t.add(r);const c=new m;c.load("models/macaron.glb",function(e){t.add(e.scene),e.scene.position.set(-8,-.7,0),e.scene.scale.set(1.3,1.3,1.3)},void 0,function(e){console.error(e)});c.load("models/donut.glb",function(e){t.add(e.scene),e.scene.position.set(8,-.8,0),e.scene.scale.set(1.5,1.5,1.5)},void 0,function(e){console.error(e)});c.load("models/cupcake.glb",function(e){t.add(e.scene),e.scene.position.set(0,-1.5,8),e.scene.scale.set(1.5,1.5,1.5)},void 0,function(e){console.error(e)});c.load("models/pudding.glb",function(e){t.add(e.scene),e.scene.position.set(0,-1.7,-8),e.scene.scale.set(2,2,2)},void 0,function(e){console.error(e)});c.load("models/platter.glb",function(e){t.add(e.scene),e.scene.position.set(0,-2,0),e.scene.scale.set(3,1,3)},void 0,function(e){console.error(e)});const b=new i.TextureLoader().load("images/background.png");t.background=b;const h=new p(r,s.domElement);function l(){requestAnimationFrame(l),h.update(),s.render(t,r)}l();
