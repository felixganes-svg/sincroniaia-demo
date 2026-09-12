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
S = "{%s}" % NS_LR
I = "{%s}" % NS_INFO

work = Path(__file__).resolve().parent / "_schemas_roadmap"
work.mkdir(exist_ok=True)
for name, url in FILES.items():
    (work / name).write_bytes(urlopen(url, timeout=30).read())
info = work / "SuministroInformacion.xsd"
info.write_text(info.read_text(encoding="utf-8").replace(
    "http://www.w3.org/TR/xmldsig-core/xmldsig-core-schema.xsd", "xmldsig-core-schema.xsd"
), encoding="utf-8")
schema = etree.XMLSchema(etree.parse(str(work / "SuministroLR.xsd")))


def base_root(incidencia=False):
    root = etree.Element(S + "RegFactuSistemaFacturacion", nsmap={"sum": NS_LR, "sum1": NS_INFO})
    cab = etree.SubElement(root, S + "Cabecera")
    obl = etree.SubElement(cab, I + "ObligadoEmision")
    etree.SubElement(obl, I + "NombreRazon").text = "EMPRESA DEMO SINCRONIAIA"
    etree.SubElement(obl, I + "NIF").text = "89890001K"
    if incidencia:
        etree.SubElement(cab, I + "Incidencia").text = "S"
    return root


def add_chain(parent):
    enc = etree.SubElement(parent, I + "Encadenamiento")
    prev = etree.SubElement(enc, I + "RegistroAnterior")
    etree.SubElement(prev, I + "IDEmisorFactura").text = "89890001K"
    etree.SubElement(prev, I + "NumSerieFactura").text = "VF-SRV-D-000010"
    etree.SubElement(prev, I + "FechaExpedicionFactura").text = "12-09-2026"
    etree.SubElement(prev, I + "Huella").text = "A" * 64


def add_sif(parent, version):
    sif = etree.SubElement(parent, I + "SistemaInformatico")
    etree.SubElement(sif, I + "NombreRazon").text = "PRODUCTOR DEMO SINCRONIAIA"
    etree.SubElement(sif, I + "NIF").text = "89890001K"
    etree.SubElement(sif, I + "NombreSistemaInformatico").text = "SINCRONIAIA FISCAL"
    etree.SubElement(sif, I + "IdSistemaInformatico").text = "S1"
    etree.SubElement(sif, I + "Version").text = version
    etree.SubElement(sif, I + "NumeroInstalacion").text = "LAB0001"
    etree.SubElement(sif, I + "TipoUsoPosibleSoloVerifactu").text = "S"
    etree.SubElement(sif, I + "TipoUsoPosibleMultiOT").text = "N"
    etree.SubElement(sif, I + "IndicadorMultiplesOT").text = "N"


def add_alta(root, subsanacion=False):
    rf = etree.SubElement(root, S + "RegistroFactura")
    alta = etree.SubElement(rf, I + "RegistroAlta")
    etree.SubElement(alta, I + "IDVersion").text = "1.0"
    idf = etree.SubElement(alta, I + "IDFactura")
    etree.SubElement(idf, I + "IDEmisorFactura").text = "89890001K"
    etree.SubElement(idf, I + "NumSerieFactura").text = "VF-SRV-D-000011"
    etree.SubElement(idf, I + "FechaExpedicionFactura").text = "12-09-2026"
    etree.SubElement(alta, I + "NombreRazonEmisor").text = "EMPRESA DEMO SINCRONIAIA"
    if subsanacion:
        etree.SubElement(alta, I + "Subsanacion").text = "S"
    etree.SubElement(alta, I + "TipoFactura").text = "F2"
    etree.SubElement(alta, I + "DescripcionOperacion").text = "Prueba DEMO"
    des = etree.SubElement(alta, I + "Desglose")
    det = etree.SubElement(des, I + "DetalleDesglose")
    etree.SubElement(det, I + "ClaveRegimen").text = "01"
    etree.SubElement(det, I + "CalificacionOperacion").text = "S1"
    etree.SubElement(det, I + "TipoImpositivo").text = "10"
    etree.SubElement(det, I + "BaseImponibleOimporteNoSujeto").text = "20.00"
    etree.SubElement(det, I + "CuotaRepercutida").text = "2.00"
    etree.SubElement(alta, I + "CuotaTotal").text = "2.00"
    etree.SubElement(alta, I + "ImporteTotal").text = "22.00"
    add_chain(alta)
    add_sif(alta, "2.3.0-dev" if subsanacion else "2.1.0-dev")
    etree.SubElement(alta, I + "FechaHoraHusoGenRegistro").text = "2026-09-12T23:50:00+02:00"
    etree.SubElement(alta, I + "TipoHuella").text = "01"
    etree.SubElement(alta, I + "Huella").text = "B" * 64


def add_anulacion(root):
    rf = etree.SubElement(root, S + "RegistroFactura")
    anu = etree.SubElement(rf, I + "RegistroAnulacion")
    etree.SubElement(anu, I + "IDVersion").text = "1.0"
    idf = etree.SubElement(anu, I + "IDFactura")
    etree.SubElement(idf, I + "IDEmisorFacturaAnulada").text = "89890001K"
    etree.SubElement(idf, I + "NumSerieFacturaAnulada").text = "VF-SRV-D-000009"
    etree.SubElement(idf, I + "FechaExpedicionFacturaAnulada").text = "12-09-2026"
    add_chain(anu)
    add_sif(anu, "2.2.0-dev")
    etree.SubElement(anu, I + "FechaHoraHusoGenRegistro").text = "2026-09-12T23:55:00+02:00"
    etree.SubElement(anu, I + "TipoHuella").text = "01"
    etree.SubElement(anu, I + "Huella").text = "C" * 64


cases = []
r1 = base_root(incidencia=True); add_alta(r1); cases.append(("INCIDENCIA_ALTA", r1))
r2 = base_root(); add_anulacion(r2); cases.append(("ANULACION", r2))
r3 = base_root(); add_alta(r3, subsanacion=True); cases.append(("SUBSANACION", r3))

for name, root in cases:
    try:
        schema.assertValid(root)
    except etree.DocumentInvalid as exc:
        print(f"XSD_{name}=FAIL")
        print(schema.error_log)
        raise SystemExit(1) from exc
    print(f"XSD_{name}=PASS")
print("XSD_ROADMAP_21_23=PASS")
