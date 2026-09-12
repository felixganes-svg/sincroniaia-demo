from __future__ import annotations

import hashlib
from dataclasses import dataclass
from typing import Optional

from transport import NS_INFO, NS_LR, NS_SOAP, esc


@dataclass(frozen=True)
class FiscalIdentity:
    emisor: str
    numero: str
    fecha: str


def sha256_upper(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest().upper()


def cancellation_hash_input(
    identity: FiscalIdentity,
    previous_hash: str,
    fecha_hora: str,
) -> str:
    return (
        f"IDEmisorFacturaAnulada={identity.emisor}"
        f"&NumSerieFacturaAnulada={identity.numero}"
        f"&FechaExpedicionFacturaAnulada={identity.fecha}"
        f"&Huella={previous_hash or ''}"
        f"&FechaHoraHusoGenRegistro={fecha_hora}"
    )


def cancellation_hash(identity: FiscalIdentity, previous_hash: str, fecha_hora: str) -> str:
    return sha256_upper(cancellation_hash_input(identity, previous_hash, fecha_hora))


def _chain_xml(previous: Optional[dict]) -> str:
    if previous:
        return f"""<sum1:Encadenamiento>
            <sum1:RegistroAnterior>
              <sum1:IDEmisorFactura>{esc(previous['emisor'])}</sum1:IDEmisorFactura>
              <sum1:NumSerieFactura>{esc(previous['numero'])}</sum1:NumSerieFactura>
              <sum1:FechaExpedicionFactura>{esc(previous['fecha'])}</sum1:FechaExpedicionFactura>
              <sum1:Huella>{esc(previous['huella'])}</sum1:Huella>
            </sum1:RegistroAnterior>
          </sum1:Encadenamiento>"""
    return """<sum1:Encadenamiento><sum1:PrimerRegistro>S</sum1:PrimerRegistro></sum1:Encadenamiento>"""


def _sif_xml(version: str) -> str:
    return f"""<sum1:SistemaInformatico>
            <sum1:NombreRazon>PRODUCTOR DEMO SINCRONIAIA</sum1:NombreRazon>
            <sum1:NIF>89890001K</sum1:NIF>
            <sum1:NombreSistemaInformatico>SINCRONIAIA FISCAL</sum1:NombreSistemaInformatico>
            <sum1:IdSistemaInformatico>S1</sum1:IdSistemaInformatico>
            <sum1:Version>{esc(version)}</sum1:Version>
            <sum1:NumeroInstalacion>LAB0001</sum1:NumeroInstalacion>
            <sum1:TipoUsoPosibleSoloVerifactu>S</sum1:TipoUsoPosibleSoloVerifactu>
            <sum1:TipoUsoPosibleMultiOT>N</sum1:TipoUsoPosibleMultiOT>
            <sum1:IndicadorMultiplesOT>N</sum1:IndicadorMultiplesOT>
          </sum1:SistemaInformatico>"""


def build_cancellation_soap(
    original: dict,
    previous: Optional[dict],
    fecha_hora: str,
    rechazo_previo: bool = False,
    sin_registro_previo: bool = False,
) -> tuple[str, str]:
    identity = FiscalIdentity(original["emisor"], original["numero"], original["fecha"])
    previous_hash = previous["huella"] if previous else ""
    huella = cancellation_hash(identity, previous_hash, fecha_hora)
    flags = ""
    if sin_registro_previo:
        flags += "<sum1:SinRegistroPrevio>S</sum1:SinRegistroPrevio>"
    if rechazo_previo:
        flags += "<sum1:RechazoPrevio>S</sum1:RechazoPrevio>"
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="{NS_SOAP}" xmlns:sum="{NS_LR}" xmlns:sum1="{NS_INFO}">
  <soapenv:Header/><soapenv:Body><sum:RegFactuSistemaFacturacion>
    <sum:Cabecera><sum1:ObligadoEmision><sum1:NombreRazon>EMPRESA DEMO SINCRONIAIA</sum1:NombreRazon><sum1:NIF>{esc(original['emisor'])}</sum1:NIF></sum1:ObligadoEmision></sum:Cabecera>
    <sum:RegistroFactura><sum1:RegistroAnulacion>
      <sum1:IDVersion>1.0</sum1:IDVersion>
      <sum1:IDFactura>
        <sum1:IDEmisorFacturaAnulada>{esc(original['emisor'])}</sum1:IDEmisorFacturaAnulada>
        <sum1:NumSerieFacturaAnulada>{esc(original['numero'])}</sum1:NumSerieFacturaAnulada>
        <sum1:FechaExpedicionFacturaAnulada>{esc(original['fecha'])}</sum1:FechaExpedicionFacturaAnulada>
      </sum1:IDFactura>
      {flags}
      {_chain_xml(previous)}
      {_sif_xml('2.2.0-dev')}
      <sum1:FechaHoraHusoGenRegistro>{esc(fecha_hora)}</sum1:FechaHoraHusoGenRegistro>
      <sum1:TipoHuella>01</sum1:TipoHuella>
      <sum1:Huella>{huella}</sum1:Huella>
    </sum1:RegistroAnulacion></sum:RegistroFactura>
  </sum:RegFactuSistemaFacturacion></soapenv:Body>
</soapenv:Envelope>"""
    return xml, huella


def build_subsanation_soap(
    corrected: dict,
    previous: Optional[dict],
    rechazo_previo: bool = False,
) -> str:
    previous_hash = previous["huella"] if previous else ""
    hash_input = (
        f"IDEmisorFactura={corrected['emisor']}"
        f"&NumSerieFactura={corrected['numero']}"
        f"&FechaExpedicionFactura={corrected['fecha']}"
        f"&TipoFactura={corrected['tipo']}"
        f"&CuotaTotal={corrected['cuota']}"
        f"&ImporteTotal={corrected['total']}"
        f"&Huella={previous_hash}"
        f"&FechaHoraHusoGenRegistro={corrected['fechaHora']}"
    )
    huella = sha256_upper(hash_input)
    rechazo = "<sum1:RechazoPrevio>S</sum1:RechazoPrevio>" if rechazo_previo else ""
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="{NS_SOAP}" xmlns:sum="{NS_LR}" xmlns:sum1="{NS_INFO}">
  <soapenv:Header/><soapenv:Body><sum:RegFactuSistemaFacturacion>
    <sum:Cabecera><sum1:ObligadoEmision><sum1:NombreRazon>EMPRESA DEMO SINCRONIAIA</sum1:NombreRazon><sum1:NIF>{esc(corrected['emisor'])}</sum1:NIF></sum1:ObligadoEmision></sum:Cabecera>
    <sum:RegistroFactura><sum1:RegistroAlta>
      <sum1:IDVersion>1.0</sum1:IDVersion>
      <sum1:IDFactura><sum1:IDEmisorFactura>{esc(corrected['emisor'])}</sum1:IDEmisorFactura><sum1:NumSerieFactura>{esc(corrected['numero'])}</sum1:NumSerieFactura><sum1:FechaExpedicionFactura>{esc(corrected['fecha'])}</sum1:FechaExpedicionFactura></sum1:IDFactura>
      <sum1:NombreRazonEmisor>EMPRESA DEMO SINCRONIAIA</sum1:NombreRazonEmisor>
      <sum1:Subsanacion>S</sum1:Subsanacion>{rechazo}
      <sum1:TipoFactura>{esc(corrected['tipo'])}</sum1:TipoFactura>
      <sum1:DescripcionOperacion>Subsanación DEMO</sum1:DescripcionOperacion>
      <sum1:Desglose><sum1:DetalleDesglose><sum1:ClaveRegimen>01</sum1:ClaveRegimen><sum1:CalificacionOperacion>S1</sum1:CalificacionOperacion><sum1:TipoImpositivo>10</sum1:TipoImpositivo><sum1:BaseImponibleOimporteNoSujeto>{esc(corrected['base'])}</sum1:BaseImponibleOimporteNoSujeto><sum1:CuotaRepercutida>{esc(corrected['cuota'])}</sum1:CuotaRepercutida></sum1:DetalleDesglose></sum1:Desglose>
      <sum1:CuotaTotal>{esc(corrected['cuota'])}</sum1:CuotaTotal><sum1:ImporteTotal>{esc(corrected['total'])}</sum1:ImporteTotal>
      {_chain_xml(previous)}
      {_sif_xml('2.3.0-dev')}
      <sum1:FechaHoraHusoGenRegistro>{esc(corrected['fechaHora'])}</sum1:FechaHoraHusoGenRegistro><sum1:TipoHuella>01</sum1:TipoHuella><sum1:Huella>{huella}</sum1:Huella>
    </sum1:RegistroAlta></sum:RegistroFactura>
  </sum:RegFactuSistemaFacturacion></soapenv:Body>
</soapenv:Envelope>"""
    return xml
