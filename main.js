let descuentoAplicado = false;
let planSeleccionado = null;

const planes = [
  { id: 1, nombre: "Básico", velocidad: "50 Mbps", precio: 25 },
  { id: 2, nombre: "Intermedio", velocidad: "100 Mbps", precio: 40 },
  { id: 3, nombre: "Premium", velocidad: "300 Mbps", precio: 60 }
];

const app = document.getElementById("app");
const extrasDiv = document.getElementById("extras");
const resultadoDiv = document.getElementById("resultado");

planes.forEach(plan => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h3>${plan.nombre}</h3>
    <p>Velocidad: ${plan.velocidad}</p>
    <p>Precio base: $${plan.precio}</p>
    <button onclick="seleccionarPlan(${plan.id})">Elegir Plan</button>
  `;
  app.appendChild(card);
});

function seleccionarPlan(id) {
  planSeleccionado = planes.find(p => p.id === id);
  extrasDiv.classList.remove("hidden");
  resultadoDiv.innerHTML = "";
  Swal.fire("Plan seleccionado", `Seleccionaste el ${planSeleccionado.nombre}`, "info");
}

document.getElementById("formDescuento").addEventListener("submit", e => {
  e.preventDefault();
  const codigo = document.getElementById("codigo").value.trim().toUpperCase();
  if (codigo === "PROMO10") {
    descuentoAplicado = true;
    Swal.fire("¡Descuento aplicado!", "Obtendrás 10% OFF en el total", "success");
  } else {
    descuentoAplicado = false;
    Swal.fire("Código inválido", "Intentá nuevamente", "error");
  }
});

document.getElementById("calcularBtn").addEventListener("click", () => {
  if (!planSeleccionado) {
    Swal.fire("Error", "Primero selecciona un plan", "warning");
    return;
  }

  const checkboxes = extrasDiv.querySelectorAll("input[type='checkbox']");
  let extrasTotales = 0;
  let extrasDetalle = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      extrasTotales += Number(cb.value);
      extrasDetalle.push(`$${cb.value}`);
    }
  });

  let total = planSeleccionado.precio + extrasTotales;

  if (descuentoAplicado) {
    total = total * 0.9;
  }

  const cuotas = [3, 6, 12].map(meses => {
    return `${meses} cuotas de $${(total / meses).toFixed(2)}`;
  });

  resultadoDiv.innerHTML = `
    <p>Plan: ${planSeleccionado.nombre} - $${planSeleccionado.precio}</p>
    <p>Extras: $${extrasTotales} (${extrasDetalle.join(", ") || "Ninguno"})</p>
    <p><strong>Total final: $${total.toFixed(2)}</strong></p>
    <p>Simulación de cuotas:</p>
    <ul>
      ${cuotas.map(c => `<li>${c}</li>`).join("")}
    </ul>
  `;
});
