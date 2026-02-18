import { useQuery } from '@tanstack/react-query'
import filterData from 'src/shared/temp/filterData.json'

import { FilterItem } from '@/shared/api/types/Filter'

export const useFiltersQuery = () => {
	return useQuery<FilterItem[]>({
		queryKey: ['filters'],
		queryFn: async () => filterData.filterItems as FilterItem[]
	})
}
