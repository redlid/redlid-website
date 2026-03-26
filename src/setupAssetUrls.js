const baseAssets = `${import.meta.env.BASE_URL}assets`

document.documentElement.style.setProperty(
  '--asset-url-iconmonstr-menu-1',
  `url("${baseAssets}/iconmonstr-menu-1.svg")`
)
document.documentElement.style.setProperty(
  '--asset-url-redlid-grass',
  `url("${baseAssets}/RedlidGrass.jpg")`
)
document.documentElement.style.setProperty(
  '--asset-url-footer-truck',
  `url("${baseAssets}/RedlidTruckGrassFooter.jpg")`
)
document.documentElement.style.setProperty(
  '--asset-url-footer-binbag',
  `url("${baseAssets}/BinBagTruckGrassFooter.png")`
)
