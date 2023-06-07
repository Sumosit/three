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
  cubes: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initScene();
    this.renderScene();
  }

  initScene(): void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const loader = new GLTFLoader();
    const modelPath = 'assets/blender/xo.glb';

    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 10);
    this.scene.add(light);

    loader.load(modelPath, (gltf) => {
      const group = gltf.scene.children[0] as THREE.Group;

      const positions = [
        [-2.7, 2.7, 0], [-0.5, 2.7, 0], [1.7, 2.7, 0],
        [-2.7, 0.5, 0], [-0.5, 0.5, 0], [1.7, 0.5, 0],
        [-2.7, -1.7, 0], [-0.5, -1.7, 0], [1.7, -1.7, 0]
      ];

      for (let i = 0; i < 9; i++) {
        const groupClone = group.clone();

        groupClone.position.set(positions[i][0], positions[i][1], positions[i][2]);
        groupClone.scale.set(1, 1, 1);
        groupClone.name = 'xo';

        this.scene.add(groupClone);
        this.cubes.push(groupClone);
      }

      this.renderer.domElement.addEventListener('click', (event) => {
        if (this.isAnimating) {
          return;
        }
        this.isAnimating = true;

        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.cubes, true);

        if (intersects.length > 0) {
          const clickedGroup = intersects[0].object.parent;

          // @ts-ignore
          const rotationTween = new TWEEN.Tween(clickedGroup.rotation)
            // @ts-ignore
            .to({ y: clickedGroup.rotation.y + Math.PI }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

          const animate = () => {
            requestAnimationFrame(animate);
            TWEEN.update();
            this.renderer.render(this.scene, this.camera);

            if (!TWEEN.getAll().length) {
              this.isAnimating = false;
            }
          };

          animate();
        }
      });
    });
  }

  renderScene(): void {
    requestAnimationFrame(() => this.renderScene());

    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  }
}
