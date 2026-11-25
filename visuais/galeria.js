"use strict";

const element = (id) => document.getElementById(id);

function acousticProfile(id, mode) {
  const canvas = element(id);
  const context = canvas.getContext("2d");
  const { width, height } = canvas;
  const gapStart = Math.floor(width * 0.38);
  const gapWidth = Math.floor(width * 0.25);
  const gapEnd = gapStart + gapWidth;
  const image = context.createImageData(width, height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const angle = x / width * Math.PI * 2;
      const offset = x >= gapStart && x < gapEnd ? (x - gapStart) / gapWidth : null;
      const divergence = offset === null ? 0 : Math.sin(offset * Math.PI);
      const layer = Math.sin(y / 4 + Math.sin(angle) * 4);
      const grain = Math.cos(x * 2.31 + y * 6.07) * 9;
      const feature = y - height / 2 - 22 * Math.sin(angle);
      const amplitude = 122 + layer * 32 + grain - 53 * Math.exp(-(feature ** 2) / 28);
      let color = [amplitude + 46, amplitude, amplitude * 0.57];

      if (mode === "masked" && offset !== null) {
        color = [26, 41, 55];
      } else if (mode === "estimate" && offset !== null) {
        color = [amplitude + 29, amplitude + 14, amplitude * 0.8 + 24];
      } else if (mode === "uncertainty") {
        color = [32 + divergence * 219, 45 + divergence * 88, 62 + divergence * 7];
      }
      image.data.set([...color, 255], (y * width + x) * 4);
    }
  }
  context.putImageData(image, 0, 0);

  if (mode === "estimate") {
    context.strokeStyle = "#f9fbff";
    context.setLineDash([4, 3]);
    context.strokeRect(gapStart + 0.5, 0.5, gapWidth, height - 1);
    context.setLineDash([]);
  }
}

function drawGeometry() {
  const amount = Number(element("lacuna").value);
  element("graus").textContent = `${amount}°`;
  const canvas = element("curva");
  const context = canvas.getContext("2d");
  const { width, height } = canvas;
  const gapWidth = width * amount / 360;
  const start = (width - gapWidth) / 2;
  const end = start + gapWidth;

  context.fillStyle = "#23384b";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#6b4c2c";
  context.fillRect(start, 0, gapWidth, height);
  for (const [from, to, estimated] of [[0, start, false], [start, end, true], [end, width, false]]) {
    context.beginPath();
    context.strokeStyle = estimated ? "#ffe5ac" : "#74e1ce";
    context.lineWidth = 3;
    context.setLineDash(estimated ? [6, 5] : []);
    const wave = (x) => height / 2 + 52 * Math.sin(x / width * Math.PI * 2);
    context.moveTo(from, wave(from));
    for (let x = from + 1; x < to; x += 1) context.lineTo(x, wave(x));
    context.lineTo(to, wave(to));
    context.stroke();
  }
}

function drawTracks() {
  const canvas = element("perfis");
  const context = canvas.getContext("2d");
  const { width, height } = canvas;
  const trackWidth = width / 4;
  context.fillStyle = "#23384b";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#614b35";
  context.fillRect(0, 62, width, 24);

  for (const [i, color] of ["#72e3cb", "#f8d88a", "#acc4fd", "#f8aabf"].entries()) {
    const middle = (i + 0.5) * trackWidth;
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.moveTo(middle, 0);
    for (let depth = 1; depth < height; depth += 1) {
      const shift = 33 * Math.exp(-((depth - 74) ** 2) / 200);
      const oscillation = 15 * Math.sin(depth / (5 + 2 * i) + i);
      context.lineTo(middle + shift + oscillation, depth);
    }
    context.stroke();
  }
}

const defaults = { minutos: 40, equipes: 35, hora: 200, dias: 220 };
const fields = Object.keys(defaults).map(element);
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const hours = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const scale = element("escala").tBodies[0];
const teamCounts = [1, 5, 10, 20, 35, 50, 100];

function updateProjection() {
  const result = element("projecao");
  if (fields.some((field) => field.value === "" || !field.validity.valid)) {
    result.textContent = "Preencha os quatro parâmetros com valores válidos.";
    scale.replaceChildren();
    return;
  }

  const [minutes, teams, hourlyRate, days] = fields.map((field) => field.valueAsNumber);
  const annualHours = minutes / 60 * days;
  const annualValue = annualHours * hourlyRate;

  result.textContent = `${money.format(annualValue * teams)} por ano · ${hours.format(annualHours * teams)} horas de equipe liberadas · ${money.format(annualValue)} por equipe`;
  scale.replaceChildren(...teamCounts.map((count) => {
    const row = document.createElement("tr");
    const heading = document.createElement("th");
    const cell = document.createElement("td");
    const bar = document.createElement("meter");
    heading.scope = "row";
    heading.textContent = String(count);
    bar.max = 100;
    bar.value = annualValue > 0 ? count : 0;
    bar.setAttribute("aria-hidden", "true");
    cell.append(bar, money.format(annualValue * count));
    row.append(heading, cell);
    return row;
  }));
}

for (const field of fields) field.addEventListener("input", updateProjection);
element("restaurar").addEventListener("click", () => {
  for (const field of fields) field.value = defaults[field.id];
  updateProjection();
});

const referenceButton = element("referencia");
referenceButton.addEventListener("click", () => {
  const showReference = referenceButton.getAttribute("aria-pressed") === "false";
  referenceButton.setAttribute("aria-pressed", String(showReference));
  referenceButton.textContent = showReference ? "Ocultar referência" : "Mostrar referência";
  const label = showReference ? "Referência sintética completa" : "Observado com lacuna";
  element("original-label").textContent = label;
  element("original").setAttribute("aria-label", label);
  acousticProfile("original", showReference ? "reference" : "masked");
});

element("lacuna").addEventListener("input", drawGeometry);
acousticProfile("aquisicao-log", "reference");
acousticProfile("hipoteses", "uncertainty");
acousticProfile("original", "masked");
acousticProfile("estimativa", "estimate");
acousticProfile("incerteza-log", "uncertainty");
drawGeometry();
drawTracks();
updateProjection();
