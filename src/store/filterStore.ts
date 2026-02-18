import { create } from 'zustand'

import { FilterType } from '@/shared/api/types/Filter'
import {
	SearchRequestFilter,
	SearchRequestOptions
} from '@/shared/api/types/SearchRequest/SearchRequestFilter'

interface FilterStore {
	appliedFilters: SearchRequestFilter
	setAppliedFilters: (filters: SearchRequestFilter) => void
	toggleOption: (filterId: string, optionId: string) => void
	resetFilters: () => void
}

export const useFilterStore = create<FilterStore>(set => ({
	appliedFilters: [],

	setAppliedFilters: filters => set({ appliedFilters: filters }),

	toggleOption: (filterId, optionId) =>
		set(state => {
			const existing = state.appliedFilters.find(
				filter => filter.id === filterId
			)

			if (existing) {
				const isSelected = existing.optionsIds.includes(optionId)

				const updatedOptions = isSelected
					? existing.optionsIds.filter(id => id !== optionId)
					: [...existing.optionsIds, optionId]

				if (updatedOptions.length === 0) {
					return {
						appliedFilters: state.appliedFilters.filter(
							filter => filter.id !== filterId
						)
					}
				}

				return {
					appliedFilters: state.appliedFilters.map(filter =>
						filter.id === filterId
							? { ...filter, optionsIds: updatedOptions }
							: filter
					)
				}
			}

			const newFilter: SearchRequestOptions = {
				id: filterId,
				type: FilterType.OPTION,
				optionsIds: [optionId]
			}

			return {
				appliedFilters: [...state.appliedFilters, newFilter]
			}
		}),

	resetFilters: () => set({ appliedFilters: [] })
}))
