interface subclassProps {
  [acronym: string]: string;
}

const subclassVariations: subclassProps = {
  COMBOPT: 'Comercial B- Optante',
  COMCON: 'Comerc.Administração Condominial',
  COMCT: 'Comerc.Serv.Comunicações e Telecom',
  COMER: 'Comercial',
  COMFIL: 'Comerc.Associação e Entidades Filant',
  COMOS: 'Comerc.Outros Serviços e Atividades',
  COMREL: 'Comerc.Templos Religiosos',
  COMROD: 'Comerc.Iluminação em Rodovia',
  COMSEM: 'Comerc.Semáforos, Radares e Câmeras',
  COMTP: 'Comerc.Serviços de Transporte',
  CPCPE: 'Consumo Próprio - Escritórios',
  CPCPO: 'Consumo Próprio - Canteiro de Obras',
  CPCPSE: 'Consumo Próprio - Sub - Estação',
  CPCPU: 'Consumo Próprio - Usinas',
  ILPUBL: 'Iluminação Pública',
  INDBOPT: 'Industrial B - Optante',
  INDUST: 'Industrial',
  PPEBOPT: 'Poder Público Estadual B - Optante',
  PPEST: 'Poder Público Estadual',
  PPFBOPT: 'Poder Público Federal B - Optante',
  PPFED: 'Poder Público Federal',
  PPMBOPT: 'Poder Público Municipal B - Optante',
  PPMUN: 'Poder Público Municipal',
  REBRBPC: 'Resid.Baixa Renda BPC',
  REBRIND: 'Resid.Baixa Renda Indígena',
  REBRMUL: 'Resid.Baixa Renda Multifamiliar',
  REBRQUI: 'Resid.Baixa Renda Quilombola',
  REBXR: 'Resid.Baixa Renda',
  REPLN: 'Residencial Pleno',
  RESBOPT: 'Residencial B - Optante',
  RUAGU: 'Rural Agropecuária Urbana',
  RUAQC: 'Rural Aqüicultura',
  RUCES: 'Rural Cooperativa de Eletrificação Rural',
  RURAG: 'Rural Agropecuária',
  RURBOPT: 'Rural B - Optante',
  RURCR: 'Rural Coletividade Rural',
  RUREA: 'Rural Escola Agrotécnica',
  RURIR: 'Rural Indústria Rural',
  RURRR: 'Rural Residencial Rural',
  RURSP: 'Rural Serviço Público de Irrigação Rural',
  SPAES: 'Serviço Público Água Esgoto e Saneamento',
  SPAESBOT: 'Serviço Público AES B - Optante',
  SPERVBOT: 'Serviço Público B - Optante',
  SPTER: 'Serviço Público Tração Elétrica',
  SPTRS: 'Serviço Público Trat.de Resíduo Sólido',
  SPTRSBOT: 'Serviço Público Resíduo B - Optante',
};

function getInstallationSubclassName(acronym: string): string {
  return subclassVariations[acronym].toUpperCase();
}

export default getInstallationSubclassName;
