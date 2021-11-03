import 'core-js/modules/es.array.find'
import 'core-js/modules/es.array.from'
import 'core-js/modules/es.array.includes'
import 'core-js/modules/es.array.iterator'
import 'core-js/modules/es.object.assign'
import 'core-js/modules/es.object.entries'
import 'core-js/modules/es.object.values'
import 'core-js/modules/es.promise'
import 'core-js/modules/es.promise'
import 'core-js/modules/es.set'
import 'core-js/modules/es.string.starts-with'

if (
  // MSIE is present in all IE user agents since IE 2.0
  navigator.userAgent.indexOf('MSIE') !== -1 ||
  // Trident is IE specific
  navigator.userAgent.indexOf('Trident') !== -1
) {
  import('formdata-polyfill')
}
