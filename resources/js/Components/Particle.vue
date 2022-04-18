<template>
  <div class="particles">
    <div id="particles-js"></div>
  </div>
  <div id="app">
    <div id="container-id" class="container-class"></div>
  </div>
</template>

<script>
import './particles.js'
import Vue from 'vue';
new Vue({
  el: '#app',
  data: function() {
    return {
      value: '100',
      area_value: '800',
      enable: true
    }
  },
  mounted: function() {
      this.$nextTick(() => {
          this.initParticleJS()
      })
  },
  methods: {
    initParticleJS () {
      particlesJS('container-id', {
          "particles": {
            "number": {
              "value": this.value,
              "density": {
                "enable": this.enable,
                "value_area": this.area_value
              }
            },
            "color": {
              "value": "#FFFFFF"
            },
            "shape": {
              "type": "edge",
              "stroke": {
                "width": 0,
                "color": "#FFFFFF"
              },
              "polygon": {
                "nb_sides": 5
              }
            },
            "opacity": {
              "value": 0.5,
              "random": false,
              "anim": {
                "enable": !this.enable,
                "speed": 1.5,
                "opacity_min": 0.15,
                "sync": false
              }
            },
            "size": {
              "value": 3,
              "random": false,
              "anim": {
                "enable": this.enable,
                "speed": 5,
                "size_min": 0.15,
                "sync": false
              }
            },
            "line_linked": {
              "enable": this.enable,
              "distance": 150,
              "color": "#FFFFFF",
              "opacity": 0.25,
              "width": 1
            },
            "move": {
              "enable": this.enable,
              "speed": 2.5,
              "direction": "none",
              "random": false,
              "straight": false,
              "out_mode": "out",
              "bounce": false,
              "attract": {
                "enable": !this.enable,
                "rotateX": 600,
                "rotateY": 1200
              }
            }
              },
              "interactivity": {
            "detect_on": "canvas",
            "events": {
              "onhover": {
                "enable": !this.enable,
                "mode": "grab"
              },
              "onclick": {
                "enable": this.enable,
                "mode": "repulse"
              },
              "resize": true
            },
            "modes": {
              "grab": {
                "distance": 140,
                "line_linked": {
                  "opacity": 1
                }
              },
              "bubble": {
                "distance": 400,
                "size": 40,
                "duration": 2,
                "opacity": 8,
                "speed": 3
              },
              "repulse": {
                "distance": 200,
                "duration": 0.4
              },
              "push": {
                "particles_nb": 4
              },
              "remove": {
                "particles_nb": 2
              }
            }
          },
          "retina_detect": true
      });
    }
  }
})
</script>

<style scoped>
#particles-js {
  background: black;
  height: 100%;
  width: 100%;
}

/* -canvas- */
canvas {
    display: block;
    vertical-align: bottom;
}
/* -particle container- */
.container-class {
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background: #2E4A62;
}
</style>
