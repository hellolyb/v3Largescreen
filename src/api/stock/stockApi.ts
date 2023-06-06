import axios from '@/utils/http'
export const stockData = () => axios.get('stock')
