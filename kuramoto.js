/**
 * KURAMOTO.JS - Modelo Dinámico de Sincronización de Fases (Panem)
 * Ecuación: d(theta_i)/dt = omega_i + (K/N) * sum_j (w_ij * sin(theta_j - theta_i))
 */

const DISTRICT_DATA = [
  { num: 1, name: "Lujo", desc: "Joyas, gemas y glamour", color: [250, 204, 21], sector: "01:00" },
  { num: 2, name: "Armas", desc: "Centro militar y canteras", color: [225, 29, 72], sector: "02:00" },
  { num: 3, name: "Tecnología", desc: "Electrónica y cómputo", color: [56, 189, 248], sector: "03:00" },
  { num: 4, name: "Pesca", desc: "Costas y vida marítima", color: [14, 165, 233], sector: "04:00" },
  { num: 5, name: "Energía", desc: "Plantas hidroeléctricas", color: [234, 179, 8], sector: "05:00" },
  { num: 6, name: "Transporte", desc: "Trenes y aerodeslizadores", color: [168, 85, 247], sector: "06:00" },
  { num: 7, name: "Madera", desc: "Bosques y tala", color: [180, 83, 9], sector: "07:00" },
  { num: 8, name: "Textil", desc: "Uniformes y fábricas", color: [236, 72, 153], sector: "08:00" },
  { num: 9, name: "Cereales", desc: "Campos de trigo y silos", color: [245, 158, 11], sector: "09:00" },
  { num: 10, name: "Ganado", desc: "Ranchos y carnicería", color: [217, 119, 6], sector: "10:00" },
  { num: 11, name: "Agricultura", desc: "Cultivos y huertos", color: [34, 197, 94], sector: "11:00" },
  { num: 12, name: "Minería", desc: "Carbón y Veta rebelde", color: [148, 163, 184], sector: "12:00" }
];

class DistrictNode {
  constructor(data, startX, startY) {
    this.num = data.num;
    this.name = data.name;
    this.desc = data.desc;
    this.color = data.color;
    this.sector = data.sector;

    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;

    this.vx = (Math.random() - 0.5);
    this.vy = (Math.random() - 0.5);

    this.theta = Math.random() * Math.PI * 2;
    this.baseOmega = 0.022 + Math.random() * 0.016;
    this.omega = this.baseOmega;

    this.isIsolated = false;
    this.isolationTimer = 0;

    this.pulse = 0;
    this.scaleImpulse = 1.0;
  }

  toggleRebellion() {
    this.isIsolated = !this.isIsolated;
    if (this.isIsolated) {
      this.isolationTimer = 400;
      this.omega = this.baseOmega * 1.8;
      this.vx += (Math.random() - 0.5) * 4;
      this.vy += (Math.random() - 0.5) * 4;
    } else {
      this.omega = this.baseOmega;
    }
  }

  update(all, K, radius, tempo, motionFactor = 0.75, cx = 0, cy = 0, clockRadius = 250, arenaRotation = 0, isFree = false) {
    if (this.isIsolated) {
      this.isolationTimer--;
      if (this.isolationTimer <= 0) {
        this.isIsolated = false;
        this.omega = this.baseOmega;
      }
    }

    if (!isFree) {
      let angle = (this.num) * (Math.PI * 2 / 12) - Math.PI / 2 + arenaRotation;
      let baseAnchorX = cx + Math.cos(angle) * clockRadius;
      let baseAnchorY = cy + Math.sin(angle) * clockRadius;

      let orbitAmp = 18 * motionFactor;
      let phaseDx = Math.cos(this.theta) * orbitAmp;
      let phaseDy = Math.sin(this.theta) * orbitAmp;

      this.targetX = baseAnchorX + phaseDx;
      this.targetY = baseAnchorY + phaseDy;

      this.x += (this.targetX - this.x) * 0.07;
      this.y += (this.targetY - this.y) * 0.07;
    } else {
      this.x += this.vx * tempo;
      this.y += this.vy * tempo;
      this.vx *= 0.98;
      this.vy *= 0.98;
    }

    // Acoplamiento Kuramoto
    let couplingSum = 0;
    let count = 0;

    if (!this.isIsolated) {
      for (let other of all) {
        if (other.num === this.num || other.isIsolated) continue;
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let d = Math.sqrt(dx * dx + dy * dy);

        if (d < radius && d > 0) {
          let weight = 1.0 - (d / radius);
          couplingSum += weight * Math.sin(other.theta - this.theta);
          count++;
        }
      }
    }

    let dTheta = this.omega * tempo;
    if (count > 0 && !this.isIsolated) {
      dTheta += (K / count) * couplingSum * 0.016 * tempo;
    }

    let prevTheta = this.theta;
    this.theta += dTheta;

    let emitted = false;
    if (Math.floor(prevTheta / (Math.PI * 2)) < Math.floor(this.theta / (Math.PI * 2))) {
      this.pulse = 1.0;
      this.scaleImpulse = 1.25;
      emitted = true;
    }

    this.theta = this.theta % (Math.PI * 2);

    if (this.pulse > 0) this.pulse -= 0.035;
    this.scaleImpulse += (1.0 - this.scaleImpulse) * 0.08;

    return emitted;
  }
}

function calculateKuramotoOrder(districts) {
  if (!districts || districts.length === 0) return { R: 0, psi: 0 };
  let sumCos = 0;
  let sumSin = 0;
  for (let d of districts) {
    sumCos += Math.cos(d.theta);
    sumSin += Math.sin(d.theta);
  }
  let meanCos = sumCos / districts.length;
  let meanSin = sumSin / districts.length;
  let R = Math.sqrt(meanCos * meanCos + meanSin * meanSin);
  let psi = Math.atan2(meanSin, meanCos);
  return { R, psi };
}