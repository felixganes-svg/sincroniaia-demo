from __future__ import annotations

import hashlib
import os
import ssl
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import httpx

PREPROD_ENDPOINTS = {
    "https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP",
    "https://prewww10.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP",
}
DEFAULT_ENDPOINT = "https://prewww1.aeat.es/wlpl/TIKE-CONT/ws/SistemaFacturacion/VerifactuSOAP"
NS_SOAP = "http://schemas.xmlsoap.org/soap/envelope/"
NS_LR = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroLR.xsd"
NS_INFO = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd"


@dataclass(frozen=True)
class TransportConfig:
    enabled: bool
    endpoint: str
    cert_file: Optional[Path]
    key_file: Optional[Path]
    timeout_seconds: float = 15.0

    @classmethod
    def from_env(cls) -> "TransportConfig":
        enabled = os.getenv("VERIFACTU_AEAT_SEND_ENABLED", "0").strip().lower() in {"1", "true", "yes", "on"}
        endpoint = os.getenv("VERIFACTU_AEAT_ENDPOINT", DEFAULT_ENDPOINT).strip()
        cert_raw = os.getenv("VERIFACTU_AEAT_CERT_FILE", "").strip()
        key_raw = os.getenv("VERIFACTU_AEAT_KEY_FILE", "").strip()
        timeout = float(os.getenv("VERIFACTU_AEAT_TIMEOUT", "15"))
        return cls(
            enabled=enabled,
            endpoint=endpoint,
            cert_file=Path(cert_raw) if cert_raw else None,
            key_file=Path(key_raw) if key_raw else None,
            timeout_seconds=timeout,
        )

    def readiness(self) -> tuple[bool, str]:
        if not self.enabled:
            return False, "REAL_SEND_DISABLED"
        if self.endpoint not in PREPROD_ENDPOINTS:
            return False, "ENDPOINT_NOT_PREPRODUCTION_WHITELISTED"
        if not self.cert_file or not self.cert_file.is_file():
            return False, "CLIENT_CERTIFICATE_MISSING"
        if self.key_file and not self.key_file.is_file():
            return False, "CLIENT_KEY_MISSING"
        return True, "READY_PREPRODUCTION"


@dataclass(frozen=True)
class TransportResult:
    status_code: int
    body: str
    headers: dict[str, str]


def body_sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest().upper()


def esc(value: object) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&apos;")
    )


def build_soap(record: dict, previous: Optional[dict] = None) -> str:
    if previous:
        enc = f"""<sum1:Encadenamiento>
            <sum1:RegistroAnterior>
              <sum1:IDEmisorFactura>{esc(previous['emisor'])}</sum1:IDEmisorFactura>
              <sum1:NumSerieFactura>{esc(previous['numero'])}</sum1:NumSerieFactura>
              <sum1:FechaExpedicionFactura>{esc(previous['fecha'])}</sum1:FechaExpedicionFactura>
              <sum1:Huella>{esc(previous['huella'])}</sum1:Huella>
            </sum1:RegistroAnterior>
          </sum1:Encadenamiento>"""
    else:
        enc = """<sum1:Encadenamiento>
            <sum1:PrimerRegistro>S</sum1:PrimerRegistro>
          </sum1:Encadenamiento>"""

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="{NS_SOAP}" xmlns:sum="{NS_LR}" xmlns:sum1="{NS_INFO}">
  <soapenv:Header/>
  <soapenv:Body>
    <sum:RegFactuSistemaFacturacion>
      <sum:Cabecera>
        <sum1:ObligadoEmision>
          <sum1:NombreRazon>EMPRESA DEMO SINCRONIAIA</sum1:NombreRazon>
          <sum1:NIF>{esc(record['emisor'])}</sum1:NIF>
        </sum1:ObligadoEmision>
      </sum:Cabecera>
      <sum:RegistroFactura>
        <sum1:RegistroAlta>
          <sum1:IDVersion>1.0</sum1:IDVersion>
          <sum1:IDFactura>
            <sum1:IDEmisorFactura>{esc(record['emisor'])}</sum1:IDEmisorFactura>
            <sum1:NumSerieFactura>{esc(record['numero'])}</sum1:NumSerieFactura>
            <sum1:FechaExpedicionFactura>{esc(record['fecha'])}</sum1:FechaExpedicionFactura>
          </sum1:IDFactura>
          <sum1:NombreRazonEmisor>EMPRESA DEMO SINCRONIAIA</sum1:NombreRazonEmisor>
          <sum1:TipoFactura>{esc(record['tipo'])}</sum1:TipoFactura>
          <sum1:DescripcionOperacion>Venta minorista alimentación · DEMO</sum1:DescripcionOperacion>
          <sum1:Desglose>
            <sum1:DetalleDesglose>
              <sum1:ClaveRegimen>01</sum1:ClaveRegimen>
              <sum1:CalificacionOperacion>S1</sum1:CalificacionOperacion>
              <sum1:TipoImpositivo>10</sum1:TipoImpositivo>
              <sum1:BaseImponibleOimporteNoSujeto>15.41</sum1:BaseImponibleOimporteNoSujeto>
              <sum1:CuotaRepercutida>1.54</sum1:CuotaRepercutida>
            </sum1:DetalleDesglose>
            <sum1:DetalleDesglose>
              <sum1:ClaveRegimen>01</sum1:ClaveRegimen>
              <sum1:CalificacionOperacion>S1</sum1:CalificacionOperacion>
              <sum1:TipoImpositivo>4</sum1:TipoImpositivo>
              <sum1:BaseImponibleOimporteNoSujeto>5.29</sum1:BaseImponibleOimporteNoSujeto>
              <sum1:CuotaRepercutida>0.21</sum1:CuotaRepercutida>
            </sum1:DetalleDesglose>
          </sum1:Desglose>
          <sum1:CuotaTotal>{esc(record['cuota'])}</sum1:CuotaTotal>
          <sum1:ImporteTotal>{esc(record['total'])}</sum1:ImporteTotal>
          {enc}
          <sum1:SistemaInformatico>
            <sum1:NombreRazon>PRODUCTOR DEMO SINCRONIAIA</sum1:NombreRazon>
            <sum1:NIF>89890001K</sum1:NIF>
            <sum1:NombreSistemaInformatico>SINCRONIAIA FISCAL</sum1:NombreSistemaInformatico>
            <sum1:IdSistemaInformatico>S1</sum1:IdSistemaInformatico>
            <sum1:Version>1.9.0-dev</sum1:Version>
            <sum1:NumeroInstalacion>LAB0001</sum1:NumeroInstalacion>
            <sum1:TipoUsoPosibleSoloVerifactu>S</sum1:TipoUsoPosibleSoloVerifactu>
            <sum1:TipoUsoPosibleMultiOT>N</sum1:TipoUsoPosibleMultiOT>
            <sum1:IndicadorMultiplesOT>N</sum1:IndicadorMultiplesOT>
          </sum1:SistemaInformatico>
          <sum1:FechaHoraHusoGenRegistro>{esc(record['fechaHora'])}</sum1:FechaHoraHusoGenRegistro>
          <sum1:TipoHuella>01</sum1:TipoHuella>
          <sum1:Huella>{esc(record['huella'])}</sum1:Huella>
        </sum1:RegistroAlta>
      </sum:RegistroFactura>
    </sum:RegFactuSistemaFacturacion>
  </soapenv:Body>
</soapenv:Envelope>"""


def _local_text(root: ET.Element, local_name: str) -> Optional[str]:
    for node in root.iter():
        if node.tag.rsplit("}", 1)[-1] == local_name:
            return (node.text or "").strip() or None
    return None


def parse_aeat_response(xml_text: str) -> dict:
    root = ET.fromstring(xml_text)
    estado_envio = _local_text(root, "EstadoEnvio")
    estado_registro = _local_text(root, "EstadoRegistro")
    codigo = _local_text(root, "CodigoErrorRegistro")
    descripcion = _local_text(root, "DescripcionErrorRegistro")
    mapped = {
        "Correcto": "ACEPTADO",
        "AceptadoConErrores": "ACEPTADO_CON_INCIDENCIA",
        "Incorrecto": "RECHAZADO",
    }.get(estado_registro)
    return {
        "estadoEnvio": estado_envio,
        "estadoRegistro": estado_registro,
        "estadoInterno": mapped,
        "codigo": codigo,
        "descripcion": descripcion,
    }


def perform_send(xml_text: str, config: TransportConfig) -> TransportResult:
    ready, reason = config.readiness()
    if not ready:
        raise RuntimeError(reason)

    context = ssl.create_default_context()
    if config.key_file:
        context.load_cert_chain(str(config.cert_file), keyfile=str(config.key_file))
    else:
        context.load_cert_chain(str(config.cert_file))

    with httpx.Client(verify=context, timeout=config.timeout_seconds) as client:
        response = client.post(
            config.endpoint,
            content=xml_text.encode("utf-8"),
            headers={"Content-Type": "text/xml; charset=utf-8"},
        )
    return TransportResult(
        status_code=response.status_code,
        body=response.text,
        headers={k.lower(): v for k, v in response.headers.items()},
    )
