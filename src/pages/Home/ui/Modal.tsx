import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Divider from '@mui/material/Divider'
import { X } from 'lucide-react'

import { useFiltersQuery } from '@/hooks/useFiltersQuery'
import { FilterType } from '@/shared/api/types/Filter'
import {
	SearchRequestFilter,
	SearchRequestOptions
} from '@/shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '@store/filterStore'

interface Props {
	isOpen: boolean
	onClose: () => void
}

export const FilterModal = ({ isOpen, onClose }: Props) => {
	const { data: filters, isLoading } = useFiltersQuery()

	const appliedFilters = useFilterStore(state => state.appliedFilters)
	const setAppliedFilters = useFilterStore(state => state.setAppliedFilters)

	const [localFilters, setLocalFilters] = useState<SearchRequestFilter>([])
	const [showConfirm, setShowConfirm] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		if (isOpen) {
			setLocalFilters(appliedFilters)
		}
	}, [isOpen, appliedFilters])

	const toggleOption = (filterId: string, optionId: string) => {
		setLocalFilters(prev => {
			const existing = prev.find(filter => filter.id === filterId)

			if (existing) {
				const isSelected = existing.optionsIds.includes(optionId)

				const updatedOptions = isSelected
					? existing.optionsIds.filter(id => id !== optionId)
					: [...existing.optionsIds, optionId]

				if (updatedOptions.length === 0) {
					return prev.filter(filter => filter.id !== filterId)
				}

				return prev.map(filter =>
					filter.id === filterId
						? { ...filter, optionsIds: updatedOptions }
						: filter
				)
			}

			const newFilter: SearchRequestOptions = {
				id: filterId,
				type: FilterType.OPTION,
				optionsIds: [optionId]
			}

			return [...prev, newFilter]
		})
	}

	const handleApply = () => {
		setShowConfirm(true)
	}
	const handleConfirmYes = () => {
		setAppliedFilters(localFilters)
		setShowConfirm(false)
		onClose()
	}

	const handleConfirmNo = () => {
		setShowConfirm(false)
	}
	const handleClearAll = () => {
		setLocalFilters([])
	}

	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center over backdrop-blur-sm">
			<div className="bg-white  max-h-[90vh] p-6 rounded-lg w-[90%] shadow-lg overflow-y-auto">
				<div className="flex justify-between relative mb-4">
					<h2 className="text-4xl  mx-auto">{t('modal.title')}</h2>
					<button
						onClick={handleApply}
						className="px-4 py-2 absolute right-0 cursor-pointer"
					>
						<X />
					</button>
				</div>
				<Divider className="bg-black/40 " />
				{isLoading && <p>{t('modal.loading')}</p>}
				{filters?.map(filter => (
					<div
						key={filter.id}
						className="mt-8 "
					>
						<h3 className="mt-2 text-xl mb-2">{filter.name}</h3>
						<div className="grid grid-cols-2 mb-8">
							{filter.options.map(option => (
								<label
									key={option.id}
									className="flex gap-2 flex-wrap mt-2"
								>
									<input
										type="checkbox"
										checked={
											localFilters
												.find(localFilter => localFilter.id === filter.id)
												?.optionsIds.includes(option.id) ?? false
										}
										onChange={() => toggleOption(filter.id, option.id)}
										className="cursor-pointer"
									/>
									<div>
										<div className="">{option.name}</div>
									</div>
								</label>
							))}
						</div>
						<Divider className="bg-black/40 " />
					</div>
				))}

				<div className="flex justify-center mt-6 relative">
					<button
						onClick={handleApply}
						className="px-12 py-4 bg-orange-500 text-white rounded-2xl cursor-pointer"
					>
						{t('modal.apply')}
					</button>
					<button
						onClick={handleClearAll}
						className="px-4 py-2  text-cyan-500 absolute right-0 underline cursor-pointer"
					>
						{t('modal.clearAllParameters')}
					</button>
				</div>
			</div>
			{showConfirm && (
				<div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="bg-white p-6 rounded-lg shadow-lg w-[80%]  text-center">
						<div className="flex justify-between relative mb-4">
							<p className="mb-4 font-medium mx-auto text-3xl">
								{t('modal.confirmTitle')}
							</p>
							<button
								onClick={() => setShowConfirm(false)}
								className="px-4 py-2 absolute right-0 cursor-pointer"
							>
								<X />
							</button>
						</div>
						<div className="flex justify-center gap-4">
							<button
								onClick={handleConfirmNo}
								className="px-12 py-4 border rounded-2xl cursor-pointer"
							>
								{t('modal.useOldFilter')}
							</button>
							<button
								onClick={handleConfirmYes}
								className="px-12 py-4 bg-orange-500 text-white rounded-2xl cursor-pointer"
							>
								{t('modal.applyNewFilter')}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
