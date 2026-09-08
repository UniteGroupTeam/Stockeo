# Recuperación de UX — Stockeo

Referencia: https://sneako.framer.website/ (revisada el 7 de septiembre de 2026).

## Cambios
- Se reparó la estructura HTML: categorías, ventajas y FAQ estaban fuera del contenedor que aplica sus estilos.
- Se reemplazó la política de una captura SingleFile por una política que permite los archivos locales, el catálogo y las fuentes utilizadas.
- Se recuperaron 19 imágenes únicas de la referencia en assets/reference. Los recursos incrustados restantes se separaron para permitir caché.
- Se recrearon con APIs nativas la entrada de nubes y título, flotación y sombra, selector de color, desplazamientos al hacer scroll, zoom de categorías, acordeón y movimiento decorativo del pie.
- Se incorporó un carrusel de cuatro productos del catálogo de Stockeo, con botones, desplazamiento táctil y teclado.
- Se mantuvieron el catálogo de 46 productos, los filtros, los precios, el carrito y el flujo de cotización existente.
- Se agregaron estilos para la versión móvil que no estaba incluida en la captura original.
- Se actualizó sw.js para eliminar la referencia a catalogo.html y dar prioridad a la red para navegación y productos.

## Archivos
- index.html: estructura y contenido.
- css/framer-snapshot.css: estilos conservados de la captura.
- css/motion.css: interacciones y adaptación móvil.
- js/motion.js: animaciones e interacciones recuperadas.
- js/catalog.js: lógica del catálogo existente, separada del HTML.
- assets/reference/: imágenes y fuentes locales.

## Validación
Se comprobaron en navegador escritorio y móvil de 390 px: selector de color, acordeón, carrusel, filtro de búsqueda, agregar y quitar un producto, cierre del carrito con Escape y ausencia de desbordamiento horizontal. Se verificó que todos los archivos locales referenciados y las imágenes del catálogo existen.

## Alcance y límites
La captura no incluye los componentes originales ni los parámetros de Framer. Las animaciones se reconstruyeron a partir del comportamiento observado; sus tiempos y curvas no están certificados como idénticos. Se conservaron los textos comerciales de Stockeo y se usaron las imágenes de zapatos y categorías de la referencia, tal como se solicitó. Esto deja diferencias entre algunas imágenes decorativas y los textos de tecnología.

El trabajo se centra en el inicio de Stockeo. No se clonaron las páginas internas de la tienda de zapatos ni se modificaron el panel o las políticas comerciales. No se publicó ni se hizo commit.
