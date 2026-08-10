"use strict";

/* ================================================================
   CONFIGURACIÓN EDITABLE
   Sustituye estas listas cuando tengas los datos definitivos.
   ================================================================ */

const EMPRESAS = [
  "Hayco",
  "B.Braun",
  "Hanes",
  "Gildan",
  "Cardinal",
  "Empresa 06", "Empresa 07", "Empresa 08", "Empresa 09",
  "Empresa 10", "Empresa 11", "Empresa 12", "Empresa 13", "Empresa 14",
  "Empresa 15", "Empresa 16", "Empresa 17", "Empresa 18", "Empresa 19",
  "Empresa 20", "Empresa 21", "Empresa 22", "Empresa 23", "Empresa 24",
  "Empresa 25", "Empresa 26", "Empresa 27", "Empresa 28", "Empresa 29",
  "Empresa 30", "Empresa 31", "Empresa 32", "Empresa 33", "Empresa 34",
  "Empresa 35"
];

const RECLUTADORES = [
  "Sin asignar",
  "Reclutador 1",
  "Reclutador 2",
  "Reclutador 3",
  "Reclutador 4",
  "Reclutador 5"
];

const TURNOS = ["A/B", "C"];
const DIAS_ADICIONALES_TURNO_C = 3;

const RANGOS_PROMESA = [
  { minimo: 1, maximo: 30, diasLaborables: 3 },
  { minimo: 31, maximo: 50, diasLaborables: 4 },
  { minimo: 51, maximo: 100, diasLaborables: 7 },
  { minimo: 101, maximo: Infinity, diasLaborables: null, requiereAcuerdo: true }
];

const MIGRACION_EMPRESAS = {
  "ZFLA Servicios": "Hayco",
  "ATALYS Moldeo": "B.Braun",
  "Caribe Textiles": "Hanes",
  "NovaLogística": "Gildan",
  "Empresa 05": "Cardinal"
};

const MIGRACION_RECLUTADORES = {
  "Ana Martínez": "Reclutador 1",
  "Carlos Reyes": "Reclutador 2",
  "Laura Gómez": "Reclutador 3",
  "Miguel Santos": "Reclutador 4"
};

const MIGRACION_TURNOS = {
  "Diurno": "A/B",
  "Nocturno": "C",
  "Rotativo": "A/B",
  "Mixto": "C"
};

const CLAVE_ALMACENAMIENTO = "gestion-requisiciones-html-v1";
const CLAVE_ACTUALIZACION = "gestion-requisiciones-html-updated-at";
const TAMANO_PAGINA = 20;

const REGISTROS_DEMO = [
  { id: 1058, fechaRequisicion: "2026-08-05", empresa: "Hayco", reclutador: "Reclutador 1", cantidad: 10, turno: "A/B", fechaPromesa: "2026-08-10", fechaEnvio: "2026-08-07", cantidadEnviada: 12, cantidadAceptada: 9 },
  { id: 1057, fechaRequisicion: "2026-08-03", empresa: "B.Braun", reclutador: "Reclutador 2", cantidad: 12, turno: "C", fechaPromesa: "2026-08-11", fechaEnvio: "2026-08-12", cantidadEnviada: 14, cantidadAceptada: 10 },
  { id: 1056, fechaRequisicion: "2026-08-10", empresa: "Hanes", reclutador: "Reclutador 3", cantidad: 5, turno: "A/B", fechaPromesa: "2026-08-13", fechaEnvio: "2026-08-18", cantidadEnviada: 6, cantidadAceptada: 4 },
  { id: 1055, fechaRequisicion: "2026-08-17", empresa: "Gildan", reclutador: "Reclutador 4", cantidad: 18, turno: "C", fechaPromesa: "2026-08-25", fechaEnvio: "", cantidadEnviada: 0, cantidadAceptada: 0 },
  { id: 1054, fechaRequisicion: "2026-08-19", empresa: "Hayco", reclutador: "Reclutador 1", cantidad: 7, turno: "A/B", fechaPromesa: "2026-08-24", fechaEnvio: "2026-08-25", cantidadEnviada: 8, cantidadAceptada: 7 },
  { id: 1053, fechaRequisicion: "2026-08-24", empresa: "Cardinal", reclutador: "Reclutador 3", cantidad: 9, turno: "C", fechaPromesa: "2026-09-01", fechaEnvio: "2026-08-30", cantidadEnviada: 7, cantidadAceptada: 3 },
  { id: 1052, fechaRequisicion: "2026-07-03", empresa: "Hayco", reclutador: "Reclutador 1", cantidad: 8, turno: "A/B", fechaPromesa: "2026-07-08", fechaEnvio: "2026-07-07", cantidadEnviada: 10, cantidadAceptada: 8 },
  { id: 1051, fechaRequisicion: "2026-07-08", empresa: "B.Braun", reclutador: "Reclutador 2", cantidad: 12, turno: "C", fechaPromesa: "2026-07-16", fechaEnvio: "2026-07-16", cantidadEnviada: 13, cantidadAceptada: 11 },
  { id: 1050, fechaRequisicion: "2026-07-14", empresa: "Hanes", reclutador: "Reclutador 3", cantidad: 5, turno: "A/B", fechaPromesa: "2026-07-17", fechaEnvio: "2026-07-20", cantidadEnviada: 6, cantidadAceptada: 4 },
  { id: 1049, fechaRequisicion: "2026-07-22", empresa: "Gildan", reclutador: "Reclutador 4", cantidad: 18, turno: "C", fechaPromesa: "2026-07-30", fechaEnvio: "2026-07-30", cantidadEnviada: 18, cantidadAceptada: 15 }
];

let registros = cargarRegistros();
let idEnEdicion = null;
let temporizadorAviso = null;
let empresaSeleccionada = "Todas";
let mesSeleccionado = "";
let alertaSeleccionada = "Todas";
let rankingSeleccionado = "pending";
let paginaActual = 1;
let ultimaActualizacion = cargarUltimaActualizacion();

const dashboardView = document.getElementById("dashboardView");
const formView = document.getElementById("formView");
const navDashboard = document.getElementById("navDashboard");
const navForm = document.getElementById("navForm");
const navRecords = document.getElementById("navRecords");
const navCompanies = document.getElementById("navCompanies");
const formulario = document.getElementById("requisitionForm");
const filtroEmpresa = document.getElementById("dashboardCompanyFilter");
const filtroMes = document.getElementById("monthFilter");
const filtroEstado = document.getElementById("recordStatusFilter");
const ordenRegistros = document.getElementById("recordSort");

const campos = {
  fechaRequisicion: document.getElementById("requestDate"),
  empresa: document.getElementById("company"),
  reclutador: document.getElementById("recruiter"),
  cantidad: document.getElementById("quantity"),
  turno: document.getElementById("shift"),
  fechaEnvio: document.getElementById("sendDate"),
  fechaPromesaManual: document.getElementById("manualPromiseDate"),
  cantidadEnviada: document.getElementById("sentQuantity"),
  cantidadAceptada: document.getElementById("acceptedQuantity"),
  cantidadNoAceptada: document.getElementById("notAcceptedQuantity")
};

/* ================================================================
   FECHAS, MÉTRICAS Y ALMACENAMIENTO
   ================================================================ */

function convertirFechaLocal(valor) {
  const partes = valor.split("-").map(Number);
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

function fechaParaInput(fecha) {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
}

function agregarDiasLaborables(fechaTexto, cantidadDias) {
  if (!fechaTexto || !cantidadDias) return "";
  const resultado = convertirFechaLocal(fechaTexto);
  let agregados = 0;
  while (agregados < cantidadDias) {
    resultado.setDate(resultado.getDate() + 1);
    if (resultado.getDay() !== 0 && resultado.getDay() !== 6) agregados += 1;
  }
  return fechaParaInput(resultado);
}

function obtenerReglaPromesa(cantidad) {
  return RANGOS_PROMESA.find(function (item) {
    return cantidad >= item.minimo && cantidad <= item.maximo;
  });
}

function obtenerDiasPromesa(cantidad, turno) {
  const rango = obtenerReglaPromesa(cantidad);
  if (!rango || rango.requiereAcuerdo) return null;
  return rango.diasLaborables + (turno === "C" ? DIAS_ADICIONALES_TURNO_C : 0);
}

function diferenciaEnDias(inicial, final) {
  return Math.round((convertirFechaLocal(final) - convertirFechaLocal(inicial)) / 86400000);
}

function sumarDiasCalendario(fechaTexto, dias) {
  const fecha = convertirFechaLocal(fechaTexto);
  fecha.setDate(fecha.getDate() + dias);
  return fechaParaInput(fecha);
}

function mesAnterior(valor) {
  const fecha = convertirFechaLocal(`${valor}-01`);
  fecha.setMonth(fecha.getMonth() - 1);
  return fechaParaInput(fecha).slice(0, 7);
}

function puntuacionPuntualidad(promesa, envio) {
  if (!promesa || !envio) return 0;
  const retraso = diferenciaEnDias(promesa, envio);
  if (retraso < 0) return 100;
  if (retraso === 0) return 95;
  if (retraso <= 2) return 75;
  if (retraso <= 5) return 50;
  return 20;
}

function porcentajeAceptacion(enviada, aceptada) {
  return enviada ? Math.min(100, Math.round((aceptada / enviada) * 100)) : 0;
}

function efectividadGeneral(registro) {
  if (!registro.fechaEnvio || !registro.fechaPromesa) return 0;
  return Math.round(
    (puntuacionPuntualidad(registro.fechaPromesa, registro.fechaEnvio) * 0.4) +
    (porcentajeAceptacion(registro.cantidadEnviada, registro.cantidadAceptada) * 0.6)
  );
}

function estadoDelRegistro(registro) {
  if (registro.cantidadAceptada >= registro.cantidad) return "Aceptada";
  if (registro.cantidadEnviada > 0) return "Enviado";
  return "Pendiente";
}

function cantidadNoAceptadaRegistrada(registro) {
  const enviada = Math.max(0, Number(registro.cantidadEnviada) || 0);
  const aceptada = Math.max(0, Number(registro.cantidadAceptada) || 0);
  const disponible = Math.max(enviada - aceptada, 0);
  const registrada = Math.max(0, Number(registro.cantidadNoAceptada) || 0);
  return Math.min(registrada, disponible);
}

function metricasRegistro(registro) {
  const noAceptados = cantidadNoAceptadaRegistrada(registro);
  const enviadosTotales = Math.max(0, Number(registro.cantidadEnviada) || 0);
  const aceptados = Math.max(0, Number(registro.cantidadAceptada) || 0);
  return {
    pendientes: Math.max(registro.cantidad - enviadosTotales, 0),
    enviados: Math.max(enviadosTotales - aceptados - noAceptados, 0),
    enviadosTotales: enviadosTotales,
    aceptados: aceptados,
    rechazados: noAceptados
  };
}

function sumarMetricas(lista) {
  return lista.reduce(function (total, registro) {
    const valor = metricasRegistro(registro);
    total.pendientes += valor.pendientes;
    total.enviados += valor.enviados;
    total.enviadosTotales += valor.enviadosTotales;
    total.aceptados += valor.aceptados;
    total.rechazados += valor.rechazados;
    return total;
  }, { pendientes: 0, enviados: 0, enviadosTotales: 0, aceptados: 0, rechazados: 0 });
}

function formatearFecha(valor, corto) {
  if (!valor) return "—";
  return new Intl.DateTimeFormat("es-DO", corto
    ? { day: "2-digit", month: "short" }
    : { day: "2-digit", month: "short", year: "numeric" }
  ).format(convertirFechaLocal(valor));
}

function etiquetaMes(valor) {
  if (!valor) return "Todos los meses";
  const texto = new Intl.DateTimeFormat("es-DO", { month: "long", year: "numeric" })
    .format(convertirFechaLocal(`${valor}-01`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function obtenerIniciales(nombre) {
  return nombre.split(" ").map(function (parte) { return parte.charAt(0); }).slice(0, 2).join("");
}

function escaparHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function cargarRegistros() {
  const demoNormalizados = REGISTROS_DEMO.map(function (registro) {
    return Object.assign({}, registro, { cantidadNoAceptada: 0 });
  });
  try {
    const guardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (guardados) {
      const anteriores = JSON.parse(guardados);
      let huboMigracion = false;
      const actualizados = anteriores.map(function (registro) {
        const empresaNueva = MIGRACION_EMPRESAS[registro.empresa];
        const reclutadorNuevo = MIGRACION_RECLUTADORES[registro.reclutador];
        const turnoNuevo = MIGRACION_TURNOS[registro.turno];
        const noAceptadaAnterior = Number(registro.cantidadNoAceptada);
        const noAceptadaNormalizada = cantidadNoAceptadaRegistrada(registro);
        const requiereNuevoCampo = !Number.isFinite(noAceptadaAnterior) || noAceptadaNormalizada !== noAceptadaAnterior;
        if (!empresaNueva && !reclutadorNuevo && !turnoNuevo && !requiereNuevoCampo) return registro;
        huboMigracion = true;
        return Object.assign({}, registro, {
          empresa: empresaNueva || registro.empresa,
          reclutador: reclutadorNuevo || registro.reclutador,
          turno: turnoNuevo || registro.turno,
          cantidadNoAceptada: noAceptadaNormalizada
        });
      });
      if (huboMigracion) localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(actualizados));
      return actualizados;
    }
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(demoNormalizados));
  } catch (error) {
    // La página sigue funcionando aunque el navegador bloquee localStorage.
  }
  return JSON.parse(JSON.stringify(demoNormalizados));
}

function cargarUltimaActualizacion() {
  try {
    const guardada = localStorage.getItem(CLAVE_ACTUALIZACION);
    if (guardada) return guardada;
    const ahora = new Date().toISOString();
    localStorage.setItem(CLAVE_ACTUALIZACION, ahora);
    return ahora;
  } catch (error) {
    return new Date().toISOString();
  }
}

function marcarActualizacion() {
  ultimaActualizacion = new Date().toISOString();
  try {
    localStorage.setItem(CLAVE_ACTUALIZACION, ultimaActualizacion);
  } catch (error) {
    // La marca de tiempo sigue disponible durante la sesión actual.
  }
  renderizarUltimaActualizacion();
}

function renderizarUltimaActualizacion() {
  const elemento = document.getElementById("lastUpdatedText");
  if (!elemento) return;
  const fecha = new Date(ultimaActualizacion);
  const texto = new Intl.DateTimeFormat("es-DO", {
    day: "numeric", month: "short", hour: "numeric", minute: "2-digit"
  }).format(fecha);
  elemento.textContent = `Actualizado ${texto}`;
  elemento.title = `Último cambio guardado: ${fecha.toLocaleString("es-DO")}`;
}

function guardarRegistros() {
  try {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(registros));
  } catch (error) {
    mostrarAviso("El navegador no permitió guardar los cambios permanentemente.", false);
  }
  marcarActualizacion();
}

/* ================================================================
   FILTROS Y DASHBOARD
   ================================================================ */

function actualizarOpcionesMes(preferido) {
  const meses = Array.from(new Set(registros.flatMap(function (registro) {
    return [registro.fechaRequisicion, registro.fechaEnvio].filter(Boolean).map(function (fecha) {
      return fecha.slice(0, 7);
    });
  }))).sort().reverse();

  const candidato = preferido || mesSeleccionado;
  mesSeleccionado = meses.includes(candidato) ? candidato : (meses[0] || fechaParaInput(new Date()).slice(0, 7));
  filtroMes.innerHTML = meses.map(function (mes) {
    return `<option value="${mes}">${etiquetaMes(mes)}</option>`;
  }).join("");
  if (!meses.length) filtroMes.innerHTML = `<option value="${mesSeleccionado}">${etiquetaMes(mesSeleccionado)}</option>`;
  filtroMes.value = mesSeleccionado;
}

function contextoFiltro() {
  return empresaSeleccionada === "Todas" ? etiquetaMes(mesSeleccionado) : `${empresaSeleccionada} · ${etiquetaMes(mesSeleccionado)}`;
}

function registrosFiltradosBase() {
  return registros.filter(function (registro) {
    const coincideMes = registro.fechaRequisicion.slice(0, 7) === mesSeleccionado;
    const coincideEmpresa = empresaSeleccionada === "Todas" || registro.empresa === empresaSeleccionada;
    return coincideMes && coincideEmpresa;
  });
}

function coincideAlerta(registro, alerta) {
  if (alerta === "Todas") return true;
  const hoy = fechaParaInput(new Date());
  const limite = sumarDiasCalendario(hoy, 2);
  const pendiente = estadoDelRegistro(registro) === "Pendiente";
  if (alerta === "overdue") return pendiente && registro.fechaPromesa && registro.fechaPromesa < hoy;
  if (alerta === "dueSoon") return pendiente && registro.fechaPromesa && registro.fechaPromesa >= hoy && registro.fechaPromesa <= limite;
  if (alerta === "deficit") return registro.cantidadEnviada < registro.cantidad;
  if (alerta === "unassigned") return registro.reclutador === "Sin asignar";
  return true;
}

function renderizarAlertas(filas) {
  const alertas = [
    ["overdue", "overdueAlert"],
    ["dueSoon", "dueSoonAlert"],
    ["deficit", "deficitAlert"],
    ["unassigned", "unassignedAlert"]
  ];
  alertas.forEach(function (item) {
    document.getElementById(item[1]).textContent = filas.filter(function (registro) {
      return coincideAlerta(registro, item[0]);
    }).length;
  });
  document.querySelectorAll("button[data-alert]").forEach(function (boton) {
    const activo = boton.dataset.alert === alertaSeleccionada;
    boton.classList.toggle("active", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });
}

function renderizarFlujo(filas) {
  const asignadas = filas.filter(function (registro) {
    return registro.reclutador && registro.reclutador !== "Sin asignar";
  }).length;
  const conEnvios = filas.filter(function (registro) {
    return registro.cantidadEnviada > 0;
  }).length;
  const cubiertas = filas.filter(function (registro) {
    return estadoDelRegistro(registro) === "Aceptada";
  }).length;

  document.getElementById("flowReceived").textContent = filas.length.toLocaleString("es-DO");
  document.getElementById("flowAssigned").textContent = asignadas.toLocaleString("es-DO");
  document.getElementById("flowSent").textContent = conEnvios.toLocaleString("es-DO");
  document.getElementById("flowCovered").textContent = cubiertas.toLocaleString("es-DO");
  document.getElementById("workflowContext").textContent = `${empresaSeleccionada === "Todas" ? "Todas las empresas" : empresaSeleccionada} · ${etiquetaMes(mesSeleccionado)}`;
}

function renderizarDashboard() {
  const filas = registrosFiltradosBase();
  const filasMesTodas = registros.filter(function (registro) {
    return registro.fechaRequisicion.slice(0, 7) === mesSeleccionado;
  });
  renderizarUltimaActualizacion();
  document.getElementById("donutContext").textContent = contextoFiltro();
  document.getElementById("sidebarCompanyCount").textContent = `${EMPRESAS.length} disponibles`;
  document.getElementById("allCompaniesButtonCount").textContent = EMPRESAS.length;
  const vistaIndividual = empresaSeleccionada !== "Todas";
  document.getElementById("activeCompanyNotice").classList.toggle("hidden", !vistaIndividual);
  document.getElementById("activeCompanyName").textContent = vistaIndividual ? empresaSeleccionada : "—";
  document.getElementById("clearFiltersButton").classList.toggle("active", vistaIndividual);

  renderizarIndicadores(filas);
  renderizarFlujo(filas);
  renderizarAlertas(filas);
  renderizarEmpresas(filas);
  renderizarRanking(filasMesTodas);
  renderizarDirectorioEmpresas(filasMesTodas);
  renderizarDona(filas);
  renderizarLinea();
  renderizarTabla();
}

function mensajeEfectividad(porcentaje, cantidadCompletada) {
  if (!cantidadCompletada) return "Sin envíos completados";
  if (porcentaje >= 80) return "Desempeño sobresaliente";
  if (porcentaje >= 65) return "Buen desempeño";
  return "Oportunidad de mejora";
}

function promedioEfectividad(lista) {
  const completadas = lista.filter(function (registro) { return Boolean(registro.fechaEnvio); });
  return completadas.length
    ? Math.round(completadas.reduce(function (suma, registro) { return suma + efectividadGeneral(registro); }, 0) / completadas.length)
    : 0;
}

function renderizarIndicadores(filas) {
  const procesadasPeriodo = registros.filter(function (registro) {
    const coincideMes = registro.fechaEnvio && registro.fechaEnvio.slice(0, 7) === mesSeleccionado;
    const coincideEmpresa = empresaSeleccionada === "Todas" || registro.empresa === empresaSeleccionada;
    return coincideMes && coincideEmpresa;
  }).reduce(function (total, registro) { return total + registro.cantidadEnviada; }, 0);
  const metricasPeriodo = sumarMetricas(filas);
  const requisicionesConDeficit = filas.filter(function (registro) { return metricasRegistro(registro).pendientes > 0; });
  const completadas = filas.filter(function (registro) { return Boolean(registro.fechaEnvio); });
  const puntuales = completadas.filter(function (registro) { return registro.fechaEnvio <= registro.fechaPromesa; }).length;
  const cumplimiento = completadas.length ? Math.round((puntuales / completadas.length) * 100) : 0;

  document.getElementById("processedPeriodKpi").textContent = procesadasPeriodo.toLocaleString("es-DO");
  document.getElementById("processedPeriodDetail").textContent = `${etiquetaMes(mesSeleccionado)} · toda persona enviada cuenta como procesada`;
  document.getElementById("pendingPeopleKpi").textContent = metricasPeriodo.pendientes.toLocaleString("es-DO");
  document.getElementById("pendingPeopleDetail").textContent = `${requisicionesConDeficit.length} requisiciones con déficit`;
  document.getElementById("promiseComplianceKpi").textContent = `${cumplimiento}%`;
  document.getElementById("promiseComplianceDetail").textContent = completadas.length ? `${puntuales} de ${completadas.length} envíos puntuales` : "Sin envíos completados";
}

function renderizarEmpresas(filas) {
  const metricas = sumarMetricas(filas);
  const totalProceso = metricas.enviados + metricas.aceptados + metricas.rechazados + metricas.pendientes;
  const requeridos = filas.reduce(function (total, registro) { return total + registro.cantidad; }, 0);
  const cobertura = requeridos ? Math.min(100, Math.round((metricas.aceptados / requeridos) * 100)) : 0;
  const efectividad = promedioEfectividad(filas);
  const titulo = empresaSeleccionada === "Todas" ? "Todas las empresas" : empresaSeleccionada;
  const iniciales = empresaSeleccionada === "Todas" ? String(EMPRESAS.length) : obtenerIniciales(empresaSeleccionada);
  const porcentajes = {
    sent: totalProceso ? Math.min(100, (metricas.enviados / totalProceso) * 100) : 0,
    accepted: totalProceso ? (metricas.aceptados / totalProceso) * 100 : 0,
    rejected: totalProceso ? (metricas.rechazados / totalProceso) * 100 : 0,
    pending: totalProceso ? (metricas.pendientes / totalProceso) * 100 : 0
  };

  document.getElementById("focusCompanyName").textContent = titulo;
  document.getElementById("companyChartSubtitle").textContent = `${filas.length} requisiciones · ${etiquetaMes(mesSeleccionado)}`;
  document.getElementById("companyBars").innerHTML = `
    <div class="focus-overview">
      <div class="focus-overview-top">
        <div class="focus-company-identity"><span class="focus-company-avatar">${escaparHtml(iniciales)}</span><span><strong>${escaparHtml(titulo)}</strong><small>${empresaSeleccionada === "Todas" ? `${EMPRESAS.length} empresas disponibles` : "Empresa seleccionada"}</small></span></div>
        <div class="focus-total"><strong>${metricas.enviadosTotales.toLocaleString("es-DO")}</strong><small>personas enviadas</small></div>
      </div>
      <div class="focus-pipeline-block">
        <div class="focus-pipeline-labels"><span class="sent"><i></i>${metricas.enviados} enviados</span><span class="accepted"><i></i>${metricas.aceptados} aceptados</span><span class="rejected"><i></i>${metricas.rechazados} no aceptados</span><span class="pending"><i></i>${metricas.pendientes} pendientes</span><strong>${totalProceso} personas</strong></div>
        <div class="focus-pipeline-track" aria-label="${metricas.enviados} enviados en evaluación, ${metricas.aceptados} aceptados, ${metricas.rechazados} no aceptados y ${metricas.pendientes} pendientes"><span class="sent" style="width:${porcentajes.sent}%" title="${metricas.enviados} personas enviadas en evaluación"></span><span class="accepted" style="width:${porcentajes.accepted}%"></span><span class="rejected" style="width:${porcentajes.rejected}%"></span><span class="pending" style="width:${porcentajes.pending}%"></span></div>
      </div>
      <div class="focus-metric-grid">
        <div class="focus-metric"><strong>${filas.length}</strong><small>Requisiciones</small></div>
        <div class="focus-metric"><strong>${requeridos}</strong><small>Personas requeridas</small></div>
        <div class="focus-metric"><strong>${cobertura}%</strong><small>Cobertura aceptada</small></div>
        <div class="focus-metric"><strong>${efectividad}%</strong><small>Efectividad general</small></div>
      </div>
    </div>`;
}

function resumenPorEmpresa(filasMes) {
  return EMPRESAS.map(function (empresa) {
    const filas = filasMes.filter(function (registro) { return registro.empresa === empresa; });
    const vencidas = filas.filter(function (registro) { return coincideAlerta(registro, "overdue"); }).length;
    const proximas = filas.filter(function (registro) { return coincideAlerta(registro, "dueSoon"); }).length;
    return {
      empresa: empresa,
      filas: filas,
      requisiciones: filas.length,
      metricas: sumarMetricas(filas),
      riesgoFecha: (vencidas * 2) + proximas,
      efectividad: promedioEfectividad(filas)
    };
  });
}

function renderizarRanking(filasMes) {
  const resumenes = resumenPorEmpresa(filasMes).filter(function (item) { return item.requisiciones > 0; });
  resumenes.sort(function (a, b) {
    if (rankingSeleccionado === "due") return b.riesgoFecha - a.riesgoFecha || b.metricas.pendientes - a.metricas.pendientes;
    if (rankingSeleccionado === "effectiveness") return a.efectividad - b.efectividad || b.requisiciones - a.requisiciones;
    return b.metricas.pendientes - a.metricas.pendientes || b.requisiciones - a.requisiciones;
  });
  const principales = resumenes.slice(0, 5);
  document.querySelectorAll("button[data-ranking]").forEach(function (boton) {
    boton.classList.toggle("active", boton.dataset.ranking === rankingSeleccionado);
  });
  document.getElementById("companyRanking").innerHTML = principales.length ? principales.map(function (item, indice) {
    const valor = rankingSeleccionado === "effectiveness" ? `${item.efectividad}%` : rankingSeleccionado === "due" ? item.riesgoFecha : item.metricas.pendientes;
    const detalle = rankingSeleccionado === "effectiveness" ? `${item.metricas.enviados} en evaluación` : rankingSeleccionado === "due" ? "nivel de urgencia" : "personas pendientes";
    return `<button class="ranking-row${empresaSeleccionada === item.empresa ? " selected" : ""}" type="button" data-company="${escaparHtml(item.empresa)}"><span class="ranking-number">${indice + 1}</span><span><strong>${escaparHtml(item.empresa)}</strong><small>${item.requisiciones} requisiciones · ${detalle}</small></span><span class="ranking-value">${valor}</span></button>`;
  }).join("") : '<div class="ranking-row"><span class="ranking-number">—</span><span><strong>Sin actividad</strong><small>No hay requisiciones en el período</small></span><span class="ranking-value">0</span></div>';
}

function renderizarDirectorioEmpresas(filasMes) {
  const consulta = document.getElementById("companyDirectorySearch").value.trim().toLowerCase();
  const resumenes = resumenPorEmpresa(filasMes).filter(function (item) {
    return item.empresa.toLowerCase().includes(consulta);
  });
  document.getElementById("companyDirectoryCount").textContent = `${resumenes.length} de ${EMPRESAS.length} empresas`;
  document.getElementById("companyDirectoryList").innerHTML = resumenes.length ? resumenes.map(function (item) {
    return `<button class="directory-company-row${empresaSeleccionada === item.empresa ? " selected" : ""}" type="button" data-company="${escaparHtml(item.empresa)}"><span class="directory-avatar">${escaparHtml(obtenerIniciales(item.empresa))}</span><span><strong>${escaparHtml(item.empresa)}</strong><small>${item.requisiciones} requisiciones · ${item.metricas.pendientes} pendientes</small></span><span class="directory-result">${item.metricas.enviadosTotales} enviados</span></button>`;
  }).join("") : '<div class="modal-empty">No encontramos empresas con esa búsqueda.</div>';
}

function renderizarDona(filas) {
  const metricas = sumarMetricas(filas);
  const total = metricas.enviados + metricas.aceptados + metricas.rechazados + metricas.pendientes;
  const enviadosPct = total ? Math.min(100, (metricas.enviados / total) * 100) : 0;
  const aceptadosPct = total ? (metricas.aceptados / total) * 100 : 0;
  const rechazadosPct = total ? (metricas.rechazados / total) * 100 : 0;
  const dona = document.getElementById("donutChart");
  dona.style.setProperty("--sent-stop", `${enviadosPct}%`);
  dona.style.setProperty("--accepted-stop", `${enviadosPct + aceptadosPct}%`);
  dona.style.setProperty("--rejected-stop", `${enviadosPct + aceptadosPct + rechazadosPct}%`);
  dona.classList.toggle("empty", total === 0);
  document.getElementById("donutTotal").textContent = total;

  const elementos = [
    ["sent", "Enviados", metricas.enviados],
    ["accepted", "Aceptados", metricas.aceptados],
    ["rejected", "No aceptados", metricas.rechazados],
    ["pending", "Pendientes de envío", metricas.pendientes]
  ];
  document.getElementById("donutLegend").innerHTML = elementos.map(function (item) {
    const porcentaje = total ? Math.round((item[2] / total) * 100) : 0;
    return `<div class="donut-legend-row"><span><i class="${item[0]}"></i>${item[1]}</span><strong>${item[2]} <small>${porcentaje}%</small></strong></div>`;
  }).join("");
}

function enviadosPorSemana(mes) {
  const valores = [0, 0, 0, 0, 0];
  registros.filter(function (registro) {
    const coincideMes = registro.fechaEnvio && registro.fechaEnvio.slice(0, 7) === mes;
    const coincideEmpresa = empresaSeleccionada === "Todas" || registro.empresa === empresaSeleccionada;
    return coincideMes && coincideEmpresa;
  }).forEach(function (registro) {
    const dia = Number(registro.fechaEnvio.slice(8, 10));
    valores[Math.min(4, Math.floor((dia - 1) / 7))] += registro.cantidadEnviada;
  });
  return valores;
}

function renderizarLinea() {
  const mesComparado = mesAnterior(mesSeleccionado);
  const valores = enviadosPorSemana(mesSeleccionado);
  const valoresAnteriores = enviadosPorSemana(mesComparado);
  document.getElementById("lineChartSubtitle").textContent = `${etiquetaMes(mesSeleccionado)} vs. ${etiquetaMes(mesComparado)} · ${empresaSeleccionada}`;

  document.getElementById("lineTotal").textContent = valores.reduce(function (suma, valor) { return suma + valor; }, 0);
  const ancho = 760;
  const alto = 250;
  const margen = { izquierda: 46, derecha: 24, arriba: 30, abajo: 40 };
  const baseY = alto - margen.abajo;
  const maximoReal = Math.max(...valores, ...valoresAnteriores, 1);
  const maximo = Math.max(4, Math.ceil(maximoReal / 4) * 4);
  const x = function (indice) { return margen.izquierda + (indice * (ancho - margen.izquierda - margen.derecha) / 4); };
  const y = function (valor) { return baseY - ((valor / maximo) * (baseY - margen.arriba)); };
  const puntos = valores.map(function (valor, indice) { return `${x(indice)},${y(valor)}`; }).join(" ");
  const puntosAnteriores = valoresAnteriores.map(function (valor, indice) { return `${x(indice)},${y(valor)}`; }).join(" ");

  const cuadricula = [0, 1, 2, 3, 4].map(function (paso) {
    const valor = Math.round(maximo - (maximo * paso / 4));
    const posicionY = margen.arriba + ((baseY - margen.arriba) * paso / 4);
    return `<line class="grid-line" x1="${margen.izquierda}" y1="${posicionY}" x2="${ancho - margen.derecha}" y2="${posicionY}"></line><text class="axis-label" x="${margen.izquierda - 10}" y="${posicionY + 4}" text-anchor="end">${valor}</text>`;
  }).join("");
  const etiquetas = valores.map(function (valor, indice) {
    const etiquetaValor = valor > 0
      ? `<text class="line-value" x="${x(indice)}" y="${Math.max(16, y(valor) - 12)}" text-anchor="middle">${valor}</text>`
      : "";
    return `<text class="axis-label" x="${x(indice)}" y="${alto - 12}" text-anchor="middle">Sem ${indice + 1}</text><circle class="line-point" cx="${x(indice)}" cy="${y(valor)}" r="4"><title>Semana ${indice + 1}: ${valor} enviados</title></circle>${etiquetaValor}`;
  }).join("");
  const area = `${margen.izquierda},${baseY} ${puntos} ${ancho - margen.derecha},${baseY}`;
  const comparacion = valoresAnteriores.map(function (valor, indice) {
    return `<circle class="comparison-point" cx="${x(indice)}" cy="${y(valor)}" r="3.5"><title>${etiquetaMes(mesComparado)} · Semana ${indice + 1}: ${valor} enviados</title></circle>`;
  }).join("");

  document.getElementById("lineChart").innerHTML = `
    <svg viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="Mes seleccionado: ${valores.join(", ")}. Mes anterior: ${valoresAnteriores.join(", ")}">
      <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3e8cab" stop-opacity=".2"></stop><stop offset="100%" stop-color="#3e8cab" stop-opacity=".015"></stop></linearGradient></defs>
      ${cuadricula}<polygon class="line-area" points="${area}"></polygon><polyline class="comparison-path" points="${puntosAnteriores}"></polyline>${comparacion}<polyline class="line-path" points="${puntos}"></polyline>${etiquetas}
    </svg>`;
}

function registrosParaTabla() {
  const consulta = document.getElementById("searchInput").value.trim().toLowerCase();
  const estadoSeleccionado = filtroEstado.value;
  const orden = ordenRegistros.value;
  return registrosFiltradosBase().filter(function (registro) {
    const coincideBusqueda = `${registro.id} ${registro.empresa} ${registro.reclutador} ${registro.turno}`.toLowerCase().includes(consulta);
    const coincideEstado = estadoSeleccionado === "Todas" || estadoDelRegistro(registro) === estadoSeleccionado;
    return coincideAlerta(registro, alertaSeleccionada) && coincideBusqueda && coincideEstado;
  }).sort(function (a, b) {
    if (orden === "promise") return (a.fechaPromesa || "").localeCompare(b.fechaPromesa || "") || b.id - a.id;
    if (orden === "effectiveness") return efectividadGeneral(b) - efectividadGeneral(a) || b.id - a.id;
    if (orden === "pending") return metricasRegistro(b).pendientes - metricasRegistro(a).pendientes || b.id - a.id;
    return b.fechaRequisicion.localeCompare(a.fechaRequisicion) || b.id - a.id;
  });
}

function renderizarTabla() {
  const filas = registrosParaTabla();
  const totalPaginas = Math.max(1, Math.ceil(filas.length / TAMANO_PAGINA));
  paginaActual = Math.min(Math.max(1, paginaActual), totalPaginas);
  const inicio = (paginaActual - 1) * TAMANO_PAGINA;
  const final = Math.min(inicio + TAMANO_PAGINA, filas.length);
  const filasPagina = filas.slice(inicio, final);
  const cuerpo = document.getElementById("recordsBody");
  document.getElementById("recordsCount").textContent = `${filas.length} resultados filtrados · máximo ${TAMANO_PAGINA} por página`;
  document.getElementById("paginationSummary").textContent = filas.length ? `Mostrando ${inicio + 1}–${final} de ${filas.length} registros` : "No hay registros para mostrar";
  document.getElementById("pageIndicator").textContent = `Página ${paginaActual} de ${totalPaginas}`;
  document.getElementById("previousPageButton").disabled = paginaActual <= 1;
  document.getElementById("nextPageButton").disabled = paginaActual >= totalPaginas;

  if (!filas.length) {
    cuerpo.innerHTML = '<tr><td colspan="11" class="empty-state">No hay requisiciones que coincidan con los filtros.</td></tr>';
    return;
  }

  cuerpo.innerHTML = filasPagina.map(function (registro) {
    const metricas = metricasRegistro(registro);
    const efectividad = efectividadGeneral(registro);
    const estado = estadoDelRegistro(registro);
    const claseEfectividad = efectividad >= 80 ? "score-good" : efectividad >= 60 ? "score-mid" : "score-low";
    const claseEstado = estado === "Aceptada" ? "accepted-status" : estado === "Enviado" ? "sent-status" : "pending-status";
    return `
      <tr>
        <td><strong class="record-id">REQ-${registro.id}</strong><small>${formatearFecha(registro.fechaRequisicion)}</small></td>
        <td><div class="company-cell"><span>${escaparHtml(obtenerIniciales(registro.empresa))}</span><strong>${escaparHtml(registro.empresa)}</strong></div></td>
        <td><div class="recruiter-cell"><span>${escaparHtml(obtenerIniciales(registro.reclutador))}</span><strong>${escaparHtml(registro.reclutador)}</strong></div></td>
        <td><strong>${registro.cantidad}</strong><small>${escaparHtml(registro.turno)}</small></td>
        <td><strong>${registro.cantidadEnviada}</strong><small>${registro.fechaEnvio ? formatearFecha(registro.fechaEnvio, true) : "Sin envío"}</small></td>
        <td><strong>${registro.cantidadAceptada}</strong><small>${porcentajeAceptacion(registro.cantidadEnviada, registro.cantidadAceptada)}%</small></td>
        <td><strong>${metricas.rechazados}</strong></td>
        <td><strong>${formatearFecha(registro.fechaPromesa)}</strong></td>
        <td><strong class="${claseEfectividad}">${registro.fechaEnvio ? `${efectividad}%` : "—"}</strong></td>
        <td><span class="status ${claseEstado}"><i></i>${estado}</span></td>
        <td><div class="row-actions"><button type="button" data-action="edit" data-id="${registro.id}" aria-label="Editar REQ-${registro.id}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path></svg></button><button type="button" data-action="delete" data-id="${registro.id}" aria-label="Eliminar REQ-${registro.id}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"></path></svg></button></div></td>
      </tr>`;
  }).join("");
}

/* ================================================================
   EXPORTACIÓN EXCEL (.XLSX)
   El libro se genera localmente sin enviar datos a internet.
   ================================================================ */

function escaparXml(valor) {
  return String(valor == null ? "" : valor)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function nombreColumna(indice) {
  let resultado = "";
  let numero = indice + 1;
  while (numero > 0) {
    numero -= 1;
    resultado = String.fromCharCode(65 + (numero % 26)) + resultado;
    numero = Math.floor(numero / 26);
  }
  return resultado;
}

function serialFechaExcel(valor) {
  if (!valor) return null;
  const partes = valor.split("-").map(Number);
  return Math.floor((Date.UTC(partes[0], partes[1] - 1, partes[2]) - Date.UTC(1899, 11, 30)) / 86400000);
}

function celdaExcel(referencia, valor, estilo) {
  const atributoEstilo = estilo ? ` s="${estilo}"` : "";
  if (valor === null || valor === undefined || valor === "") return `<c r="${referencia}"${atributoEstilo}></c>`;
  if (typeof valor === "number") return `<c r="${referencia}"${atributoEstilo}><v>${Number.isFinite(valor) ? valor : 0}</v></c>`;
  return `<c r="${referencia}" t="inlineStr"${atributoEstilo}><is><t xml:space="preserve">${escaparXml(valor)}</t></is></c>`;
}

function crearHojaExcel(filas) {
  const encabezados = [
    "Requisición", "Fecha requisición", "Empresa", "Reclutador/a", "Cantidad requerida", "Turno",
    "Fecha promesa", "Fecha envío", "Cantidad enviada", "Cantidad aceptada", "No aceptados",
    "% aceptados", "¿Cumplió promesa?", "Puntuación puntualidad", "Efectividad general", "Estado"
  ];
  const filasXml = [];
  filasXml.push(`<row r="1" ht="28" customHeight="1">${encabezados.map(function (titulo, indice) {
    return celdaExcel(`${nombreColumna(indice)}1`, titulo, 1);
  }).join("")}</row>`);

  filas.forEach(function (registro, indice) {
    const numeroFila = indice + 2;
    const aceptacion = porcentajeAceptacion(registro.cantidadEnviada, registro.cantidadAceptada) / 100;
    const puntualidad = registro.fechaEnvio && registro.fechaPromesa ? puntuacionPuntualidad(registro.fechaPromesa, registro.fechaEnvio) : "";
    const efectividad = registro.fechaEnvio && registro.fechaPromesa ? efectividadGeneral(registro) / 100 : "";
    const cumplimiento = !registro.fechaEnvio ? "Pendiente" : (!registro.fechaPromesa ? "Por acordar" : (registro.fechaEnvio <= registro.fechaPromesa ? "Sí" : "No"));
    const valores = [
      [`REQ-${registro.id}`, 0], [serialFechaExcel(registro.fechaRequisicion), 4], [registro.empresa, 0], [registro.reclutador, 0],
      [registro.cantidad, 2], [registro.turno, 0], [serialFechaExcel(registro.fechaPromesa), 4], [serialFechaExcel(registro.fechaEnvio), 4],
      [registro.cantidadEnviada, 2], [registro.cantidadAceptada, 2], [cantidadNoAceptadaRegistrada(registro), 2],
      [aceptacion, 3], [cumplimiento, 0], [puntualidad, 2], [efectividad, 3], [estadoDelRegistro(registro), 0]
    ];
    filasXml.push(`<row r="${numeroFila}">${valores.map(function (item, columna) {
      return celdaExcel(`${nombreColumna(columna)}${numeroFila}`, item[0], item[1]);
    }).join("")}</row>`);
  });

  const ultimaFila = Math.max(1, filas.length + 1);
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>
  <sheetFormatPr defaultRowHeight="19"/>
  <cols><col min="1" max="1" width="16" customWidth="1"/><col min="2" max="2" width="17" customWidth="1"/><col min="3" max="4" width="24" customWidth="1"/><col min="5" max="5" width="19" customWidth="1"/><col min="6" max="6" width="15" customWidth="1"/><col min="7" max="8" width="16" customWidth="1"/><col min="9" max="11" width="18" customWidth="1"/><col min="12" max="12" width="15" customWidth="1"/><col min="13" max="13" width="21" customWidth="1"/><col min="14" max="15" width="22" customWidth="1"/><col min="16" max="16" width="15" customWidth="1"/></cols>
  <sheetData>${filasXml.join("")}</sheetData>
  <autoFilter ref="A1:P${ultimaFila}"/>
</worksheet>`;
}

function tablaCrc32() {
  const tabla = new Uint32Array(256);
  for (let numero = 0; numero < 256; numero += 1) {
    let valor = numero;
    for (let bit = 0; bit < 8; bit += 1) valor = (valor & 1) ? (0xEDB88320 ^ (valor >>> 1)) : (valor >>> 1);
    tabla[numero] = valor >>> 0;
  }
  return tabla;
}

const TABLA_CRC32 = tablaCrc32();

function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  bytes.forEach(function (byte) { crc = (crc >>> 8) ^ TABLA_CRC32[(crc ^ byte) & 0xFF]; });
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function enteroLittleEndian(valor, cantidadBytes) {
  const bytes = new Uint8Array(cantidadBytes);
  let numero = valor >>> 0;
  for (let indice = 0; indice < cantidadBytes; indice += 1) {
    bytes[indice] = numero & 0xFF;
    numero >>>= 8;
  }
  return bytes;
}

function unirBytes(partes) {
  const total = partes.reduce(function (suma, parte) { return suma + parte.length; }, 0);
  const salida = new Uint8Array(total);
  let posicion = 0;
  partes.forEach(function (parte) { salida.set(parte, posicion); posicion += parte.length; });
  return salida;
}

function crearZipSinCompresion(archivos) {
  const codificador = new TextEncoder();
  const locales = [];
  const centrales = [];
  let desplazamiento = 0;
  const ahora = new Date();
  const horaDos = ((ahora.getHours() & 31) << 11) | ((ahora.getMinutes() & 63) << 5) | Math.floor(ahora.getSeconds() / 2);
  const fechaDos = (((Math.max(1980, ahora.getFullYear()) - 1980) & 127) << 9) | (((ahora.getMonth() + 1) & 15) << 5) | (ahora.getDate() & 31);

  archivos.forEach(function (archivo) {
    const nombre = codificador.encode(archivo.nombre);
    const contenido = codificador.encode(archivo.contenido);
    const crc = crc32(contenido);
    const cabeceraLocal = unirBytes([
      enteroLittleEndian(0x04034B50, 4), enteroLittleEndian(20, 2), enteroLittleEndian(0x0800, 2),
      enteroLittleEndian(0, 2), enteroLittleEndian(horaDos, 2), enteroLittleEndian(fechaDos, 2),
      enteroLittleEndian(crc, 4), enteroLittleEndian(contenido.length, 4), enteroLittleEndian(contenido.length, 4),
      enteroLittleEndian(nombre.length, 2), enteroLittleEndian(0, 2), nombre
    ]);
    locales.push(cabeceraLocal, contenido);
    centrales.push(unirBytes([
      enteroLittleEndian(0x02014B50, 4), enteroLittleEndian(20, 2), enteroLittleEndian(20, 2), enteroLittleEndian(0x0800, 2),
      enteroLittleEndian(0, 2), enteroLittleEndian(horaDos, 2), enteroLittleEndian(fechaDos, 2), enteroLittleEndian(crc, 4),
      enteroLittleEndian(contenido.length, 4), enteroLittleEndian(contenido.length, 4), enteroLittleEndian(nombre.length, 2),
      enteroLittleEndian(0, 2), enteroLittleEndian(0, 2), enteroLittleEndian(0, 2), enteroLittleEndian(0, 2),
      enteroLittleEndian(0, 4), enteroLittleEndian(desplazamiento, 4), nombre
    ]));
    desplazamiento += cabeceraLocal.length + contenido.length;
  });

  const directorio = unirBytes(centrales);
  const fin = unirBytes([
    enteroLittleEndian(0x06054B50, 4), enteroLittleEndian(0, 2), enteroLittleEndian(0, 2),
    enteroLittleEndian(archivos.length, 2), enteroLittleEndian(archivos.length, 2),
    enteroLittleEndian(directorio.length, 4), enteroLittleEndian(desplazamiento, 4), enteroLittleEndian(0, 2)
  ]);
  return unirBytes(locales.concat([directorio, fin]));
}

function crearLibroExcel(filas) {
  const estilos = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts>
  <fonts count="2"><font><sz val="11"/><color rgb="FF243B4E"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts>
  <fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0A354F"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFDDE5EA"/></left><right style="thin"><color rgb="FFDDE5EA"/></right><top style="thin"><color rgb="FFDDE5EA"/></top><bottom style="thin"><color rgb="FFDDE5EA"/></bottom><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFill="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="9" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
  const archivos = [
    { nombre: "[Content_Types].xml", contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>` },
    { nombre: "_rels/.rels", contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { nombre: "xl/workbook.xml", contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets><sheet name="Requisiciones" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>` },
    { nombre: "xl/_rels/workbook.xml.rels", contenido: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>` },
    { nombre: "xl/worksheets/sheet1.xml", contenido: crearHojaExcel(filas) },
    { nombre: "xl/styles.xml", contenido: estilos }
  ];
  return crearZipSinCompresion(archivos);
}

function nombreSeguro(valor) {
  return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function exportarExcel() {
  const filas = registrosParaTabla();
  if (!filas.length) {
    mostrarAviso("No hay registros visibles para exportar.", false);
    return;
  }
  const bytes = crearLibroExcel(filas);
  const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const enlace = document.createElement("a");
  const empresa = empresaSeleccionada === "Todas" ? "todas-las-empresas" : nombreSeguro(empresaSeleccionada);
  enlace.href = URL.createObjectURL(blob);
  enlace.download = `requisiciones_${mesSeleccionado}_${empresa}.xlsx`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  window.setTimeout(function () { URL.revokeObjectURL(enlace.href); }, 1200);
  mostrarAviso(`${filas.length} registros exportados a Excel.`, true);
}

/* ================================================================
   FORMULARIO
   ================================================================ */

function actualizarCalculoEnVivo() {
  const cantidad = Math.max(1, Number(campos.cantidad.value) || 1);
  const enviada = Math.max(0, Number(campos.cantidadEnviada.value) || 0);
  const aceptada = Math.max(0, Number(campos.cantidadAceptada.value) || 0);
  const noAceptada = Math.max(0, Number(campos.cantidadNoAceptada.value) || 0);
  const enEvaluacion = Math.max(enviada - aceptada - noAceptada, 0);
  const regla = obtenerReglaPromesa(cantidad);
  const requiereAcuerdo = Boolean(regla && regla.requiereAcuerdo);
  const turno = campos.turno.value;
  const diasBase = regla ? regla.diasLaborables : null;
  const dias = obtenerDiasPromesa(cantidad, turno);
  const fechaPromesa = requiereAcuerdo
    ? campos.fechaPromesaManual.value
    : agregarDiasLaborables(campos.fechaRequisicion.value, dias);
  const fechaEnvio = campos.fechaEnvio.value;
  const tasa = porcentajeAceptacion(enviada, aceptada);
  const puntualidad = puntuacionPuntualidad(fechaPromesa, fechaEnvio);
  const procesoCalculable = Boolean(fechaEnvio && fechaPromesa);
  const general = procesoCalculable ? Math.round((puntualidad * 0.4) + (tasa * 0.6)) : 0;

  document.getElementById("automaticPromiseField").classList.toggle("hidden", requiereAcuerdo);
  campos.fechaPromesaManual.classList.toggle("hidden", !requiereAcuerdo);
  document.getElementById("promiseAgreementNote").classList.toggle("hidden", !requiereAcuerdo);
  campos.fechaPromesaManual.required = requiereAcuerdo;
  campos.fechaPromesaManual.min = campos.fechaRequisicion.value;

  campos.cantidadAceptada.max = Math.max(enviada - noAceptada, 0);
  campos.cantidadNoAceptada.max = Math.max(enviada - aceptada, 0);
  document.getElementById("promiseDateDisplay").textContent = formatearFecha(fechaPromesa);
  document.getElementById("promiseDaysDisplay").textContent = requiereAcuerdo ? "Fecha acordada" : `${dias} días laborables · Turno ${turno}`;
  document.getElementById("acceptanceDisplay").textContent = `${tasa}%`;
  document.getElementById("acceptanceDetail").textContent = `${aceptada} aceptadas · ${enEvaluacion} en evaluación`;
  document.getElementById("liveGeneral").textContent = procesoCalculable ? `${general}%` : "—";
  document.getElementById("liveGeneralMessage").textContent = !fechaPromesa ? "Define la fecha acordada" : (fechaEnvio ? mensajeEfectividad(general, 1) : "Completa la fecha de envío");
  document.getElementById("liveVacancies").textContent = `Según ${cantidad} vacante${cantidad === 1 ? "" : "s"} · Turno ${turno}`;
  document.getElementById("livePromise").textContent = fechaPromesa ? formatearFecha(fechaPromesa, true) : (requiereAcuerdo ? "Por acordar" : "—");
  document.getElementById("liveTimeliness").textContent = procesoCalculable ? `${puntualidad}/100` : "—";
  document.getElementById("liveAcceptance").textContent = `${tasa}%`;
  document.getElementById("rangeApplied").textContent = requiereAcuerdo
    ? `Para ${cantidad} personas, la fecha promesa debe acordarse con la empresa. Si el turno es C, contempla el margen adicional dentro del acuerdo.`
    : (turno === "C"
      ? `Rango base: ${diasBase} días laborables. El turno C añade ${DIAS_ADICIONALES_TURNO_C}; fecha promesa total: ${dias} días laborables.`
      : `Para ${cantidad} persona${cantidad === 1 ? "" : "s"}, el turno A/B mantiene la fecha promesa en ${dias} días laborables.`);
  const cumplimiento = document.getElementById("liveFulfilled");
  cumplimiento.className = "";
  if (!fechaEnvio) cumplimiento.textContent = "Pendiente";
  else if (!fechaPromesa) cumplimiento.textContent = "Por definir";
  else if (fechaEnvio <= fechaPromesa) { cumplimiento.textContent = "Sí"; cumplimiento.className = "yes"; }
  else { cumplimiento.textContent = "No"; cumplimiento.className = "no"; }
}

function guardarFormulario(evento) {
  evento.preventDefault();
  const cantidad = Math.max(1, Number(campos.cantidad.value) || 1);
  const enviada = Math.max(0, Number(campos.cantidadEnviada.value) || 0);
  const aceptada = Math.max(0, Number(campos.cantidadAceptada.value) || 0);
  const noAceptada = Math.max(0, Number(campos.cantidadNoAceptada.value) || 0);
  const regla = obtenerReglaPromesa(cantidad);
  const fechaPromesa = regla && regla.requiereAcuerdo
    ? campos.fechaPromesaManual.value
    : agregarDiasLaborables(campos.fechaRequisicion.value, obtenerDiasPromesa(cantidad, campos.turno.value));
  if (aceptada > enviada) {
    mostrarAviso("La cantidad aceptada no puede superar la cantidad enviada.", false);
    return;
  }
  if (aceptada + noAceptada > enviada) {
    mostrarAviso("Aceptados y no aceptados no pueden superar la cantidad enviada.", false);
    return;
  }
  if (!fechaPromesa) {
    mostrarAviso("Indica la fecha promesa acordada con la empresa.", false);
    campos.fechaPromesaManual.focus();
    return;
  }
  const registro = {
    id: idEnEdicion || siguienteId(),
    fechaRequisicion: campos.fechaRequisicion.value,
    empresa: campos.empresa.value,
    reclutador: campos.reclutador.value,
    cantidad: cantidad,
    turno: campos.turno.value,
    fechaPromesa: fechaPromesa,
    fechaEnvio: campos.fechaEnvio.value,
    cantidadEnviada: enviada,
    cantidadAceptada: aceptada,
    cantidadNoAceptada: noAceptada
  };
  if (idEnEdicion) {
    registros = registros.map(function (item) { return item.id === idEnEdicion ? registro : item; });
    mostrarAviso("Requisición actualizada correctamente.", true);
  } else {
    registros.unshift(registro);
    mostrarAviso("Requisición registrada correctamente.", true);
  }
  guardarRegistros();
  actualizarOpcionesMes(registro.fechaRequisicion.slice(0, 7));
  configurarVistaGeneral();
  limpiarFormulario();
  mostrarVista("dashboard");
}

function editarRegistro(id) {
  const registro = registros.find(function (item) { return item.id === id; });
  if (!registro) return;
  idEnEdicion = id;
  campos.fechaRequisicion.value = registro.fechaRequisicion;
  campos.empresa.value = registro.empresa;
  campos.reclutador.value = registro.reclutador;
  campos.cantidad.value = registro.cantidad;
  campos.turno.value = registro.turno;
  campos.fechaEnvio.value = registro.fechaEnvio;
  campos.cantidadEnviada.value = registro.cantidadEnviada;
  campos.cantidadAceptada.value = registro.cantidadAceptada;
  campos.cantidadNoAceptada.value = cantidadNoAceptadaRegistrada(registro);
  campos.fechaPromesaManual.value = registro.cantidad >= 101 ? registro.fechaPromesa : "";
  document.getElementById("formEyebrow").textContent = "ACTUALIZAR REGISTRO";
  document.getElementById("formTitle").textContent = `Editar REQ-${id}`;
  document.getElementById("saveButtonText").textContent = "Guardar cambios";
  actualizarCalculoEnVivo();
  mostrarVista("formulario");
}

function eliminarRegistro(id) {
  if (!window.confirm(`¿Deseas eliminar la requisición REQ-${id}?`)) return;
  registros = registros.filter(function (registro) { return registro.id !== id; });
  guardarRegistros();
  actualizarOpcionesMes();
  renderizarDashboard();
  mostrarAviso("Requisición eliminada.", true);
}

function limpiarFormulario() {
  idEnEdicion = null;
  formulario.reset();
  campos.fechaRequisicion.value = fechaParaInput(new Date());
  campos.cantidad.value = 1;
  campos.cantidadEnviada.value = 0;
  campos.cantidadAceptada.value = 0;
  campos.cantidadNoAceptada.value = 0;
  campos.fechaPromesaManual.value = "";
  document.getElementById("formEyebrow").textContent = "NUEVO REGISTRO";
  document.getElementById("formTitle").textContent = "Registrar requisición";
  document.getElementById("saveButtonText").textContent = "Registrar requisición";
  actualizarCalculoEnVivo();
}

function siguienteId() {
  return registros.length ? Math.max(...registros.map(function (registro) { return registro.id; })) + 1 : 1001;
}

/* ================================================================
   NAVEGACIÓN, AVISOS Y EVENTOS
   ================================================================ */

function mostrarVista(vista) {
  const esDashboard = vista === "dashboard";
  dashboardView.classList.toggle("hidden", !esDashboard);
  formView.classList.toggle("hidden", esDashboard);
  navDashboard.classList.toggle("active", esDashboard);
  navForm.classList.toggle("active", !esDashboard);
  if (esDashboard) renderizarDashboard();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarAviso(mensaje, correcto) {
  const aviso = document.getElementById("toast");
  const icono = aviso.querySelector("span");
  document.getElementById("toastMessage").textContent = mensaje;
  icono.textContent = correcto ? "✓" : "!";
  aviso.classList.remove("hidden");
  window.clearTimeout(temporizadorAviso);
  temporizadorAviso = window.setTimeout(function () { aviso.classList.add("hidden"); }, 3000);
}

function refrescarDetalleOperativo() {
  const boton = document.getElementById("refreshRecordsButton");
  boton.classList.add("is-refreshing");
  registros = cargarRegistros();
  ultimaActualizacion = cargarUltimaActualizacion();
  actualizarOpcionesMes(mesSeleccionado);
  renderizarDashboard();
  mostrarAviso("Detalle operativo actualizado.", true);
  window.setTimeout(function () { boton.classList.remove("is-refreshing"); }, 650);
}

function llenarSelect(elemento, opciones, incluirTodas) {
  const lista = incluirTodas ? ["Todas"].concat(opciones) : opciones;
  elemento.innerHTML = lista.map(function (opcion) {
    return `<option value="${escaparHtml(opcion)}">${escaparHtml(opcion)}</option>`;
  }).join("");
}

function abrirFormularioNuevo() {
  limpiarFormulario();
  mostrarVista("formulario");
}

function configurarVistaGeneral() {
  empresaSeleccionada = "Todas";
  alertaSeleccionada = "Todas";
  filtroEmpresa.value = "Todas";
  document.getElementById("searchInput").value = "";
  filtroEstado.value = "Todas";
  ordenRegistros.value = "recent";
  paginaActual = 1;
}

function mostrarVistaGeneral() {
  configurarVistaGeneral();
  mostrarVista("dashboard");
}

function seleccionarEmpresa(nombre, cerrarDirectorio) {
  empresaSeleccionada = nombre;
  filtroEmpresa.value = nombre;
  paginaActual = 1;
  renderizarDashboard();
  if (cerrarDirectorio) cerrarDirectorioEmpresas();
}

function abrirDirectorioEmpresas() {
  if (dashboardView.classList.contains("hidden")) mostrarVista("dashboard");
  document.getElementById("companyDirectorySearch").value = "";
  renderizarDirectorioEmpresas(registros.filter(function (registro) {
    return registro.fechaRequisicion.slice(0, 7) === mesSeleccionado;
  }));
  document.getElementById("companyModal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  window.setTimeout(function () { document.getElementById("companyDirectorySearch").focus(); }, 20);
}

function cerrarDirectorioEmpresas() {
  document.getElementById("companyModal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function irAlRegistro() {
  configurarVistaGeneral();
  mostrarVista("dashboard");
  window.setTimeout(function () {
    document.getElementById("recordsPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 30);
}

navDashboard.addEventListener("click", mostrarVistaGeneral);
navForm.addEventListener("click", abrirFormularioNuevo);
navRecords.addEventListener("click", irAlRegistro);
navCompanies.addEventListener("click", abrirDirectorioEmpresas);
document.getElementById("newRequisitionButton").addEventListener("click", abrirFormularioNuevo);
document.getElementById("tableNewButton").addEventListener("click", abrirFormularioNuevo);
document.getElementById("exportExcelButton").addEventListener("click", exportarExcel);
document.getElementById("refreshRecordsButton").addEventListener("click", refrescarDetalleOperativo);
document.getElementById("backButton").addEventListener("click", function () { mostrarVista("dashboard"); });
document.getElementById("cancelButton").addEventListener("click", function () { limpiarFormulario(); mostrarVista("dashboard"); });
document.getElementById("searchInput").addEventListener("input", function () { paginaActual = 1; renderizarTabla(); });
filtroEstado.addEventListener("change", function () { paginaActual = 1; renderizarTabla(); });
ordenRegistros.addEventListener("change", function () { paginaActual = 1; renderizarTabla(); });
formulario.addEventListener("submit", guardarFormulario);

filtroEmpresa.addEventListener("change", function () {
  empresaSeleccionada = filtroEmpresa.value;
  paginaActual = 1;
  renderizarDashboard();
});

filtroMes.addEventListener("change", function () {
  mesSeleccionado = filtroMes.value;
  paginaActual = 1;
  renderizarDashboard();
});

document.getElementById("clearFiltersButton").addEventListener("click", function () {
  configurarVistaGeneral();
  actualizarOpcionesMes();
  renderizarDashboard();
});

document.getElementById("showAllCompaniesButton").addEventListener("click", mostrarVistaGeneral);

document.getElementById("attentionStrip").addEventListener("click", function (evento) {
  const tarjeta = evento.target.closest("button[data-alert]");
  if (!tarjeta) return;
  alertaSeleccionada = alertaSeleccionada === tarjeta.dataset.alert ? "Todas" : tarjeta.dataset.alert;
  paginaActual = 1;
  renderizarDashboard();
  document.getElementById("recordsPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("rankingTabs").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button[data-ranking]");
  if (!boton) return;
  rankingSeleccionado = boton.dataset.ranking;
  renderizarDashboard();
});

document.getElementById("companyRanking").addEventListener("click", function (evento) {
  const tarjeta = evento.target.closest("button[data-company]");
  if (!tarjeta) return;
  seleccionarEmpresa(tarjeta.dataset.company, false);
});

document.getElementById("viewCompaniesButton").addEventListener("click", abrirDirectorioEmpresas);
document.getElementById("rankingAllCompaniesButton").addEventListener("click", abrirDirectorioEmpresas);
document.getElementById("closeCompanyModalButton").addEventListener("click", cerrarDirectorioEmpresas);
document.getElementById("companyModal").addEventListener("click", function (evento) {
  if (evento.target.dataset.closeModal === "true") cerrarDirectorioEmpresas();
});
document.getElementById("companyDirectorySearch").addEventListener("input", function () {
  renderizarDirectorioEmpresas(registros.filter(function (registro) {
    return registro.fechaRequisicion.slice(0, 7) === mesSeleccionado;
  }));
});
document.getElementById("companyDirectoryList").addEventListener("click", function (evento) {
  const tarjeta = evento.target.closest("button[data-company]");
  if (!tarjeta) return;
  seleccionarEmpresa(tarjeta.dataset.company, true);
});
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" && !document.getElementById("companyModal").classList.contains("hidden")) cerrarDirectorioEmpresas();
});

document.getElementById("previousPageButton").addEventListener("click", function () {
  paginaActual = Math.max(1, paginaActual - 1);
  renderizarTabla();
});
document.getElementById("nextPageButton").addEventListener("click", function () {
  paginaActual += 1;
  renderizarTabla();
});

Object.keys(campos).forEach(function (nombre) {
  campos[nombre].addEventListener("input", actualizarCalculoEnVivo);
  campos[nombre].addEventListener("change", actualizarCalculoEnVivo);
});

document.getElementById("recordsBody").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button[data-action]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.action === "edit") editarRegistro(id);
  if (boton.dataset.action === "delete") eliminarRegistro(id);
});

llenarSelect(campos.empresa, EMPRESAS, false);
llenarSelect(campos.reclutador, RECLUTADORES, false);
llenarSelect(campos.turno, TURNOS, false);
llenarSelect(filtroEmpresa, EMPRESAS, true);
actualizarOpcionesMes();

document.getElementById("todayText").textContent = new Intl.DateTimeFormat("es-DO", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
}).format(new Date());

limpiarFormulario();
renderizarUltimaActualizacion();
renderizarDashboard();
