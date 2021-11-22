import Sunco from './Sunco'
import SuncoAPIError from './utils/SuncoAPIError'
import { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE_IN_BYTES } from './utils/constants'
import { getOrCreateClientId } from './utils/device'

export default Sunco

export { SuncoAPIError, SUPPORTED_FILE_TYPES, MAX_FILE_SIZE_IN_BYTES, getOrCreateClientId }
