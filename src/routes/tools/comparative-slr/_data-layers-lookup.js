export const cosmosLookup = new Map([
  ["2020-2040|min", "cosmosflooding_0cm_100yrstorm"],
  ["2020-2040|med", "cosmosflooding_25cm_100yrstorm"],
  ["2020-2040|max", "cosmosflooding_25cm_100yrstorm"],
  ["2080-2100|min", "cosmosflooding_75cm_100yrstorm"],
  ["2080-2100|med", "cosmosflooding_150cm_100yrstorm"],
  ["2080-2100|max", "cosmosflooding_200cm_100yrstorm"],
]);

export const calflod50mLookup = new Map([
  ["2020-2040|min", "calflod3dtfs_50m_HadGEM2-ES_rcp45_2020-2040_prec500"],
  ["2020-2040|max", "calflod3dtfs_50m_CanESM2_rcp45_2020-2040_prec999"],
  ["2080-2100|min", "calflod3dtfs_50m_HadGEM2-ES_rcp85_2080-2100_prec500"],
  ["2080-2100|max", "calflod3dtfs_50m_CanESM2_rcp85_2080-2100_prec999"],
]);
