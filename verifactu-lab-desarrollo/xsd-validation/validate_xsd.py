from pathlib import Path
from urllib.request import urlopen
from lxml import etree

BASE = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tikeV1.0/cont/ws/"
FILES = {
    "SuministroLR.xsd": BASE + "SuministroLR.xsd",
    "SuministroInformacion.xsd": BASE + "SuministroInformacion.xsd",
    "xmldsig-core-schema.xsd": "https://www.w3.org/TR/xmldsig-core/xmldsig-core-schema.xsd",
}
NS_LR = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroLR.xsd"
NS_INFO = "https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd"

work = Path(__file__).resolve().parent / "_schemas"
work.mkdir(exist_ok=True)
for name, url in FILES.items():
    data = urlopen(url, timeout=30).read()
    (work / name).write_bytes(data)

info = work / "SuministroInformacion.xsd"
text = info.read_text(encoding="utf-8")
text = text.replace(
    "http://www.w3.org/TR/xmldsig-core/xmldsig-core-schema.xsd",
    "xmldsig-core-schema.xsd",
)
info.write_text(text, encoding="utf-8")

schema_doc = etree.parse(str(work / "SuministroLR.xsd"))
schema = etree.XMLSchema(schema_doc)

S = "{%s}" % NS_LR
I = "{%s}" % NS_INFO
root = etree.Element(S + "RegFactuSistemaFacturacion", nsmap={"sum": NS_LR, "sum1": NS_INFO})
cab = etree.SubElement(root, S + "Cabecera")
obl = etree.SubElement(cab, I + "ObligadoEmision")
etree.SubElement(obl, I + "NombreRazon").text = "EMPRESA DEMO SINCRONIAIA"
etree.SubElement(obl, I + "NIF").text = "89890001K"
rf = etree.SubElement(root, S + "RegistroFactura")
alta = etree.SubElement(rf, I + "RegistroAlta")
etree.SubElement(alta, I + "IDVersion").text = "1.0"
idf = etree.SubElement(alta, I + "IDFactura")
etree.SubElement(idf, I + "IDEmisorFactura").text = "89890001K"
etree.SubElement(idf, I + "NumSerieFactura").text = "VF-LAB-D-000012"
etree.SubElement(idf, I + "FechaExpedicionFactura").text = "12-09-2026"
etree.SubElement(alta, I + "NombreRazonEmisor").text = "EMPRESA DEMO SINCRONIAIA"
etree.SubElement(alta, I + "TipoFactura").text = "F2"
etree.SubElement(alta, I + "DescripcionOperacion").text = "Venta minorista alimentación · DEMO"
des = etree.SubElement(alta, I + "Desglose")
for tipo, base, cuota in (("10", "15.41", "1.54"), ("4", "5.29", "0.21")):
    det = etree.SubElement(des, I + "DetalleDesglose")
    etree.SubElement(det, I + "ClaveRegimen").text = "01"
    etree.SubElement(det, I + "CalificacionOperacion").text = "S1"
    etree.SubElement(det, I + "TipoImpositivo").text = tipo
    etree.SubElement(det, I + "BaseImponibleOimporteNoSujeto").text = base
    etree.SubElement(det, I + "CuotaRepercutida").text = cuota
etree.SubElement(alta, I + "CuotaTotal").text = "1.75"
etree.SubElement(alta, I + "ImporteTotal").text = "22.45"
enc = etree.SubElement(alta, I + "Encadenamiento")
prev = etree.SubElement(enc, I + "RegistroAnterior")
etree.SubElement(prev, I + "IDEmisorFactura").text = "89890001K"
etree.SubElement(prev, I + "NumSerieFactura").text = "VF-LAB-D-000011"
etree.SubElement(prev, I + "FechaExpedicionFactura").text = "12-09-2026"
etree.SubElement(prev, I + "Huella").text = "B910BBFD4947921A62109B20E1342660F82CA278197903347CAE24A39D0541CE"
sif = etree.SubElement(alta, I + "SistemaInformatico")
etree.SubElement(sif, I + "NombreRazon").text = "PRODUCTOR DEMO SINCRONIAIA"
etree.SubElement(sif, I + "NIF").text = "89890001K"
etree.SubElement(sif, I + "NombreSistemaInformatico").text = "SINCRONIAIA FISCAL"
etree.SubElement(sif, I + "IdSistemaInformatico").text = "S1"
etree.SubElement(sif, I + "Version").text = "1.6.1-dev"
etree.SubElement(sif, I + "NumeroInstalacion").text = "LAB0001"
etree.SubElement(sif, I + "TipoUsoPosibleSoloVerifactu").text = "S"
etree.SubElement(sif, I + "TipoUsoPosibleMultiOT").text = "N"
etree.SubElement(sif, I + "IndicadorMultiplesOT").text = "N"
etree.SubElement(alta, I + "FechaHoraHusoGenRegistro").text = "2026-09-12T22:52:03+02:00"
etree.SubElement(alta, I + "TipoHuella").text = "01"
etree.SubElement(alta, I + "Huella").text = "3FB10634D5D8719731E118C953CED1EC4F8A2D4547E05E7314F12EA48E5756BB"

try:
    schema.assertValid(root)
except etree.DocumentInvalid as exc:
    print("XSD_RESULT=FAIL")
    print(schema.error_log)
    raise SystemExit(1) from exc

print("XSD_RESULT=PASS")
print("SCHEMA=SuministroLR.xsd + SuministroInformacion.xsd (AEAT)")
print("PAYLOAD=RegFactuSistemaFacturacion / RegistroAlta")
