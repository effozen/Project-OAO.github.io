import * as THREE from './jsm/build/three.module.js'
import {OrbitControls} from "./jsm/controls/OrbitControls.js";
import {BVHLoader} from "./jsm/loaders/BVHLoader.js";
import {FBXLoader} from "./jsm/loaders/FBXLoader.js";
import {LoadingManager} from "./jsm/loaders/LoadingManager.js";
const clock = new THREE.Clock(); // Animation 동작을 위해서 구현해두었다.

let camera, controls, scene, renderer; // 기본적인 Three.js 모듈이다.
let mixer, skeletonHelper; // 스켈레톤 구현하기 위한 툴이다.

let animeStatus = true;

// -----------------------------------------------내용 설명------------------------------------------
/*
*   init() :
*               input : X
*               output : X
*               Three.js 구동을 위한 환경 설정
*               FBX와 BVH 모두 같은 설정을 공유할 수 있도록 하였다.
*               결론 : init 하나로 FBX, BVH Player 모두 환경설정 할 수 있기 때문에 사용여부와 상관없이 한번만 실행해주면 된다.
*
*   OnWindowResize() :
*               input : X
*               output : X
*               init()에서 화면에 맞춰서 반응형으로 화면을 조절하기 위한 것으로, 이에 대해서는 별도로 실행시킬 필요가 없다.
*               결론 : 내부 동작을 위한 것이므로, 신경쓰지 않아도 된다.
*
*   loadBVH() :
*               input : bvhFile - "./model/bvh/example.bvh" 처럼 문자열 형태로 경로와 그 안에 담긴 파일의 이름과 확장자를 넘겨주면 된다.
*               output : X
*               BVH를 재생시키기에 앞서서 three.js 에 BVH 파일을 올리는 역할을 한다.
*
*   loadFBX() :
*               input : fbxFile - "./model/fbx/example.fbx" 처럼 문자열 형태로 경로와 그 안에 담긴 파일의 이름과 확장자를 넘겨주면 된다.
*               output : X
*               FBX를 재생시키기에 앞서서 three.js 에 FBX 파일을 올리는 역할을 한다.
*
*   animate() :
*               input : X
*               output : X
*               loadBVH 혹은 loadFBX를 통해 올린 파일을 재생시키는 역할을 한다.
*               둘다 모두 실행시킬 경우에는 제일 마지막에 올린 파일만 애니메이션이 동작하게 되며, 다른 파일은 그냥 Mesh만 출력이 된다.
*               애니메이션 재생과 관련된 부분은 FBX와 BVH가 공유하고 있다. array에 하나의 애니메이션 관련 내용만 업로드 하는 방식으로 동작하기 때문에
*               한번에 하나만 올려서 재생시켜야 한다.
*               결론 : 무조건 BVH면 BVH, FBX면 FBX 하나만 load한 후에 실행하자.
*
*   toggleAnimate(), playAnimate(), stopAnimate() :
*               input : X
*               output : X
*               Animation 재생과 관련된 부분으로 toggleAnimate는 애니메이션이 정지되어 있으면 재생을, 재생하고 있으면 정지시킨다.
*               playAnimate는 애니메이션이 정지되있든 재생되있든 재생 상태를 유지하게 바꾼다.
*               stopAnimate는 애니메이션이 정지되있든 재생되있든 정지 상태르 유지하게 바꾼다.
*
*
*   Loading Manager
*               기본적으로 loader들은 Loading manager를 사용할 수 있는 기능을 포함하고 있다.
*               여기에 Div 태그를 이용해서 애니메이션을 구현해준 것.
*
*/

//-------------------------------- Loading Manager -----------------------------------------
// reference : https://www.youtube.com/watch?v=zMzuPIiznQ4&ab_channel=WaelYasmina
const manager = new LoadingManager();
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.querySelector('.progress-bar-container');
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {

    //console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onLoad = function ( ) {

    progressBarContainer.style.display = 'none';
    //console.log( 'Loading complete!');

};


manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {

    progressBar.value = (itemsLoaded / itemsTotal) * 100;
    //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );

};

manager.onError = function ( url ) {

    console.log( 'There was an error loading ' + url );

};


//---------------------------------

function initPlayer() {
    // 캔바스 설정
    const canvas = document.querySelector("#test");

    // Scene에 대한 설정
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    // 카메라
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.set( 0, 380, 300 );
    scene.add(camera); // 카메라를 씬에 넣어주자.
    // 빛에 대한 설정
    // 해당 설정은 그냥 three.js의 예제를 따르도록 한다.
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 380, 0 );
    scene.add( hemiLight );

    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 380, 100 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = - 100;
    dirLight.shadow.camera.left = - 120;
    dirLight.shadow.camera.right = 120;
    scene.add( dirLight );
    // ground
    const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.position.y=180;
    scene.add( mesh );

    const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
    grid.position.set(0,180,0);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );
    // renderer에 대한 설정
    renderer = new THREE.WebGLRenderer( {
        canvas : canvas,
        antialias: true
    } );
    renderer.setPixelRatio( window.devicePixelRatio); // 차후 필요하면 삼항 연산자를 이용해서 정리해두자.
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    //document.body.appendChild( renderer.domElement );

    // 카메라 제어에 대한 모듈
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 280, 0 );
    controls.minDistance = 300;
    controls.maxDistance = 600;
    controls.update();

    window.addEventListener( 'resize', onWindowResize ); // 화면 사이즈가 변화하면 그에 맞춰서 변화해야 하는데 이에 대한 맞춤 설정이다.

    // gui.add(camera.position,'y',-1000,1000,0.01);

}

// 사이즈 조절과 관련된 함수이다.
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

// ------------------------------------------------BVH Loader --------------------------------------------------
/*
*   무조건 경로에 파일명으로 주어야한다.
*   ./model/bvh/example.bvh
*
*/
function loadBVH(bvhFile) {
    const loader = new BVHLoader(manager); // BVH Loader를 파싱 받는다.

    // BVH Loader를 통해 받은 정보는 result로 나오게 되는데, 이를 바탕으로 skeleton을 이용해서 구현하게 된다.
    // 이 부분이 핵심으로, 여기서 구현된 loader가 해당 내용을 스켈레톤 정보로 뿌리게 됨.
    loader.load( bvhFile, function ( result ) {

        skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );
        skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to THREE.SkeletonHelper directly

        const boneContainer = new THREE.Group();
        boneContainer.add( result.skeleton.bones[ 0 ] );

        scene.add( skeletonHelper );
        scene.add( boneContainer );

        // play animation
        mixer = new THREE.AnimationMixer( skeletonHelper );
        mixer.clipAction( result.clip ).setEffectiveWeight( 1.0 ).play();

    } );
}

// ------------------------------FBX Loader-------------------------------------------
/*
*   FBX Loader
*   fbxLink는 fbxFile 이어야 한다. 즉, 확장자가 .fbx로 떨어져야 한다.
*   ./model/fbx/example.fbx 형태로 들어가야 한다.
*
* */
function loadFBX(fbxFile){
    const loader = new FBXLoader(manager);
    loader.load( fbxFile, function ( object ) {

        mixer = new THREE.AnimationMixer( object );

        const action = mixer.clipAction( object.animations[ 0 ] );
        action.play();

        object.traverse( function ( child ) {

            if ( child.isMesh ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        } );

        scene.add( object );

    } );
}
// -----------------------------------------------Animation 구현-------------------------------------------------
function animate() {

    const delta = clock.getDelta();

    if(animeStatus == true) {
        if ( mixer ) mixer.update( delta ); // Mixer 구동을 위한 구현부
        renderer.render( scene, camera );
        requestAnimationFrame(animate);
    }
    else if(animeStatus == false){
        requestAnimationFrame(animate);
    }

}
// animation 동작 제어 (pause, run)
function togleAnimate(){
    if(animeStatus == true) {
        animeStatus = false;
    }
    else if(animeStatus == false){
        animeStatus = true;
    }
}
function playAnimate(){
    animeStatus = true;
}
function stopAnimate(){
    animeStatus = false;
}
export{initPlayer,loadBVH,loadFBX,animate, playAnimate, stopAnimate, togleAnimate}