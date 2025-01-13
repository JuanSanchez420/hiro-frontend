import { ArrowsRightLeftIcon, ChartBarIcon, BanknotesIcon, LightBulbIcon, XMarkIcon } from "@heroicons/react/24/outline";

export interface WidgetOption {
    name: string
    value: string | null
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    iconColor: string
    bgColor: string
}

export const widgetOptions: WidgetOption[] = [
    { name: 'Swap', value: 'swap', icon: ArrowsRightLeftIcon, iconColor: 'text-white', bgColor: 'bg-blue-400' },
    { name: 'Earn', value: 'earn', icon: ChartBarIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
    { name: 'Lend/Borrow', value: 'lend/borrow', icon: BanknotesIcon, iconColor: 'text-white', bgColor: 'bg-orange-400' },
    { name: 'Suggest', value: 'suggest', icon: LightBulbIcon, iconColor: 'text-white', bgColor: 'bg-purple-400' },
    { name: 'Cancel', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]