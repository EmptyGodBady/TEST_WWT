import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilterStore } from '@store/filterStore'

import { FilterModal } from './Modal'

export const App = () => {
	const [isOpen, setIsOpen] = useState(false)

	const appliedFilters = useFilterStore(state => state.appliedFilters)
	const { t } = useTranslation()

	return (
		<div className="">
			<button
				onClick={() => setIsOpen(true)}
				className="px-4 py-2 bg-black text-white rounded"
			>
				{t('app.openFilters')}
			</button>

			<div className="mt-6">
				<h2 className="font-bold mb-2">{t('app.selectedFiltersDebugTitle')}</h2>

				<pre className="bg-gray-100 p-4 rounded">
					{Object.keys(appliedFilters).length === 0
						? t('app.noFiltersSelected')
						: JSON.stringify(appliedFilters, null, 2)}
				</pre>
			</div>
			<FilterModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</div>
	)
}
