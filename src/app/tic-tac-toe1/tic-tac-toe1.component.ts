import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { default as TWEEN } from '@tweenjs/tween.js';

@Component({
  selector: 'app-tic-tac-toe1',
  templateUrl: './tic-tac-toe1.component.html',
  styleUrls: ['./tic-tac-toe1.component.scss']
})
export class TicTacToeComponent1 implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;

  isAnimating: boolean = false;
  cube: any;

  constructor() { }

  ngOnInit(): void {
    this.initScene();
    this.renderScene();
  }

  initScene(): void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5); // Переместите камеру по оси Z для получения правильного обзора
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const loader = new GLTFLoader();
    const modelPath = 'assets/blender/xo.glb';

    const light = new THREE.DirectionalLight(0xffffff, 1);

// Установка позиции источника света
    light.position.set(1, 1, 1);

// Добавление источника света на сцену
    this.scene.add(light);

    loader.load(modelPath, (gltf) => {
      this.cube = gltf.scene;

      // Создание пустого контейнера для точки вращения
      const pivot = new THREE.Object3D();
      this.scene.add(pivot);
      pivot.add(this.cube);

      // Установка позиции фигуры в начале координат
      this.cube.position.set(0, 0, 0);

      // Установка размера и имени фигуры
      this.cube.scale.set(1, 1, 1);
      this.cube.name = 'xo';

      // Установка точки вращения в центр фигуры
      const box = new THREE.Box3().setFromObject(this.cube);
      const center = box.getCenter(new THREE.Vector3());
      this.cube.position.copy(center).multiplyScalar(-1);
      pivot.position.copy(center);

      this.renderer.domElement.addEventListener('click', (event) => {
        if (this.isAnimating) {
          return; // Если анимация уже выполняется, просто игнорируем клик
        }
        this.isAnimating = true;
        // Получаем координаты клика относительно элемента рендерера
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Создаем луч, проходящий через координаты клика
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        // Проверяем пересечение луча с объектом куба
        const intersects = raycaster.intersectObject(this.cube, true);

        if (intersects.length > 0) {
          // Клик произошел на фигуре
          const rotationTween = new TWEEN.Tween(pivot.rotation)
            .to({ y: pivot.rotation.y + Math.PI }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          const animate = () => {
            requestAnimationFrame(animate);
            TWEEN.update();
            this.renderer.render(this.scene, this.camera);

            if (!TWEEN.getAll().length) {
              this.isAnimating = false; // Устанавливаем флаг, что анимация завершена
            }
          };

          animate();
        }
      });
    });
  }



  renderScene(): void {
    requestAnimationFrame(() => this.renderScene());

    this.renderer.render(this.scene, this.camera);
  }
}
