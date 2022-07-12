<template>
    <div class="worldmap" @wheel="onWheel" @mousedown="onMousedown" @mouseup="onMouseup" @mousemove="onMousemove">
        <div :style="worldStyle" class="worldmap_svg" :class="{ 'worldmap_svg-transitionon': this.transitionOn }">
            <div v-for="marker in cMarkers" :key="marker.id" class="worldmap_markerwrap" :style="getMarkerPosition(marker)">
                <slot name="marker" :marker="marker"><div class="worldmap_marker"></div></slot>
            </div>

            <slot></slot>

            <world-map-svg />
        </div>
    </div>
</template>

<script>
import {getUniqueId} from "@/utils/index.js";
import {projectAbsoluteR} from "@/components/WorldMap/robinson-projection.js";
import { mat2d } from 'gl-matrix';
import WorldMapSvg from "@/components/WorldMap/WorldMapSvg.vue";

export default {
    components: {WorldMapSvg},

    props: {
        enableZooming: {
            type: Boolean,
            default: false
        },
        reverseZooming: {
            type: Boolean,
            default: false
        },
        zoomMin: {
            type: Number,
            default: 1
        },
        zoomMax: {
            type: Number,
            default: 4
        },
        zoomSpeed: {
            type: Number,
            default: 0.15
        },
        enablePanning: {
            type: Boolean,
            default: false
        },
        panSpeed: {
            type: Number,
            default: 1.5
        },
        markers: {
            type: Array,
            default() {
                return [];
            }
        },
    },

    data() {
        return {
            transformMatrix: mat2d.create(),
            mouseIsDown: false,
            worldStyle: {},
            transitionOn: true,
            mapWidth: 2000,
            mapHeight: 857,
        }
    },

    computed: {
        cMarkers() {
            return this.markers.map(marker => {
                if (!marker.id) {
                    marker.id = getUniqueId();
                }

                return marker;
            });
        }
    },

    methods: {
        scale(zoom, mousePosition) {
            const { transformMatrix } = this;

            if (transformMatrix[0] * zoom < this.zoomMin || transformMatrix[0] * zoom > this.zoomMax) {
                return;
            }

            const Pinv = mat2d.fromTranslation(mat2d.create(), [-mousePosition.x, -mousePosition.y]);
            const S = mat2d.fromScaling(mat2d.create(), [zoom, zoom]);
            const P = mat2d.fromTranslation(mat2d.create(), [mousePosition.x, mousePosition.y]);

            // T = P * S * Pinv * T
            mat2d.multiply(transformMatrix, Pinv, transformMatrix);
            mat2d.multiply(transformMatrix, S, transformMatrix);
            mat2d.multiply(transformMatrix, P, transformMatrix);

            this.setScaleProperty(zoom);
        },

        pan(dx, dy) {
            const { transformMatrix }  = this;
            const { panSpeed } = this;
            const P = mat2d.fromTranslation(mat2d.create(), [dx * panSpeed, dy * panSpeed]);

            mat2d.multiply(transformMatrix, P, transformMatrix);
        },

        setScaleProperty() {
            const { $el } = this;

            if ($el.style.setProperty) {
                $el.style.setProperty('--worldmap-scale', this.transformMatrix[0]);
            }
        },

        setStyle() {
            this.worldStyle = {
                transform: this.getTransformMatrix(),
            }
        },

        getTransformMatrix() {
            return `matrix(${this.transformMatrix.join(',')})`;
        },

        getMarkerPosition(marker) {
            const proj = projectAbsoluteR(marker.lat, marker.lon, this.mapWidth, 0.975, -15, 8);
            // const proj = projectAbsoluteR(marker.lat, marker.lon, this.mapWidth, 0.99, -10, 10);

            return {
                top: `${((proj.y / this.mapHeight) * 100)}%`,
                left: `${((proj.x / this.mapWidth) * 100)}%`,
            };
        },

        getMousePosition(event) {
            const elRect = this.$el.getBoundingClientRect();
            const x = event.pageX - window.scrollX - elRect.x;
            const y = event.pageY - window.scrollY - elRect.y;

            return {x, y};
        },

        onMousedown() {
            if (this.enablePanning) {
                this.mouseIsDown = true;
                this.transitionOn = false;
            }
        },

        onMouseup() {
            this.mouseIsDown = false;
            this.transitionOn = true;
        },

        onMousemove(event) {
            if (this.mouseIsDown) {
                this.pan(event.movementX, event.movementY);
                this.setStyle();
            }
        },

        /**
         * @param {WheelEvent} event
         */
        onWheel(event) {
            if (this.enableZooming) {
                event.preventDefault();

                this.scale(
                    event.deltaY < 0 ? (1 + this.zoomSpeed) : (1 - this.zoomSpeed),
                    this.getMousePosition(event)
                );

                this.setStyle();
            }
        }
    }
}
</script>

<style lang="scss">
.worldmap {
    --worldmap-scale: 1;
    --worldmap-fill: #ececec;
    --worldmap-stroke: #333;

    overflow: hidden;
    height:0;
    padding-top:42.85%;
    position: relative;

    &_svg {
        position: absolute;
        top:0;
        left:0;
        height: 100%;
        width: 100%;
        transform-origin: top left;

        svg {
            fill: var(--worldmap-fill);
            stroke: var(--worldmap-stroke);
            display:block;
            height: 100%;
            width: 100%;
        }

        &-transitionon {
            transition: transform 200ms ease;
        }
    }

    &_markerwrap {
        position: absolute;
        transform:  translateX(-50%) translateY(-50%) scale(calc(1 / var(--worldmap-scale)), calc(1 / var(--worldmap-scale)));
        transition: transform 200ms ease;

        &:hover {
            z-index: 2;
        }
    }

    &_marker {
        border-radius: 50%;
        width: 16px;
        height: 16px;
        background: rgba(53, 136, 138, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9em;
        overflow: hidden;
    }
}
</style>
