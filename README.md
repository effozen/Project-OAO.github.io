# OAO's Portfolio Webpage

<br>

<strong>🔥🔥🔥🔥 DO NOT USE MY PHOTOS FOR ANY PURPOSE!!!!!!!!!!! 🔥🔥🔥🔥</strong>


## 📚 개요
- Apache 2.0 License
- Portfolio 생성 및 관리를 위한 웹페이지
- 지속적으로 업데이트 될 예정이며 다른 모든 내용은 사용해도 되나, 사진에 대해서는 타인의 사용을 금한다. (차후 관련 라이센스 수정 예정)

<br>

## 📚 소스 코드 설명
파일은 크게 6가지 챕터로 구분이 된다.<br>
4가지는 자기소개용 챕터이며, 2가지는 오픈소스에 기반한 개인 프로젝트 진행을 위한 기술 테스트 페이지이다.<br>
본 과제에서는 자기소개만 요구하였으나 오픈소스SW활용이라는 본 수업 목적에 맞게 웹 오픈소스를 실습해보기 위해 본 과제 페이지를 활용하였다.<br>
<br>
### 📝 자기소개용 페이지
- index : main으로 보여주는 페이지이며, 간단한 자기소개를 보여준다.
- about : 자기소개 페이지로, 나에 대한 페이지와 개발자 이름인 OAO에 대한 소개를 보여준다.
- history : 내가 쌓은 커리어에 대한 발자취와 이에 대한 몇가지 증명 사진을 보여준다.<br>
&nbsp;&nbsp;&nbsp;&nbsp;* 해당 내용은 증빙 자료에 대한 첨부를 바탕으로 그 과정에서 얻은 것, 어떻게 진행을 하였는 지 등을 redirection 할 수 있게 차후 3D/Interactive Web으로 구현할 예정.
- contact : 이메일 주소와 사용중인 SNS에 접근할 수 있는 아이콘 제공. 버튼 클릭시 이동할 수 있다.
<br>

### 📝 오픈소스용 테스트 페이지
- threejs : threejs에 기반해서, fbx player와 bvh player를 구현해놓은 테스트 페이지이다. canvas 사용에 익숙하지 않기 때문에, main page의 UI는 이식하지 못하였지만, 차후 이식할 예정이며, 이 페이지는 차후 3D에 기반한 자기소개 페이지로 변경할 예정이다.
- motionCapture : Google의 Tensorflow 의 하위 프로젝트인 Posenet을 이용한 모션캡쳐 테스트 페이지이다. pause 버튼 클릭시 캡쳐한 모든 정보가 console에 log로 찍히게 된다.

<br>

## 📚 Opensource reference
- threejs : https://threejs.org/
- posenet : https://www.tensorflow.org/lite/examples/pose_estimation/overview?hl=ko
