import axios from '@/utils/http'
export const trendData = () => axios.get('trend')
