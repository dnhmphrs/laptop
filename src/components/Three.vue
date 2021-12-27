<template>
  <div class="outer">
    <div
      id="container"
      :class="{loaded:loaded}" />

    <div id="menu">
      <button id="sphere">
        SPHERE
      </button>
      <!--button id="helix">
        ART
      </button-->
      <button id="helix">
        HELIX
      </button>
      <button id="grid">
        GRID
      </button>
    </div>

    <div
      v-if="!loaded"
      class="loading">
      <div
        class="progress-bar"
        :style="{'width':progress+'px', 'margin-right':110-progress+'px'}" />
      <h3 class="progress-text">
        {{ progress }}
      </h3>
    </div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import tooloud from 'tooloud'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import TWEEN from '@tweenjs/tween.js'
  // import { TrackballControls  } from 'three/examples/jsm/controls/TrackballControls'
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Three',
    data () {
      return {
        camera: null,
        scene: null,
        renderer: null,
        mesh: null,
        controls: null,
        loaded: false,
        progress: 0,
        table: [
          'H', 'Hydrogen', '1.00794', 1, 1,
          'He', 'Helium', '4.002602', 18, 1,
          'Li', 'Lithium', '6.941', 1, 2,
          'Be', 'Beryllium', '9.012182', 2, 2,
          'B', 'Boron', '10.811', 13, 2,
          'C', 'Carbon', '12.0107', 14, 2,
          'N', 'Nitrogen', '14.0067', 15, 2,
          'O', 'Oxygen', '15.9994', 16, 2,
          'F', 'Fluorine', '18.9984032', 17, 2,
          'Ne', 'Neon', '20.1797', 18, 2,
          'Na', 'Sodium', '22.98976...', 1, 3,
          'Mg', 'Magnesium', '24.305', 2, 3,
          'Al', 'Aluminium', '26.9815386', 13, 3,
          'Si', 'Silicon', '28.0855', 14, 3,
          'P', 'Phosphorus', '30.973762', 15, 3,
          'S', 'Sulfur', '32.065', 16, 3,
          'Cl', 'Chlorine', '35.453', 17, 3,
          'Ar', 'Argon', '39.948', 18, 3,
          'K', 'Potassium', '39.948', 1, 4,
          'Ca', 'Calcium', '40.078', 2, 4,
          'Sc', 'Scandium', '44.955912', 3, 4,
          'Ti', 'Titanium', '47.867', 4, 4,
          'V', 'Vanadium', '50.9415', 5, 4,
          'Cr', 'Chromium', '51.9961', 6, 4,
          'Mn', 'Manganese', '54.938045', 7, 4,
          'Fe', 'Iron', '55.845', 8, 4,
          'Co', 'Cobalt', '58.933195', 9, 4,
          'Ni', 'Nickel', '58.6934', 10, 4,
          'Cu', 'Copper', '63.546', 11, 4,
          'Zn', 'Zinc', '65.38', 12, 4,
          'Ga', 'Gallium', '69.723', 13, 4,
          'Ge', 'Germanium', '72.63', 14, 4,
          'As', 'Arsenic', '74.9216', 15, 4,
          'Se', 'Selenium', '78.96', 16, 4,
          'Br', 'Bromine', '79.904', 17, 4,
          'Kr', 'Krypton', '83.798', 18, 4,
          'Rb', 'Rubidium', '85.4678', 1, 5,
          'Sr', 'Strontium', '87.62', 2, 5,
          'Y', 'Yttrium', '88.90585', 3, 5,
          'Zr', 'Zirconium', '91.224', 4, 5,
          'Nb', 'Niobium', '92.90628', 5, 5,
          'Mo', 'Molybdenum', '95.96', 6, 5,
          'Tc', 'Technetium', '(98)', 7, 5,
          'Ru', 'Ruthenium', '101.07', 8, 5,
          'Rh', 'Rhodium', '102.9055', 9, 5,
          'Pd', 'Palladium', '106.42', 10, 5,
          'Ag', 'Silver', '107.8682', 11, 5,
          'Cd', 'Cadmium', '112.411', 12, 5,
          'In', 'Indium', '114.818', 13, 5,
          'Sn', 'Tin', '118.71', 14, 5,
          'Sb', 'Antimony', '121.76', 15, 5,
          'Te', 'Tellurium', '127.6', 16, 5,
          'I', 'Iodine', '126.90447', 17, 5,
          'Xe', 'Xenon', '131.293', 18, 5,
          'Cs', 'Caesium', '132.9054', 1, 6,
          'Ba', 'Barium', '132.9054', 2, 6,
          'La', 'Lanthanum', '138.90547', 4, 9,
          'Ce', 'Cerium', '140.116', 5, 9,
          'Pr', 'Praseodymium', '140.90765', 6, 9,
          'Nd', 'Neodymium', '144.242', 7, 9,
          'Pm', 'Promethium', '(145)', 8, 9,
          'Sm', 'Samarium', '150.36', 9, 9,
          'Eu', 'Europium', '151.964', 10, 9,
          'Gd', 'Gadolinium', '157.25', 11, 9,
          'Tb', 'Terbium', '158.92535', 12, 9,
          'Dy', 'Dysprosium', '162.5', 13, 9,
          'Ho', 'Holmium', '164.93032', 14, 9,
          'Er', 'Erbium', '167.259', 15, 9,
          'Tm', 'Thulium', '168.93421', 16, 9,
          'Yb', 'Ytterbium', '173.054', 17, 9,
          'Lu', 'Lutetium', '174.9668', 18, 9,
          'Hf', 'Hafnium', '178.49', 4, 6,
          'Ta', 'Tantalum', '180.94788', 5, 6,
          'W', 'Tungsten', '183.84', 6, 6,
          'Re', 'Rhenium', '186.207', 7, 6,
          'Os', 'Osmium', '190.23', 8, 6,
          'Ir', 'Iridium', '192.217', 9, 6,
          'Pt', 'Platinum', '195.084', 10, 6,
          'Au', 'Gold', '196.966569', 11, 6,
          'Hg', 'Mercury', '200.59', 12, 6,
          'Tl', 'Thallium', '204.3833', 13, 6,
          'Pb', 'Lead', '207.2', 14, 6,
          'Bi', 'Bismuth', '208.9804', 15, 6,
          'Po', 'Polonium', '(209)', 16, 6,
          'At', 'Astatine', '(210)', 17, 6,
          'Rn', 'Radon', '(222)', 18, 6,
          'Fr', 'Francium', '(223)', 1, 7,
          'Ra', 'Radium', '(226)', 2, 7,
          'Ac', 'Actinium', '(227)', 4, 10,
          'Th', 'Thorium', '232.03806', 5, 10,
          'Pa', 'Protactinium', '231.0588', 6, 10,
          'U', 'Uranium', '238.02891', 7, 10,
          'Np', 'Neptunium', '(237)', 8, 10,
          'Pu', 'Plutonium', '(244)', 9, 10,
          'Am', 'Americium', '(243)', 10, 10,
          'Cm', 'Curium', '(247)', 11, 10,
          'Bk', 'Berkelium', '(247)', 12, 10,
          'Cf', 'Californium', '(251)', 13, 10,
          'Es', 'Einstenium', '(252)', 14, 10,
          'Fm', 'Fermium', '(257)', 15, 10,
          'Md', 'Mendelevium', '(258)', 16, 10,
          'No', 'Nobelium', '(259)', 17, 10,
          'Lr', 'Lawrencium', '(262)', 18, 10,
          'Rf', 'Rutherfordium', '(267)', 4, 7,
          'Db', 'Dubnium', '(268)', 5, 7,
          'Sg', 'Seaborgium', '(271)', 6, 7,
          'Bh', 'Bohrium', '(272)', 7, 7,
          'Hs', 'Hassium', '(270)', 8, 7,
          'Mt', 'Meitnerium', '(276)', 9, 7,
          'Ds', 'Darmstadium', '(281)', 10, 7,
          'Rg', 'Roentgenium', '(280)', 11, 7,
          'Cn', 'Copernicium', '(285)', 12, 7,
          'Nh', 'Nihonium', '(286)', 13, 7,
          'Fl', 'Flerovium', '(289)', 14, 7,
          'Mc', 'Moscovium', '(290)', 15, 7,
          'Lv', 'Livermorium', '(293)', 16, 7,
          'Ts', 'Tennessine', '(294)', 17, 7,
          'Og', 'Oganesson', '(294)', 18, 7,
          'Og', 'Oganesson', '(294)', 18, 7,
          'Og', 'Oganesson', '(294)', 18, 7,
          'Og', 'Oganesson', '(294)', 18, 7,
          'Og', 'Oganesson', '(294)', 18, 7,
          'Og', 'Oganesson', '(294)', 18, 7,
          'Og', 'Oganesson', '(294)', 18, 7,
          'Og', 'Oganesson', '(294)', 18, 7
        ],
        objects: [],
        targets: { table: [], sphere: [], helix: [], grid: [], sinStar: [], cosStar: [] },
        selection: 'INIT',
        isTransition: false
      }
    },
    computed: {
      ...mapGetters(['isMobile'])
    },
    mounted () {
      this.init()
      // this.scene.rotation.y += Math.PI/2;

      // startAnimation is called by the loadingManager at the top of init
      // this.startAnimation();
    },
    created () {
      window.addEventListener('resize', this.onWindowResize)
    },
    destroyed () {
      window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {
      delayStart () {
        this.loaded = true
        this.startAnimation()
      },
      setProgress (progress) {
        this.progress = progress
      },
      init () {
        let container = document.getElementById('container')

        this.loadingManager = new THREE.LoadingManager()
        this.loadingManager.onProgress = ( url, itemsLoaded, itemsTotal ) => {
          let progress = Math.floor(itemsLoaded / itemsTotal * 100)

          setTimeout(() => { this.setProgress(progress) }, progress*10)
        }
        this.loadingManager.onLoad  = () => {
          // this.loaded = true;
          setTimeout(() => { this.delayStart() }, 2000)
        }

        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth/container.clientHeight, 1, 1500)
        this.camera.position.set(0,100,900)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x0b0b0b)

        this.clock = new THREE.Clock()

        // ---------------------------------------------------------------------

        // ---------------------------------------------------------------------


        const loader = new GLTFLoader(this.loadingManager)
        loader.load( '/laptop.glb', gltf => {

          const mesh = gltf.scene

          this.laptop = new THREE.Group()
          this.laptop.scale.multiplyScalar( 500 )
          this.laptop.translateY(-120)
          // this.laptop.translateZ(100)
          this.scene.add( this.laptop )
          this.laptop.add( mesh )

        }, undefined, function () {
        } )

        // ---------------------------------------------------------------------

        // ---------------------------------------------------------------------


        this.scene.fog = new THREE.Fog( 0x0b0b0b, 1, 1500 )

        // let floorGeometry = new THREE.BoxGeometry(1000000, .01, 1000000)
        // let material = new THREE.MeshToonMaterial({color: 0x1b1b1b, metalness:0.8})

        // this.floor = new THREE.Mesh(floorGeometry, material)
        // this.floor.translateY(-3000)

        // this.scene.add(this.floor)

        this.hemiLight = new THREE.HemisphereLight( 0xf0f0f0, 0x222222 )
        this.hemiLight.position.set( 0, 10000, 0 )
        this.scene.add( this.hemiLight )

        this.toneLight = new THREE.PointLight( 0x00ffff, 8, 5000 )
        this.toneLight.position.set( 0, -100, 0 )
        this.scene.add( this.toneLight )


        // ---------------------------------------------------------------------


        // ---------------------------------------------------------------------


        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.setSize(container.clientWidth, container.clientHeight)
        this.renderer.setPixelRatio( window.devicePixelRatio )
        container.appendChild(this.renderer.domElement)

        // ---------------------------------------------------------------------

        // ---------------------------------------------------------------------

        this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        this.controls.minDistance = 300
        this.controls.maxDistance = 1300
        this.controls.enableDamping = true
        this.controls.enablePan = false
        this.controls.rotateSpeed = .5
        this.controls.zoomSpeed = .75
        this.controls.enabled = false

        // ---------------------------------------------------------------------

        // table (materials)

        let cubeGeometry = new THREE.BoxGeometry(100, 100, 100)
        let cubeMaterial = new THREE.MeshLambertMaterial({color: 0x111111})

        for ( let i = 0, l = this.table.length; i < l; i += 5 ) {

          // this bit inits the objects

          let cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

          cube.position.x = ( ( (i/5) % 5 ) * 100 ) - 220 // - Math.tan((i % 2 ) * 2)
          cube.position.y = ( - ( Math.floor( (i/5) / 5 ) % 5 ) * 100 ) + 220 // + Math.tan((i % 2 ) * 2)
          cube.position.z = ( Math.floor( (i/5) / 25 ) ) * 100 - 220 // - Math.tan((i % 2 ) * 2)


          this.cubeGroup = new THREE.Group()
          this.cubeGroup.add( cube )

          this.scene.add( this.cubeGroup )

          this.objects.push( cube )

          // this bit does the actual table (materials)

          const object = new THREE.Object3D()
          
          object.position.x = cube.position.x
          object.position.y = cube.position.y
          object.position.z = cube.position.z

          this.targets.table.push( object )

        }

        // sphere (design)

        const vector = new THREE.Vector3()

        for ( let i = 0, l = this.objects.length; i < l; i ++ ) {

          const phi = Math.acos( - 1 + ( 2 * i ) / l )
          const theta = Math.sqrt( l * Math.PI ) * phi

          const object = new THREE.Object3D()

          object.position.setFromSphericalCoords( 700, phi, theta )

          this.targets.sphere.push( object )

        }


        // cosStar (contact)

        for ( let i = 0, l = this.objects.length; i < l; i ++ ) {

          const phi = Math.acos( - 1 + ( 2 * i ) / l )
          const theta = Math.sqrt( l * Math.PI ) * phi
          const radius = 500 * ( (Math.cos(i) + 2.3) * 0.8 )

          const object = new THREE.Object3D()

          object.position.setFromSphericalCoords( radius, phi, theta )

          this.targets.cosStar.push( object )

        }

        // sinStar (materials)

        for ( let i = 0, l = this.objects.length; i < l; i ++ ) {

          const phi = Math.acos( - 1 + ( 2 * i ) / l )
          const theta = Math.sqrt( l * Math.PI ) * Math.cos(phi) * -1
          const radius = 500 * (Math.sin(i) + 2)

          const object = new THREE.Object3D()

          object.position.setFromSphericalCoords( radius, phi, theta )

          this.targets.sinStar.push( object )

        }


        // helix (art)

        for ( let i = 0, l = this.objects.length; i < l; i ++ ) {

          const theta = i * 0.175 + Math.PI
          const y = - ( i * 12 ) + 600

          const object = new THREE.Object3D()

          object.position.setFromCylindricalCoords( 600, theta, y )

          vector.x = object.position.x * 2
          vector.y = object.position.y
          vector.z = object.position.z * 2

          object.lookAt( vector )

          this.targets.helix.push( object )

        }

        // grid (contact)

        for ( let i = 0; i < this.objects.length; i ++ ) {

          const object = new THREE.Object3D()

          let o = (i==62) ? 63 : i // to account for 25 being where the laptop is
          object.position.x = ( ( o % 5 ) * 400 ) - 800
          object.position.z = ( - ( Math.floor( o / 5 ) % 5 ) * 400 ) + 800
          object.position.y = ( Math.floor( o / 25 ) ) * 400 - 800

          this.targets.grid.push( object )

        }

        //

        const buttonTable = document.getElementById( 'helix' )
        buttonTable.addEventListener( 'click', () => {

          this.transform( 'MATERIALS', this.targets.sinStar, 2000 )

        } )

        const buttonSphere = document.getElementById( 'sphere' )
        buttonSphere.addEventListener( 'click', () => {

          this.transform( 'PROJECTS', this.targets.sphere, 2000 )

        } )

        /*const buttonHelix = document.getElementById( 'helix' )
        buttonHelix.addEventListener( 'click', () => {

          this.transform( this.targets.helix, 2000 )

        } )*/

        const buttonGrid = document.getElementById( 'grid' )
        buttonGrid.addEventListener( 'click', () => {

          this.transform( 'CONTACT', this.targets.grid, 2000 )

        } )



        setTimeout( () => {
          this.transform( 'PROJECTS', this.targets.sphere, 2000 )
        }, 2500)

        setTimeout( () => {
          // this.camera.position.set(0,0,800)
          this.camera.updateProjectionMatrix()
          this.controls.enabled = true
          this.toneLight.intensity = 8
        }, 6000)



      },
      transform ( selection, targets, duration ) {

        TWEEN.removeAll()

        // const targetPosition = (0,200,400)
          
        /*new TWEEN.Tween( this.camera.position )
          .to(targetPosition, 2000)
          .start()*/

        for ( let i = 0; i < this.objects.length; i ++ ) {

          const object = this.objects[ i ]
          const target = targets[ i ]

          new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start()

          new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start()

        }

        new TWEEN.Tween( this )
          .to( {}, duration * 2 )
          .onUpdate( () => {
            this.render()
            this.camera.updateProjectionMatrix()
          } )
          .onStart(() => {
            this.isTransition = true
            this.selection = selection
          })
          .onComplete(() => {
            this.isTransition = false
          })
          .start()

      },
      animate () {
        requestAnimationFrame(this.animate)

        let time = this.clock.getElapsedTime()
        let noise = tooloud.Simplex.noise(time,time,time) * 0.5
        this.toneLight.intensity += noise / 2

        if (!this.isTransition) {

          if (this.selection === 'INIT') {
            // this.toneLight.intensity += noise * 100 + 100
          }

          if (this.selection === 'PROJECTS' ) {
            for ( let i = 0, l = this.objects.length; i < l; i ++ ) {
              let x = Math.sin(this.objects[i].position.x + time)
              let y = Math.sin(this.objects[i].position.y + time)
              let z = Math.sin(this.objects[i].position.z + time)
              let noise = tooloud.Perlin.noise(x,y,z) * 0.01

              this.objects[i].rotation.x += 0.001 * (i % 5 ) - (i % 25) * 0.0002
              this.objects[i].rotation.y += noise
              this.objects[i].rotation.z += 0.001 * (i % 5) - (i % 25) * 0.0002
            }
          }

          if (this.selection === 'MATERIALS') {
            for ( let i = 0, l = this.objects.length; i < l; i ++ ) {
              let x = Math.sin(this.objects[i].position.x + time)
              let y = Math.sin(this.objects[i].position.y + time)
              let z = Math.sin(this.objects[i].position.z + time)
              let noise = tooloud.Perlin.noise(x,y,z) * 0.02

              this.objects[i].rotation.x += noise
              this.objects[i].rotation.y += noise
              this.objects[i].rotation.z += noise
            }
          }

          if (this.selection === 'CONTACT') {

            for ( let i = 0, l = this.objects.length; i < l; i ++ ) {
              let o = (i==25) ? 26 : i // to account for 25 sitting on top of 26
              let x = Math.sin(this.objects[o].rotation.x + time)
              let y = Math.sin(this.objects[o].rotation.y + time)
              let z = Math.sin(this.objects[o].rotation.z + time)
              let noise = tooloud.Simplex.noise(x,y,z) * 0.05

              this.objects[i].rotation.x += noise
              this.objects[i].rotation.y += noise
              this.objects[i].rotation.z += noise
            }
          }
      
        }
        
        if (this.controls.enabled && !this.isTransition) {
          this.scene.rotation.y += 0.0005
          this.laptop.rotation.y -= 0.0005
        }


        TWEEN.update()
        this.controls.update()
        this.render()
      },
      render () {
        this.renderer.render(this.scene, this.camera)

        this.controls.update()
      },
      onWindowResize () {

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize( window.innerWidth, window.innerHeight )

        this.renderer.render( this.scene, this.camera )

        this.controls.handleResize()

      },
      startAnimation () {
        this.animate()
        this.renderer.render(this.scene, this.camera)
      }
    }
  }
</script>

<style scoped>
.loading {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #0b0b0b;
  color: #88ffff99;
	display: flex;
	align-items: center;
  justify-content: center;
	flex-wrap: wrap;
  box-shadow: 0px 0px 12px rgba(0,255,255,0.5);
}

.progress-text {
  color: #88ffff;
  text-shadow: 0 0 10px rgba(0,255,255,0.55);
  font-weight: 400;
  padding-left: .3rem;
  opacity: .8;
}

.progress-bar {
	height: 2px;
	width: 100px;
	background: #88ffff;
  opacity: .8;
  transition: all .1s linear;
  color: #88ffff99;
  box-shadow: 0px 0px 12px rgba(48, 66, 66, 0.8);
}


#container {
	width: 100%;
	height: 100%;
	opacity: 0;
}

#container.loaded {
	opacity: 1;
  transition: opacity .4s ease-out;
}









/* start periodic table styles */

a {
  color: #8ff;
}

#menu {
  position: absolute;
  bottom: 3rem;
  width: 100%;
  text-align: center;
}

.element {
  width: 120px;
  height: 160px;
  box-shadow: 0px 0px 12px rgba(0,255,255,0.5);
  border: 1px solid rgba(127,255,255,0.25);
  font-family: Helvetica, sans-serif;
  text-align: center;
  line-height: normal;
  cursor: default;
}

.element:hover {
  box-shadow: 0px 0px 12px rgba(0,255,255,0.75);
  border: 1px solid rgba(127,255,255,0.75);
}

  .element .number {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 12px;
    color: rgba(127,255,255,0.75);
  }

  .element .symbol {
    position: absolute;
    top: 40px;
    left: 0px;
    right: 0px;
    font-size: 60px;
    font-weight: bold;
    color: rgba(255,255,255,0.75);
    text-shadow: 0 0 10px rgba(0,255,255,0.95);
  }

  .element .details {
    position: absolute;
    bottom: 15px;
    left: 0px;
    right: 0px;
    font-size: 12px;
    color: rgba(127,255,255,0.75);
  }

button {
  color: rgba(127,255,255,0.75);
  background: transparent;
  outline: 1px solid rgba(127,255,255,0.75);
  border: 0px;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  opacity: .8;
  transition: all .1s ease-in, opacity 0s linear;
}

button:hover {
  background-color: rgba(0,255,255,0.06);
  transition: all .05s ease-out, opacity 0s linear;
  opacity: 1;
}

button:active {
  color: #000000;
  background-color: rgba(0,255,255,0.6);
  transition: all .0s ease-out, opacity 0s linear;
}


</style>
