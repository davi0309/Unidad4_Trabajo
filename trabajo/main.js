/**
 * MAIN.JS - Orquestador Modular de la Experiencia Kuramoto Panem
 */

let districts = [];
let K_coupling = 1.8;
let listeningRadius = 320;
let clockTempo = 1.0;
let currentLayout = 'CLOCK';
let draggedDistrict = null;
let hoveredDistrict = null;

let sonicRipples = [];
let fireParticles = [];

// Si se carga mediante módulos externos
window.addEventListener('DOMContentLoaded', () => {
  console.log("Panem: Experiencia Kuramoto cargada exitosamente.");
});